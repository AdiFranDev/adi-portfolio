import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * The site's design-system primitives. Colors: two quiet (bone-white ground,
 * deep green) and one loud (pink), used only for the main call to action and
 * the active state. Every button and chip comes from here so size, radius,
 * icon size, and press feedback stay the same everywhere.
 */

export const buttonStyles = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap no-underline transition-[background-color,color,border-color,transform,box-shadow] duration-150 ease-out select-none active:scale-[0.97] disabled:cursor-default disabled:opacity-50 disabled:active:scale-100 [&_svg]:size-[18px] [&_svg]:shrink-0 motion-reduce:active:scale-100",
  {
    variants: {
      variant: {
        // The loud one: one per view.
        primary:
          "bg-primary text-primary-foreground shadow-[0_6px_20px_-6px_var(--primary)] hover:shadow-[0_10px_28px_-8px_var(--primary)] hover:-translate-y-px",
        secondary: "border border-input bg-background text-foreground hover:border-foreground hover:bg-muted",
        quiet: "bg-transparent text-foreground hover:bg-muted",
        dashed: "border-2 border-dashed border-primary bg-transparent text-primary",
      },
      size: {
        md: "min-h-11 px-5 text-[15px]",
        lg: "min-h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
)

export type ButtonStyleProps = VariantProps<typeof buttonStyles>

export const iconButtonStyles =
  "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-input bg-background text-foreground transition-[background-color,border-color,transform] duration-150 hover:border-foreground hover:bg-muted active:scale-[0.94] disabled:cursor-default disabled:opacity-50 disabled:active:scale-100 [&_svg]:size-5 motion-reduce:active:scale-100"

// Toggle chips (filters, categories). Pressed = ink, the quiet way to show "selected".
export function chipStyles(pressed: boolean) {
  return cn(
    "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-semibold whitespace-nowrap transition-[background-color,color,border-color,transform] duration-150 active:scale-[0.97] motion-reduce:active:scale-100",
    pressed
      ? "border-foreground bg-foreground text-background"
      : "border-input bg-background text-foreground hover:border-foreground",
  )
}

// Surfaces. Nested corners follow: inner radius = outer radius - padding.
export const surface = {
  // 18px outer radius; children inset 12px use 6px.
  card: "rounded-2xl border border-input bg-background",
  inner: "rounded-sm",
}
