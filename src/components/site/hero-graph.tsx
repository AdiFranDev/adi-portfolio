"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export type GraphNode = {
  id: string
  label: string
  // Where the node's dot sits, as a share of the scene (0 to 1).
  x: number
  y: number
  n?: string
  note?: string
  href?: string
  tilt?: number
  tone?: "green"
  // Hidden until the hero scroll is almost done (fades in over the last 7%).
  late?: boolean
}

type HeroGraphProps = {
  nodes: GraphNode[]
  edges: [string, string][]
  // Starts drawing the edges; before that, nothing shows.
  play: boolean
}

// Opacity for a late node and its edges: 0 until 93% of the hero scroll, 1 at 100%.
const LATE = { opacity: "clamp(0, calc((var(--p) - 0.93) * 14.3), 1)" } as const

const DRAW_MS = 1600
const STAGGER_MS = 350
// Seconds a runner takes to cross one edge.
const RUN_S = 3.2

/**
 * The hero's graph: Adrian's three roles, the three things his tagline names, and
 * Empathy on his back, joined to all of them. Curved dotted edges draw in one after
 * another, then a small pink runner keeps travelling each edge, so the whole network
 * looks alive. Side edges bow outward, away from Adrian and the name. Reduced
 * motion: everything drawn, no drift and no runners.
 */
export function HeroGraph({ nodes, edges, play }: HeroGraphProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  // Runners start once every edge has drawn in; none with reduced motion.
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!play || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = window.setTimeout(() => setRunning(true), DRAW_MS + edges.length * STAGGER_MS)
    return () => window.clearTimeout(timer)
  }, [play, edges.length])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setSize({ w: entry.contentRect.width, h: entry.contentRect.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const lateIds = new Set(nodes.filter((n) => n.late).map((n) => n.id))

  const at = (id: string) => {
    const node = nodes.find((n) => n.id === id)
    return node ? { x: node.x * size.w, y: node.y * size.h, side: node.x < 0.45 ? -1 : node.x > 0.55 ? 1 : 0 } : null
  }

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0">
      {size.w > 0 && (
        <svg aria-hidden="true" width={size.w} height={size.h} className="absolute inset-0 overflow-visible">
          {edges.map(([from, to], i) => {
            const a = at(from)
            const b = at(to)
            if (!a || !b) return null
            // Bow each curve outward, away from Adrian in the middle.
            const mx = (a.x + b.x) / 2
            const my = (a.y + b.y) / 2
            const len = Math.hypot(b.x - a.x, b.y - a.y)
            let nx = -(b.y - a.y) / (len || 1)
            let ny = (b.x - a.x) / (len || 1)
            // Side edges bow outward, away from Adrian. Edges from the centre node, and
            // edges that cross from one side to the other, dip down, under his head.
            const across = a.side === 0 || b.side === 0 || a.side !== b.side
            const flip = across ? ny < 0 : Math.sign(nx || 1) !== (a.side || b.side)
            if (flip) {
              nx = -nx
              ny = -ny
            }
            // Edges into the centre node are straight rays, so they fan apart and never run
            // side by side; edges along a side bow outward.
            const toCentre = a.side === 0 || b.side === 0
            const bow = toCentre ? 0 : across ? 0.12 : 0.22
            const off = len * bow
            const d = `M${a.x} ${a.y} Q${mx + nx * off} ${my + ny * off} ${b.x} ${b.y}`
            const id = `edge-${from}-${to}`
            const delay = `${i * STAGGER_MS}ms`
            return (
              <g key={`${from}-${to}`} style={lateIds.has(from) || lateIds.has(to) ? LATE : undefined}>
                <mask id={`${id}-m`} maskUnits="userSpaceOnUse">
                  <path
                    d={d}
                    pathLength={1}
                    fill="none"
                    stroke="#fff"
                    strokeWidth={8}
                    className={cn("graph-draw", play && "graph-draw-on")}
                    style={{ animationDelay: delay, animationDuration: `${DRAW_MS}ms` }}
                  />
                </mask>
                <g mask={`url(#${id}-m)`}>
                  {/* A light casing under the dots keeps them visible on the photo in both themes. */}
                  <path d={d} fill="none" className="graph-flow stroke-background/80" strokeWidth={5.5} strokeLinecap="round" strokeDasharray="0.1 7" />
                  <path id={id} d={d} fill="none" className="graph-flow stroke-foreground" strokeWidth={2.6} strokeLinecap="round" strokeDasharray="0.1 7" />
                </g>
                {running && (
                  <circle r={4.5} className="fill-primary stroke-background" strokeWidth={2}>
                    <animateMotion dur={`${RUN_S}s`} repeatCount="indefinite" begin={`${(i % 6) * 0.5}s`} keyPoints={i % 2 ? "1;0" : "0;1"} keyTimes="0;1" calcMode="linear">
                      <mpath href={`#${id}`} />
                    </animateMotion>
                  </circle>
                )}
              </g>
            )
          })}
        </svg>
      )}
      {nodes.map((node, i) => {
        // A node in the middle hangs its label below the dot, unless it is at the foot of
        // the scene (Impact), where the label sits beside the dot instead.
        const centre = Math.abs(node.x - 0.5) < 0.05 && node.y < 0.9
        const body = (
          <>
            <span className={cn("flex items-center gap-2.5", centre && "flex-col gap-1.5")}>
              <span aria-hidden="true" className={cn("relative flex size-3.5", !centre && "-translate-x-1/2")}>
                <span className={cn("absolute inset-0 animate-ping rounded-full", node.tone === "green" ? "bg-brand-green/40" : "bg-primary/40", "[animation-duration:2.4s] motion-reduce:animate-none")} />
                <span className={cn("relative size-3.5 rounded-full border-2 border-background shadow-[0_1px_4px_rgb(0_0_0/0.3)]", node.tone === "green" ? "bg-brand-green" : "bg-primary")} />
              </span>
              <span
                className={cn(
                  "flex items-center gap-2 rounded-full bg-background/90 px-3.5 py-1.5 text-[15px] font-semibold whitespace-nowrap text-foreground shadow-[0_2px_10px_rgb(0_0_0/0.14)] backdrop-blur-sm transition-[background-color,color] duration-150",
                  !centre && "-ml-1.5",
                  node.href && "group-hover:bg-foreground group-hover:text-background",
                )}
              >
                {node.n && <span className={cn("font-mono text-[12px]", node.tone === "green" ? "text-brand-green" : "opacity-60")}>{node.n}</span>}
                {node.label}
              </span>
            </span>
            {node.note && (
              <span
                className={cn(
                  "font-hand text-[21px] leading-none text-foreground drop-shadow-[0_1px_2px_color-mix(in_oklab,var(--background)_80%,transparent)]",
                  centre ? "text-center whitespace-nowrap" : "ml-5",
                )}
                style={{ rotate: `${node.tilt ?? 0}deg` }}
              >
                {node.note}
              </span>
            )}
          </>
        )
        const place = {
          left: `${node.x * 100}%`,
          top: `${node.y * 100}%`,
          transitionDelay: play ? `${i * 120}ms` : "0ms",
          // A late node follows the scroll instead of the play-in fade.
          ...(node.late ? { opacity: play ? LATE.opacity : 0, transitionDelay: "0ms", transitionProperty: "scale" } : {}),
        }
        const shared = cn(
          "absolute flex flex-col items-start gap-1.5 transition-[opacity,scale] duration-500 ease-out motion-reduce:transition-none",
          // The centre node is hung from its dot, label below; side nodes sit beside theirs.
          // Side nodes: the pill row (about 34px tall) is centred on the point, whatever
          // the caption below it adds, so the dot sits exactly where its edges end.
          centre ? "-translate-x-1/2 -translate-y-[7px] items-center" : "-translate-y-[17px]",
          play ? "scale-100 opacity-100" : "scale-90 opacity-0",
        )
        return node.href ? (
          <a key={node.id} href={node.href} style={place} className={cn(shared, "group pointer-events-auto no-underline")}>
            {body}
          </a>
        ) : (
          <span key={node.id} style={place} className={shared}>
            {body}
          </span>
        )
      })}
    </div>
  )
}
