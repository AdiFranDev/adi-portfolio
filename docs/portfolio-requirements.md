# adi-portfolio: requirements and flow

**Owner:** Francis Adrian Esteban (Adrian)
**Version:** 1.0, 2026-11-21
**Design source:** the "adi-portfolio wireframe" canvas. Every desktop and phone board has a sticky note with the same details as this file.
**Brand source:** `brand-guidelines.md` (tokens, type, voice, 60-30-10).
**Status:** wireframe approved for implementation. Items marked **[ADRIAN]** need input from Adrian before or during the build.

---

## 0. How to use this file

- Claude Code reads this file before building any section. The section specs (part 4) are the acceptance criteria.
- Build one section at a time, in the order of part 9. Check each section at 390, 768, 1024, 1440 and 1920 px with Playwright before moving on.
- Never invent content. Anything missing stays as a visible `[PLACEHOLDER]` and goes on the list in part 8.
- Images, icons and logos follow part 6. Ask Adrian before adding any asset that is not listed there.

---

## 1. Goal and audience

A one-page personal portfolio that shows all of Adrian: the researcher, the community leader, and the creative developer. It should feel "extra" (motion, personality, local language) while staying fast and accessible.

| Audience | What they need within 30 seconds |
|---|---|
| Recruiters and internship hosts (tech, supply chain) | Who he is, what he builds, the CV, a way to reach him |
| Research advisers and panels | The research (AI, graph theory, network flow), the thesis, method and results |
| Scholarship, fellowship and youth programs | Leadership, community projects, awards, scholarships |
| Peers and organizations | The personality, the projects, the links |

---

## 2. Stack and project rules

| Area | Choice |
|---|---|
| Framework | Next.js 16.4.6, App Router, React 19.3.1, TypeScript 6.0.3 strict |
| Runtime | Node 26.13.1 |
| Styling | Tailwind 4.3.5, shadcn/ui (Base UI, base-nova, neutral base), tw-animate-css |
| Icons | Lucide (`lucide-react`, the shadcn default) |
| Fonts | Bricolage Grotesque (headings), Geist and Geist Mono (body, labels), Noto Sans JP (subset: 日本語 only), all through `next/font` |
| Theme | `next-themes`, class strategy, light default, respects the system setting |
| Content | `@next/mdx` for long case studies; typed data files for cards |
| Email | Resend 6.39.0 from a Server Action |
| Quality | ESLint 10, Playwright for every breakpoint |
| Package manager | npm |
| Hosting | Vercel |

Project rules that apply to every task:

- Git: short commit messages, no co-author lines.
- Never read `.env.local`. Adrian sets secrets himself.
- Public personal info is limited to name, school, city-level location and links. No phone number, home address or personal email on the site.
- Minimal solution: no new dependency, abstraction or library without asking. Motion is CSS plus the Web Animations API first. A motion library (Motion, GSAP) only if Adrian approves it for a specific section.
- No em dashes in interface copy.

---

## 3. Site flow

### 3.1 Page order

One page, one vertical scroll. Each section has an anchor id.

| # | Section | Anchor | Nav item lit |
|---|---|---|---|
| 0 | Loading intro (first visit only, overlay) | none | nav hidden |
| 1 | Hero, before scroll (frame 1) | `#home` | Home |
| 2 | Hero, after one scroll (frame 2) | `#home` | Home |
| 3 | About, then Who I am | `#about`, `#who-i-am` | About |
| 4 | Experiences (side scroll) | `#experiences` | Portfolio |
| 5 | Selected work (side scroll, three waves) | `#projects` | Portfolio |
| 6 | Moments (lettuce, then photo burst) | `#moments` | Portfolio |
| 7 | Skills and affiliations | `#skills` | Portfolio |
| 8 | Contact and footer | `#contact` | Contact |

### 3.2 Flow, start to finish

```
first visit?
 ├─ yes → 0 Intro (about 5 s, skippable) ─┐
 └─ no  ──────────────────────────────────┤
                                          ▼
               1 Hero frame 1 (photo layers, no text)
                    │ first scroll ("boom": the zoom-out)
                    ▼
               2 Hero frame 2 (name, cutout, CTAs)
                    ▼
               3 About (photo blend) → Who I am (3 timelines)
                    ▼
               4 Experiences: vertical scroll moves cards sideways
                    ▼
               5 Selected work: wave 1 Development → 2 Community → 3 Awards
                    ▼
               6 Moments: blank → lettuce pops → photos burst
                    ▼
               7 Skills: categories + tool and affiliation marquees
                    ▼
               8 Contact: form, links, footer
```

The nav (Home, About, Portfolio, Contact, the ⋯ menu, the theme toggle) can jump to any point at any time. The ⋯ menu lists Experiences, Selected work, Moments and Skills.

### 3.3 Scroll model

- **Hero (1 to 2):** one sticky scene about 180vh tall. The first scroll plays the zoom from frame 1 to frame 2, and scroll snapping lands on frame 2. The page is never scroll-locked: wheel, trackpad, keys and the scrollbar all work.
- **Experiences and Selected work:** each section is pinned while the visitor scrolls down. Vertical progress moves the card track sideways. When the last card is reached, the section unpins and normal scrolling continues.
- **Every other section:** normal scrolling, with one entrance animation each, played once.
- **Anchor jumps** (nav, ⋯ menu, CTAs) use smooth scrolling and land at the start of the section, with the sticky nav height as the offset (`scroll-margin-top`).

### 3.4 Motion rules (all sections)

- Durations: 150 to 250 ms for UI feedback, 400 to 800 ms for entrances, about 14 s for the intro (slow and subtle).
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` for entrances, `ease-out` for UI.
- Animate only `transform`, `opacity`, `filter` and `clip-path`. No animating width, height, top or left.
- Entrances play once per page load. Use IntersectionObserver at about 25% visibility.
- **`prefers-reduced-motion: reduce`:** no intro, no hero zoom, no side scroll (cards become a normal swipe row), no glitch jitter, no marquee movement, no burst. Content appears instantly or with a 150 ms fade.
- No motion may hide content from screen readers or keyboard users. All text is real text in the DOM from the start.

---

## 4. Section specs

Each spec lists: purpose, transition in, contents, interaction, transition out, phone version, assets needed, and acceptance checks.

### 4.0 Loading intro

**Purpose:** a short, playful signature: his research (a graph), his home (Filipino greeting), his first program (Hello world), and his wink (UNIVERSE).

**When:** the first visit in a browser session only (a `sessionStorage` flag). Never on reloads within the session. Never with reduced motion.

**Sequence (about 14 s total, slow and subtle):** `UNIVERSE` sits on the same baseline as `Hello`; the cameo is large (about 310 × 380 on desktop).

| Beat | Time | What happens |
|---|---|---|
| 0 · FAE graph | 0.0 to 4.6 s | Pink nodes pop in softly (600 ms each, 100 ms apart) and green edges draw between them until the graph spells **FAE**; dashed links join the letters; it holds, then fades over 800 ms. |
| 1 · Greeting | 4.4 to 7.2 s | `Isang makabata't makakalikasang araw!` rises in (8 px, 1 s), holds, fades over 600 ms. `lang="fil"`. |
| 2 · Hello world | 7.2 to 9.0 s | Typed 120 ms a letter in Geist Mono, with a blinking caret. |
| 3 · Glitch | 9.0 to 10.0 s | "world" glitches (small 2 px jitters, 500 ms) and becomes **UNIVERSE**. |
| 4 · Cameo | 10.2 to 12.0 s | The cameo slides in with a slight tilt, holds, slides out. **[ADRIAN] adds the photo.** |
| 5 · Dissolve | 12.2 to 14.0 s | UNIVERSE grows outward, blurs and fades; hero frame 1 sharpens underneath. |

**Transition out:** the overlay is removed, with no "welcome" screen in between. The nav fades in (200 ms). Hero frame 1 is now static and waits for the first scroll.

**Controls and accessibility:**
- A **Skip intro** button (44 px tall) is the first focusable element, visible from 0 s. Esc also skips.
- The overlay is `aria-hidden="true"`. A visually hidden live text reads "Francis Adrian Esteban, portfolio".
- The page underneath renders normally. The intro is a client overlay, so it adds no layout shift and does not block LCP.

**Phone:** the same six beats and timing, scaled down.

**Assets:** the cameo image. The FAE graph is inline SVG (node coordinates are in the Loader board).

**Done when:** it plays once per session, Skip and Esc work, reduced motion skips it, and total time is about 14 s.

### 4.1 Hero, before scroll (frame 1)

**Purpose:** a cinematic opening: the visitor steps out of a field and sees Adrian from behind.

**Contents (three photo layers, back to front):**
1. Background: the USTP campus (glass tower), upscaled for sharpness. No logo.
2. Adrian cutout seen from behind (transparent).
3. Foreground garden (transparent): Adrian's chosen garden image (bushes with hibiscus, bells and tomatoes on both sides, a flower meadow in the middle), upscaled and cut into three feathered pieces where the bushes meet the meadow: left 0-40%, middle 34-66%, right 60-100%. At rest they line up into one picture, a little larger than the screen and sunk so its soft bottom edge is off-screen; the meadow piece sits lower so the flowers reach Adrian's waist.
4. The nav and a "Scroll" cue. No other text.

**Transition (the "boom", one scroll):** scroll progress 0 to 1 over the sticky scene:
- the garden zooms in toward the viewer (scale 1 to 1.9, centred just below Adrian's shoulders) and fades out as one piece, with no splitting
- the bottom of the scene (photos and cutout) fades to transparent with a soft blur band, so the hero dissolves into the page instead of ending in a hard edge
- background scales 1.15 to 1, and the campus blurs and fades into a farmland photo underneath; a light bone-white wash fades in over the farm so the name and text stay readable; as the farm comes in, Adrian's cutout changes from the black shirt to the 4-H shirt (same pose, crossfade)
- the cutout scales 1 to about 0.92
- the name fades in behind him, which is frame 2

Use CSS scroll-driven animations (`animation-timeline: scroll()`) where the browser supports them, with a small `requestAnimationFrame` scroll handler as the fallback. Check browser support at build time rather than assuming it.

**Phone:** no zoom. Show frame 2 as a static composition (Mobile board).

**Assets:** 4 images **[ADRIAN]** (sizes in part 6).

**Done when:** one scroll reaches frame 2 at 60 fps on a mid-range laptop, the page is never locked, and the LCP image is preloaded with `priority`.

### 4.2 Hero, after one scroll (frame 2)

**Frame 2, the name and the graph.** The greeting (cycling through five languages) sits in a small centred pill just above the name; the pill eases to the width of each greeting. FRANCIS and ADRIAN share one line on desktop (two on phones), same font and size, bottoms aligned. FRANCIS is a field of small tilted ink-coloured dots that build in one by one, mostly left to right, over about 2 seconds when the farm frame arrives (all at once with reduced motion). ADRIAN is solid pink and keeps the ADRIAN to ADIRAWR hover and bite. The hero has no buttons (View CV lives in About). Instead, a graph of seven numbered nodes: 01 Researcher, 02 Community leader, 03 Creative Developer (with hand-written notes, linking to the projects), 04 Algorithms, 05 Urban farms, 06 Student institutions (from the tagline), and 07 Empathy on Adrian's back under the 4-H logo, joined to all six. Side nodes stay clear of Adrian and the name. Curved dotted edges (dark dots on a light casing, visible in both themes) draw in one after another, then drift slowly while small pink runners travel every edge. The tagline stays as screen-reader text on desktop and shows on a sheet on phones. Desktop only for the graph.

- The greeting cycles every 2.8 seconds through Adrian's five languages: English, Cebuano, Filipino, Tagalog, Japanese. Screen readers hear the English one once; reduced motion keeps it still.

**Contents:**
- Status badge (green): **[ADRIAN] confirm wording**, for example "Open to internships".
- The name as the page `<h1>`: "FRANCIS" as a dot matrix (the letters filled with an even, staggered grid of brand-green dots, same typeface and weight as ADRIAN), "ADRIAN" solid pink, set behind the cutout.
- The Adrian cutout in front of the name (stacking: background, name, cutout, then text and nav).
- Greeting line: **[ADRIAN] Cebuano or Waray greeting**.
- Tagline: "Algorithms, urban farms, and student institutions, built with the same care."
- Buttons: **View projects** (pink primary, to `#projects`) and **View CV** (outline, `/cv.pdf`, opens the PDF).
- "Three sides" list: Researcher 01, Community leader 02, Creative Developer 03. Each is a link to its part of the site. The numbers are neutral gray.

**Interaction:** hovering or focusing "ADRIAN" plays the RAWR glitch (4.10).

**Transition out:** normal scrolling into About. The nav active item moves from Home to About.

**Assets:** `/public/cv.pdf` **[ADRIAN]**.

### 4.3 About, then Who I am

**Background (whole page):** one fixed grainy gradient behind every section, in brand pinks and greens, softer on bone in light mode and glowing on the near-black in dark mode. The glows drift and pulse slowly; one follows the pointer and shifts from pink (left) to green (right); everything leans slightly toward the pointer. Film grain on top. No section edges or cuts. Reduced motion: still, no pointer tracking. (src/components/site/grain-backdrop.tsx)

**Transition in:** the section fades up (translateY 24 px, 600 ms). The three Who I am timelines stagger in, 80 ms apart.

**Contents, top block:**
- "Hi, I am" (neutral) and the name as an `<h2>` (the hero holds the `<h1>`).
- A center photo blend: academic photo and community photo.
- Bio **[ADRIAN]**, View CV, View projects.

**Photo blend interaction:** no frame or border; the photo's edges fade into the page. Mouse: a small soft circle follows the cursor (a white dot marks it) and shows the other photo inside it. A **Reveal** button under the photo opens the other photo out of the button as a growing circle, and closes it back on the next press; while revealed, the hover circle shows the academic photo. Touch: a tap does the same as the button. Reduced motion: instant swap.

**Contents, Who I am band (three borderless timelines):** each is a numbered list on a thin rail. As the page scrolls, the step reaching the reading line (62% down the screen) lights up (number filled in ink, full opacity) and the others dim; hover or focus lights a step directly. Reduced motion: every step stays lit. Entries live in `who` in `content/site.ts`; an entry marked `todo` renders in pink until filled in.

| Timeline | Steps, newest first |
|---|---|
| Education | 1 University of Science and Technology of Southern Philippines, Cagayan de Oro: BS Computer Science, 2023 to present, expected graduation June 2027, with tags Dean's Lister (1st sem AY 2024 to 2025; 2nd sem AY 2025 to 2026), Cagayan de Oro City Scholarship Program, CHED-UniFAST Scholarship · 2 Liceo de Cagayan University, Main Campus: Senior High School, STEM strand, 2020 to 2023, Outstanding Student Leadership Award · 3 Gusa Elementary School and East Gusa National High School: primary and secondary education, 2012 to 2020, completed with honors |
| Leadership | 1 4-H Club USTP-CDO: Senior Advisor, former Director of Community Outreach, founding officer · 2 Computer Science Student Society (CS³): Senior Advisor, former VP for Internal Affairs, 1st CS³ Congress · 3 University City Scholars: Senior Advisor for Academic Affairs, former Department Head |
| Languages | 1 Filipino, Tagalog, Bisaya (Cebuano): mother tongues · 2 English: proficient, the language of instruction at university · 3 Nihongo 日本語: beginner, with the live Duolingo streak counter |

**Duolingo streak counter:**
- Day 1 is 2026-04-04, Asia/Manila time. Count = (today in Asia/Manila minus the start date) + 1.
- There is no official public Duolingo API, so the count is computed, not fetched. Keep the start date and an optional manual override in one config constant (`content/streak.ts`), so Adrian can correct it if the streak ever breaks.
- Render it on the server with the Manila date, and revalidate hourly so the page stays static.

**Phone:** one column. The photo blend uses tap or the Reveal button. The cards stack.

**Assets:** 2 matching photos (same size, pose, framing and lighting), the bio. **[ADRIAN]**

### 4.3b Word scenes

Between Who I am and Experiences, a pinned scene shows **EXPERIENCES**: it pops up as you scroll in, holds, then grows outward and fades, revealing the Experiences side scroll. At the end of Experiences the section blurs and fades out, and a second scene brings **SELECTED WORK** into focus out of a blur, then grows outward the same way. Reduced motion: still words, no pin.

### 4.4 Experiences (side scroll)

- A **Certifications** button sits in the header beside the intro line. Certifications are not ready yet: clicking it swaps the label to "Soon" for about 2 seconds (screen readers hear "Certifications: coming soon").

**Transition in:** the section pins. Vertical scroll progress maps to a horizontal translate of the card track. The giant blurred word "EXPERIENCES" sits behind the cards and drifts at about 0.3 times the track speed.

**Contents per card** (from a typed data file, `content/experiences.ts`, so new entries need no layout change):
kind, tag, role, organization, description, 4 highlights, photo, number, dates.

| # | Card | Status |
|---|---|---|
| 01 | Agri-Tech Intern, Fresco Greenovations Inc., Apr to Jul 2026 (4 months). ESP32 sensor networks, Supabase schemas, greenhouse SOPs, Agri-Youth media. | Content ready, photo needed |
| 02 | Mindanao Finalist, 2026 Presidential Filipinovation Awards, with the Fresco team. | 2 more highlights needed **[ADRIAN]** |

**Controls:** a progress bar (neutral ink), an "01 / 02" counter, and prev and next buttons (neutral outline) for keyboard and mouse users. Arrow keys move one card when the track has focus.

**Photos:** shown in black and white, and in color on hover or focus.

**Transition out:** when the last card is fully in view, the section unpins.

**Phone and reduced motion:** no pinning. A native horizontal swipe row with `scroll-snap-type: x mandatory`. The blurred word stays, smaller.

**Assets:** one photo per card **[ADRIAN]**.

### 4.5 Selected work (side scroll, three waves)

Same layout, data shape and behavior as Experiences, for consistency. Data in `content/projects.ts`.

**Categories (buttons):** 01 Highlight (default; the first card of Apps, Research, Community, and Awards: 4 cards), 02 Apps, 03 Research, 04 Community, 05 Awards. Each category shows at most 5 cards, then a "Want to see more?" card: Apps → GitHub, Research → Google Scholar, Community and Awards → Facebook. Profile URLs live once, in `profiles` in `content/site.ts`; missing ones show a highlighted "Add link".

**Details button:** on apps and research cards only, linking to the app, the repo, or the exact source. Until a link is added it shows a highlighted "Add link".

**Content:** CSEK, the thesis, AutoMotif (research); two app slots (apps); AgriVANture, Project 3K, the 1st CS³ Congress (community); Kahamili Outstanding Project 2026, Batang Lider 2026, CEDO Volunteer of the Year 2026 (awards). Details in [brackets] are for **[ADRIAN]**.

**Phone:** the category buttons scroll sideways above a swipe row.

**Assets:** one figure or photo per card **[ADRIAN]**.

### 4.6 Moments

**Scroll-driven (pinned):** at first nothing. Once the scroll reaches the scene, the lettuce pops up; scrolling on brings the photos out of it one by one, and scrolling up sends them back. Near the end the lettuce pops out, then the whole stage zooms in and fades into the next section.

**Contents:** the heading "The lab, the field, and me" and 8 photos, as plain pictures: no frames, captions, filters, or click targets. Photo slots and suggested shots are in `content/moments.ts`.

**Phone:** a two-column grid, with the lettuce over the center.

**Assets:** 8 photos with captions **[ADRIAN]**. The lettuce is an inline SVG (part 6).

**Reduced motion:** no pin; the lettuce and photos simply appear.

### 4.7 Skills and affiliations

No categories (they repeat Experiences and Selected work). This section highlights skills, talents, and affiliations, building up to Contact.

- Heading: "What I bring to the room".
- Three endless rows: **Tools** (logos), **Skills** in two smaller rows drifting in opposite directions (Scholar-student-leader, Constitutional Drafting, Grant Acquisition, Policy & Legislation, Program Direction, Agri-Tech Outreach, Electoral Governance, Social Innovation, Parliamentary Governance, Stakeholder Partnerships, Institutional Advocacy, Community Mobilization, Legal & Procedural Oversight, SDG Implementation), **Affiliations** (logos and names).
- Items rest in a quiet gray. A couple at a time light up at random in their color (brand colors for logos, pink or green for words).
- Hover: the item bumps up and takes its color; it returns when the mouse leaves.
- The rows drift on their own. Drag them (mouse or touch) or use the arrow keys; on release they carry on. Hover or focus pauses a row. Reduced motion: no drift, still draggable.

### 4.8 Contact and footer

**Transition in:** the section fades up. The accordions open with a height animation (shadcn Accordion).

**Contents:**
- Heading: "Let us build something for the lab, the field, or the room."
- Intro: "Research collaborations, community programs, internships, or a hello. I read every message."
- Four trait accordions: Systematic, Grounded, Community-built, Curious across fields. The text is in the Contact board.
- Form: Name, Email and Message, each with a visible label, then "Send message".
- Links: LinkedIn **[ADRIAN] URL**, GitHub @AdiFranDev, Facebook and Instagram **[ADRIAN] confirm that they are public**.


**Form behavior:**
- A Server Action validates on the server (required fields, email format, message length 10 to 5000 characters).
- It sends with Resend from a verified domain sender to Adrian's inbox. The destination address lives only in an environment variable.
- Spam: a hidden honeypot field, plus a simple per-IP rate limit (for example 5 per hour). No new dependency without asking.
- States: idle, sending (button disabled with a spinner), success (inline message, and the form resets), error (inline message with a retry). Field errors appear under each field, linked with `aria-describedby`.

**Phone:** a full-width form with 48 px fields. The accordions move below the links.

**Needed [ADRIAN]:** `RESEND_API_KEY` and the destination email in `.env.local` (set by Adrian, never read by agents), a verified sending domain, and the social URLs.

### 4.8b Footer

A small band on the page background, after Contact: "Adrian", the quote ("Festina lente"), the social icons, and under them a small "Chuaya ♥ Adi" that shines on hover (a pink sweep across the names; the heart grows and glows). Columns: Explore and Elsewhere. On the right, a woven basket with six tuxedo cats peeking over the rim (original drawing); on hover or focus they bob and a bubble says "These are my six cats". Bottom line: "© 2026 AdiFranDev. All rights reserved." and "Adirawr, dinarawrawr, thanks for visiting mwa <3".

### 4.9 Sticky nav

- **Items:** Home, About, Portfolio, Contact (outlined), the ⋯ button, and the theme toggle. The pill floats 24 px from the top and is translucent (`rgba` background plus a blur).
- **Active item:** set by the section in view (IntersectionObserver), with `aria-current="page"`, pink fill.
- **⋯ menu:** Experiences, Selected work, Moments, Skills. Use the shadcn Dropdown Menu on Base UI. It has `aria-expanded` and `aria-controls`, opens below the dots, and closes on Esc, on a click outside, or after a choice. Focus returns to the dots. New Portfolio sections are added here, so the bar never grows.
- **Hidden during the intro,** then it opens outward from its center (clip and scale, about 750 ms) and its items fade up.
- **Phone:** the name on the left, then the theme toggle and a pink "Menu" button that opens a shadcn Sheet listing every section.

### 4.10 Name hover: ADRIAN to RAWR

- **Trigger:** hover or focus on the hero "ADRIAN". On touch, a tap plays it once.
- **Animation (about 600 ms):** the letters glitch through random characters, then settle as **ADRAWR**, with a small bite out of the top-right corner of the last R. On leave, it reverses.
- **Bite:** three circles in the background color, sized in `em` so they scale with the text, set on a 45° line across the corner of the last R. In dark mode they use the dark background color.
- **Accessibility:** the accessible name always stays "Adrian" (`aria-label`). The glitch characters are `aria-hidden`. Reduced motion: an instant swap with no jitter.

### 4.11 Theme toggle and photo blend details

- **Theme toggle:** `next-themes`. The dark theme grows out from the toggle as a circle (View Transitions API with a `clip-path: circle()` animation, about 500 ms). Going back to light, the dark shrinks in. Browsers without View Transitions, and reduced motion, switch instantly. The `aria-label` names the theme it switches to.
- **Photo blend:** see 4.3.

---

## 5. Global requirements

### 5.1 Responsive breakpoints

| Name | Width | Notes |
|---|---|---|
| Phone | 360 to 767 | Phone boards. No pinning, swipe rows, menu sheet. |
| Tablet | 768 to 1023 | Phone patterns with two-column grids. |
| Laptop | 1024 to 1439 | Desktop boards, scaled down. |
| Desktop | 1440 and up | Desktop boards. Content max width 1440, centered. |

Playwright checks run at 390, 768, 1024, 1440 and 1920, in light and dark mode, with and without reduced motion.

### 5.2 Accessibility (WCAG 2.2 AA)

- Text contrast 4.5:1 (3:1 for large text and UI boundaries). The tokens in the brand guide already pass. Check any new color.
- Every control is a real `<button>`, `<a href>` or `<input>` with a `<label>`. Touch targets are 44 px or more.
- There is a visible focus ring everywhere (pink, 2 px, 2 px offset).
- Skip link: "Skip to content", as the first element after the intro.
- One `<h1>` (the hero name), then a logical h2 and h3 order.
- `lang` attributes on Filipino (`fil`), Cebuano (`ceb`) and Japanese (`ja`) text.
- Images have meaningful alt text. Decorative images use `alt=""`.
- Reduced motion is fully supported (3.4). Marquees have a pause method (4.7).

### 5.3 Performance budgets

- Lighthouse mobile: Performance 90+, Accessibility 100, Best Practices 100, SEO 100.
- LCP under 2.5 s, CLS under 0.1, INP under 200 ms.
- JavaScript under about 150 KB gzipped on first load. Sections below the fold load their client code lazily.
- Images: `next/image`, AVIF or WebP, `sizes` set, lazy except the hero LCP image.
- Fonts: `next/font`, `display: swap`. Noto Sans JP only for the 3 glyphs 日本語.

### 5.4 Color usage: two quiet, one loud

- **Quiet light:** the bone-white ground (`background`, `#fffafc`), on every section, the footer included.
- **Quiet dark:** deep green (`brand-green`, `#0e492a`; `#8cc9a1` in dark mode) for status, scholar marks, graph edges, topographic lines, and highlights in the skills rows. Ink (`foreground`) carries text.
- **Loud:** pink (`primary`) only for the main call to action in a view, the active nav item, the focus ring, and ADRIAN. Selected chips and the phone menu button use ink, not pink.
- **Check:** one pink button per view at most. Numbers, counters, and dividers are never pink.

### 5.5 SEO and sharing

- Title: "Francis Adrian Esteban · Portfolio". Write a meta description of 150 to 160 characters from the tagline.
- Open Graph and Twitter image: 1200×630, generated with `next/og` from the name and the tagline.
- `sitemap.ts`, `robots.ts`, and `Person` JSON-LD (name, school, city, links only).

---

## 6. Assets

### 6.1 Images (Adrian adds them during active development)

Drop them in `public/images/<section>/`. Until then, each one is a labeled placeholder of the correct size and aspect ratio.

| Section | Image | Format and size |
|---|---|---|
| Intro | Reaction cameo | WebP, about 400×500 |
| Hero | Background landscape (CDO, farm or campus at dusk) | AVIF/WebP, 2560×1600 |
| Hero | Adrian cutout, from behind | WebP with transparency, about 1600 px tall |
| Hero | Leaves left, leaves right, plants along the bottom | WebP with transparency |
| About | Academic photo and community photo (matching) | WebP, 1200×1500 each |
| Experiences | 1 photo per card | WebP, 1200×900 |
| Selected work | 1 figure or photo per card | WebP, 1200×900 |
| Moments | 8 photos and captions | WebP, longest side 1600 |
| Skills | 6 category images | WebP, 1200×900 |
| Sharing | OG image | Generated, 1200×630 |

### 6.2 Icons

- **Interface icons:** Lucide via `lucide-react` (the shadcn default): menu, more-horizontal, moon, sun, arrow-right, chevron-left, chevron-right, file-text, graduation-cap, award, x, plus, minus, send, mail, external-link, leaf.
- **Tool logos** (Skills marquee): fetch them from the `simple-icons` package. Before using each slug, check that it exists in the installed version. If a brand is missing (some brands, like Java, may have been removed), ask Adrian to upload an SVG. Show all logos in one color (`currentColor`) for a calm marquee, unless Adrian asks for brand colors.
- **Affiliation logos** (USTP, 4-H, CS³, University City Scholars, Fresco Greenovations, the CDO City Scholarship Program, CHED-UniFAST): **Adrian uploads them**. Ask for SVG first, then PNG at 256 px or more. Until then, show a placeholder circle with the name.
- **Lettuce (Moments):** an inline SVG. Use a Lucide leaf icon for now, and ask Adrian whether he wants a custom illustration.
- **Rule:** if an icon is not on these lists, ask Adrian first: he uploads it, or Claude Code fetches it from Lucide or Simple Icons.

### 6.3 Logo and favicon

- The real logo is not designed yet **[ADRIAN]**.
- **Favicon:** Adrian's red bow, traced to a vector at `src/app/icon.svg`, with a 180 px `src/app/apple-icon.png` on the bone background. Next.js serves it as the favicon automatically through the App Router file convention.
- Emoji fallback, if wanted: 🎀.
- When the logo is ready, replace `app/icon.svg` and add `app/apple-icon.png` (180×180).

---

## 7. Content and data structure

```
content/
  experiences.ts    // cards for 4.4
  projects.ts       // cards for 4.5, each with wave: "development" | "community" | "awards"
  moments.ts        // photos for 4.6: src, alt, caption, category
  skills.ts         // categories, tools, affiliations for 4.7
  contact.ts        // traits and links for 4.8
  streak.ts         // Duolingo start date and optional override
  case-studies/*.mdx  // optional long reads, later
```

Each card type is one TypeScript type shared by the data and the component. Adding an entry never needs a layout change.

---

## 8. Open items for Adrian

| # | Item | Needed for |
|---|---|---|
| 1 | All photos in 6.1 | Every section |
| 2 | Status badge wording | Hero |
| 3 | Cebuano or Waray greeting | Hero |
| 4 | Bio (2 to 3 sentences) | About |
| 5 | CV PDF | Hero, About |
| 6 | Thesis title, group, adviser, 4 highlights | Selected work |
| 7 | One measured CSEK result | Selected work |
| 8 | Community and Awards picks (4 or 5 each at most) | Selected work |
| 9 | Two more Filipinovation highlights | Experiences |
| 10 | "Community Development" skill description and tags | Skills |
| 11 | Marquee pause: a button back, or stop after 5 s | Skills (WCAG) |
| 12 | Affiliation logos | Skills |
| 13 | LinkedIn URL; whether Facebook and Instagram are public | Contact |
| 14 | Resend key, sending domain, destination email (in `.env.local`) | Contact |
| 15 | Whether Contact stays in the bar or moves into the ⋯ menu | Nav |
| 16 | Logo design | Favicon, OG image |

---

## 9. Build order

1. Tokens, fonts, theme toggle, layout shell, sticky nav, skip link, favicon placeholder.
2. Hero frames 1 and 2, then the name glitch.
3. About and Who I am, including the streak counter.
4. The shared side-scroll track component, then Experiences, then Selected work.
5. Moments.
6. Skills and marquees.
7. Contact form with Resend.
8. Loading intro (last, so it never blocks other work).
9. SEO, OG image, sitemap, JSON-LD.
10. The full Playwright pass at every breakpoint and theme, Lighthouse, and an accessibility audit.

---

## 10. Definition of done (every section)

- It matches its desktop and phone boards and its sticky note.
- It works with keyboard only, a screen reader (no hidden text or traps), reduced motion, and in both themes.
- It passes Playwright at 390, 768, 1024, 1440 and 1920 with no horizontal overflow.
- It has no console errors, ESLint is clean, and TypeScript passes strict.
- Placeholders are visible and listed. No invented content.

---

## 11. Design system

All in `src/components/site/ds.tsx` and `src/app/globals.css`.

- **Type:** `type-display` (Bricolage 800, tight), `type-h2` (32 to 52 px), `type-h3`, `type-label` (Geist Mono 13 px, uppercase), `type-lead`. Big display type uses `optical-left` so it lines up by eye with the text below it.
- **Buttons:** `buttonStyles({ variant, size })`: `primary` (the loud one, one per view, with a soft pink glow), `secondary` (outline), `quiet`, `dashed` (for "add" placeholders). Sizes `md` (44 px) and `lg` (48 px). Icons are always 18 px in buttons and 20 px in icon buttons, Lucide stroke 2.
- **Chips:** `chipStyles(pressed)`: pressed = ink fill.
- **Icon buttons:** `iconButtonStyles`, 44 px round.
- **Surfaces:** cards are 18 px radius with a border and no shadow. Nested corners follow inner radius = outer radius - padding (card 18, inset 12, inner 6; menu 14, padding 8, items 6; phone sheet 20, padding 12, items 8; form 26, padding 18, fields 8).
- **Feedback motion:** buttons and chips press down (scale 0.97); menus, dialogs, and the phone sheet fade and scale in; category switches slide the new cards in; form errors and the success message slide in; the accordion plus turns into an x. Everything respects reduced motion.
- **No filler:** no status badges, eyebrow labels over headings, card numbers, dashed dividers, or decorative shadows.
