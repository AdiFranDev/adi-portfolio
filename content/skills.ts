// Skills, talents, and affiliations (spec 4.7). Everything here builds up to Contact.

/**
 * Tool logos come from Simple Icons (CC0), saved as files in /public/logos/tools.
 * `color` is the brand color shown when a logo lights up; null uses the text
 * color (for black logos, so they stay visible in dark mode).
 * `logo: null` means Simple Icons has no logo for that brand: upload an SVG to
 * /public/logos/tools/<id>.svg and set `logo` to its path.
 */
export const tools: { id: string; name: string; logo: string | null; color: string | null }[] = [
  { id: "python", name: "Python", logo: "/logos/tools/python.svg", color: "#3776AB" },
  { id: "cplusplus", name: "C++", logo: "/logos/tools/cplusplus.svg", color: "#00599C" },
  { id: "typescript", name: "TypeScript", logo: "/logos/tools/typescript.svg", color: "#3178C6" },
  { id: "java", name: "Java", logo: null, color: null },
  { id: "react", name: "React", logo: "/logos/tools/react.svg", color: "#1FA2C9" },
  { id: "nextdotjs", name: "Next.js", logo: "/logos/tools/nextdotjs.svg", color: null },
  { id: "nodedotjs", name: "Node.js", logo: "/logos/tools/nodedotjs.svg", color: "#5FA04E" },
  { id: "flutter", name: "Flutter", logo: "/logos/tools/flutter.svg", color: "#02569B" },
  { id: "pytorch", name: "PyTorch", logo: "/logos/tools/pytorch.svg", color: "#EE4C2C" },
  { id: "supabase", name: "Supabase", logo: "/logos/tools/supabase.svg", color: "#3FCF8E" },
  { id: "postgresql", name: "PostgreSQL", logo: "/logos/tools/postgresql.svg", color: "#4169E1" },
  { id: "firebase", name: "Firebase", logo: "/logos/tools/firebase.svg", color: "#DD2C00" },
  { id: "git", name: "Git", logo: "/logos/tools/git.svg", color: "#F03C2E" },
  { id: "figma", name: "Figma", logo: "/logos/tools/figma.svg", color: "#F24E1E" },
  { id: "vercel", name: "Vercel", logo: "/logos/tools/vercel.svg", color: null },
  { id: "canva", name: "Canva", logo: null, color: null },
]

// Community leadership skills and talents, in Adrian's words.
export const leadership: string[] = [
  "Legislation",
  "Parliamentary procedure",
  "Project creation",
  "Spearheading",
  "Grant proposal creation",
  "Public speaking",
  "Student-scholar-leader",
]

// Organization logos: Adrian uploads them (SVG first) to /public/logos/orgs/<id>.svg.
export const affiliations: { id: string; name: string; logo: string }[] = [
  { id: "ustp", name: "USTP Cagayan de Oro", logo: "/logos/orgs/ustp.svg" },
  { id: "4h", name: "4-H Club USTP-CDO", logo: "/logos/orgs/4h.svg" },
  { id: "cs3", name: "Computer Science Student Society", logo: "/logos/orgs/cs3.svg" },
  { id: "ucs", name: "University City Scholars", logo: "/logos/orgs/ucs.svg" },
  { id: "fresco", name: "Fresco Greenovations Inc.", logo: "/logos/orgs/fresco.svg" },
  { id: "cdo-scholarship", name: "Cagayan de Oro City Scholarship Program", logo: "/logos/orgs/cdo-scholarship.svg" },
  { id: "ched-unifast", name: "CHED-UniFAST", logo: "/logos/orgs/ched-unifast.svg" },
]
