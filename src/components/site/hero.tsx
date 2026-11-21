"use client"

import { useEffect, useRef } from "react"
import { ArrowDown, ArrowRight, FileText } from "lucide-react"
import { hero } from "@content/site"
import type { Photo } from "@/lib/photos"
import { PhotoSlot } from "@/components/site/photo-slot"
import { NameGlitch } from "@/components/site/name-glitch"
import { buttonStyles } from "@/components/site/ds"
import { FrancisGraph } from "@/components/site/francis-graph"
import { GreetingCycle } from "@/components/site/greeting-cycle"

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
        return
      }
      const rect = section.getBoundingClientRect()
      const distance = rect.height - window.innerHeight
      const p = distance > 0 ? Math.min(1, Math.max(0, -rect.top / distance)) : 1
      scene.style.setProperty("--p", p.toFixed(4))
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
        className="relative h-[max(100svh,700px)] overflow-hidden md:sticky md:top-0 md:h-svh md:min-h-[640px]"
      >
        {/* Layer 3: background. The campus blurs and fades away into the farm under it.
            In frame 2 its bottom fades out so the scene dissolves into the page below. */}
        <div className="absolute inset-0 origin-center [transform:scale(calc(1.15-0.15*var(--p)))] [mask-image:linear-gradient(to_bottom,#000_calc(100%_-_var(--p)*40%),transparent)]">
          <PhotoSlot photo={farm} sizes="100vw" className="size-full" detail="full" place="top" />
          <div className="absolute inset-0 opacity-[clamp(0,calc(1.7-var(--p)*2.4),1)] will-change-[filter,opacity] [filter:blur(calc(min(var(--p)*2,1)*18px))]">
            <PhotoSlot photo={background} sizes="100vw" priority className="size-full" detail="full" place="top" />
          </div>
        </div>

        {/* Frame 2: a light wash over the farm so the name and text stay readable */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--background)_45%,transparent),color-mix(in_oklab,var(--background)_62%,transparent)_45%,color-mix(in_oklab,var(--background)_82%,transparent))] opacity-[clamp(0,calc((var(--p)-0.35)*2.5),1)] [mask-image:linear-gradient(to_bottom,#000_calc(100%_-_var(--p)*40%),transparent)]"
        />

        {/* Frame 2: the name, behind the cutout */}
        <h1
          id="hero-name"
          className="absolute inset-x-0 top-[110px] m-0 flex flex-col items-center font-display text-[64px] leading-[0.92] font-extrabold tracking-[-0.03em] opacity-[clamp(0,calc((var(--p)-0.3)*2),1)] md:top-[22.2%] md:text-[clamp(96px,10.5vw,152px)]"
        >
          <span className="sr-only">Francis Adrian Esteban</span>
          <FrancisGraph text="FRANCIS" />
          <NameGlitch />
        </h1>

        {/* Layer 2: the cutout. In front of the name; it never blocks the name hover.
            The 4-H shirt version fades in with the farm. */}
        <div className="pointer-events-none absolute top-[190px] left-1/2 h-[340px] w-[190px] -translate-x-1/2 md:top-auto md:bottom-0 md:h-[62%] md:w-[22%] md:max-w-[360px] md:min-w-[200px] md:origin-bottom md:[scale:calc(1-0.1*var(--p))] md:[mask-image:linear-gradient(to_bottom,#000_calc(100%_-_var(--p)*30%),transparent)]">
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
            (left 0-40%, middle 34-66%, right 60-100%, cut where the bushes meet the meadow). They share one size, --s, so at
            rest they line up into the whole picture, a little larger than the screen and
            sunk below its bottom edge. On the first scroll the sides slide out and the
            middle sinks. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden [container-type:size] md:block"
          style={{ "--s": "max(110cqw, calc(100cqh * 2.2))" } as React.CSSProperties}
        >
          {(
            [
              { photo: leavesMiddle, from: 0.34, span: 0.32, sink: "12cqh", move: "translateY(calc(100% * var(--p)))" },
              { photo: leavesLeft, from: 0, span: 0.4, sink: "0px", move: "translateX(calc(-100% * var(--p)))" },
              { photo: leavesRight, from: 0.6, span: 0.4, sink: "0px", move: "translateX(calc(100% * var(--p)))" },
            ] as const
          ).map(({ photo, from, span, sink, move }) => (
            <div
              key={photo.file}
              className="absolute opacity-[calc(1-var(--p))]"
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
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] opacity-[clamp(0,calc((var(--p)-0.5)*2.5),1)] backdrop-blur-[6px] [mask-image:linear-gradient(to_bottom,transparent,#000_45%,#000_70%,transparent)]"
        />

        {/* Scroll cue, frame 1 only */}
        <div
          aria-hidden="true"
          className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-sm font-medium text-foreground opacity-[clamp(0,calc(1-var(--p)*3),1)] md:flex"
        >
          <span>Scroll</span>
          <ArrowDown className="size-5" />
        </div>

        {/* Frame 2: greeting, tagline, buttons. A sheet on phones keeps text off the photo. */}
        <div className="absolute inset-x-0 top-[530px] bottom-0 flex flex-col gap-3.5 rounded-t-[18px] bg-background p-5 opacity-[clamp(0,calc((var(--p)-0.6)*2.5),1)] md:inset-x-auto md:top-auto md:bottom-24 md:left-24 md:w-[380px] md:gap-4 md:rounded-none md:bg-transparent md:p-0">
          <GreetingCycle greetings={hero.greetings} className="text-[17px] font-semibold md:text-xl" />
          <p className="m-0 text-base leading-[1.55] md:text-lg">{hero.tagline}</p>
          <div className="flex flex-wrap items-center gap-2.5 md:gap-3">
            <a href="#projects" className={buttonStyles({ variant: "primary", size: "lg" })}>
              View projects
              <ArrowRight aria-hidden="true" />
            </a>
            <a href={hero.cvHref} className={buttonStyles({ variant: "secondary" })}>
              <FileText aria-hidden="true" />
              View CV
            </a>
          </div>
        </div>

        {/* Frame 2: three sides */}
        <div className="absolute right-24 bottom-24 hidden w-[300px] flex-col gap-2.5 text-[15px] opacity-[clamp(0,calc((var(--p)-0.6)*2.5),1)] md:flex">
          {hero.sides.map((side) => (
            <a
              key={side.id}
              href={side.href}
              className="flex min-h-11 items-center justify-between rounded-xl border border-input bg-background px-4 font-medium text-foreground no-underline transition-[background-color,border-color] duration-150 hover:border-foreground hover:bg-muted"
            >
              {side.label}
              <span className="font-mono text-muted-foreground">{side.n}</span>
            </a>
          ))}
        </div>
      </div>
      {/* Snap target: the end of the zoom lands on frame 2. */}
      <div aria-hidden="true" className="hero-snap pointer-events-none absolute inset-x-0 bottom-0 hidden h-svh md:block" />
    </section>
  )
}
