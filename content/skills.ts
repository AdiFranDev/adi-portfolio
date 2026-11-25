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
  { id: "javascript", name: "JavaScript", logo: "/logos/tools/javascript.svg", color: "#C9A800" },
  { id: "java", name: "Java", logo: "/logos/tools/java.png", color: "#E76F00" },
  { id: "r", name: "R", logo: "/logos/tools/r.svg", color: "#276DC3" },
  { id: "react", name: "React", logo: "/logos/tools/react.svg", color: "#1FA2C9" },
  { id: "nextdotjs", name: "Next.js", logo: "/logos/tools/nextdotjs.svg", color: null },
  { id: "tailwindcss", name: "Tailwind CSS", logo: "/logos/tools/tailwindcss.svg", color: "#06B6D4" },
  { id: "nodedotjs", name: "Node.js", logo: "/logos/tools/nodedotjs.svg", color: "#5FA04E" },
  { id: "flutter", name: "Flutter", logo: "/logos/tools/flutter.svg", color: "#02569B" },
  { id: "pytorch", name: "PyTorch", logo: "/logos/tools/pytorch.svg", color: "#EE4C2C" },
  { id: "tensorflow", name: "TensorFlow", logo: "/logos/tools/tensorflow.svg", color: "#FF6F00" },
  { id: "networkx", name: "NetworkX", logo: "/logos/tools/networkx.png", color: "#2C7FB8" },
  { id: "openstreetmap", name: "OpenStreetMap", logo: "/logos/tools/openstreetmap.svg", color: "#7EBC6F" },
  { id: "arduino", name: "Arduino", logo: "/logos/tools/arduino.svg", color: "#00878F" },
  { id: "espressif", name: "ESP32", logo: "/logos/tools/espressif.svg", color: "#E7352C" },
  { id: "supabase", name: "Supabase", logo: "/logos/tools/supabase.svg", color: "#3FCF8E" },
  { id: "postgresql", name: "PostgreSQL", logo: "/logos/tools/postgresql.svg", color: "#4169E1" },
  { id: "firebase", name: "Firebase", logo: "/logos/tools/firebase.svg", color: "#DD2C00" },
  { id: "git", name: "Git", logo: "/logos/tools/git.svg", color: "#F03C2E" },
  { id: "figma", name: "Figma", logo: "/logos/tools/figma.svg", color: "#F24E1E" },
  { id: "vercel", name: "Vercel", logo: "/logos/tools/vercel.svg", color: null },
  { id: "canva", name: "Canva", logo: "/logos/tools/canva.png", color: "#00C4CC" },
  { id: "claude", name: "Claude", logo: "/logos/tools/claude.png", color: "#D97757" },
  { id: "gemini", name: "Gemini", logo: "/logos/tools/gemini.png", color: "#8E75B2" },
  { id: "antigravity", name: "Antigravity", logo: "/logos/tools/antigravity.png", color: "#3186FF" },
]

// Skills, in Adrian's words.
export const skills: string[] = [
  "Scholar-student-leader",
  "Constitutional Drafting",
  "Grant Acquisition",
  "Policy & Legislation",
  "Program Direction",
  "Agri-Tech Outreach",
  "Electoral Governance",
  "Social Innovation",
  "Parliamentary Governance",
  "Stakeholder Partnerships",
  "Institutional Advocacy",
  "Community Mobilization",
  "Legal & Procedural Oversight",
  "SDG Implementation",
]

// Organization logos in /public/logos/orgs (SVG or PNG with a transparent background).
export const affiliations: { id: string; name: string; logo: string }[] = [
  { id: "ustp", name: "USTP Cagayan de Oro", logo: "/logos/orgs/ustp.png" },
  { id: "4h", name: "4-H Club USTP-CDO", logo: "/logos/orgs/4h.png" },
  { id: "cs3", name: "Computer Science Student Society", logo: "/logos/orgs/cs3.png" },
  { id: "ucs", name: "University City Scholars", logo: "/logos/orgs/ucs.png" },
  { id: "fresco", name: "Fresco Greenovations Inc.", logo: "/logos/orgs/fresco.png" },
  { id: "cdo-scholarship", name: "Cagayan de Oro City Scholarship Program", logo: "/logos/orgs/cdo-scholarship.png" },
  { id: "ched-unifast", name: "CHED-UniFAST", logo: "/logos/orgs/ched-unifast.png" },
]

// D-019: the Skills grid groups tools by kind, in this order. Ids match `tools`.
export const toolGroups: { name: string; ids: string[] }[] = [
  { name: "Languages", ids: ["python", "cplusplus", "typescript", "javascript", "java", "r"] },
  { name: "Web and apps", ids: ["react", "nextdotjs", "tailwindcss", "nodedotjs", "flutter", "supabase", "postgresql", "firebase", "vercel"] },
  { name: "Data and AI", ids: ["pytorch", "tensorflow", "networkx", "openstreetmap", "claude", "gemini", "antigravity"] },
  { name: "Hardware", ids: ["arduino", "espressif"] },
  { name: "Design and tools", ids: ["git", "figma", "canva"] },
]
