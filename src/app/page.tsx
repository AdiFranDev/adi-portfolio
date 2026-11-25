import type { Metadata } from "next"
import fs from "node:fs"
import path from "node:path"
import { FileText } from "lucide-react"
import { about, hero, profiles } from "@content/site"
import { experiences, moreLinks, projects, waves } from "@content/work"
import { moments } from "@content/moments"
import { certificates } from "@content/certificates"
import { affiliations, skills, tools } from "@content/skills"
import { resolvePhoto } from "@/lib/photos"
import { Intro } from "@/components/site/intro"
import { Hero } from "@/components/site/hero"
import { About } from "@/components/site/about"
import { WorkBento } from "@/components/site/work-bento"
import { Certificates } from "@/components/site/certificates"
import { buttonStyles } from "@/components/site/ds"
import { Moments } from "@/components/site/moments"
import { Skills } from "@/components/site/skills"
import { Contact } from "@/components/site/contact"
import { SiteFooter } from "@/components/site/site-footer"

// Re-render hourly so the Duolingo streak and newly added photos stay current.
export const revalidate = 3600

// One address for search engines: francisadrian.dev, not www or vercel.app.
export const metadata: Metadata = { alternates: { canonical: "/" } }

// Tells search engines who this site belongs to and which profiles are the same person.
// Public info only: name, school, city, links.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Francis Adrian Esteban",
  alternateName: "Francis Adrian G. Esteban",
  url: "https://francisadrian.dev",
  image: "https://francisadrian.dev/opengraph-image.jpg",
  jobTitle: "Computer Science student",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "University of Science and Technology of Southern Philippines",
  },
  address: { "@type": "PostalAddress", addressLocality: "Cagayan de Oro", addressCountry: "PH" },
  sameAs: Object.values(profiles).filter((url): url is string => url !== null),
}

const publicFile = (file: string) => fs.existsSync(path.join(process.cwd(), "public", file))

export default function Page() {
  const h = hero.photos
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <Intro />
      <main id="main">
        <Hero
          campus={resolvePhoto(h.campusLine)}
          farm={resolvePhoto(h.farmLine)}
          cutout={resolvePhoto(h.cutout)}
          cutoutFarm={resolvePhoto(h.cutoutFarm)}
        />
        <About academic={resolvePhoto(about.photos.academic)} community={resolvePhoto(about.photos.community)} />
        <div id="portfolio">
          <section id="experiences" data-section="experiences" aria-labelledby="experiences-h" className="scroll-mt-24 pt-24 pb-20 md:pt-28">
            <div className="mx-auto flex max-w-[1280px] flex-col gap-5 px-5 md:px-8">
              <div className="flex flex-col gap-3">
                <div className="type-label text-muted-foreground">Experiences</div>
                <h2 id="experiences-h" className="type-h2 m-0">Where I&apos;ve done the work</h2>
              </div>
              <p className="type-lead m-0 text-muted-foreground">An agri-tech internship, and the national stage it led to. Click a card for the full story.</p>
              <WorkBento itemLabel="experience" tilt={false} items={experiences.map((c) => ({ ...c, photos: c.photos.map(resolvePhoto) }))} />
            </div>
          </section>
          <Certificates items={certificates} />
          <section id="projects" data-section="projects" aria-labelledby="projects-h" className="scroll-mt-24 pt-24 pb-20 md:pt-28">
            <div className="mx-auto flex max-w-[1280px] flex-col gap-5 px-5 md:px-8">
              <div className="flex flex-col gap-3">
                <div className="type-label text-muted-foreground">Selected work</div>
                <h2 id="projects-h" className="type-h2 m-0">Things I&apos;ve built and led</h2>
              </div>
              <p className="type-lead m-0 text-muted-foreground">Apps, research and community programs. Click any card for the full story.</p>
              <WorkBento
                itemLabel="project"
                filters={waves.filter((w) => w.id !== "highlight").map((w) => ({ id: w.id, label: w.label }))}
                moreLinks={moreLinks}
                slot={{
                  after: "awards",
                  node: (
                    <a href={hero.cvHref} className={buttonStyles({ variant: "primary" })}>
                      <FileText aria-hidden="true" />
                      View CV
                    </a>
                  ),
                }}
                items={projects.map((c) => ({ ...c, photos: c.photos.map(resolvePhoto) }))}
              />
            </div>
          </section>
          <Skills
            skills={skills}
            tools={tools.map((t) => ({ ...t, logo: t.logo && publicFile(t.logo) ? t.logo : null }))}
            affiliations={affiliations.map((o) => ({ ...o, logo: publicFile(o.logo) ? o.logo : null }))}
          />
          <Moments moments={moments.map((m) => ({ ...m, photo: resolvePhoto(m.photo) }))} />
        </div>
        <Contact />
      </main>
      <SiteFooter />
    </>
  )
}
