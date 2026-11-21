import type { PhotoSpec } from "@/lib/photos"
import { profiles } from "./site"

export type Wave = "highlight" | "apps" | "research" | "community" | "awards"
export type Category = Exclude<Wave, "highlight">
export type Tone = "pink" | "green"

export type WorkCard = {
  id: string
  kind: string
  tag: string
  tone: Tone
  role: string
  org: string
  dates: string
  desc: string
  highlights: string[]
  // Up to three photos; the card crossfades between them as the page scrolls.
  photos: PhotoSpec[]
}

export type ProjectCard = WorkCard & {
  wave: Category
  // Apps and research only: where "Details" goes. href null = not added yet (highlighted).
  link?: { label: string; href: string | null }
}

// Experiences (spec 4.4). Add an entry here; the layout does not change.
export const experiences: WorkCard[] = [
  {
    id: "fresco-intern",
    kind: "Internship",
    tag: "Intern",
    tone: "pink",
    role: "AGRI-TECH INTERN",
    org: "Fresco Greenovations Inc.",
    dates: "Apr to Jul 2026 · 4 months",
    desc: "Designed and built smart farming systems, including ESP32 sensor networks for environmental monitoring and automated greenhouse control, and worked across the stack with Supabase, Flutter, and Next.js.",
    highlights: ["ESP32 sensor networks", "Supabase schemas", "Greenhouse SOPs", "Agri-Youth media"],
    photos: [
      { file: "/images/experiences/fresco-intern-1.webp", alt: "Adrian wiring an ESP32 sensor node beside a hydroponic tower", label: "Fresco 1" },
      { file: "/images/experiences/fresco-team.webp", alt: "The Fresco Greenovations team in their office", label: "Fresco 2" },
      { file: "/images/experiences/fresco-workshop.webp", alt: "Adrian setting up a sensor board at a workshop", label: "Fresco 3" },
    ],
  },
  {
    id: "filipinovation",
    kind: "Recognition",
    tag: "Award",
    tone: "green",
    role: "MINDANAO FINALIST",
    org: "2026 Presidential Filipinovation Awards",
    dates: "2026 · with the Fresco team",
    desc: "Advanced as a Mindanao finalist with the Fresco Greenovations team, contributing to the booth presentation.",
    highlights: [
      "Team entry: Fresco Farm Management System",
      "Booth for the farm management system and weather station",
      "Networking with people from different fields",
    ],
    photos: [
      { file: "/images/experiences/filipinovation-booth.webp", alt: "A teammate presenting the farm management system and weather station at the booth (photo: National Innovation Council)", label: "Filipinovation 1" },
      { file: "/images/experiences/filipinovation-2.webp", alt: "The team in front of the Filipinovation Awards banner in Ozamiz City", label: "Filipinovation 2" },
      { file: "/images/experiences/filipinovation-3.webp", alt: "Presenting the farm management system at the booth (photo: Philippine Information Agency)", label: "Filipinovation 3" },
    ],
  },
]

// 01 Highlight shows the first card of each category, in this order.
export const highlightOrder: Category[] = ["apps", "research", "community", "awards"]

// Each category shows at most this many cards, then a "see more" card.
export const CATEGORY_MAX = 5

// Where each category's "see more" card goes. null = link not added yet (highlighted).
export const moreLinks: Record<Category, { label: string; href: string | null }> = {
  apps: { label: "See all my apps on GitHub", href: profiles.github },
  research: { label: "See my research on Google Scholar", href: profiles.scholar },
  community: { label: "See more of my community work on Facebook", href: profiles.facebook },
  awards: { label: "See more awards on Facebook", href: profiles.facebook },
}

export const waves: { id: Wave; n: string; label: string }[] = [
  { id: "highlight", n: "01", label: "Highlight" },
  { id: "apps", n: "02", label: "Apps" },
  { id: "research", n: "03", label: "Research" },
  { id: "community", n: "04", label: "Community" },
  { id: "awards", n: "05", label: "Awards" },
]

// Three photo slots per project: /images/projects/<id>-1.webp, -2 and -3.
const photo = (id: string, label: string): PhotoSpec[] =>
  [1, 2, 3].map((k) => ({
    file: `/images/projects/${id}-${k}.webp`,
    alt: label,
    label: `${label} (${k} of 3). 1200 × 900`,
  }))
const todo = ["[Highlight]", "[Highlight]", "[Highlight]", "[Highlight]"]

// Selected work (spec 4.5). Text in [brackets] is for Adrian to fill in.
export const projects: ProjectCard[] = [
  // ---------- 03 Research ----------
  {
    id: "csek",
    wave: "research",
    kind: "Research",
    tag: "Lead author",
    tone: "pink",
    role: "CSEK EVACUATION MODEL",
    org: "Capacity-Scaled Edmonds-Karp · Downtown District 2, CDO",
    dates: "Jan to Jul 2025",
    desc: "Applies the capacity-scaled Edmonds-Karp algorithm to evacuation routing across the Downtown District 2 barangays of Cagayan de Oro, to find where routes bottleneck under limited road capacity.",
    highlights: ["Max-flow road network", "Bottleneck analysis", "C++ and Python", "[A measured result]"],
    photos: photo("csek", "Figure: the road network with flow bottlenecks highlighted"),
    link: { label: "Repository", href: null },
  },
  {
    id: "thesis",
    wave: "research",
    kind: "Thesis",
    tag: "Ongoing",
    tone: "green",
    role: "[THESIS TITLE]",
    org: "[Group or adviser]",
    dates: "2026 to 2027",
    desc: "[One or two lines on the problem, the approach, and where it stands.]",
    highlights: todo,
    photos: photo("thesis", "Thesis figure or diagram"),
    link: { label: "Paper", href: null },
  },
  {
    id: "automotif",
    wave: "research",
    kind: "Research",
    tag: "Bioinformatics",
    tone: "pink",
    role: "AUTOMOTIF",
    org: "DNA and RNA motif search",
    dates: "[Dates]",
    desc: "[One or two lines on what it finds and how: KMP, Levenshtein, Aho-Corasick.]",
    highlights: ["KMP", "Levenshtein distance", "Aho-Corasick", "[Highlight]"],
    photos: photo("automotif", "AutoMotif screen or figure"),
    link: { label: "Repository", href: null },
  },
  // ---------- 02 Apps in development ----------
  {
    id: "app-1",
    wave: "apps",
    kind: "App",
    tag: "In development",
    tone: "green",
    role: "[APP NAME]",
    org: "[Stack, e.g. Next.js, Supabase]",
    dates: "[Started]",
    desc: "[What it does and who it is for, in one or two lines.]",
    highlights: todo,
    photos: photo("app-1", "App screen"),
    link: { label: "Open app", href: null },
  },
  {
    id: "app-2",
    wave: "apps",
    kind: "App",
    tag: "In development",
    tone: "green",
    role: "[APP NAME]",
    org: "[Stack]",
    dates: "[Started]",
    desc: "[What it does and who it is for, in one or two lines.]",
    highlights: todo,
    photos: photo("app-2", "App screen"),
    link: { label: "Repository", href: null },
  },
  // ---------- 04 Community ----------
  {
    id: "agrivanture",
    wave: "community",
    kind: "Community",
    tag: "Program Director",
    tone: "green",
    role: "AGRIVANTURE",
    org: "Youth-led urban gardening and hydroponics, Cagayan de Oro",
    dates: "[Dates]",
    desc: "[What it did, for whom, and with which partners.]",
    highlights: ["Outstanding Project of the Year 2026", "[Highlight]", "[Highlight]", "[Highlight]"],
    photos: photo("agrivanture", "AgriVANture session photo"),
  },
  {
    id: "project-3k",
    wave: "community",
    kind: "Community",
    tag: "Team project",
    tone: "green",
    role: "PROJECT 3K",
    org: "Kratky hydroponics with a food-waste nutrient solution",
    dates: "[Dates]",
    desc: "[What it did, for whom, and with which partners.]",
    highlights: ["₱50,000 grant", "[Highlight]", "[Highlight]", "[Highlight]"],
    photos: photo("project-3k", "Project 3K photo"),
  },
  {
    id: "cs3-congress",
    wave: "community",
    kind: "Community",
    tag: "Organizer",
    tone: "green",
    role: "1ST CS³ CONGRESS",
    org: "Computer Science Student Society, USTP CDO",
    dates: "[Dates]",
    desc: "[What it was, who came, and your role.]",
    highlights: todo,
    photos: photo("cs3-congress", "CS³ Congress photo"),
  },
  // ---------- 05 Awards ----------
  {
    id: "kahamili",
    wave: "awards",
    kind: "Award",
    tag: "Gold",
    tone: "pink",
    role: "OUTSTANDING PROJECT OF THE YEAR",
    org: "2026 USTP Kahamili Leadership Awards · AgriVANture",
    dates: "2026",
    desc: "[What the award recognized, in one or two lines.]",
    highlights: todo,
    photos: photo("kahamili", "Kahamili awarding"),
  },
  {
    id: "batang-lider",
    wave: "awards",
    kind: "Award",
    tag: "Award",
    tone: "pink",
    role: "YOUTH LEADERSHIP EXCELLENCE AWARD",
    org: "Batang Lider",
    dates: "2026",
    desc: "[What the award recognized, in one or two lines.]",
    highlights: todo,
    photos: photo("batang-lider", "Batang Lider awarding"),
  },
  {
    id: "volunteer-of-the-year",
    wave: "awards",
    kind: "Award",
    tag: "Award",
    tone: "pink",
    role: "VOLUNTEER OF THE YEAR",
    org: "CEDO Kinanao",
    dates: "2026",
    desc: "[What the award recognized, in one or two lines.]",
    highlights: todo,
    photos: photo("volunteer-of-the-year", "Volunteer of the Year awarding"),
  },
]
