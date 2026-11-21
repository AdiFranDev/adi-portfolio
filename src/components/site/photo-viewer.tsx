"use client"

import { useEffect, useRef, type RefObject } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import type { Photo } from "@/lib/photos"
import { cn } from "@/lib/utils"

type PhotoViewerProps = {
  photos: Photo[]
  label: string
  // Index of the open photo, or null when the viewer is closed.
  index: number | null
  onChange: (index: number | null) => void
  // Gets focus back when the viewer closes (without scrolling the page).
  returnFocus?: RefObject<HTMLElement | null>
}

const navButton =
  "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-150 outline-none hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white disabled:invisible [&_svg]:size-5"

/**
 * Full-size view of a card's photos in a native modal <dialog>: the whole photo,
 * in color, with previous/next and a counter. Esc, the close button, or a click
 * outside the photo closes it; the arrow keys step through the photos.
 */
export function PhotoViewer({ photos, label, index, onChange, returnFocus }: PhotoViewerProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const count = photos.length
  const open = index !== null
  const photo = open ? photos[index] : undefined

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) {
      dialog.close()
      returnFocus?.current?.focus({ preventScroll: true })
    }
    if (!open) return
    // The page scroll drives the cards, so hold it still while the viewer is open.
    const root = document.documentElement
    const before = root.style.overflow
    root.style.overflow = "hidden"
    return () => {
      root.style.overflow = before
    }
  }, [open, returnFocus])

  const step = (by: number) => {
    if (index === null || count < 2) return
    onChange((index + by + count) % count)
  }

  return (
    <dialog
      ref={ref}
      aria-label={`${label}, photos`}
      onClose={() => {
        // Esc closes the dialog natively; move focus here as well.
        onChange(null)
        returnFocus?.current?.focus({ preventScroll: true })
      }}
      onClick={(e) => e.target === e.currentTarget && onChange(null)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") step(1)
        if (e.key === "ArrowLeft") step(-1)
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-black/90 p-0 text-white backdrop:bg-black/60"
    >
      {photo && (
        <div
          className="flex size-full flex-col gap-3 p-3 md:p-6"
          onClick={(e) => e.target === e.currentTarget && onChange(null)}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[13px] tracking-[0.08em] uppercase" aria-live="polite">
              {label}
              {count > 1 && <span className="text-white/60"> · {index! + 1} / {count}</span>}
            </p>
            <button type="button" autoFocus aria-label="Close photos" onClick={() => onChange(null)} className={navButton}>
              <X aria-hidden="true" />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center gap-2 md:gap-4">
            <button
              type="button"
              aria-label="Previous photo"
              disabled={count < 2}
              onClick={() => step(-1)}
              className={cn(navButton, "max-md:absolute max-md:bottom-3 max-md:left-3 max-md:z-10")}
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <div className="relative size-full min-h-0">
              <Image key={photo.file} src={photo.file} alt={photo.alt} fill sizes="100vw" className="object-contain" />
            </div>
            <button
              type="button"
              aria-label="Next photo"
              disabled={count < 2}
              onClick={() => step(1)}
              className={cn(navButton, "max-md:absolute max-md:right-3 max-md:bottom-3 max-md:z-10")}
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>

          <p className="mx-auto max-w-2xl text-center text-sm text-white/75 max-md:px-14">{photo.alt}</p>
        </div>
      )}
    </dialog>
  )
}
