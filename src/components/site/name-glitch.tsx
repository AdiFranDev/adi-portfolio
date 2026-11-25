"use client"

import { useEffect, useEffectEvent, useRef, useState } from "react"

type Phase = "rest" | "glitch" | "rawr" | "bite"

const GLITCH_CHARS = "RIANWX#%&@/"
const randomWord = () =>
  Array.from({ length: 4 }, () => GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] ?? "R").join("")

/**
 * ADRIAN: hover makes RIAN glitch (0 to 300 ms), settle as RAWR (300 to 500 ms),
 * then a bite comes out of the last R (500 to 900 ms). It reverses on leave.
 * Touch screens play it once when the name comes into view. Reduced motion: no effect.
 * The whole thing is aria-hidden; the heading carries the real name.
 */
export function NameGlitch() {
  const [phase, setPhase] = useState<Phase>("rest")
  const [noise, setNoise] = useState("RIAN")
  const ref = useRef<HTMLSpanElement>(null)
  const timers = useRef<number[]>([])
  const ticker = useRef<number | null>(null)

  function clearAll() {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
    if (ticker.current !== null) window.clearInterval(ticker.current)
    ticker.current = null
  }

  function play() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    clearAll()
    setPhase("glitch")
    ticker.current = window.setInterval(() => setNoise(randomWord()), 50)
    timers.current.push(
      window.setTimeout(() => {
        if (ticker.current !== null) window.clearInterval(ticker.current)
        ticker.current = null
        setPhase("rawr")
      }, 300),
      window.setTimeout(() => setPhase("bite"), 500),
    )
  }

  function rest() {
    clearAll()
    setPhase("rest")
  }

  const playOnce = useEffectEvent(() => play())
  const settle = useEffectEvent(() => rest())
  const stop = useEffectEvent(() => clearAll())

  // Touch screens: play once when the name enters view, then settle back.
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia("(hover: none)").matches) return
    const pending: number[] = []
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        pending.push(window.setTimeout(() => playOnce(), 600))
        pending.push(window.setTimeout(() => settle(), 2400))
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      pending.forEach((t) => window.clearTimeout(t))
      stop()
    }
  }, [])

  return (
    <span
      ref={ref}
      aria-hidden="true"
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") play()
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") rest()
      }}
      className="relative inline-flex text-accent-pink"
    >
      AD
      {/* The slot keeps RIAN's width (the visible text takes no width of its own),
          so ADRIAN stays centered and RAWR runs a little past it without moving anything. */}
      <span className="inline-grid">
        <span className="invisible col-start-1 row-start-1">RIAN</span>
        <span className="col-start-1 row-start-1 w-0 overflow-visible whitespace-nowrap">
          {phase === "rest" && "RIAN"}
          {phase === "glitch" && (
            <span className="relative">
              {noise}
              <span className="absolute top-0 left-1 text-primary opacity-55 [clip-path:inset(18%_0_52%_0)]">
                {noise}
              </span>
              <span className="absolute top-0 -left-[5px] text-foreground opacity-40 [clip-path:inset(62%_0_12%_0)]">
                RAWR
              </span>
            </span>
          )}
          {(phase === "rawr" || phase === "bite") && (
            <>
              RAW
              <span className="relative inline-block">
                <span className="bite-r" data-bitten={phase === "bite"}>
                  R
                </span>
                {phase === "bite" && (
                  <span className="bite-crumb absolute top-[0.3em] -right-[0.06em] size-[0.03em] min-h-1 min-w-1 rounded-full bg-primary" />
                )}
              </span>
            </>
          )}
        </span>
      </span>
    </span>
  )
}
