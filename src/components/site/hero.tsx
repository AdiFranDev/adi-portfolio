"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { hero } from "@content/site"
import type { Photo } from "@/lib/photos"
import { NameGlitch } from "@/components/site/name-glitch"
import { GreetingCycle } from "@/components/site/greeting-cycle"

type HeroProps = { campus: Photo; farm: Photo; cutout: Photo; cutoutFarm: Photo }

/**
 * D-016: one sticky scene. Campus first (CS shirt); scrolling zooms into the
 * campus, the shirt changes, and the scene ends on the farm (4-H shirt). Both
 * scenes are line drawings on pearl. Reduced motion: the campus scene, still.
 */
export function Hero({ campus, farm, cutout, cutoutFarm }: HeroProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] })

  const swap = useTransform(p, [0.42, 0.58], [0, 1])
  const campusOpacity = useTransform(swap, (v) => 1 - v)
  const campusScale = useTransform(p, [0, 0.58], [1, 1.29])
  const farmScale = useTransform(p, [0.42, 1], [1.25, 1])
  const meScale = useTransform(p, [0, 0.5, 1], [1, 1.06, 1])
  const cueOpacity = useTransform(p, [0, 0.15], [1, 0])

  return (
    <section
      ref={ref}
      id="home"
      data-section="home"
      aria-labelledby="hero-name"
      className={reduced ? "relative h-[100svh] min-h-[640px]" : "relative h-[220svh] min-h-[1400px]"}
    >
      <div className="sticky top-0 h-[100svh] min-h-[640px] overflow-hidden">
        <motion.div className="hero-fade absolute inset-0 origin-[50%_60%]" style={reduced ? undefined : { scale: campusScale, opacity: campusOpacity }}>
          {campus.ready && <Image src={campus.file} alt="" fill priority sizes="100vw" className="hero-lines object-cover" />}
        </motion.div>
        {!reduced && (
          <motion.div className="hero-fade absolute inset-0 origin-[50%_60%]" style={{ scale: farmScale, opacity: swap }}>
            {farm.ready && <Image src={farm.file} alt="" fill sizes="100vw" className="hero-lines object-cover" />}
          </motion.div>
        )}
        {/* Keeps the name readable over the lines. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_28%,var(--background)_0%,transparent_70%)]"
        />

        <div className="absolute inset-x-0 top-[96px] z-[3] flex flex-col items-center gap-3 px-4 text-center md:top-[120px] md:gap-4">
          <GreetingCycle
            greetings={hero.greetings}
            className="rounded-full border border-border bg-background/90 px-3.5 py-1 text-sm font-semibold md:px-4 md:py-1.5 md:text-base"
          />
          <h1
            id="hero-name"
            className="m-0 flex flex-col items-center font-display text-[56px] leading-[0.9] font-extrabold tracking-[-0.035em] md:flex-row md:gap-x-[0.28em] md:text-[clamp(72px,9vw,132px)]"
          >
            <span className="sr-only">Francis Adrian Esteban</span>
            <span aria-hidden="true">FRANCIS</span>
            <NameGlitch />
          </h1>
          <p className="m-0 max-w-[44ch] text-base leading-relaxed text-muted-foreground md:text-lg">{hero.tagline}</p>
        </div>

        <motion.div
          className="hero-fade pointer-events-none absolute bottom-0 left-1/2 z-[2] h-[46svh] w-[60vw] max-w-[380px] -translate-x-1/2 origin-bottom md:h-[60svh] md:max-h-[600px] md:w-[30vw]"
          style={reduced ? undefined : { scale: meScale }}
        >
          <motion.div className="absolute inset-0" style={reduced ? undefined : { opacity: campusOpacity }}>
            {cutout.ready && <Image src={cutout.file} alt={cutout.alt} fill priority sizes="(min-width: 768px) 380px, 60vw" className="object-contain object-bottom" />}
          </motion.div>
          {!reduced && (
            <motion.div className="absolute inset-0" style={{ opacity: swap }}>
              {cutoutFarm.ready && <Image src={cutoutFarm.file} alt={cutoutFarm.alt} fill sizes="(min-width: 768px) 380px, 60vw" className="object-contain object-bottom" />}
            </motion.div>
          )}
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="absolute bottom-5 left-1/2 z-[3] -translate-x-1/2 rounded-full border border-border bg-background/90 px-3.5 py-1.5 font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase"
          style={reduced ? undefined : { opacity: cueOpacity }}
        >
          Scroll
        </motion.div>
      </div>
    </section>
  )
}
