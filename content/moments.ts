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

const slot = (id: string, label: string): PhotoSpec => ({
  file: `/images/moments/${id}.webp`,
  alt: label,
  label: `${label}. Longest side 1600`,
})

export const moments: Moment[] = [
  { id: "csek-defense", category: "researcher", caption: "[Caption]", photo: slot("csek-defense", "CSEK presentation or research defense"), x: 110, y: 220, w: 220, h: 250, r: -6 },
  { id: "lab-session", category: "researcher", caption: "[Caption]", photo: slot("lab-session", "Coding or lab session"), x: 400, y: 200, w: 200, h: 170, r: 4 },
  { id: "4h-outreach", category: "leader", caption: "[Caption]", photo: slot("4h-outreach", "4-H outreach in a barangay"), x: 830, y: 190, w: 220, h: 240, r: 5 },
  { id: "awarding", category: "leader", caption: "[Caption]", photo: slot("awarding", "Awarding: Kahamili or Batang Lider"), x: 1120, y: 220, w: 220, h: 210, r: -3 },
  { id: "farm-work", category: "leader", caption: "[Caption]", photo: slot("farm-work", "Hands-on farm work"), x: 260, y: 520, w: 230, h: 200, r: 3 },
  { id: "cs3-congress", category: "leader", caption: "[Caption]", photo: slot("cs3-congress", "CS³ congress or event"), x: 520, y: 560, w: 170, h: 190, r: -5 },
  { id: "friends-family", category: "me", caption: "[Caption]", photo: slot("friends-family", "Casual: friends or family"), x: 820, y: 520, w: 190, h: 210, r: 6 },
  { id: "hobby-travel", category: "me", caption: "[Caption]", photo: slot("hobby-travel", "A hobby or travel photo"), x: 1060, y: 470, w: 200, h: 180, r: -4 },
]
