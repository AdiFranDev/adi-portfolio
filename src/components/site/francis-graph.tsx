"use client"

import { useEffect, useRef } from "react"

type FrancisGraphProps = { text: string }

/**
 * Draws the word as a dot matrix: the letters, filled with an even grid of
 * brand-green dots. The real text stays in place (invisible) so the layout and
 * size match the type exactly.
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

      // 2. Fill the letters with an even, staggered grid of dots, so the word
      // keeps the same solid weight as the name under it.
      const pitch = Math.max(4, size * 0.058)
      const r = pitch * 0.34
      const root = getComputedStyle(document.documentElement)
      ctx.fillStyle = root.getPropertyValue("--brand-green").trim() || "#0e492a"
      ctx.beginPath()
      for (let row = 0, y = pitch / 2; y < h; row++, y += pitch * 0.866) {
        const shift = row % 2 === 0 ? 0 : pitch / 2
        for (let x = pitch / 2 + shift; x < w; x += pitch) {
          if (!inside(Math.round(x), Math.round(y))) continue
          ctx.moveTo(x + r, y)
          ctx.arc(x, y, r, 0, Math.PI * 2)
        }
      }
      ctx.fill()
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
