"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion } from "motion/react"
import { RotateCcw } from "lucide-react"
import type { Photo } from "@/lib/photos"
import { buttonStyles } from "@/components/site/ds"
import { cn } from "@/lib/utils"

export type GraphNode = {
  id: string
  label: string
  n: string
  x: number
  y: number
  side: "academic" | "community" | "center" | "impact"
  note: string
  photo: Photo
}

type AboutGraphProps = {
  nodes: GraphNode[]
  edges: [string, string][]
  links: [string, string][]
  root: string
  academic: Photo
  community: Photo
}

type Point = { x: number; y: number }
// A dot travelling along `pts`, from `start` for `dur` seconds.
type Trip = { key: string; pts: Point[]; start: number; dur: number }

const W = 1600
const H = 720
const SPEED = 210 // stage units per second for a travelling dot
const POP = 0.55 // seconds for a node to pop in
const SOLID = 0.7 // seconds for a dotted line to turn solid

const clamp = (v: number) => Math.min(1, Math.max(0, v))
const easeInOut = (v: number) => 0.5 - Math.cos(Math.PI * v) / 2
const easeOutBack = (v: number) => 1 + 2.2 * Math.pow(v - 1, 3) + 1.2 * Math.pow(v - 1, 2)
// A fixed "random" number in [0, 1) per key, so server and client agree and every replay looks the same.
const rand = (key: string) => {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 10000) / 10000
}
const lengthOf = (pts: Point[]) => pts.slice(1).reduce((sum, p, i) => {
  const a = pts[i] ?? p
  return sum + Math.hypot(p.x - a.x, p.y - a.y)
}, 0)
// The point a fraction `f` of the way along a polyline.
const along = (pts: Point[], f: number): Point => {
  const first = pts[0] ?? { x: 0, y: 0 }
  let dist = f * lengthOf(pts)
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1] ?? first
    const b = pts[i] ?? a
    const len = Math.hypot(b.x - a.x, b.y - a.y)
    if (dist <= len) {
      const k = len > 0 ? dist / len : 0
      return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k }
    }
    dist -= len
  }
  return pts[pts.length - 1] ?? first
}
const tripFraction = (trip: Trip, t: number) => easeInOut(clamp((t - trip.start) / trip.dur))

/**
 * D-017: the graph grows out of Adrian's photo. Empathy pops up inside it. Dots
 * travel out along dotted lines, to Initiative and Action first, then on to the
 * other nodes, and each node pops in as its dot arrives. Before the tree is done,
 * more dots join the nodes on each side to each other (no lines cross). Then
 * every dot walks home to Empathy, the dotted lines turn solid, and one last dot
 * carries a line down to Impact, which pops up beneath the photo as the photo
 * changes to the 4-H shirt. Start times and speeds vary a little per dot.
 * It plays once when the graph comes into view; "Replay" plays it again.
 * Reduced motion: the finished graph, no animation.
 */
export function AboutGraph({ nodes, edges, links, root, academic, community }: AboutGraphProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const inView = useInView(stageRef, { once: true, amount: 0.45 })
  const [clock, setClock] = useState(0)
  const [open, setOpen] = useState<string | null>(null)
  const progress = useMotionValue(0)
  useMotionValueEvent(progress, "change", (v) => setClock(v))

  // ---- The schedule (seconds) ----
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const impact = nodes.find((n) => n.side === "impact")
  const pt = (id: string): Point => {
    const n = byId.get(id)
    return n ? { x: n.x, y: n.y } : { x: 0, y: 0 }
  }
  const popAt = new Map<string, number>([[root, 0.4]])
  const parent = new Map<string, string>()
  const lines: { key: string; from: string; to: string; trip: Trip }[] = []

  // 1. The tree, in content order (parents come before their children).
  for (const [from, to] of edges) {
    if (to === impact?.id) continue
    parent.set(to, from)
    const fromAt = popAt.get(from)
    if (fromAt === undefined) continue
    const pts = [pt(from), pt(to)]
    const start = fromAt + 0.25 + rand(`${to}:wait`) * 0.8
    const dur = (lengthOf(pts) / SPEED) * (0.85 + rand(`${to}:pace`) * 0.5)
    lines.push({ key: `${from}-${to}`, from, to, trip: { key: `out-${to}`, pts, start, dur } })
    popAt.set(to, start + dur)
  }
  // 2. Links within each side, once both ends exist; the dot leaves the node that appeared first.
  for (const [a, b] of links) {
    const aAt = popAt.get(a)
    const bAt = popAt.get(b)
    if (aAt === undefined || bAt === undefined) continue
    const [from, to] = aAt <= bAt ? [a, b] : [b, a]
    const pts = [pt(from), pt(to)]
    const start = Math.max(aAt, bAt) + 0.3 + rand(`${a}${b}:wait`) * 0.9
    const dur = (lengthOf(pts) / SPEED) * (0.85 + rand(`${a}${b}:pace`) * 0.5)
    lines.push({ key: `${a}-${b}`, from, to, trip: { key: `link-${a}-${b}`, pts, start, dur } })
  }
  const grown = Math.max(...lines.map((l) => l.trip.start + l.trip.dur))

  // 3. Every dot walks home to Empathy along the tree.
  const home: Trip[] = nodes
    .filter((n) => n.id !== root && n.id !== impact?.id)
    .map((n) => {
      const pts = [pt(n.id)]
      let cur = parent.get(n.id)
      while (cur !== undefined && pts.length <= nodes.length) {
        pts.push(pt(cur))
        cur = parent.get(cur)
      }
      const start = grown + 0.5 + rand(`${n.id}:home`) * 1.0
      // Long trips home move faster, so no single dot keeps everyone waiting.
      const dur = (1.7 + lengthOf(pts) / (SPEED * 3)) * (0.85 + rand(`${n.id}:homepace`) * 0.4)
      return { key: `home-${n.id}`, pts, start, dur }
    })
  const homeAt = Math.max(...home.map((h) => h.start + h.dur))

  // 4. The dotted lines turn solid, from Empathy outward with a little scatter. It starts as the
  //    last dots slip under the Empathy label, so there is no dead pause.
  const depth = (id: string) => {
    let d = 0
    let cur = parent.get(id)
    while (cur !== undefined && d < nodes.length) {
      d += 1
      cur = parent.get(cur)
    }
    return d
  }
  const solidAt = new Map(lines.map((l) => [l.key, homeAt - 0.6 + depth(l.to) * 0.2 + rand(`${l.key}:solid`) * 0.3]))
  const solidDone = Math.max(...[...solidAt.values()].map((v) => v + SOLID))

  // 5. The last dot carries a line down to Impact.
  const impactTrip: Trip | null = impact
    ? { key: "impact", pts: [pt(root), pt(impact.id)], start: solidDone + 0.4, dur: 1.5 }
    : null
  const impactAt = impactTrip ? impactTrip.start + impactTrip.dur : solidDone
  if (impact) popAt.set(impact.id, impactAt)
  const total = impactAt + POP + 0.4

  function play() {
    progress.set(0)
    animate(progress, total, { duration: total, ease: "linear" })
  }

  useEffect(() => {
    if (inView && !reduced) {
      progress.set(0)
      const run = animate(progress, total, { duration: total, ease: "linear" })
      return () => run.stop()
    }
  }, [inView, reduced, progress, total])

  // ---- This frame ----
  const t = reduced ? total : clock
  const popOf = (id: string) => {
    const at = popAt.get(id)
    return at === undefined ? 1 : clamp((t - at) / POP)
  }
  const dotsNow = reduced
    ? []
    : [...lines.map((l) => l.trip), ...home, ...(impactTrip ? [impactTrip] : [])]
        .filter((trip) => t >= trip.start && t <= trip.start + trip.dur)
        .map((trip) => ({ key: trip.key, ...along(trip.pts, tripFraction(trip, t)) }))
  const reached = t >= impactAt

  return (
    <div className="flex flex-col gap-6">
      {/* Desktop and tablet: the graph stage. */}
      <div ref={stageRef} className="relative hidden w-full md:block" style={{ aspectRatio: `${W} / ${H}` }}>
        <div className="absolute top-[15%] left-[40%] h-[56%] w-[20%] overflow-hidden rounded-[26px] bg-placeholder shadow-[0_30px_60px_-30px_rgb(1_42_35/0.5)]">
          {academic.ready && (
            <Image src={academic.file} alt={academic.alt} fill sizes="300px" className={cn("object-cover transition-opacity duration-700", reached && "opacity-0")} />
          )}
          {community.ready && (
            <Image src={community.file} alt={community.alt} fill sizes="300px" className={cn("object-cover opacity-0 transition-opacity duration-700", reached && "opacity-100")} />
          )}
          <span className="absolute top-3 left-3 rounded-full bg-background/95 px-2.5 py-1 font-mono text-[11.5px] tracking-[0.06em] text-primary uppercase">
            {reached ? "Community · 4-H" : "Academic · CS"}
          </span>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-visible">
          {lines.map(({ key, trip }) => {
            const f = tripFraction(trip, t)
            if (f <= 0) return null
            const a = trip.pts[0]
            if (!a) return null
            const b = along(trip.pts, f)
            const solid = reduced ? 1 : clamp((t - (solidAt.get(key) ?? 0)) / SOLID)
            return (
              <g key={key}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--primary)" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="0.1 9" opacity={1 - solid} />
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--primary)" strokeWidth={2.5} strokeLinecap="round" opacity={solid} />
              </g>
            )
          })}
          {impactTrip && tripFraction(impactTrip, t) > 0 && (() => {
            const a = impactTrip.pts[0]
            const b = along(impactTrip.pts, tripFraction(impactTrip, t))
            return a ? <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--accent-pink)" strokeWidth={2.5} strokeLinecap="round" /> : null
          })()}
          {dotsNow.map((d) => (
            <circle key={d.key} cx={d.x} cy={d.y} r={8} fill="var(--accent-pink)" stroke="var(--background)" strokeWidth={2.5} />
          ))}
        </svg>

        {nodes.map((n) => {
          const isOpen = open === n.id
          const pop = popOf(n.id)
          const lit = n.id === impact?.id && reached
          return (
            <div
              key={n.id}
              className="absolute"
              style={{
                left: `${(n.x / W) * 100}%`,
                top: `${(n.y / H) * 100}%`,
                zIndex: isOpen ? 20 : 5,
                transform: `translate(-50%, -50%) scale(${pop > 0 ? 0.3 + 0.7 * easeOutBack(pop) : 0.3})`,
                opacity: clamp(pop * 2.5),
                visibility: pop > 0 ? "visible" : "hidden",
              }}
            >
              <button
                type="button"
                aria-describedby={isOpen ? `node-tip-${n.id}` : undefined}
                onMouseEnter={() => setOpen(n.id)}
                onMouseLeave={() => setOpen((o) => (o === n.id ? null : o))}
                onFocus={() => setOpen(n.id)}
                onBlur={() => setOpen((o) => (o === n.id ? null : o))}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setOpen(null)
                }}
                className={cn(
                  "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border py-0 pr-3.5 pl-2.5 text-sm font-semibold whitespace-nowrap text-foreground shadow-[0_4px_14px_rgb(0_0_0/0.06)] transition-colors duration-150",
                  lit ? "border-accent-pink bg-accent-pink-soft" : "border-border bg-card hover:border-foreground",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-2.5 rounded-full",
                    n.side === "impact" ? "bg-accent-pink" : n.side === "community" ? "bg-[#3f8a5c]" : "bg-primary",
                  )}
                />
                <span className="font-mono text-[11px] font-medium text-muted-foreground">{n.n}</span>
                {n.label}
              </button>
              {isOpen && (
                <motion.div
                  id={`node-tip-${n.id}`}
                  role="tooltip"
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute bottom-[calc(100%+12px)] left-1/2 w-60 -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_20px_40px_-16px_rgb(1_42_35/0.45)]"
                >
                  <div className="relative aspect-[3/2] bg-placeholder">
                    {n.photo.ready && <Image src={n.photo.file} alt={n.photo.alt} fill sizes="240px" className="object-cover" />}
                  </div>
                  <p className="m-0 px-3 py-2.5 text-[13.5px] leading-snug">
                    <b>{n.label}</b> · <span className="text-muted-foreground">{n.note}</span>
                  </p>
                </motion.div>
              )}
            </div>
          )
        })}
      </div>

      {/* Replay sits centred under the graph, below Impact. */}
      {!reduced && (
        <div className="hidden justify-center md:flex">
          <button type="button" onClick={play} className={buttonStyles({ variant: "quiet" })}>
            <RotateCcw aria-hidden="true" />
            Replay
          </button>
        </div>
      )}

      {/* Phones: the photo, then the nodes as a list with their photos. */}
      <div className="flex flex-col gap-5 md:hidden">
        <div className="relative mx-auto aspect-[4/5] w-[70%] overflow-hidden rounded-[22px] bg-placeholder">
          {academic.ready && <Image src={academic.file} alt={academic.alt} fill sizes="70vw" className="object-cover" />}
        </div>
        <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0">
          {nodes.map((n) => (
            <li key={n.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative aspect-[3/2] bg-placeholder">
                {n.photo.ready && <Image src={n.photo.file} alt={n.photo.alt} fill sizes="50vw" className="object-cover" />}
              </div>
              <p className="m-0 px-3 py-2 text-[13px] leading-snug">
                <b>{n.label}</b>
                <br />
                <span className="text-muted-foreground">{n.note}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
