import Link from "next/link"
import { Heart, ImagePlus } from "lucide-react"
import { footer } from "@content/site"
import { iconButtonStyles } from "@/components/site/ds"
import { TuxedoCats } from "@/components/site/tuxedo-cats"
import { cn } from "@/lib/utils"

const explore = [
  ["Home", "/#home"],
  ["About", "/#about"],
  ["Experiences", "/#experiences"],
  ["Selected work", "/#projects"],
  ["Moments", "/#moments"],
  ["Skills", "/#skills"],
] as const

const linkClass =
  "text-[15px] font-medium text-foreground no-underline decoration-brand-green underline-offset-4 transition-colors duration-150 hover:text-brand-green hover:underline"
const labelClass = "type-label"

// A small closing band on the page background: a quote, socials, and the way back to Contact.
export function SiteFooter() {
  return (
    <footer className="relative border-t border-border text-foreground">
      <TuxedoCats />
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-10 px-5 pt-14 pb-24 md:px-16 xl:px-[120px]">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.6fr)_repeat(2,minmax(0,1fr))] md:gap-8">
          <div className="flex flex-col gap-4">
            <span className="type-display text-2xl">Adrian</span>
            {footer.quotes.map((q) => (
              <blockquote key={q} className="m-0 max-w-[36ch] text-[15px] leading-[1.55] text-muted-foreground [hanging-punctuation:first] [text-indent:-0.4em]">
                “{q}”
              </blockquote>
            ))}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <ul className="m-0 flex list-none gap-2 p-0">
                {footer.socials.map((s) => (
                  <li key={s.name}>
                    <SocialIcon name={s.name} href={s.href} icon={s.icon} />
                  </li>
                ))}
              </ul>
              <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
                {footer.dedication.left}
                <Heart aria-hidden="true" className="size-3.5 fill-primary text-primary" />
                <span className="sr-only">loves</span>
                {footer.dedication.right}
              </span>
            </div>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            <div className={labelClass}>Explore</div>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {explore.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3">
            <div className={labelClass}>Elsewhere</div>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {footer.socials.map((s) => (
                <li key={s.name}>
                  {s.href ? (
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {s.name}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <span data-link-needed={s.name} className="rounded-sm border border-dashed border-primary px-1.5 py-0.5 text-[15px] font-medium text-primary">
                      {s.name} · add link
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-5 text-[13px] text-muted-foreground md:flex-row md:justify-between">
          <span>{footer.copyright}</span>
          <span>{footer.signoff}</span>
        </div>
      </div>
    </footer>
  )
}

type SocialIconProps = { name: string; href: string | null; icon: string | null }

function SocialIcon({ name, href, icon }: SocialIconProps) {
  const glyph = icon ? (
    <span
      aria-hidden="true"
      className="size-5 bg-current"
      style={{ mask: `url(${icon}) center / contain no-repeat`, WebkitMask: `url(${icon}) center / contain no-repeat` }}
    />
  ) : (
    <ImagePlus aria-hidden="true" />
  )
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${name} (opens in a new tab)`} className={iconButtonStyles}>
        {glyph}
      </a>
    )
  }
  return (
    <span
      role="img"
      aria-label={`${name}: link not added yet`}
      data-link-needed={name}
      title={icon ? `Add the ${name} link in content/site.ts` : `Add a ${name} logo to public/logos/social`}
      className={cn(iconButtonStyles, "cursor-default border-2 border-dashed border-primary text-primary hover:border-primary hover:bg-background active:scale-100")}
    >
      {glyph}
    </span>
  )
}
