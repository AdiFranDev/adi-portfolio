import { ArrowRight, FileText } from "lucide-react"
import { about, hero, who } from "@content/site"
import type { Photo } from "@/lib/photos"
import { streakDays } from "@/lib/streak"
import { PhotoBlend } from "@/components/site/photo-blend"
import { Reveal } from "@/components/site/reveal"
import { Timeline } from "@/components/site/timeline"
import { cn } from "@/lib/utils"
import { buttonStyles } from "@/components/site/ds"

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
      {/* Borderless timelines: the step reaching the reading line lights up as the page scrolls. */}
      <div className="mt-4 grid gap-14 lg:mt-8 lg:grid-cols-3 lg:gap-10">
        <Reveal delay={0}>
          <Timeline title="Education" entries={who.education} />
        </Reveal>
        <Reveal delay={80}>
          <Timeline title="Leadership" entries={who.leadership} />
        </Reveal>
        <Reveal delay={160}>
          <Timeline title="Languages" entries={who.languages} streak={days} />
        </Reveal>
      </div>
    </section>
  )
}
