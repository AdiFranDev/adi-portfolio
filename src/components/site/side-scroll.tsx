"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, BadgeCheck, ChevronLeft, ChevronRight, Link2 } from "lucide-react"
import type { Photo } from "@/lib/photos"
import type { Category, Tone, Wave } from "@content/work"
import { PhotoSlot } from "@/components/site/photo-slot"
import { cn } from "@/lib/utils"
import { buttonStyles, chipStyles, iconButtonStyles, surface } from "@/components/site/ds"

export type SideCard = {
  id: string
  kind: string
  tag: string
  tone: Tone
  role: string
  org: string
  dates: string
  desc: string
  highlights: string[]
  photo: Photo
  wave?: Category
  link?: { label: string; href: string | null }
}

type SideScrollProps = {
  id: string
  title: string
  blurredWord: string
  cards: SideCard[]
  itemLabel: string
  intro?: string
  waves?: { id: Wave; n: string; label: string }[]
  // 01 Highlight: the first card of each of these categories.
  highlightOrder?: Category[]
  // Cards per category; after them comes a "see more" card.
  max?: number
  moreLinks?: Record<Category, { label: string; href: string | null }>
  // Blur and fade the section out over an extra stretch of scroll after the last card.
  exitBlur?: boolean
  // A button for something not built yet; clicking it says "Soon".
  soon?: string
}

const pad = (n: number) => String(n).padStart(2, "0")
const PIN_QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)"

/**
 * Desktop: the section pins and vertical scroll moves the cards sideways.
 * Phones and reduced motion: a native swipe row with scroll snapping.
 */
export function SideScroll({
  id,
  title,
  blurredWord,
  cards: allCards,
  itemLabel,
  intro,
  waves,
  highlightOrder = [],
  max = 5,
  moreLinks,
  exitBlur = false,
  soon,
}: SideScrollProps) {
  const outerRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const [pinned, setPinned] = useState(false)
  const [distance, setDistance] = useState(0)
  const [exitPx, setExitPx] = useState(0)
  const [active, setActive] = useState(0)
  const [wave, setWave] = useState<Wave>("highlight")
  // Categories: 01 Highlight shows the first card of each category; the others
  // show up to `max` cards of their own, then a "see more" card.
  const cards = !waves
    ? allCards
    : wave === "highlight"
      ? highlightOrder.flatMap((cat) => allCards.find((c) => c.wave === cat) ?? [])
      : allCards.filter((c) => c.wave === wave).slice(0, max)
  const more = waves && wave !== "highlight" && moreLinks ? moreLinks[wave] : undefined
  const count = cards.length

  useEffect(() => {
    const outer = outerRef.current
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!outer || !viewport || !track) return
    const query = window.matchMedia(PIN_QUERY)
    let frame = 0
    let dist = 0
    let exit = 0

    const measure = () => {
      const last = track.lastElementChild
      if (!(last instanceof HTMLElement)) return
      const gutter = track.offsetLeft
      dist = Math.max(0, last.offsetLeft + last.offsetWidth + gutter - viewport.clientWidth)
      exit = exitBlur ? Math.round(window.innerHeight * 0.6) : 0
      setDistance(dist)
      setExitPx(exit)
    }

    const paint = (p: number) => {
      if (barRef.current) barRef.current.style.width = `${(count > 1 ? p : 1) * 100}%`
      setActive(Math.round(p * (count - 1)))
    }

    const onWindowScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const rect = outer.getBoundingClientRect()
        const p = dist > 0 ? Math.min(1, Math.max(0, -rect.top / dist)) : 0
        track.style.transform = `translateX(${-p * dist}px)`
        if (exit > 0 && stickyRef.current) {
          const q = Math.min(1, Math.max(0, (-rect.top - dist) / exit))
          stickyRef.current.style.filter = q > 0 ? `blur(${q * 12}px)` : ""
          stickyRef.current.style.opacity = String(1 - q * 0.85)
        }
        if (wordRef.current) wordRef.current.style.transform = `translateX(${-p * dist * 0.3}px)`
        paint(p)
      })
    }

    const onRowScroll = () => {
      const max = viewport.scrollWidth - viewport.clientWidth
      paint(max > 0 ? viewport.scrollLeft / max : 0)
    }

    const setup = () => {
      const pin = query.matches
      setPinned(pin)
      window.removeEventListener("scroll", onWindowScroll)
      viewport.removeEventListener("scroll", onRowScroll)
      track.style.transform = ""
      if (wordRef.current) wordRef.current.style.transform = ""
      if (stickyRef.current) {
        stickyRef.current.style.filter = ""
        stickyRef.current.style.opacity = ""
      }
      if (pin) {
        // The swipe row may have snapped before pinning; start from the first card.
        viewport.scrollLeft = 0
        measure()
        window.addEventListener("scroll", onWindowScroll, { passive: true })
        onWindowScroll()
      } else {
        viewport.addEventListener("scroll", onRowScroll, { passive: true })
        onRowScroll()
      }
    }

    const resize = new ResizeObserver(() => {
      if (query.matches) {
        measure()
        onWindowScroll()
      }
    })
    resize.observe(viewport)
    resize.observe(track)
    setup()
    query.addEventListener("change", setup)
    return () => {
      resize.disconnect()
      query.removeEventListener("change", setup)
      window.removeEventListener("scroll", onWindowScroll)
      viewport.removeEventListener("scroll", onRowScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [count, exitBlur])

  function goTo(index: number) {
    const i = Math.min(count - 1, Math.max(0, index))
    const behavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    if (pinned && outerRef.current) {
      const top = outerRef.current.getBoundingClientRect().top + window.scrollY
      const p = count > 1 ? i / (count - 1) : 0
      window.scrollTo({ top: top + p * distance + 1, behavior })
      return
    }
    const viewport = viewportRef.current
    const card = trackRef.current?.children[i]
    if (viewport && card instanceof HTMLElement) {
      viewport.scrollTo({ left: card.offsetLeft - (trackRef.current?.offsetLeft ?? 0), behavior })
    }
  }

  const counter = `${pad(Math.min(active, count - 1) + 1)} / ${pad(count)}`

  function pickWave(next: Wave) {
    setWave(next)
    setActive(0)
    if (viewportRef.current) viewportRef.current.scrollLeft = 0
    const outer = outerRef.current
    if (pinned && outer && outer.getBoundingClientRect().top < 0) {
      window.scrollTo({ top: outer.getBoundingClientRect().top + window.scrollY, behavior: "instant" })
    }
  }

  return (
    <section
      ref={outerRef}
      id={id}
      data-section={id}
      aria-labelledby={`${id}-title`}
      className="relative"
      style={pinned ? { height: `calc(100svh + ${distance + exitPx}px)` } : undefined}
    >
      <div ref={stickyRef} className={cn("relative overflow-hidden", pinned && "sticky top-0 h-svh min-h-[720px]")}>
        <div
          ref={wordRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-[150px] -left-2.5 font-display text-[110px] leading-none font-extrabold tracking-[-0.04em] whitespace-nowrap text-border blur-[4px] will-change-transform md:top-[35.5%] md:-left-5 md:text-[250px] md:blur-[6px]"
        >
          {blurredWord}
        </div>

        <div className="relative flex h-full flex-col gap-[18px] pt-[84px] pb-7 md:gap-0 md:pt-24 md:pb-9">
          <div className="flex flex-col gap-3.5 px-5 md:flex-row md:items-end md:justify-between md:px-24">
            <div>
              <h2 id={`${id}-title`} className="type-display optical-left m-0 text-[34px] md:text-[44px]">
                {title}
              </h2>
              {intro && <p className="m-0 mt-1.5 text-[15px] text-muted-foreground md:hidden">{intro}</p>}
            </div>
            {(intro || soon) && (
              <div className="flex items-center gap-5">
                {intro && <div className="hidden text-[15px] text-muted-foreground md:block">{intro}</div>}
                {soon && <SoonButton label={soon} />}
              </div>
            )}
            {waves && (
              <ol aria-label="Categories" className="m-0 -mx-5 flex list-none gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:justify-end md:overflow-visible md:px-0 md:pb-0">
                {waves.map((w) => {
                  const on = w.id === wave
                  return (
                    <li key={w.id} className="shrink-0">
                      <button
                        suppressHydrationWarning
                        type="button"
                        aria-pressed={on}
                        aria-controls={`${id}-cards`}
                        onClick={() => pickWave(w.id)}
                        className={chipStyles(on)}
                      >
                        <span className={cn("font-mono font-medium", on ? "opacity-70" : "text-muted-foreground")}>{w.n}</span>
                        {w.label}
                      </button>
                    </li>
                  )
                })}
              </ol>
            )}
          </div>

          <div
            ref={viewportRef}
            role="region"
            aria-roledescription="carousel"
            aria-label={title}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault()
                goTo(active + 1)
              } else if (e.key === "ArrowLeft") {
                e.preventDefault()
                goTo(active - 1)
              }
            }}
            className={cn(
              "relative min-h-0 md:flex-1 md:pt-[22px]",
              pinned ? "overflow-hidden" : "snap-x snap-mandatory scroll-pl-5 overflow-x-auto [scrollbar-width:none] md:scroll-pl-24",
            )}
          >
            <div id={`${id}-cards`} ref={trackRef} className="ml-5 flex w-max gap-3 pr-5 will-change-transform md:ml-24 md:gap-8 md:pr-24">
              {cards.map((card, i) => (
                <Card key={`${wave}-${card.id}`} card={card} index={i} dim={i !== active} />
              ))}
              {more && <MoreCard key={`${wave}-more`} label={more.label} href={more.href} delay={cards.length * 70} />}
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 md:gap-6 md:px-24 md:pt-6">
            <div className="relative h-0.5 flex-1 bg-border">
              <span ref={barRef} className="absolute top-0 left-0 h-0.5 w-0 bg-foreground" />
            </div>
            <span aria-live="polite" className="font-mono text-[13px] text-muted-foreground">
              {counter}
            </span>
            <button
              suppressHydrationWarning
              type="button"
              aria-label={`Previous ${itemLabel}`}
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              className={cn(iconButtonStyles, "hidden md:flex")}
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              suppressHydrationWarning
              type="button"
              aria-label={`Next ${itemLabel}`}
              onClick={() => goTo(active + 1)}
              disabled={active === count - 1}
              className={cn(iconButtonStyles, "hidden md:flex")}
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

const SOON_MS = 2200

function SoonButton({ label }: { label: string }) {
  const [said, setSaid] = useState(false)

  useEffect(() => {
    if (!said) return
    const timer = window.setTimeout(() => setSaid(false), SOON_MS)
    return () => window.clearTimeout(timer)
  }, [said])

  return (
    <button
      suppressHydrationWarning
      type="button"
      onClick={() => setSaid(true)}
      className={cn(buttonStyles({ variant: "secondary" }), "w-fit")}
    >
      <BadgeCheck aria-hidden="true" />
      {/* Both labels share one grid cell, so the button keeps its width when the text swaps. */}
      <span className="grid">
        <span className={cn("col-start-1 row-start-1 transition-[opacity,translate] duration-200 motion-reduce:transition-none", said && "-translate-y-1 opacity-0")}>
          {label}
        </span>
        <span aria-hidden={!said} className={cn("col-start-1 row-start-1 text-center text-brand-green transition-[opacity,translate] duration-200 motion-reduce:transition-none", !said && "translate-y-1 opacity-0")}>
          Soon
        </span>
      </span>
      <span role="status" className="sr-only">{said ? `${label}: coming soon` : ""}</span>
    </button>
  )
}

type CardProps = { card: SideCard; index: number; dim: boolean }

function Card({ card, index, dim }: CardProps) {
  return (
    <article
      aria-label={`${card.role}, ${card.org}`}
      className={cn(
        surface.card,
        "group grid w-[300px] shrink-0 snap-start grid-cols-1 overflow-hidden animate-in duration-500 fade-in slide-in-from-right-6 motion-reduce:animate-none md:h-[min(590px,calc(100svh-310px))] md:min-h-[420px] md:w-[min(1060px,calc(100vw-192px))] md:grid-cols-[57%_43%] md:grid-rows-[auto_1fr]",
        "transition-opacity duration-300",
        dim && "opacity-75",
      )}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="type-label px-[18px] pt-[18px] md:px-12 md:pt-10">
        {card.kind} · <span className="text-brand-green">{card.tag}</span>
      </div>

      <div className="relative mx-3 mt-3 h-[150px] overflow-hidden rounded-sm md:row-span-2 md:mx-0 md:mt-0 md:h-auto md:rounded-none">
        <PhotoSlot
          photo={card.photo}
          sizes="(min-width: 768px) 460px, 300px"
          className="size-full rounded-sm md:rounded-none"
          imageClassName="grayscale transition-[filter] duration-300 group-hover:grayscale-0 group-focus-within:grayscale-0"
        />
        <span className="absolute bottom-4 left-4 hidden rounded-sm bg-(--glass) px-2.5 py-1 font-mono text-[13px] tracking-[0.08em] uppercase backdrop-blur-sm md:block">
          {card.dates}
        </span>
      </div>

      <div className="flex min-h-0 flex-col gap-2.5 px-[18px] pt-2.5 pb-[18px] md:gap-3.5 md:px-12 md:pt-3.5 md:pb-10">
        <h3 className="type-display optical-left m-0 text-[22px] leading-[1.05] md:text-[clamp(32px,3.5vw,50px)]">
          {card.role}
        </h3>
        <div className="text-sm font-semibold md:text-[15px] md:tracking-[0.06em] md:uppercase">{card.org}</div>
        <p className="m-0 text-sm leading-[1.5] md:mt-1.5 md:text-base md:leading-[1.6]">{card.desc}</p>
        {card.link &&
          (card.link.href ? (
            <a
              href={card.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonStyles({ variant: "secondary" }), "self-start")}
            >
              Details · {card.link.label}
              <ArrowUpRight aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ) : (
            <span data-link-needed={card.id} className={cn(buttonStyles({ variant: "dashed" }), "self-start")}>
              <Link2 aria-hidden="true" />
              Add link · {card.link.label}
            </span>
          ))}
        <div className="text-[13px] text-muted-foreground md:hidden">{card.dates}</div>
        <div className="mt-auto hidden md:block">
          <div className="border-b border-input pb-2.5 font-mono text-[13px] tracking-[0.12em] text-muted-foreground uppercase">
            Highlights
          </div>
          <ul className="m-0 grid list-none grid-cols-2 gap-x-6 p-0">
            {card.highlights.map((h, i) => (
              <li
                key={`${card.id}-${i}`}
                className="flex gap-2.5 border-b border-border py-3 text-[13px] font-semibold tracking-[0.03em] uppercase"
              >
                <span className="font-mono text-muted-foreground">{pad(i + 1)}</span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}

type MoreCardProps = { label: string; href: string | null; delay: number }

// The end of a category: one clear way to see the rest.
function MoreCard({ label, href, delay }: MoreCardProps) {
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        surface.card,
        "flex w-[300px] shrink-0 snap-start animate-in flex-col justify-center gap-5 border-dashed p-6 duration-500 fade-in slide-in-from-right-6 motion-reduce:animate-none md:h-[min(590px,calc(100svh-310px))] md:min-h-[420px] md:w-[380px] md:p-10",
      )}
    >
      <p className="type-h3 m-0">Want to see more?</p>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cn(buttonStyles({ variant: "primary", size: "lg" }), "self-start whitespace-normal text-left")}>
          {label}
          <ArrowUpRight aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ) : (
        <span data-link-needed={label} className={cn(buttonStyles({ variant: "dashed", size: "lg" }), "self-start whitespace-normal text-left")}>
          <Link2 aria-hidden="true" />
          Add link · {label}
        </span>
      )}
    </div>
  )
}
