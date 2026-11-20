---
paths:
  - "src/**/*.tsx"
  - "src/app/globals.css"
  - "content/**/*.mdx"
---

# UI rules: accessibility, responsive layout, design

## Accessibility (WCAG 2.2 AA)

- Semantic elements first: one `<main>` per page, `<nav>` with aria-label when there is more than one, `<button>` for actions, `<a>` for navigation, `<ul>` or `<ol>` for lists, and a `<label>` for every input.
- A "Skip to main content" link is the first focusable element on every page.
- Every interactive element works with the keyboard alone. Never remove an outline without a `:focus-visible` style with at least 3:1 contrast.
- aria-label on icon-only buttons, aria-current="page" on the active navigation link, role="status" or aria-live="polite" for form results.
- Contrast of at least 4.5:1 for normal text and 3:1 for large text and UI components, in both the light and the dark theme.
- Meaningful images get descriptive alt text. Decorative images get alt="". Icons next to visible text get aria-hidden="true".
- Respect prefers-reduced-motion: use `motion-reduce:` variants to remove transforms and long transitions.

## Responsive layout

- Mobile first: base classes are for phones, and sm, md, lg, and xl add to them.
- No horizontal scrolling at 360 px. Code blocks use overflow-x-auto. Tables sit in an overflow-x-auto wrapper. Flex rows that can overflow use flex-wrap.
- Touch targets: at least 44 by 44 px for navigation and primary buttons, and never smaller than 24 by 24 px with 8 px between targets.
- Body text at least 16 px; no text smaller than 13 px. Prose stays within max-w-prose (about 65 characters per line).
- On phones, navigation collapses behind a menu button. Do not squeeze the desktop navigation.

## Design

- Use the shadcn tokens: bg-background, text-foreground, border-border, primary, muted, and the rest. Change colors and radius in globals.css through the existing shadcn variables and `@theme inline`. Do not add a second token system, and do not redefine Tailwind theme names such as --text-*, --shadow-*, or --radius-* in :root.
- No arbitrary hex colors such as bg-[#...] in components.
- Color 60-30-10: a neutral canvas, a secondary neutral or lightly tinted surface, and one brand accent reserved for primary actions and active states. One brand hue plus semantic red and green. No rainbow category colors. Gradients use 1 or 2 neighboring hues and never sit behind body text.
- Borders must be visible against their background. Shadows stay subtle: cards use shadow-sm at rest and shadow-md on hover.
- Radius comes from the shadcn --radius scale only. An outer container's radius equals the inner radius plus the padding between them.
- Never nest a card inside a card unless the inner element is a different kind of content (code, image, table).
- Icons come from lucide-react only. No emoji as icons.
- No em dashes in interface copy. Use a colon or separate elements.
- Fonts: Geist and Geist Mono only.
- Motion is CSS only (Tailwind transitions and tw-animate-css): 150 to 200 ms for hover color and shadow changes, and cards may lift 2 px on hover. No JavaScript animation library.

## Components (Next.js App Router)

- Server Components by default. Add "use client" only for state, effects, browser APIs, or event handlers, and only on the smallest leaf component that needs it.
- Images use next/image with width and height (or fill inside a sized parent). Use priority only for the image above the fold.
- Split a component when its JSX passes about 150 lines or it handles 3 or more separate concerns. Prefer composition with children over boolean flag props.
- List keys come from stable data such as a slug or id, never from the array index for lists that can change. Never define a component inside another component.
- Every route that can fail has an error.tsx, and the app has a not-found.tsx with links back to the main sections.
