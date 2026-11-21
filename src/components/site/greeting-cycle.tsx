"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type GreetingCycleProps = {
  greetings: { lang: string; text: string }[]
  className?: string
}

const EVERY_MS = 2800

/**
 * Cycles through one greeting per language. Every greeting sits in the same
 * grid cell, so the line keeps the width of the longest one and nothing below
 * it moves. Screen readers get the first greeting once, not a ticking region.
 * Reduced motion: the first greeting stays.
 */
export function GreetingCycle({ greetings, className }: GreetingCycleProps) {
  const [index, setIndex] = useState(0)
  const count = greetings.length

  useEffect(() => {
    if (count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), EVERY_MS)
    return () => window.clearInterval(timer)
  }, [count])

  const first = greetings[0]
  if (!first) return null

  return (
    <div className={className}>
      <span className="sr-only" lang={first.lang}>
        {first.text}
      </span>
      <span aria-hidden="true" className="grid">
        {greetings.map((g, i) => (
          <span
            key={g.lang}
            lang={g.lang}
            className={cn(
              "col-start-1 row-start-1 transition-[opacity,translate] duration-500 ease-out motion-reduce:transition-none",
              i === index ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0",
            )}
          >
            {g.text}
          </span>
        ))}
      </span>
    </div>
  )
}
