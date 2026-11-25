// D-020: certificates and badges. Each card links to the issuer so anyone can verify it.
// Name a course as the issuer does, and say plainly when it is one part of a longer track.

export type Certificate = {
  id: string
  title: string
  issuer: string
  // What it is, in plain words (e.g. which part of a series).
  note: string
  issued: string
  hours?: number
  badge: { file: string; alt: string }
  verify: { label: string; href: string }
}

export const certificates: Certificate[] = [
  {
    id: "ccna-itn",
    title: "CCNA: Introduction to Networks",
    issuer: "Cisco Networking Academy",
    note: "Course 1 of 3 in the CCNA series, taken at USTP.",
    issued: "Jul 22, 2026",
    hours: 70,
    badge: { file: "/images/certificates/ccna-itn-badge.webp", alt: "Cisco Networking Academy verified badge: CCNA: Introduction to Networks" },
    verify: { label: "Verify on Credly", href: "https://www.credly.com/badges/6859afe9-252b-433e-97b7-d9d47acaf2e7" },
  },
]
