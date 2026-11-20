"use client"

import { useEffect, useRef } from "react"

/**
 * One fixed layer behind the whole page: soft brand-colored light (pink and
 * greens) that drifts and pulses, a glow that follows the pointer and shifts
 * from pink to green across the screen, and film grain on top. Colors come from
 * --glow-* tokens in globals.css, so it works in light and dark. Reduced motion:
 * still, no pointer tracking.
 */
export function GrainBackdrop() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const target = { x: 0.5, y: 0.4 }
    const pos = { x: 0.5, y: 0.4 }
    let frame = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      const k = 1 - Math.exp(-dt / 450) // slow, soft follow
      pos.x += (target.x - pos.x) * k
      pos.y += (target.y - pos.y) * k
      el.style.setProperty("--mx", pos.x.toFixed(4))
      el.style.setProperty("--my", pos.y.toFixed(4))
      frame = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.0005 ? window.requestAnimationFrame(tick) : 0
    }
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth
      target.y = e.clientY / window.innerHeight
      if (!frame) {
        last = performance.now()
        frame = window.requestAnimationFrame(tick)
      }
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={ref} aria-hidden="true" className="grain-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="glow glow-a" />
      <div className="glow glow-b" />
      <div className="glow glow-c" />
      <div className="glow glow-d" />
      <div className="glow glow-cursor" />
      <svg className="grain absolute inset-0 size-full">
        <filter id="grain-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-noise)" />
      </svg>
    </div>
  )
}
