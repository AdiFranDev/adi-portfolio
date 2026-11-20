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
  greeting: "[GREETING in Cebuano or Waray]",
  tagline: "Algorithms, urban farms, and student institutions, built with the same care.",
  cvHref: "/cv.pdf",
  sides: [
    { id: "researcher", label: "Researcher", n: "01", href: "#projects" },
    { id: "community", label: "Community leader", n: "02", href: "#projects" },
    { id: "creative", label: "Creative Developer", n: "03", href: "#projects" },
  ],
  photos: {
    background: {
      file: "/images/hero/background.webp",
      alt: "",
      label: "Background photo: a Cagayan de Oro landscape, farm, or campus at dusk. 2560 × 1600",
    },
    cutout: {
      file: "/images/hero/cutout.webp",
      alt: "Francis Adrian Esteban",
      label: "Adrian cutout, transparent WebP, about 1600 px tall",
    },
    leavesLeft: {
      file: "/images/hero/leaves-left.webp",
      alt: "",
      label: "Foreground leaves, left, transparent WebP",
    },
    leavesRight: {
      file: "/images/hero/leaves-right.webp",
      alt: "",
      label: "Foreground leaves, right, transparent WebP",
    },
    plants: {
      file: "/images/hero/plants-bottom.webp",
      alt: "",
      label: "Plants along the bottom edge, transparent WebP",
    },
  },
} satisfies {
  status: string
  greeting: string
  tagline: string
  cvHref: string
  sides: { id: string; label: string; n: string; href: string }[]
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
      alt: "Adrian in his university uniform",
      label: "Photo A · Academic: formal or university uniform, front-facing. 1200 × 1500",
    },
    community: {
      file: "/images/about/community.webp",
      alt: "Adrian in his 4-H shirt",
      label: "Photo B · Community leader: 4-H shirt or field clothes, same pose, framing, and light as Photo A",
    },
  } satisfies Record<string, PhotoSpec>,
}

export type WhoRow = { title: string; detail: string; lang?: string; dot?: boolean }

export const who = {
  education: [
    { title: "BS Computer Science, USTP Cagayan de Oro", detail: "2023 to 2027 · expected June 2027" },
    { title: "Iskolar sa Dakbayan", detail: "City Scholar of Cagayan de Oro", lang: "ceb", dot: true },
    { title: "CHED-UniFAST USTAT Scholar", detail: "Free tuition, earned by passing the USTAT", dot: true },
  ],
  leadership: [
    { title: "4-H Club USTP-CDO", detail: "Senior Advisor · former Director of Community Outreach · founding officer" },
    { title: "Computer Science Student Society", detail: "Senior Advisor · former VP for Internal Affairs · 1st CS³ Congress" },
    { title: "University City Scholars", detail: "Senior Advisor, Academic Affairs · former Department Head" },
  ],
  languages: [
    { title: "Filipino, Tagalog, Bisaya (Cebuano)", detail: "Mother tongues" },
    { title: "English", detail: "Proficient · language of instruction at university" },
  ],
} satisfies Record<string, WhoRow[]>

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