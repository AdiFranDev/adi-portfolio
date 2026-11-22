import Link from "next/link"
import { Heart, ImagePlus } from "lucide-react"
import { footer } from "@content/site"
import { iconButtonStyles } from "@/components/site/ds"
import { CatBasket } from "@/components/site/tuxedo-cats"
import { cn } from "@/lib/utils"

const explore = [
  ["Home", "/#home"],
  ["About", "/#about"],
  ["Experiences", "/#experiences"],
  ["Selected work", "/#projects"],
  ["Moments", "/#moments"],
  ["Skills", "/#skills"],
] as const

// 44px tall rows on phones for thumbs; normal text height from md up.
const linkClass =
  "inline-flex min-h-11 items-center md:inline md:min-h-0 text-[15px] font-medium text-foreground no-underline decoration-brand-green underline-offset-4 transition-colors duration-150 hover:text-brand-green hover:underline"
const labelClass = "type-label"

// A small closing band on the page background: a quote, socials, and the way back to Contact.
export function SiteFooter() {
  return (
    <footer className="relative border-t border-border text-foreground">
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-10 px-5 pt-14 pb-8 md:px-16 xl:px-[120px]">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] md:gap-8">
          <div className="flex flex-col gap-4">
            <span className="type-display text-2xl">Adrian</span>
            {footer.quotes.map((q) => (
              <blockquote key={q} className="m-0 max-w-[36ch] text-[15px] leading-[1.55] text-muted-foreground [hanging-punctuation:first] [text-indent:-0.4em]">
                “{q}”
              </blockquote>
            ))}
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {footer.socials.map((s) => (
                <li key={s.name}>
                  <SocialIcon name={s.name} href={s.href} icon={s.icon} />
                </li>
              ))}
            </ul>
            <p className="group m-0 inline-flex w-fit cursor-default items-center gap-1.5 text-[13px] font-medium">
              <span className="shine">{footer.dedication.left}</span>
              <Heart
                aria-hidden="true"
                className="size-3.5 fill-primary text-primary transition-[scale,filter] duration-300 group-hover:scale-125 group-hover:drop-shadow-[0_0_6px_var(--primary)] motion-reduce:transition-none"
              />
              <span className="sr-only">loves</span>
              <span className="shine">{footer.dedication.right}</span>
            </p>
            <p className="group m-0 -mt-3 w-fit cursor-default text-[13px] font-medium">
              <span className="shine">{footer.dedication.below}</span>
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            <div className={labelClass}>Explore</div>
            <ul className="m-0 flex list-none flex-col p-0 md:gap-2.5">
              {explore.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="pt-6 md:self-end md:pt-0">
            <CatBasket />
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
