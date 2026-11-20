"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type WordSceneProps = {
  word: string
  section: string
  // "pop": the word pops up. "blur": the word comes into focus out of a blur.
  entry?: "pop" | "blur"
}

const clamp = (v: number) => Math.min(1, Math.max(0, v))
const easeOut = (t: number) => 1 - (1 - t) ** 3

/**
 * A pinned scene between sections: the word arrives, holds, then grows outward
 * and fades, revealing the next section. Reduced motion: a still word.
 */
export function WordScene({ word, section, entry = "pop" }: WordSceneProps) {
  const outerRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLSpanElement>(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const outer = outerRef.current
    const el = wordRef.current
    if (!outer || !el) return
    const query = window.matchMedia("(prefers-reduced-motion: no-preference)")
    let frame = 0

    const update = () => {
      frame = 0
      const rect = outer.getBoundingClientRect()
      const range = rect.height - window.innerHeight
      const p = range > 0 ? clamp(-rect.top / range) : 0
      const inT = easeOut(clamp(p / 0.35))
      const outT = clamp((p - 0.5) / 0.5)
      let scale: number
      let blur: number
      let opacity: number
      if (entry === "pop") {
        scale = 0.6 + 0.4 * inT
        blur = 0
      } else {
        scale = 1.08 - 0.08 * inT
        blur = 16 * (1 - inT)
      }
      opacity = inT
      if (outT > 0) {
        scale *= 1 + outT * outT * 5
        blur += outT * 10
        opacity *= 1 - clamp((outT - 0.35) / 0.65)
      }
      el.style.transform = `scale(${scale.toFixed(4)})`
      el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : ""
      el.style.opacity = opacity.toFixed(3)
      el.style.letterSpacing = `${(-0.03 + outT * 0.2).toFixed(3)}em`
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    const setup = () => {
      setAnimated(query.matches)
      window.removeEventListener("scroll", onScroll)
      el.style.cssText = ""
      if (query.matches) {
        window.addEventListener("scroll", onScroll, { passive: true })
        update()
      }
    }
    setup()
    query.addEventListener("change", setup)
    return () => {
      query.removeEventListener("change", setup)
      window.removeEventListener("scroll", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [entry])

  return (
    <div ref={outerRef} data-section={section} aria-hidden="true" className={cn("relative", animated ? "h-[220svh]" : "h-[60svh]")}>
      <div className={cn("flex items-center justify-center overflow-hidden", animated ? "sticky top-0 h-svh" : "h-full")}>
        <span
          ref={wordRef}
          className="block px-5 text-center font-display text-[clamp(44px,10vw,170px)] leading-none font-extrabold tracking-[-0.03em] text-foreground will-change-transform md:whitespace-nowrap"
        >
          {word}
        </span>
      </div>
    </div>
  )
}
