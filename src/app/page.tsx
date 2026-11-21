import fs from "node:fs"
import path from "node:path"
import { about, hero, intro } from "@content/site"
import { CATEGORY_MAX, experiences, highlightOrder, moreLinks, projects, waves } from "@content/work"
import { moments } from "@content/moments"
import { affiliations, skills, tools } from "@content/skills"
import { resolvePhoto } from "@/lib/photos"
import { Intro } from "@/components/site/intro"
import { Hero } from "@/components/site/hero"
import { About } from "@/components/site/about"
import { SideScroll } from "@/components/site/side-scroll"
import { Moments } from "@/components/site/moments"
import { Skills } from "@/components/site/skills"
import { Contact } from "@/components/site/contact"
import { SiteFooter } from "@/components/site/site-footer"
import { WordScene } from "@/components/site/word-scene"

// Re-render hourly so the Duolingo streak and newly added photos stay current.
export const revalidate = 3600

const publicFile = (file: string) => fs.existsSync(path.join(process.cwd(), "public", file))

export default function Page() {
  const h = hero.photos
  return (
    <>
      <Intro cameo={resolvePhoto(intro.cameo)} />
      <main id="main">
        <Hero
          background={resolvePhoto(h.background)}
          cutout={resolvePhoto(h.cutout)}
          leavesLeft={resolvePhoto(h.leavesLeft)}
          leavesRight={resolvePhoto(h.leavesRight)}
          plants={resolvePhoto(h.plants)}
        />
        <About academic={resolvePhoto(about.photos.academic)} community={resolvePhoto(about.photos.community)} />
        <div id="portfolio">
          <WordScene word="EXPERIENCES" section="experiences" entry="pop" />
          <SideScroll
            id="experiences"
            title="EXPERIENCES"
            intro="An agri-tech internship, and the national stage it led to."
            blurredWord="EXPERIENCES"
            itemLabel="experience"
            exitBlur
            soon="Certifications"
            cards={experiences.map((c) => ({ ...c, photo: resolvePhoto(c.photo) }))}
          />
          <WordScene word="SELECTED WORK" section="projects" entry="blur" />
          <SideScroll
            id="projects"
            title="SELECTED WORK"
            blurredWord="SELECTED WORK"
            itemLabel="project"
            waves={waves}
            highlightOrder={highlightOrder}
            max={CATEGORY_MAX}
            moreLinks={moreLinks}
            cards={projects.map((c) => ({ ...c, photo: resolvePhoto(c.photo) }))}
          />
          <Moments
            moments={moments.map((m) => ({ ...m, photo: resolvePhoto(m.photo) }))}
          />
          <Skills
            skills={skills}
            tools={tools.map((t) => ({ ...t, logo: t.logo && publicFile(t.logo) ? t.logo : null }))}
            affiliations={affiliations.map((o) => ({ ...o, logo: publicFile(o.logo) ? o.logo : null }))}
          />
        </div>
        <Contact />
      </main>
      <SiteFooter />
    </>
  )
}
