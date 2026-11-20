"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

type TopoFieldProps = { className?: string; seed?: number }

const CELL = 14 // px per marching-squares cell
const LEVELS = [0.22, 0.3, 0.38, 0.46, 0.54, 0.62, 0.7, 0.78]
const SCALE = 1 / 300 // feature size of the terrain
const BUMP_RADIUS = 170
const BUMP_AMOUNT = 0.11
const DRIFT = 0.000012 // terrain drift per ms

// Marching squares: for each corner case, the cell edges a contour crosses.
// Corners: top-left 8, top-right 4, bottom-right 2, bottom-left 1. Edges: 0 top, 1 right, 2 bottom, 3 left.
const SEGMENTS: number[][][] = [
  [], [[3, 2]], [[2, 1]], [[3, 1]], [[0, 1]], [[3, 0], [2, 1]], [[0, 2]], [[3, 0]],
  [[3, 0]], [[0, 2]], [[3, 2], [0, 1]], [[0, 1]], [[3, 1]], [[2, 1]], [[3, 2]], [],
]

function hash(x: number, y: number, seed: number) {
  const s = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453
  return s - Math.floor(s)
}
function smooth(t: number) {
  return t * t * (3 - 2 * t)
}
function valueNoise(x: number, y: number, seed: number) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = smooth(x - ix)
  const fy = smooth(y - iy)
  const a = hash(ix, iy, seed)
  const b = hash(ix + 1, iy, seed)
  const c = hash(ix, iy + 1, seed)
  const d = hash(ix + 1, iy + 1, seed)
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy
}
function terrain(x: number, y: number, seed: number) {
  return 0.6 * valueNoise(x, y, seed) + 0.28 * valueNoise(x * 2.1, y * 2.1, seed + 1) + 0.12 * valueNoise(x * 4.3, y * 4.3, seed + 2)
}

/**
 * Topographic contour lines that drift slowly and bend gently around the
 * pointer. Pointer-transparent; runs only while on screen. Reduced motion: drawn once.
 */
export function TopoField({ className, seed = 1 }: TopoFieldProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
    let values = new Float32Array(0)
    let frame = 0
    let visible = false
    let last = performance.now()
    let time = 0
    // Pointer bump, eased toward its target so the lines never jump.
    const bump = { x: -9999, y: -9999, tx: -9999, ty: -9999, s: 0, ts: 0 }

    const resize = () => {
      const box = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = box.width
      height = box.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(width / CELL) + 1
      rows = Math.ceil(height / CELL) + 1
      values = new Float32Array(cols * rows)
      draw()
    }

    const draw = () => {
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = i * CELL
          const y = j * CELL
          let v = terrain(x * SCALE + time, y * SCALE - time * 0.6, seed)
          if (bump.s > 0.001) {
            const dx = x - bump.x
            const dy = y - bump.y
            v += BUMP_AMOUNT * bump.s * Math.exp(-(dx * dx + dy * dy) / (BUMP_RADIUS * BUMP_RADIUS))
          }
          values[j * cols + i] = v
        }
      }
      const color = getComputedStyle(canvas).getPropertyValue("--brand-green").trim() || "#1a763f"
      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = color
      ctx.lineWidth = 1.2
      ctx.lineCap = "round"
      for (let l = 0; l < LEVELS.length; l++) {
        const level = LEVELS[l] ?? 0.5
        ctx.globalAlpha = l % 3 === 0 ? 0.22 : 0.13
        ctx.beginPath()
        for (let j = 0; j < rows - 1; j++) {
          for (let i = 0; i < cols - 1; i++) {
            const tl = values[j * cols + i] ?? 0
            const tr = values[j * cols + i + 1] ?? 0
            const br = values[(j + 1) * cols + i + 1] ?? 0
            const bl = values[(j + 1) * cols + i] ?? 0
            const kind = (tl > level ? 8 : 0) | (tr > level ? 4 : 0) | (br > level ? 2 : 0) | (bl > level ? 1 : 0)
            const segs = SEGMENTS[kind]
            if (!segs || segs.length === 0) continue
            const x0 = i * CELL
            const y0 = j * CELL
            const point = (edge: number): [number, number] => {
              if (edge === 0) return [x0 + CELL * ((level - tl) / (tr - tl)), y0]
              if (edge === 1) return [x0 + CELL, y0 + CELL * ((level - tr) / (br - tr))]
              if (edge === 2) return [x0 + CELL * ((level - bl) / (br - bl)), y0 + CELL]
              return [x0, y0 + CELL * ((level - tl) / (bl - tl))]
            }
            for (const [a, b] of segs) {
              const [ax, ay] = point(a ?? 0)
              const [bx, by] = point(b ?? 0)
              ctx.moveTo(ax, ay)
              ctx.lineTo(bx, by)
            }
          }
        }
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }

    const tick = (now: number) => {
      frame = 0
      const dt = Math.min(64, now - last)
      last = now
      time += dt * DRIFT
      const k = 1 - Math.exp(-dt / 220)
      bump.x += (bump.tx - bump.x) * k
      bump.y += (bump.ty - bump.y) * k
      bump.s += (bump.ts - bump.s) * k
      draw()
      if (visible) frame = window.requestAnimationFrame(tick)
    }

    const start = () => {
      if (reduced || frame || !visible) return
      last = performance.now()
      frame = window.requestAnimationFrame(tick)
    }

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      const box = canvas.getBoundingClientRect()
      const x = event.clientX - box.left
      const y = event.clientY - box.top
      const inside = x >= 0 && y >= 0 && x <= box.width && y <= box.height
      if (bump.ts === 0 && inside) {
        bump.x = x
        bump.y = y
      }
      bump.tx = x
      bump.ty = y
      bump.ts = inside ? 1 : 0
    }

    const io = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting)
      if (visible) start()
    })
    const ro = new ResizeObserver(resize)
    const theme = new MutationObserver(() => draw())

    resize()
    io.observe(canvas)
    ro.observe(canvas)
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    if (!reduced) window.addEventListener("pointermove", onPointer, { passive: true })
    return () => {
      io.disconnect()
      ro.disconnect()
      theme.disconnect()
      window.removeEventListener("pointermove", onPointer)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [seed])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 size-full [mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_88%,transparent)]",
        className,
      )}
    />
  )
}
