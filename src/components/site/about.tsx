import Image from "next/image"
import { about, aboutGraph, who } from "@content/site"
import type { Photo } from "@/lib/photos"
import { resolvePhoto } from "@/lib/photos"
import { streakDays } from "@/lib/streak"
import { AboutGraph } from "@/components/site/about-graph"
import { Timeline } from "@/components/site/timeline"
import { Reveal } from "@/components/site/reveal"

type AboutProps = { academic: Photo; community: Photo }

const card = "rounded-[20px] border border-border bg-card/90 p-5 md:p-6"
const label = "font-mono text-[12.5px] tracking-[0.08em] text-accent-pink-text uppercase"

// The three groups of "Two scholarships, three organizations, five languages" (D-017).
const scholarships = [
  { name: "Iskolar sa Dakbayan", meta: "Cagayan de Oro City Scholarship Program", logo: "/logos/orgs/cdo-scholarship.png" },
  { name: "CHED-UniFAST", meta: "USTAT Scholarship", logo: "/logos/orgs/ched-unifast.png" },
]
const orgLogos: Record<string, string> = {
  "4-H Club USTP-CDO": "/logos/orgs/4h.png",
  "Computer Science Student Society": "/logos/orgs/cs3.png",
  "University City Scholars": "/logos/orgs/ucs.png",
}
const languages = [
  { name: "Filipino", level: "Mother tongue" },
  { name: "Tagalog", level: "Mother tongue" },
  { name: "Bisaya (Cebuano)", level: "Mother tongue" },
  { name: "English", level: "Proficient" },
]

export function About({ academic, community }: AboutProps) {
  const days = streakDays()
  const nodes = aboutGraph.nodes.map((n) => ({ ...n, photo: resolvePhoto(n.photo) }))

  return (
    <section id="about" data-section="about" aria-labelledby="about-title" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-5 md:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-[640px] flex-col gap-3">
            <div className="type-label text-muted-foreground">About</div>
            <h2 id="about-title" className="type-h2 m-0">Two sides, one graph</h2>
            <p className="type-lead m-0 text-muted-foreground">{about.bio} Hover a node to see where it comes from.</p>
          </div>
        </Reveal>
      </div>

      {/* The graph gets a wider stage than the text around it (D-017). */}
      <div className="mx-auto mt-8 max-w-[1600px] px-5 md:px-8">
        <AboutGraph nodes={nodes} edges={aboutGraph.edges} links={aboutGraph.links} root={aboutGraph.root} academic={academic} community={community} />
      </div>

      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-5 md:px-8">
        <Reveal className="mt-10 flex flex-col gap-5">
          <h3 id="who-h" className="type-h2 m-0">Two scholarships, three organizations, five languages</h3>
          <div className="grid gap-5 md:grid-cols-3">
            <div className={`${card} flex flex-col gap-4`}>
              <div className={label}>2 scholarships</div>
              {scholarships.map((s) => (
                <div key={s.name} className="flex items-center gap-3">
                  <Image src={s.logo} alt="" width={44} height={44} className="size-11 object-contain" />
                  <div>
                    <div className="font-bold">{s.name}</div>
                    <div className="text-sm text-muted-foreground">{s.meta}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className={`${card} flex flex-col gap-4`}>
              <div className={label}>3 organizations</div>
              {who.leadership.map((o) => {
                const logo = orgLogos[o.org]
                return (
                <div key={o.org} className="flex items-center gap-3">
                  {logo && <Image src={logo} alt="" width={44} height={44} className="size-11 object-contain" />}
                  <div>
                    <div className="font-bold">{o.org}</div>
                    <div className="text-sm text-muted-foreground">
                      {o.title}
                      {o.meta ? ` · ${o.meta}` : ""}
                    </div>
                  </div>
                </div>
                )
              })}
            </div>
            <div className={`${card} flex flex-col gap-1`}>
              <div className={`${label} mb-2`}>5 languages</div>
              {languages.map((l) => (
                <div key={l.name} className="flex justify-between gap-2 border-b border-border py-1.5">
                  <span className="font-bold">{l.name}</span>
                  <span className="text-sm text-muted-foreground">{l.level}</span>
                </div>
              ))}
              <div className="flex justify-between gap-2 py-1.5">
                <span className="font-bold" lang="ja">
                  Nihongo 日本語
                </span>
                <span className="text-right text-sm text-muted-foreground">
                  Beginner · <b className="text-primary">{days}</b>-day Duolingo streak
                </span>
              </div>
            </div>
          </div>
          <div className={`${card} md:p-8`}>
            <Timeline title="Education" entries={who.education} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
