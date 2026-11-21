import type { PhotoSpec } from "@/lib/photos"

// Text in [brackets] is a placeholder Adrian still has to write.

/**
 * Profile links, in one place. Contact, the footer, and Selected work's
 * "see more" buttons all read from here. null = not added yet (shown highlighted).
 */
export const profiles = {
  github: "https://github.com/AdiFranDev" as string | null,
  scholar: null as string | null, // Google Scholar
  facebook: null as string | null,
  linkedin: null as string | null,
  instagram: null as string | null,
}

export const hero = {
  status: "[STATUS: open to opportunities, confirm wording]",
  // One greeting per language Adrian speaks; the hero cycles through them.
  greetings: [
    { lang: "en", text: "Hello, I'm Adrian!" },
    { lang: "ceb", text: "Maayong adlaw! Ako si Adrian." },
    { lang: "fil", text: "Magandang araw, ako si Adrian!" },
    { lang: "tl", text: "Kumusta! Ako si Adrian." },
    { lang: "ja", text: "こんにちは、アドリアンです！" },
  ],
  tagline: "Algorithms, urban farms, and student institutions, built with the same care.",
  // The other graph nodes. Academic side (left) and community side (right); Empathy
  // sits on Adrian's back, under the 4-H logo, and joins both sides.
  topics: [
    { id: "scholar", label: "Scholar", n: "02", note: "city scholar, CHED-UniFAST" },
    { id: "farms", label: "Urban farms", n: "03", note: "Fresco Greenovations" },
    { id: "initiative", label: "Initiative", n: "04", note: "I start before I'm asked" },
    { id: "program", label: "Program Director", n: "07", note: "AgriVANture, AgriCARE" },
    { id: "action", label: "Action", n: "08", note: "plans that leave the page" },
    { id: "empathy", label: "Empathy", n: "09", note: "where every side starts" },
    // Beneath Empathy, in green; joined only to Empathy. `late`: shows only near the
    // end of the hero scroll.
    { id: "impact", label: "Impact", n: "10", tone: "green", late: true },
  ],
  // Phones have no graph; they list the nodes in these two groups instead.
  groups: [
    { title: "Academic", ids: ["researcher", "scholar", "farms", "initiative"] },
    { title: "Community", ids: ["creative", "student", "program", "action"] },
  ],
  // Where each node sits on the farm scene (share of the screen) and which pairs are
  // joined. Nodes stay at the sides; edges that cross the middle dip under Adrian's head.
  graph: {
    place: {
      // Each side steps down in even rows (36, 53, 70, 87% of the height), zigzagging
      // outer, inner, outer, inner; the right side mirrors the left.
      researcher: { x: 0.05, y: 0.36, tilt: -3 },
      scholar: { x: 0.2, y: 0.53, tilt: -2 },
      farms: { x: 0.07, y: 0.7 },
      initiative: { x: 0.28, y: 0.87, tilt: 2 },
      creative: { x: 0.79, y: 0.36, tilt: -2 },
      student: { x: 0.65, y: 0.53, tilt: -2 },
      program: { x: 0.8, y: 0.7, tilt: 2 },
      action: { x: 0.6, y: 0.87, tilt: -2 },
      empathy: { x: 0.5, y: 0.82 },
      // Beneath Empathy, at the foot of the scene.
      impact: { x: 0.5, y: 0.97 },
    },
    edges: [
      // Each side is a chain down its zigzag; Empathy joins every node.
      ["researcher", "scholar"],
      ["scholar", "farms"],
      ["farms", "initiative"],
      ["researcher", "farms"],
      ["creative", "student"],
      ["student", "program"],
      ["program", "action"],
      ["creative", "program"],
      ["empathy", "researcher"],
      ["empathy", "scholar"],
      ["empathy", "farms"],
      ["empathy", "initiative"],
      ["empathy", "creative"],
      ["empathy", "student"],
      ["empathy", "program"],
      ["empathy", "action"],
      ["empathy", "impact"],
    ],
  },
  cvHref: "/cv.pdf",
  sides: [
    { id: "researcher", label: "Researcher", n: "01", href: "#projects", note: "graphs that route people out of floods" },
    { id: "creative", label: "Creative Developer", n: "05", href: "#projects", note: "I build what I design" },
    { id: "student", label: "Student-Leader", n: "06", href: "#projects", note: "senior advisor in three orgs" },
  ],
  photos: {
    background: {
      file: "/images/hero/campus.webp",
      alt: "",
      label: "Frame 1 background: the USTP campus. 2560 × 1440",
    },
    // Frame 2: the campus blurs away into this.
    farm: {
      file: "/images/hero/farm.webp",
      alt: "",
      label: "Frame 2 background: farmland. 2560 × 1600",
    },
    cutout: {
      file: "/images/hero/cutout.webp",
      alt: "Adrian seen from behind, facing the campus",
      label: "Adrian cutout, from behind, transparent WebP",
    },
    // Same cutout in the 4-H shirt; it takes over when the farm comes in.
    cutoutFarm: {
      file: "/images/hero/cutout-farm.webp",
      alt: "Adrian seen from behind, in his 4-H shirt",
      label: "Adrian cutout, from behind, 4-H shirt, transparent WebP",
    },
    // The foreground garden, one image cut into three pieces that part on scroll.
    leavesLeft: {
      file: "/images/hero/bush-left.webp",
      alt: "",
      label: "Foreground garden, left piece (0-40%), transparent WebP",
    },
    leavesMiddle: {
      file: "/images/hero/meadow-ground.webp",
      alt: "",
      label: "Foreground garden, middle piece (16-84%, ground only past 34-66%), transparent WebP",
    },
    leavesRight: {
      file: "/images/hero/bush-right.webp",
      alt: "",
      label: "Foreground garden, right piece (60-100%), transparent WebP",
    },
  },
} satisfies {
  status: string
  greetings: { lang: string; text: string }[]
  tagline: string
  topics: { id: string; label: string; n: string; note?: string; tone?: "green"; late?: boolean }[]
  groups: { title: string; ids: string[] }[]
  graph: { place: Record<string, { x: number; y: number; tilt?: number }>; edges: [string, string][] }
  cvHref: string
  sides: { id: string; label: string; n: string; href: string; note: string }[]
  photos: Record<string, PhotoSpec>
}

export const intro = {
  greeting: { before: "Isang makabata't ", green: "makakalikasang", after: " araw!" },
  cameo: {
    file: "/images/intro/cameo.webp",
    alt: "",
    label: "Reaction cameo with the UNIVERSE? bubble",
  } satisfies PhotoSpec,
}

export const about = {
  bio: "A senior Computer Science student at USTP Cagayan de Oro. I build research models, agri-tech systems, and the student programs around them.",
  photos: {
    academic: {
      file: "/images/about/academic.webp",
      alt: "Adrian in his BS Computer Science shirt on campus",
      label: "Photo A · Academic: on campus, front-facing. 1200 × 1500",
    },
    community: {
      file: "/images/about/community.webp",
      alt: "Adrian in his 4-H shirt at a seedling area",
      label: "Photo B · Community leader: 4-H shirt or field clothes, same pose, framing, and light as Photo A",
    },
  } satisfies Record<string, PhotoSpec>,
}

// Who I am: three timelines, newest first. `todo: true` marks an entry Adrian
// still has to fill in; it renders highlighted until then.
export type TimelineEntry = {
  org: string
  title: string
  meta?: string
  dates?: string
  tags?: { text: string; lang?: string }[]
  lang?: string
  stat?: "streak"
  todo?: boolean
}

export const who = {
  education: [
    {
      org: "University of Science and Technology of Southern Philippines, Cagayan de Oro",
      title: "BS Computer Science",
      meta: "Expected graduation June 2027",
      dates: "2023 to present",
      tags: [
        { text: "Dean's Lister, 1st sem AY 2024 to 2025" },
        { text: "Dean's Lister, 2nd sem AY 2025 to 2026" },
        { text: "Cagayan de Oro City Scholarship Program" },
        { text: "CHED-UniFAST Scholarship" },
      ],
    },
    {
      org: "Liceo de Cagayan University, Main Campus",
      title: "Senior High School, STEM strand",
      meta: "Outstanding Student Leadership Award",
      dates: "2020 to 2023",
    },
    {
      org: "Gusa Elementary School and East Gusa National High School",
      title: "Primary and secondary education",
      meta: "Completed with honors",
      dates: "2012 to 2020",
    },
  ],
  leadership: [
    { org: "4-H Club USTP-CDO", title: "Senior Advisor", meta: "Former Director of Community Outreach · founding officer" },
    { org: "Computer Science Student Society", title: "Senior Advisor", meta: "Former VP for Internal Affairs · 1st CS³ Congress" },
    { org: "University City Scholars", title: "Senior Advisor, Academic Affairs", meta: "Former Department Head" },
  ],
  languages: [
    { org: "Filipino, Tagalog, Bisaya (Cebuano)", title: "Mother tongues" },
    { org: "English", title: "Proficient", meta: "Language of instruction at university" },
    { org: "Nihongo 日本語", title: "Beginner", meta: "Duolingo streak", stat: "streak" },
  ],
} satisfies Record<string, TimelineEntry[]>

/**
 * Duolingo streak. Day 1 is the start date in Asia/Manila time.
 * There is no public Duolingo API, so the count is computed. If the streak
 * ever breaks, set `override` to the real number (or move `start`).
 */
export const streak = {
  start: "2026-04-04",
  timeZone: "Asia/Manila",
  override: null as number | null,
}

export const contact = {
  traits: [
    { name: "Systematic", text: "I build structure first: process designs, SOPs, bylaws, and code that others can maintain." },
    { name: "Grounded", text: "My work starts from real places: barangay road networks, greenhouses, and student organizations." },
    { name: "Community-built", text: "Most of my projects are team efforts with partners, and I credit them." },
    { name: "Curious across fields", text: "Graph algorithms, bioinformatics, IoT, and agriculture: I move between them on purpose." },
  ],
  // href: null means the link is not confirmed yet; it renders as a highlighted slot.
  links: [
    { name: "LinkedIn", handle: "Let us connect", href: profiles.linkedin },
    { name: "GitHub", handle: "@AdiFranDev", href: profiles.github },
    { name: "Facebook", handle: "[confirm public]", href: profiles.facebook },
    { name: "Instagram", handle: "[confirm public]", href: profiles.instagram },
  ] satisfies { name: string; handle: string; href: string | null }[],
}

// Footer (spec 4.12).
export const footer = {
  // Short quotes or mottos. Add as many as you like; each shows on its own line.
  quotes: ["Festina lente"],
  // icon: a file in /public/logos/social. null = no logo yet (LinkedIn is not in Simple Icons).
  socials: [
    { name: "GitHub", href: profiles.github, icon: "/logos/social/github.svg" },
    { name: "LinkedIn", href: profiles.linkedin, icon: null },
    { name: "Facebook", href: profiles.facebook, icon: "/logos/social/facebook.svg" },
    { name: "Instagram", href: profiles.instagram, icon: "/logos/social/instagram.svg" },
  ] satisfies { name: string; href: string | null; icon: string | null }[],
  // Non-link heart easter egg rendered beside the social icons.
  dedication: {
    left: "Chuaya",
    right: "Adi",
  },
  signoff: "Adirawr, dinarawrawr, thanks for visiting mwa <3",
  copyright: "© 2026 AdiFranDev. All rights reserved.",
};