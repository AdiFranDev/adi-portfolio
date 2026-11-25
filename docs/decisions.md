# Decisions

Settled choices for this repo. Accepted entries are the source of truth; a superseded entry stays as history and names the entry that replaced it. The full section specs live in `docs/portfolio-requirements.md`; where an entry here disagrees with that file, this file wins.

Format: ID, title, status, date, then the decision and what it changes.

---

## D-001 Stack

**Status:** Accepted · 2026-11-18

Next.js 16 App Router with Turbopack, React 19, TypeScript 6 strict, Tailwind CSS v4, shadcn `base-nova` on `@base-ui/react`, `next-themes`, `@next/mdx`, Resend through a Server Action, Playwright, npm, Vercel. Details: `docs/portfolio-requirements.md` section 2 and `docs/setup.md`.

---

## D-010 Brand v2: deep green leads, pink accents, pearl ground

**Status:** Accepted · 2026-11-23 · supersedes requirements section 5.4

- **Ground:** pearl white `#F8F7F3`.
- **Main color:** deep green `#012A23` for buttons, the active state, dark cards and graph edges.
- **Accent:** pink `#C32777`, used rarely: ADRIAN, the ribbon, links, one highlighted word, the graph walk. Pink text on pearl uses `#A8205F`. At most one large pink moment per screen.
- **Fonts:** unchanged (Bricolage Grotesque, Geist, Geist Mono, Caveat).
- **Dark mode:** deep green-black ground, pearl text, mint main color, lighter pink accent.
- Explored and approved on the "Portfolio branding tests" design canvas.

## D-011 Logo: ribbon

**Status:** Accepted · 2026-11-23

The favicon and site logo is a rounded ribbon: a pink loop and a green loop, a pearl knot, two notched tails. It replaces the red bow favicon and the Home button in the nav.

## D-012 Background: pearl with a faint facet texture

**Status:** Accepted · 2026-11-23

A fixed layer of thin triangle facets following invisible contour lines, at low opacity, with a few faint green and pink faces. It bursts outward once on page load. It replaces the drifting glow and grain backdrop. Reduced motion: no burst.

## D-013 Motion library

**Status:** Accepted · 2026-11-23 · amends requirements section 2 ("motion library only if approved")

Adrian approved `motion` (formerly Framer Motion), imported from `motion/react`, for the motion-heavy parts only: the intro, the nav ribbon drop, the hero scroll, the About graph walk, and the work detail pop-up. Hovers and small UI feedback stay in CSS. Every Motion animation respects `prefers-reduced-motion`. Install: `npm i motion`.

## D-014 Intro: graphs that become F-A-E

**Status:** Accepted · 2026-11-23 · supersedes requirements section 4.0

Four small graphs appear, their nodes travel into place and edges draw the letters F, A and E, the full name fades in, and the overlay clears, in about 4 seconds, once per session, with a Skip button. Removed: the "Isang makabata't" greeting, "Hello world", the glitch, UNIVERSE, and the reaction cameo.

## D-015 Nav: ribbon drop

**Status:** Accepted · 2026-11-23 · supersedes requirements section 4.9 on desktop

Desktop: no nav over the hero. Past the hero, the ribbon drops on a short pink string, the bar opens outward from it (clip-path), the string retracts, and the ribbon vanishes in place (revised 2026-11-23: it no longer moves into the bar). Links: Home, About, Portfolio (with the sections menu), Contact (outlined), theme toggle. Scrolling back up reverses it. The phone nav keeps its current menu.

## D-016 Hero: line drawings, campus then farm

**Status:** Accepted · 2026-11-23 · supersedes requirements sections 4.1 and 4.2

Pearl hero with the campus and farm photos converted to deep-green line drawings. Campus first, with Adrian in the CS shirt; scrolling zooms into the campus, the shirt changes, and the scene ends on the farm in the 4-H shirt. The hero graph moves to About (D-017).

## D-017 About: the graph walk

**Status:** Accepted · 2026-11-23 · supersedes requirements section 4.3

Adrian's photo sits inside the graph (Researcher, Scholar, Urban farms, Initiative, Creative Developer, Student-Leader, Program Director, Action, Empathy, Impact). Hovering or focusing a node shows its photo and note. On reaching Impact the photo changes to the green-shirt photo (see revision 2 for how the graph appears). Below: "Two scholarships, three organizations, five languages" (scholarships, organizations, languages), then the full Education timeline. The Reveal photo flip is removed.

2026-11-23 revision: the stage is 1600 × 720 so the nodes spread wider, and the walk finishes when the middle of the graph reaches 60% of the screen height, so less scrolling is needed.

2026-11-23 revision 2: the graph grows instead of being walked, in about 19 seconds. It starts empty; Empathy pops up inside the photo. Dots travel out along dotted lines, to Initiative and Action first, then on to the other nodes, and each node pops in as its dot arrives. Before the tree is done, more dots add links within each side (left nodes to left nodes, right to right, no lines crossing). Every dot then walks home to Empathy, the dotted lines turn solid, and one last dot carries a pink line down to Impact, which pops up beneath the photo as the photo changes to the 4-H shirt. Start times and speeds vary per dot so nothing moves in lockstep. It plays once when the graph comes into view; Replay, centred under the graph, plays it again. Nodes are numbered in the order they appear. View CV moved out of About into the Selected work filter row, just after Awards (2026-11-24).

## D-018 Work: word zoom, then bento and a detail pop-up

**Status:** Accepted · 2026-11-23 · supersedes requirements sections 4.4 and 4.5

Revised 2026-11-24: the EXPERIENCES and SELECTED WORK word scenes are removed. Each section opens with a small label and a title, like About and Skills: "Where I've done the work" and "Things I've built and led". The pinned side-scroll card track is replaced by a bento grid of mixed card sizes, the photo tilted in the card's corner, many works per screen, with category filters for Selected work. A card opens a detail pop-up: photo gallery, dates, role, organization, what I did, highlights, notes, link buttons, Previous and Next. Community photos show the activity first and the award second.

2026-11-23 revision: when only two cards show, they sit side by side at equal width and full height, photo on top and text below. Experiences photos are not tilted.

## D-019 Section order, Skills, Moments, Contact, Footer

**Status:** Accepted · 2026-11-23 · supersedes requirements sections 3.1, 4.6, 4.7, 4.8, 4.8b

- Order: Intro, Hero, About, Experiences, Selected work, Skills, Moments, Contact, Footer.
- Skills: the drifting carousels are back (revised 2026-11-23): one row of tool logos, then two rows of skills moving in opposite directions, then a row of affiliations (back in Skills as well as About). Drag or arrow keys move a row; hover or focus pauses it.
- Moments: an aligned photo grid with captions always visible. No tilted photos or centre logo.
- Contact: heading, form, and three large link cards (LinkedIn, GitHub, Google Scholar). The Empathy, Initiative, Action list is removed.
- Footer: ribbon logo, one quote, social icons, dedication, Explore links, the cat basket.

## D-020 Certificates

Status: accepted, 2026-11-24.

- A Certificates section sits after Experiences and before Selected work, opened by a small label and the title "Certificates and badges", like the other sections. It is listed in the nav's Portfolio menu.
- Heading: "Certificates and badges". One card per item: badge, issuer, title, a plain note, issued date, hours, and a button to verify with the issuer.
- Wording: courses are named exactly as the issuer names them, and a course that is one part of a longer track says so. "CCNA: Introduction to Networks" is a Cisco Networking Academy course (course 1 of 3), not the CCNA certification (Cisco exam 200-301), and the card says "Course 1 of 3 in the CCNA series".
- Data lives in content/certificates.ts; adding a certificate is one new entry plus its badge image in public/images/certificates/.
