"use client"

import { useRef, useState } from "react"
import { Sparkles } from "lucide-react"
import type { Photo } from "@/lib/photos"
import { PhotoSlot } from "@/components/site/photo-slot"
import { chipStyles } from "@/components/site/ds"
import { cn } from "@/lib/utils"

type PhotoBlendProps = { academic: Photo; community: Photo }

const WINDOW = "72px" // radius of the hover window

/**
 * Two photos of Adrian with no frame; the edges fade into the page.
 * Hover: a small soft circle follows the cursor and shows the other photo.
 * Reveal: the other photo opens out of the button as a growing circle, and
 * closes back on the next press. Touch: a tap does the same as the button.
 * The cursor position and the window size are CSS variables, so moving the
 * mouse never re-renders React.
 */
export function PhotoBlend({ academic, community }: PhotoBlendProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  function track(event: React.PointerEvent<HTMLDivElement>) {
    const frame = frameRef.current
    if (!frame) return
    const box = frame.getBoundingClientRect()
    frame.style.setProperty("--x", `${event.clientX - box.left}px`)
    frame.style.setProperty("--y", `${event.clientY - box.top}px`)
  }
  function windowSize(open: boolean) {
    frameRef.current?.style.setProperty("--r", open ? WINDOW : "0px")
  }

  // The cursor window: solid in the middle, soft at the edge.
  const windowMask = "radial-gradient(circle var(--r) at var(--x) var(--y), #000 55%, transparent 100%)"
  const layer = "absolute inset-0"

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={frameRef}
        style={{ "--x": "50%", "--y": "40%", "--r": "0px" } as React.CSSProperties}
        onPointerEnter={(e) => {
          if (e.pointerType !== "mouse") return
          track(e)
          windowSize(true)
        }}
        onPointerMove={(e) => {
          if (e.pointerType === "mouse") track(e)
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") windowSize(false)
        }}
        onPointerUp={(e) => {
          if (e.pointerType !== "mouse") setRevealed((v) => !v)
        }}
        className="photo-blend group relative mx-auto h-[360px] w-full max-w-[400px] touch-manipulation [@media(pointer:fine)]:cursor-none lg:h-[540px] lg:w-[400px] [mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_70%,transparent),linear-gradient(to_right,transparent,#000_14%,#000_86%,transparent)] [mask-composite:intersect]"
      >
        <PhotoSlot photo={academic} sizes="400px" className={layer} imageClassName="object-cover object-top" />
        {/* Not revealed: the window shows the community photo. */}
        <div aria-hidden="true" className={layer} style={{ maskImage: windowMask, WebkitMaskImage: windowMask }}>
          <PhotoSlot photo={community} sizes="400px" className="size-full" imageClassName="object-cover object-top" />
        </div>
        {/* The full swap, opening from the button below. */}
        <div
          aria-hidden={!revealed}
          style={{ clipPath: `circle(${revealed ? 150 : 0}% at 50% 100%)` }}
          className={cn(layer, "transition-[clip-path] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none")}
        >
          <PhotoSlot photo={community} sizes="400px" className="size-full" imageClassName="object-cover object-top" />
        </div>
        {/* Revealed: the window shows the academic photo. */}
        <div
          aria-hidden="true"
          className={cn(layer, "transition-opacity duration-300", revealed ? "opacity-100" : "opacity-0")}
          style={{ maskImage: windowMask, WebkitMaskImage: windowMask }}
        >
          <PhotoSlot photo={academic} sizes="400px" className="size-full" imageClassName="object-cover object-top" />
        </div>
        {/* A small ring marks the window, since the system cursor is hidden here. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-[0_0_0_1px_rgb(0_0_0/0.2)] transition-opacity duration-200 group-hover:opacity-100"
          style={{ left: "var(--x)", top: "var(--y)" }}
        />
      </div>
      <button
        suppressHydrationWarning
        type="button"
        aria-pressed={revealed}
        onClick={() => setRevealed((v) => !v)}
        className={chipStyles(revealed)}
      >
        <Sparkles aria-hidden="true" className="size-4" />
        Reveal
        <span className="sr-only">{revealed ? ": showing the 4-H photo" : ": showing the campus photo"}</span>
      </button>
    </div>
  )
}
