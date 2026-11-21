"use client"

import { useEffect, useRef, useState } from "react"
import { ImagePlus } from "lucide-react"

export type ToolView = { id: string; name: string; logo: string | null; color: string | null }
export type OrgView = { id: string; name: string; logo: string | null }

type SkillsProps = {
  tools: ToolView[]
  skills: string[]
  affiliations: OrgView[]
}

export function Skills({ tools, skills, affiliations }: SkillsProps) {
  return (
    <section
      id="skills"
      data-section="skills"
      aria-labelledby="skills-title"
      className="relative overflow-hidden pt-[84px] pb-16 md:pt-28 md:pb-24"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-16 xl:px-[120px]">
        <h2 id="skills-title" className="type-h2 optical-left m-0 max-w-[22ch]">
          Tools I build with, skills I lead with, groups I belong to
        </h2>
      </div>

      <div className="mt-10 flex flex-col gap-10 md:mt-14 md:gap-14">
        <Row label="Tools">
          <Marquee
            label="Tools"
            speed={38}
            items={tools}
            itemKey={(t) => t.id}
            render={(t, lit) => (
              <div
                data-lit={lit}
                style={{ "--brand": t.color ?? "var(--foreground)" } as React.CSSProperties}
                className="group flex w-24 shrink-0 flex-col items-center gap-2 py-2 md:w-28"
              >
                {t.logo ? (
                  <span
                    aria-hidden="true"
                    className="size-12 bg-input transition-[background-color,transform] duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-110 group-hover:bg-(--brand) group-data-[lit=true]:bg-(--brand) md:size-16"
                    style={{ mask: `url(${t.logo}) center / contain no-repeat`, WebkitMask: `url(${t.logo}) center / contain no-repeat` }}
                  />
                ) : (
                  <span
                    data-logo-needed={`public/logos/tools/${t.id}.svg`}
                    title={`Add logo: public/logos/tools/${t.id}.svg`}
                    className="bg-stripes flex size-12 items-center justify-center rounded-xl border-2 border-dashed border-primary md:size-16"
                  >
                    <ImagePlus aria-hidden="true" className="size-5 text-primary" />
                  </span>
                )}
                <span className="text-[13px] text-muted-foreground transition-colors duration-300 group-hover:text-foreground group-data-[lit=true]:text-foreground">
                  {t.name}
                </span>
              </div>
            )}
          />
        </Row>

        <Row label="Skills">
          {/* Two shorter rows, drifting in opposite directions, so a long list stays readable. */}
          <div className="flex flex-col gap-1 md:gap-2">
            {[skills.slice(0, Math.ceil(skills.length / 2)), skills.slice(Math.ceil(skills.length / 2))].map((line, i) => (
              <Marquee
                key={i}
                label={i === 0 ? "Skills, first row" : "Skills, second row"}
                speed={26}
                reverse={i === 0}
                items={line}
                itemKey={(s) => s}
                render={(s, lit) => (
                  <div
                    data-lit={lit}
                    className="group flex shrink-0 items-center py-1.5 pr-6 md:pr-10"
                  >
                    <span className="inline-block font-display text-[clamp(22px,2.6vw,36px)] leading-none font-extrabold tracking-[-0.02em] whitespace-nowrap text-input transition-[color,transform] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:text-brand-green group-data-[lit=true]:text-brand-green">
                      {s}
                    </span>
                  </div>
                )}
              />
            ))}
          </div>
        </Row>

        <Row label="Affiliations">
          <Marquee
            label="Affiliations"
            speed={34}
            items={affiliations}
            itemKey={(o) => o.id}
            render={(o, lit) => (
              <div
                data-lit={lit}
                className="group flex h-16 shrink-0 items-center gap-3 rounded-full border border-input bg-background px-5 transition-[border-color,background-color,box-shadow] duration-300 ease-out hover:border-brand-green/60 hover:bg-[color-mix(in_oklab,var(--brand-green)_6%,var(--background))] hover:shadow-[0_2px_12px_color-mix(in_oklab,var(--brand-green)_14%,transparent)] data-[lit=true]:border-brand-green/60 data-[lit=true]:bg-[color-mix(in_oklab,var(--brand-green)_6%,var(--background))] md:h-[72px]"
              >
                {o.logo ? (
                  <span
                    aria-hidden="true"
                    className="size-9 rounded-full bg-contain bg-center bg-no-repeat opacity-60 grayscale transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:grayscale-0 group-data-[lit=true]:opacity-100 group-data-[lit=true]:grayscale-0"
                    style={{ backgroundImage: `url(${o.logo})` }}
                  />
                ) : (
                  <span
                    data-logo-needed={`public/logos/orgs/${o.id}.svg`}
                    title={`Add logo: public/logos/orgs/${o.id}.svg`}
                    className="flex size-9 items-center justify-center rounded-full border-2 border-dashed border-primary"
                  >
                    <ImagePlus aria-hidden="true" className="size-4 text-primary" />
                  </span>
                )}
                <span className="text-[15px] font-semibold whitespace-nowrap text-muted-foreground transition-colors duration-300 group-hover:text-foreground group-data-[lit=true]:text-foreground">
                  {o.name}
                </span>
              </div>
            )}
          />
        </Row>
      </div>
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="type-label mx-auto w-full max-w-[1440px] px-5 md:px-16 xl:px-[120px]">
        {label}
      </div>
      {children}
    </div>
  )
}

type MarqueeProps<T> = {
  label: string
  items: T[]
  itemKey: (item: T) => string
  render: (item: T, lit: boolean, index: number) => React.ReactNode
  speed: number // px per second
  reverse?: boolean
}

const LIGHT_EVERY = 1600
const LIGHT_COUNT = 2

/**
 * An endless row that drifts on its own. Drag it (mouse or touch) or use the
 * arrow keys to move it; let go and it carries on. Hovering or focusing pauses
 * it. A couple of random items light up at a time. Reduced motion: no drift.
 */
function Marquee<T>({ label, items, itemKey, render, speed, reverse = false }: MarqueeProps<T>) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const firstRef = useRef<HTMLDivElement>(null)
  const [lit, setLit] = useState<number[]>([])
  const count = items.length

  // Random highlights while on screen.
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || count === 0) return
    let timer = 0
    const pick = () => {
      const next = new Set<number>()
      while (next.size < Math.min(LIGHT_COUNT, count)) next.add(Math.floor(Math.random() * count))
      setLit([...next])
    }
    const io = new IntersectionObserver((entries) => {
      const on = entries.some((e) => e.isIntersecting)
      window.clearInterval(timer)
      if (on) timer = window.setInterval(pick, LIGHT_EVERY)
    })
    io.observe(wrap)
    return () => {
      io.disconnect()
      window.clearInterval(timer)
    }
  }, [count])

  // Drift, drag, and keyboard.
  useEffect(() => {
    const wrap = wrapRef.current
    const track = trackRef.current
    const first = firstRef.current
    if (!wrap || !track || !first) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let offset = 0
    let dragging = false
    let lastX = 0
    let hovered = false
    let focused = false
    let visible = false
    let frame = 0
    let last = performance.now()

    const apply = () => {
      const half = first.offsetWidth
      if (half > 0) offset = ((offset % half) + half) % half
      track.style.transform = `translate3d(${-offset}px, 0, 0)`
    }
    const tick = (now: number) => {
      frame = 0
      const dt = Math.min(64, now - last)
      last = now
      if (!dragging && !hovered && !focused && !reduced) offset += ((reverse ? -1 : 1) * speed * dt) / 1000
      apply()
      if (visible) frame = window.requestAnimationFrame(tick)
    }
    const start = () => {
      if (frame || !visible) return
      last = performance.now()
      frame = window.requestAnimationFrame(tick)
    }

    const onDown = (e: PointerEvent) => {
      dragging = true
      lastX = e.clientX
      wrap.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      offset -= e.clientX - lastX
      lastX = e.clientX
      apply()
    }
    const onUp = (e: PointerEvent) => {
      dragging = false
      if (wrap.hasPointerCapture(e.pointerId)) wrap.releasePointerCapture(e.pointerId)
    }
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovered = true
    }
    const onLeave = () => {
      hovered = false
    }
    const onFocusIn = () => {
      focused = true
    }
    const onFocusOut = () => {
      focused = false
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault()
        offset += e.key === "ArrowRight" ? 140 : -140
        apply()
      }
    }

    const io = new IntersectionObserver((entries) => {
      visible = entries.some((en) => en.isIntersecting)
      if (visible) start()
    })
    io.observe(wrap)
    wrap.addEventListener("pointerdown", onDown)
    wrap.addEventListener("pointermove", onMove)
    wrap.addEventListener("pointerup", onUp)
    wrap.addEventListener("pointercancel", onUp)
    wrap.addEventListener("pointerenter", onEnter)
    wrap.addEventListener("pointerleave", onLeave)
    wrap.addEventListener("focusin", onFocusIn)
    wrap.addEventListener("focusout", onFocusOut)
    wrap.addEventListener("keydown", onKey)
    return () => {
      io.disconnect()
      wrap.removeEventListener("pointerdown", onDown)
      wrap.removeEventListener("pointermove", onMove)
      wrap.removeEventListener("pointerup", onUp)
      wrap.removeEventListener("pointercancel", onUp)
      wrap.removeEventListener("pointerenter", onEnter)
      wrap.removeEventListener("pointerleave", onLeave)
      wrap.removeEventListener("focusin", onFocusIn)
      wrap.removeEventListener("focusout", onFocusOut)
      wrap.removeEventListener("keydown", onKey)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [reverse, speed])

  return (
    <div
      ref={wrapRef}
      role="region"
      aria-label={`${label}. Drag or use the arrow keys to move.`}
      tabIndex={0}
      className="cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing"
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        <div ref={firstRef} className="flex shrink-0 items-center gap-4 pr-4 md:gap-6 md:pr-6">
          {items.map((item, i) => (
            <div key={itemKey(item)} className="shrink-0">
              {render(item, lit.includes(i), i)}
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="flex shrink-0 items-center gap-4 pr-4 md:gap-6 md:pr-6">
          {items.map((item, i) => (
            <div key={itemKey(item)} className="shrink-0">
              {render(item, lit.includes(i), i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
