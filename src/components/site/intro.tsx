"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { buttonStyles } from "@/components/site/ds"
import { cn } from "@/lib/utils"

// D-014: small graphs whose nodes travel into the letters F, A and E (viewBox 0 0 900 400).
// Each node: [startX, startY, letterX, letterY, pink (1) or green (0)].
const NODES: [number, number, number, number, number][] = [[150, 300, 100, 80, 0], [184, 300, 170, 80, 0], [171, 327, 240, 80, 1], [142, 333, 100, 135, 0], [119, 315, 100, 190, 0], [119, 285, 155, 190, 0], [142, 267, 210, 190, 0], [171, 273, 100, 255, 0], [330, 110, 100, 320, 1], [348, 139, 450, 80, 0], [314, 140, 427, 140, 0], [296, 112, 405, 200, 0], [312, 81, 382, 260, 0], [346, 80, 360, 320, 0], [364, 108, 473, 140, 1], [590, 310, 495, 200, 0], [576, 341, 518, 260, 0], [557, 318, 540, 320, 0], [563, 289, 450, 200, 0], [589, 276, 680, 80, 0], [616, 288, 750, 80, 1], [623, 317, 820, 80, 0], [605, 340, 680, 140, 0], [790, 140, 680, 200, 0], [756, 145, 735, 200, 0], [769, 113, 790, 200, 0], [803, 108, 680, 260, 1], [824, 135, 680, 320, 0], [811, 167, 750, 320, 0], [777, 172, 820, 320, 0]]
// Letter strokes, drawn once the nodes are in place.
const LETTER_EDGES: [number, number, number, number][] = [[100, 80, 170, 80], [170, 80, 240, 80], [100, 80, 100, 135], [100, 135, 100, 190], [100, 190, 155, 190], [155, 190, 210, 190], [100, 190, 100, 255], [100, 255, 100, 320], [450, 80, 427, 140], [427, 140, 405, 200], [405, 200, 382, 260], [382, 260, 360, 320], [450, 80, 473, 140], [473, 140, 495, 200], [495, 200, 518, 260], [518, 260, 540, 320], [405, 200, 450, 200], [450, 200, 495, 200], [680, 80, 750, 80], [750, 80, 820, 80], [680, 80, 680, 140], [680, 140, 680, 200], [680, 200, 735, 200], [735, 200, 790, 200], [680, 200, 680, 260], [680, 260, 680, 320], [680, 320, 750, 320], [750, 320, 820, 320]]
// Edges of the four starting graphs, which fade as the letters form.
const GRAPH_EDGES: [number, number, number, number][] = [[150, 300, 184, 300], [184, 300, 171, 327], [150, 300, 171, 327], [171, 327, 142, 333], [150, 300, 142, 333], [142, 333, 119, 315], [150, 300, 119, 315], [119, 315, 119, 285], [150, 300, 119, 285], [119, 285, 142, 267], [150, 300, 142, 267], [142, 267, 171, 273], [150, 300, 171, 273], [171, 273, 184, 300], [330, 110, 348, 139], [348, 139, 314, 140], [330, 110, 314, 140], [314, 140, 296, 112], [330, 110, 296, 112], [296, 112, 312, 81], [330, 110, 312, 81], [312, 81, 346, 80], [330, 110, 346, 80], [346, 80, 364, 108], [330, 110, 364, 108], [364, 108, 348, 139], [590, 310, 576, 341], [576, 341, 557, 318], [590, 310, 557, 318], [557, 318, 563, 289], [590, 310, 563, 289], [563, 289, 589, 276], [590, 310, 589, 276], [589, 276, 616, 288], [590, 310, 616, 288], [616, 288, 623, 317], [590, 310, 623, 317], [623, 317, 605, 340], [590, 310, 605, 340], [605, 340, 576, 341], [790, 140, 756, 145], [756, 145, 769, 113], [790, 140, 769, 113], [769, 113, 803, 108], [790, 140, 803, 108], [803, 108, 824, 135], [790, 140, 824, 135], [824, 135, 811, 167], [790, 140, 811, 167], [811, 167, 777, 172], [790, 140, 777, 172], [777, 172, 756, 145]]

const SEEN_KEY = "intro-seen"
type Phase = "graphs" | "letters" | "name" | "out"
const EASE = [0.65, 0, 0.35, 1] as const

/**
 * First visit in a session only. The inline script in layout.tsx sets
 * html[data-intro="play"] before paint (never with reduced motion); CSS hides
 * this overlay otherwise. About 4 seconds, with Skip.
 */
export function Intro() {
  const [phase, setPhase] = useState<Phase>("graphs")

  useEffect(() => {
    const root = document.documentElement
    if (root.dataset.intro !== "play") return
    const timers = [
      window.setTimeout(() => setPhase("letters"), 900),
      window.setTimeout(() => setPhase("name"), 2400),
      window.setTimeout(() => setPhase("out"), 3300),
      window.setTimeout(() => finish(), 4000),
    ]
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [])

  function finish() {
    document.documentElement.dataset.intro = "done"
    try {
      sessionStorage.setItem(SEEN_KEY, "1")
    } catch (error) {
      console.warn("Intro: sessionStorage is not available", error)
    }
  }

  const formed = phase !== "graphs"

  return (
    <motion.div
      className="intro-overlay fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background"
      animate={{ opacity: phase === "out" ? 0 : 1 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      style={{ pointerEvents: phase === "out" ? "none" : "auto" }}
    >
      <svg viewBox="0 0 900 400" className="h-auto w-[min(820px,90vw)] overflow-visible" role="img" aria-label="F A E">
        {GRAPH_EDGES.map(([x1, y1, x2, y2], i) => (
          <motion.line
            key={`g${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--primary)"
            strokeOpacity={0.35}
            strokeWidth={2}
            animate={{ opacity: formed ? 0 : 1 }}
            transition={{ duration: 0.5 }}
          />
        ))}
        {LETTER_EDGES.map(([x1, y1, x2, y2], i) => (
          <motion.line
            key={`l${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--primary)"
            strokeWidth={5}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: formed ? 1 : 0, opacity: formed ? 1 : 0 }}
            transition={{ duration: 0.7, delay: formed ? 0.7 + i * 0.025 : 0, ease: "easeOut" }}
          />
        ))}
        {NODES.map(([x0, y0, x1, y1, pink], i) => (
          <motion.circle
            key={`n${i}`}
            r={formed ? 7 : 5}
            fill={pink ? "var(--accent-pink)" : "var(--primary)"}
            initial={{ cx: x0, cy: y0, opacity: 0 }}
            animate={{ cx: formed ? x1 : x0, cy: formed ? y1 : y0, opacity: 1 }}
            transition={{ duration: formed ? 1.15 : 0.35, delay: formed ? i * 0.018 : i * 0.022, ease: EASE }}
          />
        ))}
      </svg>
      <motion.p
        className="m-0 font-display text-[22px] font-bold tracking-[0.02em]"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "name" || phase === "out" ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        Francis Adrian Esteban
      </motion.p>
      <button type="button" onClick={finish} className={cn(buttonStyles({ variant: "quiet" }), "absolute right-5 bottom-5")}>
        Skip
      </button>
    </motion.div>
  )
}
