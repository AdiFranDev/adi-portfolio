import { ArrowRight, FileText } from "lucide-react"
import { about, hero, who, type WhoRow } from "@content/site"
import type { Photo } from "@/lib/photos"
import { streakDays } from "@/lib/streak"
import { PhotoBlend } from "@/components/site/photo-blend"
import { Reveal } from "@/components/site/reveal"
import { cn } from "@/lib/utils"
import { buttonStyles, surface } from "@/components/site/ds"

type AboutProps = { academic: Photo; community: Photo }

export function About({ academic, community }: AboutProps) {
  return (
    <section id="about" data-section="about" aria-labelledby="about-name" className="relative overflow-hidden">

      <Reveal className="relative mx-auto flex max-w-[1440px] flex-col gap-8 px-5 pt-28 lg:grid lg:min-h-[900px] lg:grid-cols-[minmax(0,420px)_400px_minmax(0,380px)] lg:justify-between lg:gap-6 lg:px-16 lg:pt-0 xl:px-[120px]">
        <div className="flex flex-col gap-6 lg:mt-[300px]">
          <div>
            <div className="type-display optical-left text-xl text-muted-foreground lg:text-[64px]">Hi, I am</div>
            <h2 id="about-name" className="type-display optical-left m-0 mt-1 text-[34px] leading-[1.02] lg:text-[64px]">
              Francis Adrian Esteban
            </h2>
          </div>
          <div className="hidden flex-wrap gap-3 lg:flex">
            <a href={hero.cvHref} className={buttonStyles({ variant: "primary", size: "lg" })}>
              <FileText aria-hidden="true" />
              View CV
            </a>
          </div>
        </div>

        <div className="lg:self-end">
          <PhotoBlend academic={academic} community={community} />
        </div>

        <div className="flex flex-col gap-5 lg:mt-[340px]">
          <p className="type-lead m-0">{about.bio}</p>
          <div className="flex gap-2.5">
            <a href={hero.cvHref} className={cn(buttonStyles({ variant: "primary", size: "lg" }), "flex-1 lg:hidden")}>
              <FileText aria-hidden="true" />
              View CV
            </a>
            <a href="#projects" className={cn(buttonStyles({ size: "lg" }), "flex-1 lg:flex-none")}>
              View projects
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </Reveal>

      <WhoIAm />
    </section>
  )
}

function WhoIAm() {
  const days = streakDays()
  return (
    <section
      id="who-i-am"
      aria-labelledby="who-h"
      className="relative mx-auto flex max-w-[1440px] flex-col gap-[22px] px-5 pt-10 pb-24 lg:px-16 lg:pt-[30px] lg:pb-[110px] xl:px-[120px]"
    >
      <Reveal>
        <h2 id="who-h" className="type-h2 optical-left m-0">
          Two scholarships, three organizations, five languages
        </h2>
      </Reveal>
      <div className="grid gap-4 lg:grid-cols-3 lg:gap-7">
        <Reveal delay={0}>
          <WhoCard title="Education and scholarships" rows={who.education} />
        </Reveal>
        <Reveal delay={80}>
          <WhoCard title="Leadership" rows={who.leadership} />
        </Reveal>
        <Reveal delay={160}>
          <WhoCard title="Languages" rows={who.languages}>
            <div className="flex items-end justify-between gap-3">
              <span className="flex flex-col">
                <span className="text-base font-semibold">
                  Nihongo{" "}
                  <span lang="ja" className="font-jp">
                    日本語
                  </span>
                </span>
                <span className="text-sm text-muted-foreground">Beginner · Duolingo streak</span>
              </span>
              <span className="font-display text-[28px] leading-none font-extrabold whitespace-nowrap text-brand-green lg:text-[34px]">
                {days}
                <span className="font-sans text-sm font-medium text-muted-foreground"> days</span>
              </span>
            </div>
          </WhoCard>
        </Reveal>
      </div>
    </section>
  )
}

type WhoCardProps = { title: string; rows: WhoRow[]; children?: React.ReactNode }

function WhoCard({ title, rows, children }: WhoCardProps) {
  return (
    <div className={cn(surface.card, "flex h-full flex-col gap-3.5 p-5 lg:p-6")}>
      <h3 className="type-label m-0 font-normal">{title}</h3>
      {rows.map((row, i) => {
        const last = i === rows.length - 1 && !children
        return row.dot ? (
          <div key={row.title} className="flex items-center gap-2.5">
            <span className="size-2.5 shrink-0 rounded-full bg-brand-green" />
            <span className="flex flex-col">
              <span lang={row.lang} className="text-[15px] font-semibold">
                {row.title}
              </span>
              <span className="text-[13px] text-muted-foreground">{row.detail}</span>
            </span>
          </div>
        ) : (
          <div key={row.title} className={cn("flex flex-col", !last && "border-b border-border pb-2.5")}>
            <span lang={row.lang} className="text-base font-semibold">
              {row.title}
            </span>
            <span className="text-sm text-muted-foreground">{row.detail}</span>
          </div>
        )
      })}
      {children}
    </div>
  )
}
