"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

type TraitsProps = { traits: { name: string; text: string }[] }

// Four short accordions, one open at a time.
export function Traits({ traits }: TraitsProps) {
  const [open, setOpen] = useState(0)
  return (
    <div className="border-t border-border">
      {traits.map((t, i) => {
        const on = open === i
        const panelId = `trait-${i}`
        return (
          <div key={t.name} className="border-b border-border">
            <h3 className="m-0">
              <button
                suppressHydrationWarning
                type="button"
                aria-expanded={on}
                aria-controls={panelId}
                onClick={() => setOpen(on ? -1 : i)}
                className="flex min-h-14 w-full cursor-pointer items-center justify-between border-none bg-transparent px-1 text-left text-lg font-semibold text-foreground transition-colors duration-150 hover:text-brand-green"
              >
                {t.name}
                <Plus
                  aria-hidden="true"
                  className={cn("size-5 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none", on && "rotate-45")}
                />
              </button>
            </h3>
            <div
              id={panelId}
              hidden={!on}
              className="animate-in px-1 pb-4 text-[15px] leading-[1.55] text-muted-foreground duration-200 fade-in"
            >
              {t.text}
            </div>
          </div>
        )
      })}
    </div>
  )
}
