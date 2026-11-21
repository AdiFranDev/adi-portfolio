"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type GreetingCycleProps = {
  greetings: { lang: string; text: string }[]
  className?: string
}

const EVERY_MS = 2800

/**
 * Cycles through one greeting per language. The box takes the width of the
 * greeting on show and eases to the next one's width, so a pill around it grows
 * for long greetings and shrinks for short ones, staying centred. The old line
 * fades out before the new one fades in, so two never show at once. Screen
 * readers get the first greeting once, not a ticking region. Reduced motion:
 * the first greeting stays.
 */
export function GreetingCycle({ greetings, className }: GreetingCycleProps) {
  const [index, setIndex] = useState(0)
  const [widths, setWidths] = useState<number[]>([])
  const refs = useRef<(HTMLSpanElement | null)[]>([])
  const count = greetings.length

  useEffect(() => {
    if (count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), EVERY_MS)
    return () => window.clearInterval(timer)
  }, [count])

  // Measure every greeting (they share one cell, so each keeps its natural width),
  // and again once fonts load or the size changes.
  useLayoutEffect(() => {
    const measure = () => setWidths(refs.current.map((el) => el?.offsetWidth ?? 0))
    measure()
    const ro = new ResizeObserver(measure)
    refs.current.forEach((el) => el && ro.observe(el))
    document.fonts.ready.then(measure).catch(() => undefined)
    return () => ro.disconnect()
  }, [greetings])

  const first = greetings[0]
  if (!first) return null
  const width = widths[index]

  return (
    <div className={className}>
      <span className="sr-only" lang={first.lang}>
        {first.text}
      </span>
      <span
        aria-hidden="true"
        className="grid grid-cols-[minmax(0,1fr)] justify-items-center overflow-hidden transition-[width] duration-500 ease-out motion-reduce:transition-none"
        style={width ? { width } : undefined}
      >
        {greetings.map((g, i) => (
          <span
            key={g.lang}
            ref={(el) => {
              refs.current[i] = el
            }}
            lang={g.lang}
            className={cn(
              "col-start-1 row-start-1 whitespace-nowrap transition-[opacity,translate] duration-400 ease-out motion-reduce:transition-none",
              i === index ? "translate-y-0 opacity-100 delay-150" : "-translate-y-1.5 opacity-0 duration-200",
            )}
          >
            {g.text}
          </span>
        ))}
      </span>
    </div>
  )
}
