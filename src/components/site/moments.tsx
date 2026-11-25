import Image from "next/image"
import type { Moment } from "@content/moments"
import type { Photo } from "@/lib/photos"
import { Reveal } from "@/components/site/reveal"
import { cn } from "@/lib/utils"

type MomentsProps = { moments: (Omit<Moment, "photo"> & { photo: Photo })[] }

// D-019: an aligned grid, captions always visible. First photo large, then a row
// of four, then a row of three (static class names so Tailwind keeps them).
const SPAN = ["md:col-span-6 md:row-span-2", "md:col-span-3", "md:col-span-3", "md:col-span-3", "md:col-span-3", "md:col-span-4", "md:col-span-4", "md:col-span-4"]

export function Moments({ moments }: MomentsProps) {
  return (
    <section id="moments" data-section="moments" aria-labelledby="moments-title" className="scroll-mt-24 py-24 md:py-28">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-9 px-5 md:px-8">
        <Reveal className="flex flex-col gap-3">
          <div className="type-label text-muted-foreground">Moments</div>
          <h2 id="moments-title" className="type-h2 m-0">The lab, the field, and me</h2>
        </Reveal>
        <ul className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-6 p-0 md:grid-cols-12 md:gap-x-5 md:gap-y-7">
          {moments.map((m, i) => (
            <li key={m.id} className={cn("col-span-2 flex flex-col gap-2.5 sm:col-span-1", i === 0 && "sm:col-span-2", SPAN[i])}>
              <div className={cn("relative aspect-[4/3] overflow-hidden rounded-2xl bg-placeholder", i === 0 && "md:aspect-auto md:min-h-[480px] md:flex-1")}>
                {m.photo.ready && <Image src={m.photo.file} alt={m.photo.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />}
              </div>
              <p className="m-0 flex gap-2.5 text-sm leading-snug">
                <span className="pt-0.5 font-mono text-xs text-accent-pink-text">{String(i + 1).padStart(2, "0")}</span>
                <span>{m.caption}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
