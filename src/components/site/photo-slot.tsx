import Image from "next/image"
import { ImagePlus } from "lucide-react"
import type { Photo } from "@/lib/photos"
import { cn } from "@/lib/utils"

type PhotoSlotProps = {
  photo: Photo
  sizes: string
  className?: string
  imageClassName?: string
  priority?: boolean
  // "full" shows the label and file path; "compact" only the call to action.
  detail?: "full" | "compact"
  // Where the placeholder text sits: the middle, or near the top (for full-bleed layers).
  place?: "center" | "top"
}

/**
 * Shows the photo once its file exists in /public. Until then it renders a
 * highlighted "Add photo" slot that names what to shoot and where to save it.
 */
export function PhotoSlot({
  photo,
  sizes,
  className,
  imageClassName,
  priority = false,
  detail = "full",
  place = "center",
}: PhotoSlotProps) {
  if (photo.ready) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={photo.file}
          alt={photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imageClassName)}
        />
      </div>
    )
  }

  return (
    <div
      role="img"
      aria-label={`Photo coming soon: ${photo.label}`}
      data-photo-needed={photo.file}
      className={cn(
        "bg-stripes relative flex flex-col items-center gap-2 overflow-hidden border-2 border-dashed border-primary p-4 text-center",
        place === "top" ? "justify-start pt-[15%]" : "justify-center",
        className,
      )}
    >
      <ImagePlus aria-hidden="true" className="size-6 shrink-0 text-primary" />
      <span className="font-mono text-[13px] font-medium tracking-[0.06em] text-primary uppercase">
        Add photo
      </span>
      {detail === "full" && (
        <>
          <span className="max-w-[34ch] text-[13px] leading-snug text-muted-foreground">{photo.label}</span>
          <code className="rounded-sm bg-background/80 px-1.5 py-0.5 font-mono text-[13px] break-all text-foreground">
            public{photo.file}
          </code>
        </>
      )}
    </div>
  )
}
