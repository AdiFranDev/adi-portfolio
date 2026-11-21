import type { PhotoSpec } from "@/lib/photos"

export type MomentCategory = "researcher" | "leader" | "me"

export type Moment = {
  id: string
  category: MomentCategory
  caption: string
  photo: PhotoSpec
  // Desktop position on the 1440 × 900 stage, as in the wireframe.
  x: number
  y: number
  w: number
  h: number
  r: number
}

export const momentCategories: { id: MomentCategory; label: string }[] = [
  { id: "researcher", label: "Researcher" },
  { id: "leader", label: "Leader" },
  { id: "me", label: "Me" },
]

const m = (id: string, alt: string): PhotoSpec => ({
  file: `/images/moments/${id}.webp`,
  alt,
  label: alt,
})

export const moments: Moment[] = [
  { id: "speaking", category: "leader", caption: "Mic in hand, 4-H shirt on.", photo: m("speaking", "Adrian speaking into a microphone in a green 4-H shirt"), x: 110, y: 220, w: 220, h: 250, r: -6 },
  { id: "kinanao-2024", category: "leader", caption: "Kinanao Awards 2024: Outstanding School-based Organization, University City Scholars.", photo: m("kinanao-2024", "Adrian holding the Kinanao Awards 2024 trophy and certificate for University City Scholars"), x: 400, y: 200, w: 200, h: 170, r: 4 },
  { id: "agrivanture-thanks", category: "leader", caption: "Thanking the Masigasig Women's Association at AgriVANture.", photo: m("agrivanture-thanks", "The AgriVANture team handing a certificate of appreciation to the Masigasig Women's Association"), x: 830, y: 190, w: 220, h: 240, r: 5 },
  { id: "kinanao-team", category: "leader", caption: "The University City Scholars crew at the Kinanao Awards.", photo: m("kinanao-team", "University City Scholars officers with their Kinanao Awards trophy and certificate"), x: 1120, y: 220, w: 220, h: 210, r: -3 },
  { id: "barong", category: "me", caption: "Barong on, hands up.", photo: m("barong", "Adrian in a barong, smiling in front of a flower wall"), x: 260, y: 520, w: 230, h: 200, r: 3 },
  { id: "liceo-grad", category: "me", caption: "Senior high graduation, Liceo de Cagayan University.", photo: m("liceo-grad", "Adrian and two friends in Liceo de Cagayan University graduation gowns"), x: 520, y: 560, w: 170, h: 190, r: -5 },
  { id: "school-days", category: "me", caption: "Early school days.", photo: m("school-days", "Young Adrian with a classmate, both in school uniforms"), x: 820, y: 520, w: 190, h: 210, r: 6 },
  { id: "little-adrian", category: "me", caption: "Little Adrian, same grin.", photo: m("little-adrian", "Adrian as a small child, smiling at the camera"), x: 1060, y: 470, w: 200, h: 180, r: -4 },
]
