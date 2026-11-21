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
  // A second button, e.g. a paper beside its repository.
  link2?: { label: string; href: string }
  // A short status line under the description, e.g. "Preprint".
  note?: string
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
export const CATEGORY_MAX = 6

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

// One photo (apps use a single screenshot).
const shot = (id: string, label: string): PhotoSpec[] => [
  { file: `/images/projects/${id}-1.webp`, alt: label, label: `${label}. 1200 × 900` },
]

// Selected work (spec 4.5). Text in [brackets] is for Adrian to fill in.
export const projects: ProjectCard[] = [
  // ---------- 02 Apps ----------
  {
    id: "farmbox",
    wave: "apps",
    kind: "App",
    tag: "Project lead",
    tone: "green",
    role: "FARMBOX ERP",
    org: "Agri-tech platform for smallholder farmers",
    dates: "Jan to Jun 2026",
    desc: "A mobile-first platform that brings AI-powered bookkeeping and resource management to smallholder farmers, with marketplace access and community engagement built in.",
    highlights: ["Best Pitch winner", "AI-powered bookkeeping", "Online marketplace", "Flutter, Supabase, Gemini API"],
    photos: shot("farmbox", "FarmBox ERP welcome and splash screens"),
  },
  {
    id: "guidance",
    wave: "apps",
    kind: "App",
    tag: "QA and documentation lead",
    tone: "pink",
    role: "GUIDANCE AND COUNSELING SYSTEM",
    org: "USTP CDO Guidance and Counseling Services",
    dates: "Sep to Dec 2025",
    desc: "A digital management system for the university's guidance office. I led quality assurance, validation and technical documentation, aligning the system with the office's real workflows.",
    highlights: ["Quality assurance", "Technical documentation", "Workflow alignment", "Next.js, Node.js, Supabase, Firebase"],
    photos: shot("guidance", "Student dashboard of the Guidance and Counseling system"),
  },
  {
    id: "automotif",
    wave: "apps",
    kind: "App",
    tag: "System developer",
    tone: "green",
    role: "AUTOMOTIF_V2.1",
    org: "DNA and RNA sequence analyzer",
    dates: "Sep to Dec 2025",
    desc: "A sequence analysis tool for DNA and RNA with pattern matching, motif detection, sequence validation and FASTA input, using several search methods for teaching and bioinformatics work.",
    highlights: ["KMP and Aho-Corasick", "Levenshtein distance", "Motif detection, FASTA input", "C++, C, Windows Forms"],
    photos: shot("automotif", "AutoMotif v2.1 showing Levenshtein matches and the execution trace"),
    link: { label: "Repository", href: "https://github.com/AdiFranDev/AutoMotif_v2.1" },
  },
  {
    id: "cache-visualizer",
    wave: "apps",
    kind: "App",
    tag: "System developer",
    tone: "pink",
    role: "CACHE ALGORITHM VISUALIZER",
    org: "Operating systems learning tool",
    dates: "Sep to Dec 2025",
    desc: "An interactive tool that shows FIFO and LRU cache replacement step by step, so an abstract operating systems concept becomes easy to follow.",
    highlights: ["FIFO and LRU", "Step-by-step visuals", "Built for learners", "Python"],
    photos: shot("cache-visualizer", "Page Replacement Algorithm Comparison Tool, with FIFO and LRU simulations"),
    link: { label: "Repository", href: "https://github.com/AdiFranDev/Cache-Algorithm-Visualizer" },
  },
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
    desc: "Applies the capacity-scaled Edmonds-Karp algorithm to evacuation routing across the Downtown District 2 barangays of Cagayan de Oro, finding where routes bottleneck and how efficient they stay under limited road capacity.",
    highlights: ["Max-flow road network", "Bottleneck analysis", "Route efficiency", "C++, Python, HTML"],
    photos: shot("csek", "Map of evacuation routes across Downtown District 2, Cagayan de Oro"),
    link: { label: "Repository", href: "https://github.com/AdiFranDev/Capacity-Scaled-Edmonds-Karp-Algorithm" },
    link2: { label: "Preprint", href: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5370429" },
    note: "Preprint, not yet peer reviewed. The model and paper are still in progress.",
  },
  {
    id: "thesis",
    wave: "research",
    kind: "Thesis",
    tag: "Under development",
    tone: "green",
    role: "COMING SOON",
    org: "Undergraduate thesis · proposal defended",
    dates: "2026 to 2027",
    desc: "Our proposal is defended and the build is underway. The details stay under wraps for now: an algorithm that uses a forecast when it is right, and stays safe when it is not.",
    highlights: ["Co-author", "Validator", "Documenter", "Tester"],
    photos: shot("thesis", "Our team with the panel after the thesis proposal defense"),
  },
  // ---------- 04 Community ----------
  {
    id: "agrivanture",
    wave: "community",
    kind: "Community",
    tag: "Program director",
    tone: "green",
    role: "AGRIVANTURE",
    org: "4-H Club USTP-CDO · city-wide youth agriculture outreach",
    dates: "2025 to 2026",
    desc: "A youth-led, city-wide outreach program I designed and lead, training young people and communities in urban gardening, hydroponics and leadership across several barangays.",
    highlights: ["Outstanding Project of the Year 2026", "Multi-barangay rollout", "Urban gardening and hydroponics", "Partnership coordination"],
    photos: [
      { file: "/images/projects/agrivanture-1.webp", alt: "AgriVANture participants and partners with the program banner at a farm site", label: "agrivanture 1" },
      { file: "/images/projects/agrivanture-2.webp", alt: "The AgriVANture team on stage at the Kahamili Awards, Gold, Outstanding Project of the Year", label: "agrivanture 2" },
      { file: "/images/projects/agrivanture-3.webp", alt: "AgriVANture participants with the banner beside an urban garden", label: "agrivanture 3" },
    ],
    link: { label: "Facebook post", href: "https://www.facebook.com/share/p/19jfs8S5hS/" },
  },
  {
    id: "agricare",
    wave: "community",
    kind: "Community",
    tag: "Project co-head",
    tone: "pink",
    role: "AGRICARE SCHOOL URBAN FARM",
    org: "4-H Club USTP-CDO",
    dates: "Apr 2025 to May 2026",
    desc: "A student-led urban farm that brings technology and support to local farming communities, funded through the LEaP Grant.",
    highlights: ["LEaP Grant", "Project of the Year 2025", "Regional champion, Health 2026", "National qualifier"],
    photos: [
      { file: "/images/projects/agricare-1.webp", alt: "An acceptance speech on stage at the Kahamili Awards with the 4-H Club team", label: "agricare 1" },
      { file: "/images/projects/agricare-2.webp", alt: "USTP news graphic: USTP CDO students secure LEaP Grant for AgriCare Project", label: "agricare 2", fit: "contain" },
      { file: "/images/projects/agricare-3.webp", alt: "The AgriCARE team at the Kahamili Awards, Outstanding Project of the Year", label: "agricare 3" },
    ],
    link: { label: "USTP news", href: "https://www.ustp.edu.ph/ustp-cdo-students-secure-leap-grant-for-agricare-project/" },
    link2: { label: "Facebook post", href: "https://www.facebook.com/share/p/1JTaCXHHAe/" },
  },
  {
    id: "project-3k",
    wave: "community",
    kind: "Community",
    tag: "Events and partnerships",
    tone: "green",
    role: "PROJECT 3K",
    org: "University City Scholars · Kaalaman, Kakayahan, at Kabuhayan",
    dates: "2023 to 2025",
    desc: "An award-winning food security project that turns food waste into a nutrient solution for Kratky hydroponics. I managed events and partnerships.",
    highlights: ["₱50,000 Global Youth Summit grant", "3rd place, 72nd National Farm Youth Convention", "Most Outstanding Community Project 2025", "Provincial champion, Young Farmers Challenge"],
    photos: [
      { file: "/images/projects/project-3k-1.webp", alt: "Project 3K team with the ₱50,000 Global Youth Summit seed grant", label: "project-3k 1", fit: "contain" },
      { file: "/images/projects/project-3k-2.webp", alt: "The Global Youth Summit crowd at the Mall of Asia Arena", label: "project-3k 2" },
      { file: "/images/projects/project-3k-3.webp", alt: "Project 3K team and partners under the hydroponics shelter", label: "project-3k 3" },
    ],
    link: { label: "Daily Tribune", href: "https://tribune.net.ph/2024/09/08/gys-seed-grant-prize-supports-kkk-training-of-scholars" },
    link2: { label: "USTP news", href: "https://www.ustp.edu.ph/ucs-ustp-empowering-scholars-with-innovative-food-security-initiatives/" },
  },
  {
    id: "pagkat-on",
    wave: "community",
    kind: "Community",
    tag: "Program director",
    tone: "pink",
    role: "PAGKAT-ON: SCHOOL OF ISDA",
    org: "University City Scholars · academic outreach",
    dates: "Sep 2023 to present",
    desc: "A train-the-trainer academic outreach program: peer mentoring, curriculum design and volunteer management for scholars. I directed it from 2023 to 2025 and now advise it.",
    highlights: ["Train-the-trainer model", "Curriculum design", "Volunteer management", "CEDO Kinanao Awardee 2026"],
    photos: [
      { file: "/images/projects/pagkat-on-1.webp", alt: "The Pagkat-on team with their certificates and trophy at the CEDO awards", label: "pagkat-on 1" },
      { file: "/images/projects/pagkat-on-2.webp", alt: "Pagkat-on: School of ISDA shown on the CEDO awards screen", label: "pagkat-on 2", fit: "contain" },
      { file: "/images/projects/pagkat-on-3.webp", alt: "A Gabay Turo ni Isko session of Pagkat-on: School of ISDA", label: "pagkat-on 3", fit: "contain" },
    ],
    link: { label: "Facebook video", href: "https://www.facebook.com/share/v/1NvSv2vp9C/" },
  },
  {
    id: "cs3-congress",
    wave: "community",
    kind: "Governance",
    tag: "Founding convenor",
    tone: "green",
    role: "1ST CS³ CONGRESS",
    org: "Computer Science Student Society, USTP CDO",
    dates: "2024 to 2025",
    desc: "As Vice President for Internal Affairs I wrote the CS3 CBL 2025, resolutions and bills, and convened the society's first legislative body, now the 1st CS³ Congress.",
    highlights: ["Authored the CS3 CBL 2025", "Bills and resolutions", "First legislative body", "Later Electoral Commissioner"],
    photos: [
      { file: "/images/projects/cs3-congress-1.webp", alt: "Cover of the CS³ USTP-CDO Constitution and Bylaws 2025", label: "cs3-congress 1", fit: "contain" },
      { file: "/images/projects/cs3-congress-2.webp", alt: "CS³ update: the legislative body passes CS³ Bill No. 001 in its 6th regular session", label: "cs3-congress 2", fit: "contain" },
      { file: "/images/projects/cs3-congress-3.webp", alt: "BS Computer Science students of USTP CDO in a group photo", label: "cs3-congress 3" },
    ],
    link: { label: "Facebook post", href: "https://www.facebook.com/share/p/1C34ARTQY7/" },
  },
  // ---------- 05 Awards ----------
  {
    id: "batang-lider",
    wave: "awards",
    kind: "Award",
    tag: "National",
    tone: "pink",
    role: "YOUTH LEADERSHIP EXCELLENCE AWARD",
    org: "Batang Lider · Junior Chamber International Philippines",
    dates: "2026",
    desc: "A Batang Lider awardee, recognized by JCI Philippines and Palawan Pawnshop and presented by Senator JV Ejercito.",
    highlights: ["Batang Lider Awardee", "JCI Philippines", "Palawan Pawnshop"],
    photos: [
      { file: "/images/projects/awards-medals.webp", alt: "The Batang Lider YLEA medal and the CEDO Volunteer of the Year medal on the Volunteer of the Year certificate", label: "Medals", fit: "contain" },
    ],
  },
  {
    id: "volunteer-of-the-year",
    wave: "awards",
    kind: "Award",
    tag: "City",
    tone: "green",
    role: "VOLUNTEER OF THE YEAR",
    org: "2026 CEDO Kinanao Leadership Awards",
    dates: "2026",
    desc: "Named Volunteer of the Year at Cagayan de Oro's city leadership awards.",
    highlights: ["Volunteer of the Year", "CEDO Kinanao Awards"],
    photos: [
      { file: "/images/projects/kinanao-volunteer.webp", alt: "Adrian's awardee slide at the CEDO Kinanao Awards 2026", label: "Kinanao awardee slide", fit: "contain" },
      { file: "/images/projects/awards-medals.webp", alt: "The Batang Lider YLEA medal and the CEDO Volunteer of the Year medal on the Volunteer of the Year certificate", label: "Medals", fit: "contain" },
    ],
  },
  {
    id: "award-pagkat-on",
    wave: "awards",
    kind: "Award",
    tag: "City",
    tone: "pink",
    role: "OUTSTANDING SCHOOL-BASED PROJECT",
    org: "2026 CEDO Kinanao Leadership Awards · Pagkat-on: School of ISDA",
    dates: "2026",
    desc: "Pagkat-on: School of ISDA, the University City Scholars' academic outreach program I directed, was named Outstanding School-based Project.",
    highlights: ["Program Director, 2023 to 2025", "Outstanding School-based Project", "University City Scholars"],
    photos: [
      { file: "/images/projects/pagkat-on-1.webp", alt: "The Pagkat-on team with their certificates and trophy at the CEDO awards", label: "Pagkat-on award 1" },
      { file: "/images/projects/pagkat-on-2.webp", alt: "Pagkat-on: School of ISDA shown on the CEDO awards screen", label: "Pagkat-on award 2", fit: "contain" },
    ],
  },
  {
    id: "award-agrivanture",
    wave: "awards",
    kind: "Award",
    tag: "Gold",
    tone: "green",
    role: "OUTSTANDING PROJECT OF THE YEAR",
    org: "2026 USTP Kahamili Leadership Awards · AgriVANture",
    dates: "2026",
    desc: "Gold for AgriVANture, the city-wide youth agriculture program I lead with the 4-H Club USTP-CDO. The third year in a row a project I worked on won at the Kahamili Awards.",
    highlights: ["Founder and Program Director, 2025 to 2026", "Gold Awardee", "3rd year in a row"],
    photos: [
      { file: "/images/projects/agrivanture-2.webp", alt: "The AgriVANture team on stage at the Kahamili Awards, Gold, Outstanding Project of the Year", label: "AgriVANture award" },
    ],
  },
  {
    id: "award-agricare",
    wave: "awards",
    kind: "Award",
    tag: "University",
    tone: "pink",
    role: "OUTSTANDING PROJECT OF THE YEAR",
    org: "2025 USTP Kahamili Leadership Awards · AgriCARE",
    dates: "2025",
    desc: "Project of the Year for AgriCARE, the 4-H Club USTP-CDO school urban farm I co-headed.",
    highlights: ["Co-head, 2025", "Project of the Year", "4-H Club USTP-CDO"],
    photos: [
      { file: "/images/projects/agricare-3.webp", alt: "The AgriCARE team at the Kahamili Awards, Outstanding Project of the Year", label: "AgriCARE award 1" },
      { file: "/images/projects/agricare-1.webp", alt: "An acceptance speech on stage at the Kahamili Awards with the 4-H Club team", label: "AgriCARE award 2" },
    ],
  },
  {
    id: "award-project-3k",
    wave: "awards",
    kind: "Award",
    tag: "University",
    tone: "green",
    role: "BEST PROGRAM AWARD",
    org: "2024 USTP Kahamili Leadership Awards · Project 3K",
    dates: "2024",
    desc: "Best Program Award for Project 3K, the University City Scholars' food security project where I managed events and partnerships.",
    highlights: ["Core team, Events Lead, 2023 to 2025", "Best Program Award", "University City Scholars"],
    photos: [
      { file: "/images/projects/award-project-3k-1.webp", alt: "The Project 3K team on stage at the Kahamili Awards, Best Program Award", label: "Project 3K award" },
    ],
  },
]
