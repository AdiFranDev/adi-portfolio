"use client"

import { useEffect, useRef } from "react"

type FrancisGraphProps = {
  text: string
  // false: nothing drawn yet. true: the dots build in, then stay.
  play: boolean
}

const BUILD_MS = 1800

type Dot = { x: number; y: number; a: number; tone: number; order: number }

/**
 * Draws the word as a field of small tilted dots in the same font as ADRIAN.
 * The real text stays in place (invisible) so size and spacing match the type
 * exactly. When `play` turns on, the dots appear one by one, mostly left to
 * right, over about two seconds. Dense ink-coloured dots keep it readable over
 * the photo in both themes. Reduced motion: all
 * dots at once.
 */
export function FrancisGraph({ text, play }: FrancisGraphProps) {
  const textRef = useRef<HTMLSpanElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const builtRef = useRef(false)

  useEffect(() => {
    const textEl = textRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!textEl || !canvas || !ctx) return
    let cancelled = false
    let frame = 0
    let dots: Dot[] = []
    let rx = 0
    let ry = 0
    let tones: string[] = []
    let halo = ""
    let haloBlur = 0

    // Works out where the dots go for the current size, theme and font.
    const layout = () => {
      const box = textEl.getBoundingClientRect()
      const w = Math.ceil(box.width)
      const h = Math.ceil(box.height)
      if (w === 0 || h === 0) return false
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const style = getComputedStyle(textEl)
      const size = parseFloat(style.fontSize)
      const off = document.createElement("canvas")
      off.width = w
      off.height = h
      const o = off.getContext("2d", { willReadFrequently: true })
      if (!o) return false
      o.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
      o.letterSpacing = style.letterSpacing === "normal" ? "0px" : style.letterSpacing
      o.textBaseline = "alphabetic"
      const m = o.measureText(text)
      const scaleX = m.width > 0 ? w / m.width : 1
      const baseline = (h + m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2
      o.setTransform(scaleX, 0, 0, 1, 0, 0)
      o.fillText(text, 0, baseline)
      const data = o.getImageData(0, 0, w, h).data
      const inside = (x: number, y: number) =>
        x >= 0 && y >= 0 && x < w && y < h && (data[(y * w + x) * 4 + 3] ?? 0) > 128

      const pitch = Math.max(4, size * 0.06)
      rx = pitch * 0.5
      ry = pitch * 0.38
      dots = []
      for (let row = 0, y = pitch / 2; y < h; row++, y += pitch * 0.866) {
        const shift = row % 2 === 0 ? 0 : pitch / 2
        for (let x = pitch / 2 + shift; x < w; x += pitch) {
          if (!inside(Math.round(x), Math.round(y))) continue
          const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1
          dots.push({ x, y, a: hash * Math.PI, tone: Math.floor(hash * 3) % 3, order: (x / w) * 0.75 + hash * 0.25 })
        }
      }
      dots.sort((p, q) => p.order - q.order)

      const root = getComputedStyle(document.documentElement)
      const ink = root.getPropertyValue("--foreground").trim() || "#24161c"
      const green = root.getPropertyValue("--brand-green").trim() || "#0e492a"
      tones = [ink, mixHex(ink, green, 0.2), mixHex(ink, green, 0.35)]
      halo = "transparent"
      haloBlur = 0
      return true
    }

    // Draws the first `count` dots.
    const draw = (count: number) => {
      const w = canvas.width
      const h = canvas.height
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.restore()
      ctx.shadowColor = halo
      ctx.shadowBlur = haloBlur
      for (let tone = 0; tone < 3; tone++) {
        ctx.fillStyle = tones[tone] ?? "#000"
        ctx.beginPath()
        for (let i = 0; i < count; i++) {
          const d = dots[i]
          if (!d || d.tone !== tone) continue
          ctx.moveTo(d.x + rx * Math.cos(d.a), d.y + rx * Math.sin(d.a))
          ctx.ellipse(d.x, d.y, rx, ry, d.a, 0, Math.PI * 2)
        }
        ctx.fill()
      }
    }

    const build = () => {
      const start = performance.now()
      const step = (now: number) => {
        if (cancelled) return
        const t = Math.min(1, (now - start) / BUILD_MS)
        draw(Math.round(dots.length * t))
        if (t < 1) frame = window.requestAnimationFrame(step)
        else builtRef.current = true
      }
      frame = window.requestAnimationFrame(step)
    }

    const render = () => {
      if (cancelled || !layout()) return
      if (!play) return draw(0)
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (builtRef.current || reduced) {
        builtRef.current = true
        return draw(dots.length)
      }
      if (!frame) build()
    }

    document.fonts.ready.then(render).catch((error: unknown) => console.error("FRANCIS: fonts did not load", error))
    const ro = new ResizeObserver(() => {
      // Mid-build, a resize just lays out again; the build picks up the new dots.
      if (frame && !builtRef.current) layout()
      else render()
    })
    ro.observe(textEl)
    const theme = new MutationObserver(() => render())
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => {
      cancelled = true
      if (frame) window.cancelAnimationFrame(frame)
      ro.disconnect()
      theme.disconnect()
    }
  }, [text, play])

  return (
    <span aria-hidden="true" className="relative inline-block">
      <span ref={textRef} className="invisible">
        {text}
      </span>
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </span>
  )
}

// Mixes two #rrggbb colours (t = share of b). Canvas fills cannot use color-mix().
function mixHex(a: string, b: string, t: number) {
  const parse = (hex: string) => {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
    const n = m?.[1] ? Number.parseInt(m[1], 16) : 0
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const
  }
  const x = parse(a)
  const y = parse(b)
  const c = x.map((v, i) => Math.round(v + ((y[i] ?? v) - v) * t))
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`
}
