"use client"

import { useEffect, useRef } from "react"

type FrancisGraphProps = { text: string }

/**
 * Draws the word as a small connected graph: nodes along the letter outlines,
 * a few inside, each linked to its nearest neighbours. The real text stays in
 * place (invisible) so the layout and size match the type exactly.
 */
export function FrancisGraph({ text }: FrancisGraphProps) {
  const textRef = useRef<HTMLSpanElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const textEl = textRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!textEl || !canvas || !ctx) return
    let cancelled = false

    const render = () => {
      if (cancelled) return
      const box = textEl.getBoundingClientRect()
      const w = Math.ceil(box.width)
      const h = Math.ceil(box.height)
      if (w === 0 || h === 0) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      // 1. Rasterise the word offscreen with the same font.
      const style = getComputedStyle(textEl)
      const size = parseFloat(style.fontSize)
      const off = document.createElement("canvas")
      off.width = w
      off.height = h
      const o = off.getContext("2d", { willReadFrequently: true })
      if (!o) return
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

      // 2. Pick nodes: outline pixels first, then a sparse interior, kept apart by `gap`.
      const gap = Math.max(4, size * 0.05)
      const nodes: { x: number; y: number }[] = []
      const cell = gap
      const grid = new Map<string, { x: number; y: number }[]>()
      const near = (x: number, y: number, r: number) => {
        const cx = Math.floor(x / cell)
        const cy = Math.floor(y / cell)
        const out: { x: number; y: number }[] = []
        const reach = Math.ceil(r / cell)
        for (let gx = cx - reach; gx <= cx + reach; gx++) {
          for (let gy = cy - reach; gy <= cy + reach; gy++) {
            for (const n of grid.get(`${gx},${gy}`) ?? []) {
              if ((n.x - x) ** 2 + (n.y - y) ** 2 < r * r) out.push(n)
            }
          }
        }
        return out
      }
      const add = (x: number, y: number) => {
        if (near(x, y, gap).length > 0) return
        const n = { x, y }
        nodes.push(n)
        const key = `${Math.floor(x / cell)},${Math.floor(y / cell)}`
        grid.set(key, [...(grid.get(key) ?? []), n])
      }
      const step = 2
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          if (!inside(x, y)) continue
          const edge = !inside(x - step, y) || !inside(x + step, y) || !inside(x, y - step) || !inside(x, y + step)
          if (edge) add(x, y)
        }
      }
      const inner = gap * 2.4
      for (let y = inner / 2; y < h; y += inner) {
        for (let x = inner / 2; x < w; x += inner) {
          const px = Math.round(x)
          const py = Math.round(y)
          if (inside(px, py) && near(px, py, gap * 1.3).length === 0) add(px, py)
        }
      }

      // 3. Link each node to its nearest neighbours.
      const root = getComputedStyle(document.documentElement)
      const ink = root.getPropertyValue("--foreground").trim() || "#24161c"
      const green = root.getPropertyValue("--brand-green").trim() || "#1a763f"
      ctx.strokeStyle = green
      ctx.globalAlpha = 0.7
      ctx.lineWidth = Math.max(0.8, size * 0.007)
      ctx.beginPath()
      for (const n of nodes) {
        const close = near(n.x, n.y, gap * 1.9)
          .filter((p) => p !== n)
          .sort((a, b) => (a.x - n.x) ** 2 + (a.y - n.y) ** 2 - ((b.x - n.x) ** 2 + (b.y - n.y) ** 2))
          .slice(0, 3)
        for (const p of close) {
          ctx.moveTo(n.x, n.y)
          ctx.lineTo(p.x, p.y)
        }
      }
      ctx.stroke()
      ctx.globalAlpha = 1
      ctx.fillStyle = ink
      const r = Math.max(1.2, size * 0.011)
      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    document.fonts.ready.then(render).catch((error: unknown) => console.error("FRANCIS graph: fonts did not load", error))
    const ro = new ResizeObserver(() => render())
    ro.observe(textEl)
    const theme = new MutationObserver(() => render())
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => {
      cancelled = true
      ro.disconnect()
      theme.disconnect()
    }
  }, [text])

  return (
    <span aria-hidden="true" className="relative inline-block">
      <span ref={textRef} className="invisible">
        {text}
      </span>
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </span>
  )
}
