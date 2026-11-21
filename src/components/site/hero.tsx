"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowDown } from "lucide-react"
import { hero } from "@content/site"
import type { Photo } from "@/lib/photos"
import { PhotoSlot } from "@/components/site/photo-slot"
import { cn } from "@/lib/utils"
import { NameGlitch } from "@/components/site/name-glitch"
import { FrancisGraph } from "@/components/site/francis-graph"
import { GreetingCycle } from "@/components/site/greeting-cycle"
import { HeroGraph, type GraphNode } from "@/components/site/hero-graph"

// The hero graph: the three roles (with notes, linking on) and the tagline's three parts.
const place: Record<string, { x: number; y: number; tilt?: number }> = hero.graph.place
const spot = (id: string) => place[id] ?? { x: 0.5, y: 0.5 }
const graphNodes: GraphNode[] = [
  ...hero.sides.map((side) => ({ ...side, ...spot(side.id) })),
  ...hero.topics.map((topic) => ({ ...topic, ...spot(topic.id) })),
]

type HeroProps = {
  background: Photo
  farm: Photo
  cutout: Photo
  cutoutFarm: Photo
  leavesLeft: Photo
  leavesRight: Photo
  leavesMiddle: Photo
}

/**
 * Frame 1 to frame 2 in one scroll. The section is about 180vh tall with a sticky
 * scene; scroll progress 0 to 1 is written to --p and every layer reads it.
 * Phones and reduced motion: --p is 1, the static frame 2.
 */
export function Hero({ background, farm, cutout, cutoutFarm, leavesLeft, leavesRight, leavesMiddle }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  // Turns on once the farm frame arrives: FRANCIS builds and the graph draws.
  const [played, setPlayed] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const scene = sceneRef.current
    if (!section || !scene) return
    const query = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)")
    let frame = 0

    const update = () => {
      frame = 0
      if (!query.matches) {
        scene.style.setProperty("--p", "1")
        setPlayed(true)
        return
      }
      const rect = section.getBoundingClientRect()
      const distance = rect.height - window.innerHeight
      const p = distance > 0 ? Math.min(1, Math.max(0, -rect.top / distance)) : 1
      scene.style.setProperty("--p", p.toFixed(4))
      if (p > 0.72) setPlayed(true)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    query.addEventListener("change", update)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      query.removeEventListener("change", update)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="home"
      data-section="home"
      aria-labelledby="hero-name"
      className="hero-section relative md:h-[180svh]"
    >
      <div
        ref={sceneRef}
        style={{ "--p": 1 } as React.CSSProperties}
        className="hero-scene relative h-[max(100svh,700px)] overflow-hidden md:sticky md:top-0 md:h-svh md:min-h-[640px]"
      >
        {/* Layer 3: background. The campus blurs and fades away into the farm under it.
            In frame 2 its bottom fades out so the scene dissolves into the page below. */}
        <div className="absolute inset-0 origin-center [transform:scale(calc(1.15-0.15*var(--p)))] [mask-image:linear-gradient(to_bottom,#000_calc(100%_-_var(--p)*40%),transparent)]">
          {/* .farm-frame (globals.css) places the farm by measuring from the name, so its
              near tree line always crosses the bottom of FRANCIS, whatever the screen shape.
              The wash lives inside it, so the front layer can match it. */}
          <div className="farm-frame">
            <PhotoSlot photo={farm} sizes="100vw" className="size-full" detail="full" place="top" />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--background)_18%,transparent),color-mix(in_oklab,var(--background)_30%,transparent)_45%,color-mix(in_oklab,var(--background)_72%,transparent))] opacity-[clamp(0,calc((var(--p)-0.35)*2.5),1)]" />
          </div>
          <div className="absolute inset-0 opacity-[clamp(0,calc(1.7-var(--p)*2.4),1)] will-change-[filter,opacity] [filter:blur(calc(min(var(--p)*2,1)*18px))]">
            <PhotoSlot photo={background} sizes="100vw" priority className="size-full" detail="full" place="top" />
          </div>
        </div>

        {/* Frame 2: the name on one line (two on phones), set into the land. Back to
            front: the farm, FRANCIS (dots that build in), ADRIAN, then Adrian himself. The h1 has no opacity of its own (that would flatten the
            layers); each word fades on its own instead. */}
        {/* Frame 2: the greeting, cycling through Adrian's five languages, above the name. */}
        <div className="absolute inset-x-0 top-[72px] z-[7] flex justify-center opacity-[clamp(0,calc((var(--p)-0.45)*2.5),1)] md:top-[calc(var(--name-top)-2.6rem)]">
          <GreetingCycle greetings={hero.greetings} className="rounded-full bg-background/70 px-4 py-1.5 text-[15px] font-semibold backdrop-blur-sm md:text-lg" />
        </div>

        <h1
          id="hero-name"
          className="absolute inset-x-0 top-[110px] m-0 flex flex-col items-center font-display text-[64px] leading-[0.92] font-extrabold tracking-[-0.03em] md:top-(--name-top) md:flex-row md:items-end md:justify-center md:gap-x-[0.28em] md:text-(length:--name-size)"
        >
          <span className="sr-only">Francis Adrian Esteban</span>
          <span className="relative z-[2] opacity-[clamp(0,calc((var(--p)-0.3)*2),1)]">
            <FrancisGraph text="FRANCIS" play={played} />
          </span>
          <span className="relative z-[4] opacity-[clamp(0,calc((var(--p)-0.3)*2),1)]">
            {/* Hidden until the farm frame arrives, then wipes in left to right as
                FRANCIS's dots finish building (globals.css, .adrian-in). */}
            <span className={cn("block", played ? "adrian-in" : "adrian-wait")}>
              <NameGlitch />
            </span>
          </span>
        </h1>


        {/* Layer 2: the cutout. In front of the name; it never blocks the name hover.
            The 4-H shirt version fades in with the farm. */}
        <div className="pointer-events-none absolute top-[190px] left-1/2 z-[5] h-[340px] w-[190px] -translate-x-1/2 md:top-auto md:bottom-0 md:h-[62%] md:w-[22%] md:max-w-[360px] md:min-w-[200px] md:origin-bottom md:[scale:calc(1-0.1*var(--p))] md:[mask-image:linear-gradient(to_bottom,#000_calc(100%_-_var(--p)*30%),transparent)]">
          <PhotoSlot
            photo={cutout}
            sizes="(min-width: 768px) 360px, 190px"
            priority
            detail="compact"
            // The arch frame is only for the placeholder; the real cutout stands free.
            className={cutout.ready ? "size-full" : "size-full rounded-t-full border-b-0"}
            imageClassName="object-contain object-bottom"
          />
          {cutout.ready && cutoutFarm.ready && (
            <div className="absolute inset-0 opacity-[clamp(0,calc((var(--p)-0.4)*3.5),1)]">
              <PhotoSlot photo={cutoutFarm} sizes="(min-width: 768px) 360px, 190px" className="size-full" imageClassName="object-contain object-bottom" />
            </div>
          )}
        </div>

        {/* Layer 1: the foreground garden, one image cut into three feathered pieces
            (left 0-40%, middle 16-84% with only its ground reaching past 34-66%, right 60-100%, cut where the bushes meet the meadow). They share one size, --s, so at
            rest they line up into the whole picture, a little larger than the screen and
            sunk below its bottom edge. The side bushes rest 12% further out than the
            picture, to open the middle around Adrian. On the first scroll the whole garden
            zooms in toward the viewer and fades, as one piece, so nothing ever splits. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[6] hidden origin-[50%_62%] opacity-[clamp(0,calc(1-var(--p)*1.6),1)] [container-type:size] [transform:scale(calc(1+var(--p)*0.9))] md:block"
          style={{ "--s": "max(110cqw, calc(100cqh * 2.2))" } as React.CSSProperties}
        >
          {(
            [
              { photo: leavesMiddle, from: 0.16, span: 0.68, sink: "12cqh", move: "none" },
              { photo: leavesLeft, from: 0, span: 0.4, sink: "0px", move: "translateX(calc(var(--s) * -0.12))" },
              { photo: leavesRight, from: 0.6, span: 0.4, sink: "0px", move: "translateX(calc(var(--s) * 0.12))" },
            ] as const
          ).map(({ photo, from, span, sink, move }) => (
            <div
              key={photo.file}
              className="absolute"
              style={{
                left: `calc((100cqw - var(--s)) / 2 + var(--s) * ${from})`,
                width: `calc(var(--s) * ${span})`,
                height: "calc(var(--s) / 1.79)",
                // Sunk by up to 28% of its height, so the soft bottom edge goes off-screen,
                // but never so far that the bushes' top edge comes into view. The middle
                // piece (meadow and sky) sinks further, so the flowers reach Adrian's waist.
                bottom: `calc(max(calc(var(--s) / 1.79 * -0.28), calc(100cqh - var(--s) / 1.79)) - ${sink})`,
                transform: move,
              }}
            >
              <PhotoSlot photo={photo} sizes="60vw" detail="compact" className="size-full border-brand-green" imageClassName="object-cover" />
            </div>
          ))}
        </div>

        {/* Frame 2: a soft blur band where the scene fades into the page */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-[34%] opacity-[clamp(0,calc((var(--p)-0.5)*2.5),1)] backdrop-blur-[6px] [mask-image:linear-gradient(to_bottom,transparent,#000_45%,#000_70%,transparent)]"
        />

        {/* Scroll cue, frame 1 only */}
        <div
          aria-hidden="true"
          className="absolute bottom-7 left-1/2 z-[7] hidden -translate-x-1/2 flex-col items-center gap-1.5 text-sm font-medium text-foreground opacity-[clamp(0,calc(1-var(--p)*3),1)] md:flex"
        >
          <span>Scroll</span>
          <ArrowDown className="size-5" />
        </div>

        {/* Phones: the tagline on a sheet below Adrian. Desktop: the graph says it, so the
            sentence stays for screen readers only. */}
        <div className="absolute inset-x-0 top-[530px] bottom-0 z-[7] rounded-t-[18px] bg-background p-5 opacity-[clamp(0,calc((var(--p)-0.6)*2.5),1)] md:sr-only">
          <p className="m-0 text-base leading-[1.55]">{hero.tagline}</p>
        </div>

        {/* Frame 2: the graph of roles and topics, at the sides of the scene, plus a note
            on the 4-H shirt. Desktop only. */}
        <div className="pointer-events-none absolute inset-0 z-[7] hidden opacity-[clamp(0,calc((var(--p)-0.7)*3.3),1)] md:block">
          <HeroGraph nodes={graphNodes} edges={hero.graph.edges} play={played} />
          <span
            aria-hidden="true"
            className="absolute bottom-[19%] left-[calc(50%+150px)] flex items-center gap-1.5 font-hand text-[22px] leading-none text-foreground opacity-[clamp(0,calc((var(--p)-0.8)*5),1)] drop-shadow-[0_1px_2px_color-mix(in_oklab,var(--background)_80%,transparent)]"
          >
            <svg viewBox="0 0 40 20" className="h-4 w-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M38 6 C 26 2, 14 4, 4 14 M4 14 L 12 13 M4 14 L 6 6" />
            </svg>
            my 4-H shirt
          </span>
        </div>
      </div>
      {/* Snap target: the end of the zoom lands on frame 2. */}
      <div aria-hidden="true" className="hero-snap pointer-events-none absolute inset-x-0 bottom-0 hidden h-svh md:block" />
    </section>
  )
}
