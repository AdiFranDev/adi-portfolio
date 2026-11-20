"use client"

import { useEffect, useRef, useState } from "react"
import type { MomentCategory } from "@content/moments"
import type { Photo } from "@/lib/photos"
import { PhotoSlot } from "@/components/site/photo-slot"
import { cn } from "@/lib/utils"

export type MomentView = {
  id: string
  category: MomentCategory
  caption: string
  photo: Photo
  x: number
  y: number
  w: number
  h: number
  r: number
}

type MomentsProps = {
  moments: MomentView[]
}

const STAGE_W = 1440
const STAGE_H = 900

const clamp = (v: number) => Math.min(1, Math.max(0, v))
const PHOTOS_FROM = 0.08 // progress where the first photo starts
const PHOTO_STEP = 0.075 // progress between photos
const PHOTO_SPAN = 0.14 // progress one photo takes to land
const EXIT_FROM = 0.78 // progress where everything zooms in and fades
const LETTUCE_IN = 0.02 // the lettuce pops up once the scene is pinned
const LETTUCE_OUT = 0.72 // and pops out just before the zoom

/**
 * Pinned and driven by scroll. First only the lettuce; scrolling down brings the
 * photos out of it one by one, scrolling up sends them back. At the end the
 * whole stage zooms in and fades into the next section. Reduced motion: all shown, no pin.
 */
export function Moments({ moments }: MomentsProps) {
  const outerRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const [pinned, setPinned] = useState(false)

  useEffect(() => {
    const outer = outerRef.current
    const stage = stageRef.current
    const scene = sceneRef.current
    if (!outer || !stage || !scene) return
    const query = window.matchMedia("(prefers-reduced-motion: no-preference)")
    let frame = 0

    let lettuce = "idle"
    const paint = (p: number) => {
      // Pop in after the scroll reaches the scene; pop out near the end or when scrolling back above it.
      const next = p >= LETTUCE_IN && p < LETTUCE_OUT ? "in" : lettuce === "idle" ? "idle" : "out"
      if (next !== lettuce) {
        lettuce = next
        stage.dataset.lettuce = next
      }
      const figures = stage.querySelectorAll<HTMLElement>(".burst-photo")
      figures.forEach((fig, i) => {
        const t = clamp((p - PHOTOS_FROM - i * PHOTO_STEP) / PHOTO_SPAN)
        fig.style.setProperty("--t", (1 - (1 - t) ** 3).toFixed(4))
      })
      const e = clamp((p - EXIT_FROM) / (1 - EXIT_FROM))
      scene.style.transform = e > 0 ? `scale(${(1 + e * e * 0.9).toFixed(4)})` : ""
      scene.style.opacity = (1 - e).toFixed(3)
    }
    const update = () => {
      frame = 0
      const rect = outer.getBoundingClientRect()
      const range = rect.height - window.innerHeight
      paint(range > 0 ? clamp(-rect.top / range) : 0)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    const setup = () => {
      setPinned(query.matches)
      window.removeEventListener("scroll", onScroll)
      if (query.matches) {
        window.addEventListener("scroll", onScroll, { passive: true })
        update()
      } else {
        paint(PHOTOS_FROM + 1)
        stage.dataset.lettuce = "in"
        scene.style.transform = ""
        scene.style.opacity = ""
      }
    }
    setup()
    query.addEventListener("change", setup)
    return () => {
      query.removeEventListener("change", setup)
      window.removeEventListener("scroll", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section
      ref={outerRef}
      id="moments"
      data-section="moments"
      aria-labelledby="moments-title"
      className={cn("relative", pinned ? "h-[340svh]" : "")}
    >
      <div
        className={cn(
          "overflow-hidden px-5 pt-[84px] pb-12 md:px-0 md:pt-0 md:pb-0",
          pinned && "sticky top-0 flex h-svh flex-col justify-center",
        )}
      >

      <div ref={sceneRef} className="relative mx-auto w-full max-w-[1440px] origin-center will-change-transform">
        <div className="relative z-10 flex flex-col gap-3.5 md:absolute md:inset-x-0 md:top-24 md:items-center md:gap-2.5 md:text-center">
          <h2 id="moments-title" className="type-h2 m-0">
            The lab, the field, and me
          </h2>
        </div>

        <div
          ref={stageRef}
          data-lettuce="idle"
          className="moments-stage relative mt-4 grid grid-cols-2 gap-2 md:mx-auto md:mt-0 md:block md:aspect-[1440/900] md:w-[min(100%,calc(100svh*1.6))]"
        >
          {moments.map((m) => {
            const style = {
              "--x": `${(m.x / STAGE_W) * 100}%`,
              "--y": `${(m.y / STAGE_H) * 100}%`,
              "--w": `${(m.w / STAGE_W) * 100}%`,
              "--h": `${(m.h / STAGE_H) * 100}%`,
              "--dx": `${((STAGE_W / 2 - (m.x + m.w / 2)) / m.w) * 100}%`,
              "--dy": `${((STAGE_H / 2 - (m.y + m.h / 2)) / m.h) * 100}%`,
              "--r": `${m.r}deg`,
              "--t": 0,
            } as React.CSSProperties
            return (
              <figure
                key={m.id}
                style={style}
                className={cn(
                  "burst-photo relative m-0 overflow-hidden rounded-xl md:absolute md:top-(--y) md:left-(--x) md:h-(--h) md:w-(--w)",
                  m.h > 200 ? "h-[clamp(84px,13svh,120px)]" : "h-[clamp(72px,10.5svh,96px)]",
                )}
              >
                <PhotoSlot
                  photo={m.photo}
                  sizes="(min-width: 768px) 260px, 45vw"
                  detail="compact"
                  className="size-full rounded-xl p-2"
                />
              </figure>
            )
          })}

          <svg
            aria-hidden="true"
            viewBox="0 0 150 130"
            className="lettuce pointer-events-none absolute top-1/2 left-1/2 z-10 -mt-[50px] -ml-[60px] w-[120px] origin-center md:top-[46.7%] md:left-[44.8%] md:m-0 md:w-[10.4%]"
          >
            <ellipse cx="75" cy="112" rx="46" ry="8" fill="var(--foreground)" fillOpacity="0.08" />
            <path d="M75 108 C30 110 8 80 22 52 C30 36 46 40 50 50 C46 30 62 18 75 26 C88 18 104 30 100 50 C104 40 120 36 128 52 C142 80 120 110 75 108 Z" fill="var(--brand-green-soft)" />
            <path d="M75 104 C46 104 32 82 42 62 C50 48 64 54 66 64 C66 50 84 50 84 64 C86 54 100 48 108 62 C118 82 104 104 75 104 Z" fill="var(--brand-green-pale)" />
            <path d="M75 100 C60 98 56 84 62 74 C68 66 82 66 88 74 C94 84 90 98 75 100 Z" fill="var(--accent)" />
            <path d="M75 100 L75 70 M75 86 L64 76 M75 86 L86 76" stroke="var(--brand-green)" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      </div>
      </div>

    </section>
  )
}

