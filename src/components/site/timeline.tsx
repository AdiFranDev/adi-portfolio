"use client"

import { useEffect, useRef, useState } from "react"
import type { TimelineEntry } from "@content/site"
import { cn } from "@/lib/utils"

type TimelineProps = {
  title: string
  entries: TimelineEntry[]
  streak?: number
}

// The step whose top has passed this line (a share of the viewport height) is the lit one.
const READ_LINE = 0.62

/**
 * A numbered, borderless timeline. As the page scrolls, the step that reaches
 * the reading line lights up and the others dim. Hover or focus lights a step
 * directly. Reduced motion: every step stays lit.
 */
export function Timeline({ title, entries, streak }: TimelineProps) {
  const listRef = useRef<HTMLOListElement>(null)
  const [scrolled, setScrolled] = useState(0)
  const [pointed, setPointed] = useState<number | null>(null)
  const [still, setStill] = useState(false)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    setStill(reduce.matches)
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * READ_LINE
      const items = Array.from(list.children)
      let lit = 0
      items.forEach((el, i) => {
        if (el.getBoundingClientRect().top < line) lit = i
      })
      setScrolled(lit)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    const onMotion = () => setStill(reduce.matches)
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    reduce.addEventListener("change", onMotion)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      reduce.removeEventListener("change", onMotion)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const active = pointed ?? scrolled

  return (
    <div className="flex flex-col gap-6">
      <h3 className="type-h3 m-0">{title}</h3>
      <ol ref={listRef} className="relative m-0 flex list-none flex-col gap-7 p-0">
        {/* The rail behind the numbers */}
        <span aria-hidden="true" className="absolute top-4 bottom-4 left-4 w-px bg-border" />
        {entries.map((entry, i) => {
          const on = still || i === active
          return (
            <li
              key={entry.org}
              tabIndex={0}
              onPointerEnter={() => setPointed(i)}
              onPointerLeave={() => setPointed(null)}
              onFocus={() => setPointed(i)}
              onBlur={() => setPointed(null)}
              className={cn(
                "relative grid grid-cols-[32px_minmax(0,1fr)] gap-x-4 rounded-sm outline-none transition-opacity duration-300 focus-visible:ring-3 focus-visible:ring-ring/50",
                on ? "opacity-100" : "opacity-45",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "relative z-10 flex size-8 items-center justify-center rounded-full border font-mono text-sm font-semibold transition-[background-color,color,box-shadow,border-color] duration-300",
                  on
                    ? "border-foreground bg-foreground text-background shadow-[0_0_0_5px_color-mix(in_oklab,var(--foreground)_12%,transparent)]"
                    : "border-input bg-background text-muted-foreground",
                )}
              >
                {i + 1}
              </span>
              <div className="flex min-w-0 flex-col gap-1 pt-1">
                <div className="flex items-start justify-between gap-3">
                  <span
                    lang={entry.lang}
                    className={cn("text-[15px] font-semibold", entry.todo && "rounded-sm bg-primary/10 px-1 text-primary")}
                  >
                    {entry.org.includes("日本語") ? (
                      <>
                        {entry.org.replace(" 日本語", "")}{" "}
                        <span lang="ja" className="font-jp">
                          日本語
                        </span>
                      </>
                    ) : (
                      entry.org
                    )}
                  </span>
                  {entry.dates && (
                    <span
                      className={cn(
                        "shrink-0 rounded-full border border-input px-2.5 py-0.5 font-mono text-[12px] whitespace-nowrap text-muted-foreground",
                        entry.todo && "border-primary/40 text-primary",
                      )}
                    >
                      {entry.dates}
                    </span>
                  )}
                </div>
                <div className="flex items-end justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className={cn("text-lg leading-snug font-bold", entry.todo && "text-primary")}>{entry.title}</span>
                    {entry.meta && (
                      <span className={cn("text-sm text-muted-foreground", entry.todo && "text-primary/80")}>{entry.meta}</span>
                    )}
                  </div>
                  {entry.stat === "streak" && streak !== undefined && (
                    <span className="font-display text-[28px] leading-none font-extrabold whitespace-nowrap text-brand-green lg:text-[32px]">
                      {streak}
                      <span className="font-sans text-sm font-medium text-muted-foreground"> days</span>
                    </span>
                  )}
                </div>
                {entry.tags && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {entry.tags.map((tag) => (
                      <span key={tag.text} lang={tag.lang} className="rounded-full border border-input px-2.5 py-0.5 text-[12px] font-medium">
                        {tag.text}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
