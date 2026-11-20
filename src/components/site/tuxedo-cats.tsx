"use client"

import { useEffect, useState } from "react"

type Pose = "sit" | "loaf" | "stretch"
type Cat = { id: number; pose: Pose; zone: "ledge" | "floor"; x: number; scale: number; tilt: number; flip: boolean }

const COUNT = 6
const LEDGE = 2 // cats perched on the footer's top line; the rest sit along the bottom
const POSES: Pose[] = ["sit", "loaf", "stretch"]
const WIDTH: Record<Pose, number> = { sit: 46, loaf: 64, stretch: 78 }

const rand = (min: number, max: number) => min + Math.random() * (max - min)

// Spread cats across a zone so they never pile up: one per slot, jittered inside it.
function place(n: number, from: number, to: number) {
  const slot = (to - from) / n
  return Array.from({ length: n }, (_, i) => from + slot * i + rand(slot * 0.15, slot * 0.75))
}

/**
 * Six tuxedo cats, a new arrangement on every visit: random pose, spot, size,
 * tilt, and facing. Decorative. They sit on the footer's edges, away from text.
 */
export function TuxedoCats() {
  const [cats, setCats] = useState<Cat[]>([])

  useEffect(() => {
    // Random layout is made after mount so server and client HTML match.
    const ledgeX = place(LEDGE, 30, 92)
    const floorX = place(COUNT - LEDGE, 2, 92)
    const next: Cat[] = Array.from({ length: COUNT }, (_, i) => ({
      id: i,
      pose: POSES[Math.floor(Math.random() * POSES.length)] ?? "sit",
      zone: i < LEDGE ? "ledge" : "floor",
      x: (i < LEDGE ? ledgeX[i] : floorX[i - LEDGE]) ?? 50,
      scale: rand(0.8, 1.2),
      tilt: rand(-9, 9),
      flip: Math.random() < 0.5,
    }))
    const frame = window.requestAnimationFrame(() => setCats(next))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {cats.map((cat) => (
        <div
          key={cat.id}
          className="tux-cat pointer-events-auto absolute animate-in duration-500 fade-in zoom-in-75 motion-reduce:animate-none"
          style={{
            left: `${cat.x}%`,
            ...(cat.zone === "ledge" ? { top: 1, translate: "0 -100%" } : { bottom: 0 }),
            width: WIDTH[cat.pose] * cat.scale,
            rotate: `${cat.tilt}deg`,
            scale: cat.flip ? "-1 1" : undefined,
            transformOrigin: "50% 100%",
            animationDelay: `${cat.id * 90}ms`,
          }}
        >
          <CatSvg pose={cat.pose} />
        </div>
      ))}
    </div>
  )
}

const INK = "var(--tux-ink)"
const WHITE = "var(--tux-white)"
const EYE = "#d9c34a"
const NOSE = "#e88aa8"

function CatSvg({ pose }: { pose: Pose }) {
  if (pose === "loaf") {
    return (
      <svg viewBox="0 0 80 50" className="block w-full">
        <path d="M66 44 C78 44 80 34 72 30" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
        <ellipse cx="44" cy="34" rx="27" ry="14" fill={INK} className="tux-ink" />
        <polygon points="9,18 11,4 19,12" fill={INK} />
        <polygon points="29,18 27,4 20,12" fill={INK} />
        <circle cx="19" cy="24" r="12" fill={INK} className="tux-ink" />
        <path d="M14 33 C16 40 22 44 28 46 L20 47 C14 44 12 38 14 33 Z" fill={WHITE} />
        <ellipse cx="19" cy="29" rx="5.5" ry="4" fill={WHITE} />
        <path d="M18 27.5 L20 27.5 L19 29 Z" fill={NOSE} />
        <path d="M13 22 Q15 24 17 22 M21 22 Q23 24 25 22" stroke={WHITE} strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <ellipse cx="22" cy="47" rx="5" ry="2.5" fill={WHITE} />
        <ellipse cx="33" cy="47" rx="5" ry="2.5" fill={WHITE} />
      </svg>
    )
  }
  if (pose === "stretch") {
    return (
      <svg viewBox="0 0 90 40" className="block w-full">
        <path d="M76 27 C88 22 88 8 82 4" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
        <ellipse cx="50" cy="28" rx="29" ry="9.5" fill={INK} className="tux-ink" />
        <polygon points="8,14 9,2 16,9" fill={INK} />
        <polygon points="25,13 24,2 18,8" fill={INK} />
        <circle cx="16" cy="21" r="10" fill={INK} className="tux-ink" />
        <ellipse cx="16" cy="25.5" rx="5" ry="3.5" fill={WHITE} />
        <path d="M15 24 L17 24 L16 25.4 Z" fill={NOSE} />
        <circle cx="12" cy="19" r="1.8" fill={EYE} />
        <circle cx="20" cy="19" r="1.8" fill={EYE} />
        <path d="M26 33 C32 30 40 30 44 33 L42 36 C36 34 30 34 26 36 Z" fill={WHITE} />
        <ellipse cx="4" cy="35" rx="5" ry="2.4" fill={WHITE} />
        <ellipse cx="12" cy="36.5" rx="5" ry="2.4" fill={WHITE} />
        <ellipse cx="70" cy="36.5" rx="4.5" ry="2.4" fill={WHITE} />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 60 70" className="block w-full">
      <path d="M42 64 C56 62 58 48 51 41" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
      <ellipse cx="30" cy="50" rx="16" ry="18" fill={INK} className="tux-ink" />
      <polygon points="18,19 19,5 27,13" fill={INK} />
      <polygon points="42,19 41,5 33,13" fill={INK} />
      <circle cx="30" cy="24" r="13" fill={INK} className="tux-ink" />
      <path d="M30 35 C23 41 23 55 30 61 C37 55 37 41 30 35 Z" fill={WHITE} />
      <ellipse cx="30" cy="29.5" rx="6" ry="4.5" fill={WHITE} />
      <path d="M29 27.5 L31 27.5 L30 29 Z" fill={NOSE} />
      <ellipse cx="25" cy="22.5" rx="2.2" ry="2.4" fill={EYE} />
      <ellipse cx="35" cy="22.5" rx="2.2" ry="2.4" fill={EYE} />
      <ellipse cx="25" cy="22.5" rx="0.8" ry="1.9" fill={INK} />
      <ellipse cx="35" cy="22.5" rx="0.8" ry="1.9" fill={INK} />
      <ellipse cx="24" cy="67" rx="4.5" ry="2.6" fill={WHITE} />
      <ellipse cx="36" cy="67" rx="4.5" ry="2.6" fill={WHITE} />
    </svg>
  )
}
