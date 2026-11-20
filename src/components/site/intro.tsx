"use client"

import { useEffect } from "react"
import { intro } from "@content/site"
import type { Photo } from "@/lib/photos"
import { PhotoSlot } from "@/components/site/photo-slot"
import { buttonStyles } from "@/components/site/ds"
import { cn } from "@/lib/utils"

// FAE graph coordinates (viewBox 0 0 242 120), from the Loader board.
const nodes = {
  f1: [20, 20], f2: [20, 60], f3: [20, 100], f4: [60, 20], f5: [52, 60],
  a1: [95, 100], a2: [120, 20], a3: [145, 100], a4: [106, 64], a5: [134, 64],
  e1: [180, 20], e2: [180, 60], e3: [180, 100], e4: [222, 20], e5: [214, 60], e6: [222, 100],
} as const
type NodeId = keyof typeof nodes

// Drawing order: a dot, another dot, the edge between them, and so on.
const steps: ([NodeId] | [NodeId, NodeId])[] = [
  ["f1"], ["f2"], ["f1", "f2"], ["f3"], ["f2", "f3"], ["f4"], ["f1", "f4"], ["f5"], ["f2", "f5"],
  ["a1"], ["a2"], ["a1", "a2"], ["a3"], ["a2", "a3"], ["a4"], ["a5"], ["a4", "a5"],
  ["e1"], ["e2"], ["e1", "e2"], ["e3"], ["e2", "e3"], ["e4"], ["e1", "e4"], ["e5"], ["e2", "e5"], ["e6"], ["e3", "e6"],
]
const STEP_MS = 100
const links: [NodeId, NodeId][] = [["f4", "a2"], ["a3", "e3"]]
const LINKS_AT = steps.length * STEP_MS

const INTRO_MS = 14000
const SEEN_KEY = "intro-seen"

const hello = "Hello"
const world = "world"

type IntroProps = { cameo: Photo }

/**
 * First visit only. The inline script in layout.tsx sets html[data-intro="play"]
 * before paint; CSS in globals.css runs the timeline; this component ends it.
 */
export function Intro({ cameo }: IntroProps) {
  useEffect(() => {
    const root = document.documentElement
    if (root.dataset.intro !== "play") return

    const finish = () => {
      root.dataset.intro = "done"
      try {
        sessionStorage.setItem(SEEN_KEY, "1")
      } catch (error) {
        console.warn("Intro: sessionStorage is not available", error)
      }
    }
    // End exactly when the overlay's fade-out ends (the CSS timeline starts at
    // first paint, before this effect runs), so scrolling never stays locked
    // after the intro is gone. The timer is only a fallback.
    const timer = window.setTimeout(finish, INTRO_MS)
    const overlay = document.querySelector<HTMLElement>(".intro-overlay")
    const fadeOut = overlay?.getAnimations().find((a) => a instanceof CSSAnimation && a.animationName === "intro-out")
    fadeOut?.finished.then(finish).catch((error: unknown) => {
      // AbortError means Skip or Esc already ended the intro and removed the overlay.
      if (!(error instanceof DOMException && error.name === "AbortError")) console.error("Intro: fade-out failed", error)
    })
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish()
    }
    window.addEventListener("keydown", onKey)
    const skip = document.getElementById("skip-intro")
    skip?.addEventListener("click", finish)
    skip?.focus()
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener("keydown", onKey)
      skip?.removeEventListener("click", finish)
    }
  }, [])

  return (
    <div className="intro-overlay fixed inset-0 z-[70] bg-background text-foreground">
      <button
        id="skip-intro"
        type="button"
        className={cn(buttonStyles({ variant: "secondary" }), "absolute top-5 right-5 z-10 md:top-6 md:right-14")}
      >
        Skip intro
      </button>
      <p className="sr-only" role="status">
        Francis Adrian Esteban, portfolio
      </p>

      <div aria-hidden="true" className="grid size-full place-items-center overflow-hidden">
        {/* Beat 0: the FAE graph */}
        <svg
          className="intro-graph col-start-1 row-start-1 w-[min(480px,80vw)]"
          viewBox="0 0 242 120"
          fill="none"
        >
          {links.map(([a, b]) => (
            <path
              key={`${a}-${b}`}
              d={`M${nodes[a][0]} ${nodes[a][1]} L${nodes[b][0]} ${nodes[b][1]}`}
              className="intro-link"
              style={{ animationDelay: `${LINKS_AT}ms` }}
              strokeDasharray="4 5"
              stroke="var(--brand-green-soft)"
              strokeWidth={2}
              strokeLinecap="round"
            />
          ))}
          {steps.map((step, i) =>
            step.length === 2 ? (
              <path
                key={step.join("-")}
                d={`M${nodes[step[0]][0]} ${nodes[step[0]][1]} L${nodes[step[1]][0]} ${nodes[step[1]][1]}`}
                pathLength={1}
                className="intro-edge"
                style={{ animationDelay: `${i * STEP_MS}ms` }}
                stroke="var(--brand-green)"
                strokeWidth={3}
                strokeLinecap="round"
              />
            ) : null,
          )}
          {steps.map((step, i) =>
            step.length === 1 ? (
              <circle
                key={step[0]}
                cx={nodes[step[0]][0]}
                cy={nodes[step[0]][1]}
                r={6}
                className="intro-node"
                style={{ animationDelay: `${i * STEP_MS}ms` }}
                fill="var(--primary)"
              />
            ) : null,
          )}
        </svg>

        {/* Beat 1: the greeting */}
        <div
          lang="fil"
          className="intro-greeting col-start-1 row-start-1 px-6 text-center font-display text-[clamp(28px,4vw,48px)] leading-tight font-bold"
        >
          {intro.greeting.before}
          <span className="text-brand-green">{intro.greeting.green}</span>
          {intro.greeting.after}
        </div>

        {/* Beats 2 to 5: Hello world, the glitch, UNIVERSE, the dissolve */}
        <div className="intro-hello col-start-1 row-start-1 flex items-baseline gap-[0.35em] text-[clamp(28px,4vw,48px)]">
          <span className="font-mono leading-none font-medium">
            {hello.split("").map((ch, i) => (
              <span key={i} className="intro-char" style={{ animationDelay: `${7200 + i * 120}ms` }}>
                {ch === " " ? " " : ch}
              </span>
            ))}
          </span>
          <span className="relative inline-grid items-baseline">
            <span className="intro-world col-start-1 row-start-1 font-mono leading-none font-medium">
              {world.split("").map((ch, i) => (
                <span key={i} className="intro-char" style={{ animationDelay: `${7200 + (hello.length + i) * 120}ms` }}>
                  {ch}
                </span>
              ))}
              <span className="intro-caret text-muted-foreground">_</span>
            </span>
            <span className="intro-universe relative col-start-1 row-start-1 font-display text-[1.25em] leading-none font-extrabold">
              UNIVERSE
              <span className="intro-universe-slice absolute top-0 left-1 text-primary opacity-60 [clip-path:inset(20%_0_50%_0)]">
                UNIVERSE
              </span>
              <span className="intro-universe-slice absolute top-0 -left-1 text-brand-green opacity-50 [clip-path:inset(62%_0_12%_0)]">
                UNIVERSE
              </span>
            </span>
          </span>
        </div>

        {/* Beat 4: the cameo */}
        <div className="intro-cameo absolute right-[6%] bottom-[10%] aspect-[561/401] w-[min(250px,62vw)] md:right-[8%] md:w-[440px]">
          <PhotoSlot
            photo={cameo}
            sizes="(min-width: 768px) 440px, 250px"
            priority
            detail="compact"
            className="size-full"
            imageClassName="object-contain"
          />
        </div>
      </div>
    </div>
  )
}
