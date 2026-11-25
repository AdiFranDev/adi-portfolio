"use client"

import { useEffect, useRef, useState, Fragment } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, X } from "lucide-react"
import type { Photo } from "@/lib/photos"
import { buttonStyles, chipStyles } from "@/components/site/ds"
import { cn } from "@/lib/utils"

export type BentoItem = {
  id: string
  kind: string
  tag: string
  role: string
  title?: string
  org: string
  dates: string
  desc: string
  highlights: string[]
  photos: Photo[]
  wave?: string
  link?: { label: string; href: string | null }
  link2?: { label: string; href: string }
  note?: string
}

type BentoProps = {
  items: BentoItem[]
  // Selected work only: category filters. Experiences shows every card.
  filters?: { id: string; label: string }[]
  moreLinks?: Record<string, { label: string; href: string | null }>
  itemLabel: string
  // Experiences sets this to false: its photos sit straight.
  tilt?: boolean
  // Something to show in the filter row just after the chip with this id (Selected work: View CV after Awards).
  slot?: { after: string; node: React.ReactNode }
}

// Card sizes repeat in this rhythm on a 12-column grid: one large, then two
// medium, then three small (D-018). Static class names so Tailwind keeps them.
const RHYTHM = [
  { col: "md:col-span-7", row: "md:row-span-2", big: true, stack: false },
  { col: "md:col-span-5", row: "", big: false, stack: false },
  { col: "md:col-span-5", row: "", big: false, stack: false },
  { col: "md:col-span-4", row: "", big: false, stack: false },
  { col: "md:col-span-4", row: "", big: false, stack: false },
  { col: "md:col-span-4", row: "", big: false, stack: false },
] as const
// Two cards: equal halves, full height, photo on top and text below.
const PAIR = [
  { col: "md:col-span-6", row: "md:row-span-2", big: true, stack: true },
  { col: "md:col-span-6", row: "md:row-span-2", big: true, stack: true },
] as const

const titleOf = (item: BentoItem) => item.title ?? item.role

/**
 * D-018: many works per screen as a bento grid. A card opens the detail pop-up:
 * gallery, dates, role, organization, what I did, highlights, note, links, and
 * Previous / Next within the visible cards.
 */
export function WorkBento({ items, filters, moreLinks, itemLabel, tilt = true, slot }: BentoProps) {
  const [filter, setFilter] = useState("all")
  const [open, setOpen] = useState<number | null>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const shown = filter === "all" ? items : items.filter((i) => i.wave === filter)
  const rhythm = shown.length === 2 ? PAIR : RHYTHM
  const more = filter !== "all" ? moreLinks?.[filter] : undefined

  return (
    <div className="flex flex-col gap-5">
      {filters && (
        <div role="group" aria-label={`Filter ${itemLabel}s`} className="flex flex-wrap gap-2">
          {[{ id: "all", label: "All" }, ...filters].map((f) => {
            const count = f.id === "all" ? items.length : items.filter((i) => i.wave === f.id).length
            if (count === 0) return null
            return (
              <Fragment key={f.id}>
                <button type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)} className={chipStyles(filter === f.id)}>
                  {f.label}
                  <span className="font-medium opacity-60">{count}</span>
                </button>
                {slot?.after === f.id && slot.node}
              </Fragment>
            )
          })}
        </div>
      )}

      <ul className="m-0 grid list-none grid-cols-1 gap-[18px] p-0 md:auto-rows-[230px] md:grid-cols-12">
        {shown.map((item, i) => {
          const size = rhythm[i % rhythm.length] ?? RHYTHM[1]
          const cover = item.photos.find((p) => p.ready)
          return (
            <li key={item.id} className={cn(size.stack ? "min-h-[400px]" : "min-h-[220px]", size.col, size.row)}>
              <button
                type="button"
                aria-haspopup="dialog"
                aria-label={`Open details: ${titleOf(item)}`}
                onClick={(e) => {
                  openerRef.current = e.currentTarget
                  setOpen(i)
                }}
                className="group relative flex size-full cursor-pointer flex-col items-start justify-end overflow-hidden rounded-[18px] border border-border bg-card p-5 text-left text-foreground transition-[border-color,box-shadow] duration-200 hover:border-foreground hover:shadow-[0_18px_40px_-24px_rgb(1_42_35/0.5)]"
              >
                {cover && (
                  <span
                    className={cn(
                      "absolute aspect-[3/2] overflow-hidden rounded-xl border border-border bg-placeholder shadow-[0_18px_40px_-18px_rgb(1_42_35/0.45)] transition-transform duration-300",
                      size.stack
                        ? "top-[6%] left-1/2 w-[78%] -translate-x-1/2"
                        : size.big
                          ? "top-[7%] -right-[4%] w-[74%]"
                          : "top-[10%] -right-[8%] w-[62%]",
                      tilt && (size.stack ? "-rotate-2 group-hover:-rotate-1" : "-rotate-3 group-hover:-rotate-1"),
                    )}
                  >
                    <Image src={cover.file} alt="" fill sizes="(min-width: 768px) 40vw, 80vw" className={cover.fit === "contain" ? "object-contain" : "object-cover"} />
                  </span>
                )}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-0",
                    size.stack
                      ? "bg-[linear-gradient(0deg,var(--card)_20%,transparent_27%)]"
                      : "bg-[linear-gradient(90deg,var(--card)_34%,color-mix(in_srgb,var(--card)_85%,transparent)_52%,transparent_78%)]",
                  )}
                />
                <span className={cn("relative flex flex-col gap-1.5", size.stack ? "max-w-[85%]" : "max-w-[60%]")}>
                  <span className="font-mono text-[11.5px] tracking-[0.08em] text-accent-pink-text uppercase">{item.tag}</span>
                  <span className={cn("font-display leading-[1.1] font-bold", size.big ? "text-[34px]" : "text-[22px]")}>{titleOf(item)}</span>
                  <span className="mt-1 flex flex-wrap gap-1.5">
                    {item.highlights.slice(0, 2).map((h) => (
                      <span key={h} className="rounded-full border border-input/60 px-2 py-0.5 font-mono text-[11.5px] text-primary">
                        {h}
                      </span>
                    ))}
                  </span>
                </span>
                <span aria-hidden="true" className="absolute right-3.5 bottom-3.5 flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <ArrowUpRight className="size-4" />
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {more?.href && (
        <a href={more.href} className={cn(buttonStyles(), "self-start")}>
          {more.label}
          <ArrowUpRight aria-hidden="true" />
        </a>
      )}

      <WorkDetail
        items={shown}
        index={open}
        onChange={setOpen}
        onClose={() => {
          setOpen(null)
          openerRef.current?.focus({ preventScroll: true })
        }}
      />
    </div>
  )
}

type DetailProps = { items: BentoItem[]; index: number | null; onChange: (i: number) => void; onClose: () => void }

function WorkDetail({ items, index, onChange, onClose }: DetailProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const reduced = useReducedMotion()
  // The selected photo belongs to one item, so moving to another item starts at its first photo.
  const [pick, setPick] = useState({ id: "", i: 0 })
  const item = index === null ? undefined : items[index]
  const photo = item && pick.id === item.id ? pick.i : 0
  const setPhoto = (next: number | ((p: number) => number)) =>
    item && setPick({ id: item.id, i: typeof next === "function" ? next(photo) : next })
  const photos = item ? item.photos.filter((p) => p.ready) : []
  const current = photos[Math.min(photo, Math.max(0, photos.length - 1))]
  const n = items.length

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (item && !dialog.open) dialog.showModal()
    if (!item && dialog.open) dialog.close()
  }, [item])

  const links = item ? [item.link, item.link2].filter((l): l is { label: string; href: string } => !!l && !!l.href) : []
  const prev = index !== null ? items[(index - 1 + n) % n] : undefined
  const next = index !== null ? items[(index + 1) % n] : undefined

  return (
    <dialog
      ref={ref}
      aria-labelledby="work-detail-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="m-auto max-h-[min(860px,calc(100svh-32px))] w-[min(1140px,calc(100vw-32px))] overflow-auto rounded-[28px] border-none bg-card p-0 text-foreground shadow-[0_40px_100px_-30px_rgb(0_20_15/0.6)] backdrop:bg-[rgb(1_42_35/0.5)] backdrop:backdrop-blur-[3px]"
    >
      {item && (
        <motion.div
          key={item.id}
          initial={reduced ? false : { opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="grid md:grid-cols-[1.1fr_1fr]"
        >
          <div className="flex flex-col gap-3 bg-muted p-4 md:p-[18px]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-placeholder">
              {current && (
                <Image src={current.file} alt={current.alt} fill sizes="(min-width: 768px) 600px, 100vw" className={current.fit === "contain" ? "object-contain" : "object-cover"} />
              )}
              {photos.length > 0 && (
                <span className="absolute bottom-3 left-3 rounded-full bg-primary/85 px-2.5 py-1 font-mono text-xs text-primary-foreground">
                  {Math.min(photo, photos.length - 1) + 1} / {photos.length}
                </span>
              )}
              {photos.length > 1 && (
                <span className="absolute right-3 bottom-3 flex gap-2">
                  <button type="button" aria-label="Previous photo" onClick={() => setPhoto((p) => (p - 1 + photos.length) % photos.length)} className="flex size-11 cursor-pointer items-center justify-center rounded-full border-none bg-card/95 text-primary">
                    <ChevronLeft aria-hidden="true" className="size-5" />
                  </button>
                  <button type="button" aria-label="Next photo" onClick={() => setPhoto((p) => (p + 1) % photos.length)} className="flex size-11 cursor-pointer items-center justify-center rounded-full border-none bg-card/95 text-primary">
                    <ChevronRight aria-hidden="true" className="size-5" />
                  </button>
                </span>
              )}
            </div>
            {photos.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {photos.map((p, i) => (
                  <button
                    key={p.file}
                    type="button"
                    aria-label={`Show photo ${i + 1}`}
                    aria-pressed={i === photo}
                    onClick={() => setPhoto(i)}
                    className={cn("relative aspect-[3/2] cursor-pointer overflow-hidden rounded-[10px] border-2 bg-placeholder p-0", i === photo ? "border-accent-pink" : "border-transparent opacity-60")}
                  >
                    <Image src={p.file} alt="" fill sizes="120px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 p-6 md:p-[28px_30px_24px]">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[12.5px] tracking-[0.08em] text-muted-foreground uppercase">
                {item.kind} · {item.dates}
              </span>
              <button type="button" aria-label="Close" onClick={onClose} className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-foreground">
                <X aria-hidden="true" className="size-[18px]" />
              </button>
            </div>
            <div className="flex flex-col gap-2.5">
              <h2 id="work-detail-title" className="m-0 font-display text-[38px] leading-[1.02] font-extrabold tracking-[-0.025em]">
                {titleOf(item)}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-accent-pink-soft px-3 py-1 text-[13px] font-bold text-accent-foreground">{item.tag}</span>
                <span className="text-sm text-muted-foreground">{item.org}</span>
              </div>
            </div>
            <div className="h-px bg-border" />
            <div className="flex flex-col gap-1.5">
              <div className="font-mono text-[11.5px] tracking-[0.1em] text-muted-foreground uppercase">What I did</div>
              <p className="m-0 text-base leading-relaxed">{item.desc}</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-mono text-[11.5px] tracking-[0.1em] text-muted-foreground uppercase">Highlights</div>
              <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2">
                {item.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 rounded-xl bg-green-soft px-3 py-2.5 text-[13.5px] leading-snug font-semibold text-primary">
                    <Check aria-hidden="true" className="mt-px size-4 shrink-0 text-accent-pink" strokeWidth={2.6} />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            {item.note && <p className="m-0 rounded-xl border border-dashed border-input px-3 py-2.5 text-[13px] text-muted-foreground">{item.note}</p>}
            <div className="flex flex-wrap gap-2">
              {links.map((l, i) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={buttonStyles({ variant: i === 0 ? "primary" : "secondary" })}>
                  {l.label}
                  <ArrowUpRight aria-hidden="true" />
                </a>
              ))}
              {links.length === 0 && <span className="inline-flex min-h-11 items-center text-[13.5px] text-muted-foreground">No public link yet</span>}
            </div>
            {prev && next && n > 1 && (
              <div className="mt-auto flex justify-between gap-3 border-t border-border pt-3.5">
                <button type="button" onClick={() => index !== null && onChange((index - 1 + n) % n)} className="flex min-h-11 cursor-pointer flex-col items-start gap-0.5 rounded-xl border-none bg-transparent px-2.5 py-1.5 text-left text-foreground">
                  <span className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase">Previous</span>
                  <span className="text-sm font-semibold">← {titleOf(prev)}</span>
                </button>
                <button type="button" onClick={() => index !== null && onChange((index + 1) % n)} className="flex min-h-11 cursor-pointer flex-col items-end gap-0.5 rounded-xl border-none bg-transparent px-2.5 py-1.5 text-right text-foreground">
                  <span className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase">Next</span>
                  <span className="text-sm font-semibold">{titleOf(next)} →</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </dialog>
  )
}
