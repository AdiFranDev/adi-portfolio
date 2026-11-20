"use client"

import { useRef, useState } from "react"
import type { Photo } from "@/lib/photos"
import { PhotoSlot } from "@/components/site/photo-slot"

type PhotoBlendProps = { academic: Photo; community: Photo }

/**
 * Academic photo at rest. Hover: the community photo opens out of the cursor
 * as a growing circle and fills the frame; leave and it closes back. Touch: a
 * tap switches sides. Decorative swap, so no extra controls.
 */
export function PhotoBlend({ academic, community }: PhotoBlendProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  const [origin, setOrigin] = useState({ x: 50, y: 50 })

  function track(event: React.PointerEvent<HTMLDivElement>) {
    const box = frameRef.current?.getBoundingClientRect()
    if (!box) return
    setOrigin({
      x: ((event.clientX - box.left) / box.width) * 100,
      y: ((event.clientY - box.top) / box.height) * 100,
    })
  }

  return (
    <div
      ref={frameRef}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return
        track(e)
        setShown(true)
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return
        track(e)
        setShown(false)
      }}
      onPointerUp={(e) => {
        if (e.pointerType !== "mouse") setShown((v) => !v)
      }}
      className="relative mx-auto h-[300px] w-full max-w-[400px] overflow-hidden rounded-[14px] lg:h-[540px] lg:w-[400px] lg:rounded-t-[200px] lg:rounded-b-none"
    >
      <div className="absolute inset-0">
        <PhotoSlot photo={academic} sizes="400px" className="size-full lg:rounded-t-[200px]" />
      </div>
      <div
        aria-hidden={!shown}
        style={{ clipPath: `circle(${shown ? 150 : 0}% at ${origin.x}% ${origin.y}%)` }}
        className="absolute inset-0 transition-[clip-path] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
      >
        <PhotoSlot
          photo={community}
          sizes="400px"
          className="size-full border-brand-green bg-accent [background-image:none] lg:rounded-t-[200px]"
        />
      </div>
    </div>
  )
}
