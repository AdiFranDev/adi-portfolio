"use client"

import { useEffect, useRef } from "react"
import { ArrowDown, ArrowRight, FileText } from "lucide-react"
import { hero } from "@content/site"
import type { Photo } from "@/lib/photos"
import { PhotoSlot } from "@/components/site/photo-slot"
import { NameGlitch } from "@/components/site/name-glitch"
import { buttonStyles } from "@/components/site/ds"
import { FrancisGraph } from "@/components/site/francis-graph"

type HeroProps = {
  background: Photo
  cutout: Photo
  leavesLeft: Photo
  leavesRight: Photo
  plants: Photo
}

/**
 * Frame 1 to frame 2 in one scroll. The section is about 180vh tall with a sticky
 * scene; scroll progress 0 to 1 is written to --p and every layer reads it.
 * Phones and reduced motion: --p is 1, the static frame 2.
 */
export function Hero({ background, cutout, leavesLeft, leavesRight, plants }: HeroProps) {
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
        {/* Layer 3: background photo */}
        <div className="absolute inset-0 origin-center [transform:scale(calc(1.15-0.15*var(--p)))]">
          <PhotoSlot photo={background} sizes="100vw" priority className="size-full" detail="full" place="top" />
        </div>

        {/* Frame 2: the name, behind the cutout */}
        <h1
          id="hero-name"
          className="absolute inset-x-0 top-[110px] m-0 flex flex-col items-center font-display text-[64px] leading-[0.92] font-extrabold tracking-[-0.03em] opacity-[clamp(0,calc((var(--p)-0.3)*2),1)] md:top-[22.2%] md:text-[clamp(96px,10.5vw,152px)]"
        >
          <span className="sr-only">Francis Adrian Esteban</span>
          <FrancisGraph text="FRANCIS" />
          <NameGlitch />
        </h1>

        {/* Layer 2: the cutout. In front of the name; it never blocks the name hover. */}
        <div className="pointer-events-none absolute top-[200px] left-1/2 h-[330px] w-[150px] -translate-x-1/2 md:top-auto md:bottom-0 md:h-[57.8%] md:w-[16.7%] md:max-w-[260px] md:min-w-[170px] md:origin-bottom md:[scale:calc(1-0.1*var(--p))]">
          <PhotoSlot
            photo={cutout}
            sizes="(min-width: 768px) 260px, 150px"
            priority
            detail="compact"
            className="size-full rounded-t-full border-b-0"
            imageClassName="object-contain object-bottom"
          />
        </div>

        {/* Layer 1: leaves and plants, gone after the first scroll */}
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/4 opacity-[calc(1-var(--p))] [transform:translateX(calc(-160%*var(--p)))] md:block">
          <PhotoSlot photo={leavesLeft} sizes="25vw" detail="full" className="size-full border-brand-green" imageClassName="object-contain object-left" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/4 opacity-[calc(1-var(--p))] [transform:translateX(calc(160%*var(--p)))] md:block">
          <PhotoSlot photo={leavesRight} sizes="25vw" detail="full" className="size-full border-brand-green" imageClassName="object-contain object-right" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[20%] opacity-[calc(1-var(--p))] [transform:translateY(calc(100%*var(--p)))] md:block">
          <PhotoSlot photo={plants} sizes="100vw" detail="compact" place="top" className="size-full border-brand-green" imageClassName="object-contain object-bottom" />
        </div>

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
          <div className="text-[17px] font-semibold md:text-xl">{hero.greeting}</div>
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
