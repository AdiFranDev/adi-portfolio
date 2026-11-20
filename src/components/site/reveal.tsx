"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type RevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  // "fade" rises and fades in; "none" only sets data-shown for CSS (contour lines).
  variant?: "fade" | "none"
}

// Sets data-shown="true" once, when about a quarter of the element is in view.
export function Reveal({ children, className, delay = 0, variant = "fade" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-shown={shown}
      className={cn(variant === "fade" && "reveal", className)}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  )
}
