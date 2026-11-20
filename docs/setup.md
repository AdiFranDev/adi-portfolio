# Portfolio setup guide (manual)

This guide builds the portfolio from an empty folder by hand, so you see what every file and command does. Save it in the repo as `docs/setup.md` once Step 1 is done. Claude Code can then read how the project was built.

**Written:** 2026-11-20, against the current official docs listed at the end. **Revised:** 2026-11-20 (Node version, project location, decision log moved to Step 1, Resend action hardening, Windows MCP wrapper).
**Assumes:** Windows 11, PowerShell, VS Code, npm. The project lives at `C:\dev\portfolio`: all lowercase, because npm package names cannot contain capital letters, and outside OneDrive, because syncing `node_modules` and `.next` causes file-lock (`EPERM`) errors. Commands run from the project root unless a step says otherwise.

Each step has three parts: what to run or write, what it does, and how to check it worked. Commit after each step that ends with a working check, so you can always go back to a good state.

---

## Target folder structure

```
portfolio/
├─ CLAUDE.md                 Claude Code reads it every session (Step 14)
├─ .mcp.json                 shared MCP servers, no secrets (Step 15)
├─ .claude/
│  └─ settings.json          enforced permissions (Step 14)
├─ docs/
│  ├─ decisions.md           planning chat writes, Claude Code reads (Step 1)
│  └─ setup.md               this guide (Step 1)
├─ content/
│  ├─ projects/*.mdx         case studies (Step 10)
│  └─ writing/*.mdx          optional blog
├─ public/                   static files: images, CV PDF, favicon
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx          root layout: html, body, theme provider
│  │  ├─ page.tsx            Home
│  │  ├─ globals.css         Tailwind import and shadcn theme tokens
│  │  ├─ about/page.tsx
│  │  ├─ projects/page.tsx   list of case studies
│  │  ├─ projects/[slug]/page.tsx
│  │  ├─ academics/page.tsx
│  │  ├─ community/page.tsx
│  │  ├─ writing/            same pattern as projects, when you need it
│  │  └─ contact/
│  │     ├─ page.tsx
│  │     ├─ contact-form.tsx client component
│  │     └─ actions.ts       Server Action that calls Resend
│  ├─ components/
│  │  ├─ ui/                 shadcn components (generated)
│  │  ├─ theme-provider.tsx
│  │  └─ theme-toggle.tsx
│  ├─ lib/
│  │  ├─ utils.ts            cn helper (created by shadcn)
│  │  └─ content.ts          MDX loader
│  └─ mdx-components.tsx     required by @next/mdx
├─ .env.local                secrets, never committed
├─ .env.example              names of the variables, committed
├─ .gitignore
├─ components.json           shadcn CLI settings
├─ eslint.config.mjs
├─ next.config.ts
├─ postcss.config.mjs
├─ tsconfig.json
└─ package.json
```

Folders that are not in the tree on purpose: `.claude/commands/` (the Claude Code docs now say to use skills instead), and `.claude/agents/` and `.claude/skills/` (create each one when it gets its first file, since Git does not track empty folders).

---

## Step 0: Prerequisites

Install or update these, then check each version in a new PowerShell window.

```powershell
node -v      # v24.x or v26.x (see below). Next.js needs 20.9+, ESLint 10 needs 20.19+, 22.13+, or 24+
npm -v
git --version
gh --version
claude --version
```

- **Node.js** runs Next.js and every tool below. Node 26 became Active LTS on 2026-10-28, and Node 24 is now in Maintenance LTS (supported to April 2028). Use the same major version locally that your Vercel project uses (Vercel: Project Settings > Build and Deployment > Node.js Version), so a build that passes on your laptop also passes on Vercel. Install with `winget install OpenJS.NodeJS.LTS`, or pick the exact major from nodejs.org.
- **Git** tracks your history. **gh** is the GitHub CLI, which Claude Code will also use. Run `gh auth login` once and choose GitHub.com, HTTPS, and browser login.
- **Git identity**, set once per machine. Use the GitHub noreply address (GitHub > Settings > Emails) so your personal email does not appear in a public commit history:

```powershell
git config --global init.defaultBranch main
git config --global user.name "Francis Adrian Esteban"
git config --global user.email "<id>+<username>@users.noreply.github.com"
```
- **Claude Code** is already on your machine. Sign in with your Pro account if it asks.

---

## Step 1: Create the folder, Git, and package.json

```powershell
New-Item -ItemType Directory -Path C:\dev\portfolio
Set-Location C:\dev\portfolio
git init -b main
npm init -y
code .
```

**What it does:** `git init -b main` creates an empty repository whose first branch is `main`. `npm init -y` writes a default `package.json`, the file that lists your dependencies and scripts. Its `name` comes from the folder name, which is why the folder must be lowercase.

Open `package.json` and replace its contents with this. You will fill `dependencies` by installing, not by typing.

```json
{
  "name": "portfolio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```

- `"private": true` stops npm from ever publishing the site as a package.
- `next dev` starts a development server with Turbopack, which is now the default bundler. `next build` makes the production build. `next start` serves that build.
- `lint` runs ESLint directly. Since Next.js 16, `next build` no longer runs the linter, so you run `npm run lint` yourself.

Create `.gitignore`:

```gitignore
# dependencies and build output
node_modules/
.next/
out/
*.tsbuildinfo
next-env.d.ts

# secrets
.env*
!.env.example

# tools
.vercel
.claude/settings.local.json
CLAUDE.local.md
```

**What it does:** keeps generated files and secrets out of Git. `.env*` ignores every env file, and `!.env.example` re-includes the one that holds only variable names.

Create the decision log and save this guide in the repo:

```powershell
New-Item -ItemType Directory -Path docs
Move-Item <path-to-this-guide>\setup.md docs\setup.md
New-Item -ItemType File -Path docs\decisions.md
```

Paste D-001 from the planning chat into `docs/decisions.md`. The planning chat adds every later entry there, so the log must exist before the first decision is built, not at the end.

**Check, then commit:** `git status` shows `package.json`, `.gitignore`, `docs/setup.md`, and `docs/decisions.md`.

```powershell
git add -A
git commit -m "Initialize repository with decision log and setup guide"
```

---

## Step 2: Install Next.js and React

```powershell
npm i next@latest react@latest react-dom@latest
```

**What it does:** installs the framework (`next`) and the UI library it renders (`react`, `react-dom`). The App Router uses React's canary builds internally, but you still list `react` and `react-dom` in `package.json`. npm also creates `node_modules/` and `package-lock.json`, which pins exact versions. Commit the lock file.

**Check:** `package.json` now has a `dependencies` block with all three.

---

## Step 3: Add TypeScript

```powershell
npm i -D typescript @types/react @types/react-dom @types/node
```

**What it does:** `-D` saves these as dev dependencies, which are needed only while developing and building. `typescript` is the compiler. The `@types/*` packages describe React's and Node's APIs to it. Next.js needs TypeScript 5.1 or later.

Next.js could install these for you on first run. Installing them yourself shows you exactly what TypeScript needs.

---

## Step 4: Write the first route and run it

Create `src/app/layout.tsx`:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

Create `src/app/page.tsx`:

```tsx
export default function Page() {
  return <h1>Hello, Adrian.</h1>
}
```

Run:

```powershell
npm run dev
```

**What it does:** in the App Router, the folder path under `app/` is the URL, and a `page.tsx` makes that path public. `layout.tsx` wraps every page under it. The root layout is required and must contain `<html>` and `<body>`. Next.js accepts `app/` inside `src/`, which keeps code apart from the config files at the root.

On this first run, Next.js sees `.tsx` files and writes two files for you:
- `tsconfig.json`: compiler settings, including the `next` plugin that type-checks Next.js conventions.
- `next-env.d.ts`: type references for Next.js. It is regenerated, so it stays in `.gitignore`.

**Check:** http://localhost:3000 shows your heading. Stop the server with Ctrl+C.

---

## Step 5: Add the import aliases

Open `tsconfig.json` and make sure `compilerOptions` contains this `paths` block (add it or edit it):

```json
"paths": {
  "@/*": ["./src/*"],
  "@content/*": ["./content/*"]
}
```

**What it does:** `@/components/ui/button` now means `src/components/ui/button`, so imports stay the same however deep a file sits. shadcn's CLI requires the `@/*` alias. `@content/*` points at the MDX folder at the root, which sits outside `src/`.

Read the rest of the generated `tsconfig.json` once. The important options are `strict: true` (catches null and type errors), `moduleResolution: "bundler"`, and `jsx: "preserve"` (Next.js compiles JSX itself).

**Check, then commit:**

```powershell
npm run build
git add -A
git commit -m "Set up Next.js with TypeScript"
```

---

## Step 6: Set up ESLint

```powershell
npm i -D eslint eslint-config-next
```

Create `eslint.config.mjs`:

```js
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])

export default eslintConfig
```

**What it does:** this is ESLint's flat config format. `core-web-vitals` adds the Next.js and React rules, with the performance rules treated as errors. `typescript` adds TypeScript-aware rules. `globalIgnores` skips generated folders.

`npm i -D eslint` installs ESLint 10 (ESLint 9 reached end of life on 2026-08-06). `eslint-config-next` 16.4 and later supports ESLint 10, but some plugins it bundles do not list ESLint 10 in their peer dependencies yet, so npm may print peer dependency warnings. Warnings are expected. If npm stops with an `ERESOLVE` error instead, report it before you work around it.

**Check:** `npm run lint` finishes with no errors.

---

## Step 7: Install Tailwind CSS v4

```powershell
npm i tailwindcss @tailwindcss/postcss postcss
```

Create `postcss.config.mjs`:

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}

export default config
```

Create `src/app/globals.css`:

```css
@import "tailwindcss";
```

Import it at the top of `src/app/layout.tsx`:

```tsx
import "./globals.css"
```

**What it does:** PostCSS is the CSS processor Next.js runs on your stylesheets. The Tailwind plugin scans your files for class names and generates only the CSS you use. Tailwind v4 has no `tailwind.config.js`. You configure it in CSS with `@theme`, and the single `@import` replaces v3's three `@tailwind` lines. If an AI or tutorial tells you to create `tailwind.config.js`, it is describing v3.

**Check:** change the heading to `<h1 className="text-3xl font-bold underline">`, run `npm run dev`, and confirm the style applies. Commit.

---

## Step 8: Initialize shadcn/ui

shadcn's current docs offer only the CLI for setup, so this step uses it and then walks through what it did.

```powershell
npx shadcn@latest init
```

Answer the prompts. Two choices cannot be changed later without reinstalling components, so pick them deliberately:
- **Style or preset:** sets the look of every component.
- **Base color:** generates your neutral palette (for example `neutral` or `zinc`).
Keep CSS variables on, which is the default.

Then add one component:

```powershell
npx shadcn@latest add button
```

**What it did.** Read each of these files before you continue. This is the learning part of the step.
1. `components.json`: tells the CLI where things go. `tailwind.css` points to `src/app/globals.css`, `tailwind.config` is blank because v4 needs none, `rsc: true` makes the CLI add `"use client"` where a component needs it, and `aliases` map to your `@/*` paths.
2. `src/lib/utils.ts`: the `cn()` helper. It joins class names (`clsx`) and resolves conflicting Tailwind classes (`tailwind-merge`), so `cn("px-2", "px-4")` gives `px-4`.
3. `src/app/globals.css`: now holds the theme as CSS variables such as `--background` and `--primary`, a `.dark` block with the dark values, and `@theme inline`, which exposes those variables as Tailwind classes like `bg-background`.
4. `src/components/ui/button.tsx`: the component's source, now yours. Its variants (`default`, `outline`, `ghost`) come from `class-variance-authority`.
5. `package.json`: note which packages init added.

**Check:** render `<Button>Hello</Button>` in `page.tsx` (import it from `@/components/ui/button`), confirm it shows, then commit.

Add the components the site needs when you build each page, for example `npx shadcn@latest add card input textarea label`. Later, Claude Code can add them through the shadcn MCP server.

---

## Step 9: Light and dark theme

```powershell
npm i next-themes
```

Create `src/components/theme-provider.tsx`:

```tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

Update `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "Francis Adrian Esteban",
  description: "Computer science student, Cagayan de Oro.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

Create `src/components/theme-toggle.tsx`:

```tsx
"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="size-5 dark:hidden" />
      <Moon className="hidden size-5 dark:block" />
    </Button>
  )
}
```

If `lucide-react` is not in `package.json` after Step 8, run `npm i lucide-react`.

**What it does:** next-themes adds or removes the `dark` class on `<html>` and remembers the choice. The shadcn `.dark` variables then switch every color. `defaultTheme="system"` follows Windows' setting until the visitor chooses. `suppressHydrationWarning` is required because the class is set in the browser before React loads, so the server HTML and the browser HTML differ on purpose. Only the provider and the toggle are client components, so the rest of each page still renders on the server.

**Check:** add `<ThemeToggle />` to `page.tsx` and switch themes. Commit.

---

## Step 10: Set up MDX

```powershell
npm i @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

Rename Next.js's config to TypeScript by creating `next.config.ts` (delete any `next.config.js` or `.mjs` if one exists):

```ts
import type { NextConfig } from "next"
import createMDX from "@next/mdx"

const nextConfig: NextConfig = {
  // Lets a page.mdx file act as a route. Imported .mdx files work without it.
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
}

const withMDX = createMDX({
  // Under Turbopack, give remark and rehype plugins as strings, for example
  // options: { remarkPlugins: ["remark-gfm"] }
})

export default withMDX(nextConfig)
```

Create `src/mdx-components.tsx`. The App Router does not render MDX without this file, and with a `src/` folder it must sit directly in `src/`.

```tsx
import type { MDXComponents } from "mdx/types"

const components: MDXComponents = {
  h1: (props) => <h1 className="mt-10 text-3xl font-bold tracking-tight" {...props} />,
  h2: (props) => <h2 className="mt-8 text-2xl font-semibold tracking-tight" {...props} />,
  p: (props) => <p className="mt-4 leading-7" {...props} />,
  a: (props) => <a className="font-medium underline underline-offset-4" {...props} />,
  ul: (props) => <ul className="mt-4 ml-6 list-disc" {...props} />,
  code: (props) => <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm" {...props} />,
}

export function useMDXComponents(): MDXComponents {
  return components
}
```

**What it does:** `@next/mdx` compiles each `.mdx` file into a React component at build time. `mdx-components.tsx` maps Markdown elements to styled elements, so a `#` heading in MDX becomes your styled `<h1>`. This replaces the `@tailwindcss/typography` plugin and keeps one less dependency.

Create `content/projects/example.mdx`:

```mdx
export const metadata = {
  title: "Example project",
  summary: "One sentence on what it does and why it matters.",
  date: "2026-11-20",
  tags: ["Next.js", "TypeScript"],
}

## Problem

What you set out to solve.

## Approach

What you built and the key decisions.

## Result

What happened, with numbers where you have them.
```

**What it does:** `@next/mdx` does not read YAML frontmatter by default. An exported `metadata` object does the same job with no extra package, and TypeScript can read it.

---

## Step 11: Load content and build the Projects routes

Create `src/lib/content.ts`:

```ts
import fs from "node:fs"
import path from "node:path"
import type { MDXContent } from "mdx/types"

export type ProjectMeta = {
  title: string
  summary: string
  date: string
  tags?: string[]
}

const projectsDir = path.join(process.cwd(), "content", "projects")

export function getProjectSlugs(): string[] {
  return fs
    .readdirSync(projectsDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""))
}

export async function getProject(slug: string) {
  const mod = (await import(`@content/projects/${slug}.mdx`)) as {
    default: MDXContent
    metadata: ProjectMeta
  }
  return { slug, Content: mod.default, metadata: mod.metadata }
}

export async function getAllProjects() {
  const projects = await Promise.all(getProjectSlugs().map(getProject))
  return projects.sort((a, b) => b.metadata.date.localeCompare(a.metadata.date))
}
```

Create `src/app/projects/[slug]/page.tsx`:

```tsx
import { getProject, getProjectSlugs } from "@/lib/content"

export const dynamicParams = false

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }))
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { Content, metadata } = await getProject(slug)

  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight">{metadata.title}</h1>
      <p className="mt-2 text-muted-foreground">{metadata.summary}</p>
      <Content />
    </article>
  )
}
```

Create `src/app/projects/page.tsx`:

```tsx
import Link from "next/link"
import { getAllProjects } from "@/lib/content"

export default async function ProjectsPage() {
  const projects = await getAllProjects()
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
      <ul className="mt-8 space-y-6">
        {projects.map(({ slug, metadata }) => (
          <li key={slug}>
            <Link href={`/projects/${slug}`} className="text-xl font-semibold hover:underline">
              {metadata.title}
            </Link>
            <p className="text-muted-foreground">{metadata.summary}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
```

**What it does:** `[slug]` is a dynamic segment, so `/projects/example` loads `content/projects/example.mdx`. `generateStaticParams` lists every slug at build time, so each case study becomes a static HTML page. `dynamicParams = false` returns 404 for any slug not in that list, so the page needs no separate `notFound()` check. In Next.js 15 and later, `params` is a Promise, which is why the page awaits it. All of this runs on the server, so reading the file system is allowed.

**Check:** `npm run build` lists `/projects/example` as a static (prerendered) route. Visit it in `npm run dev`. Commit.

The Writing section follows the same pattern with `content/writing` when you decide to add it.

---

## Step 12: Contact form with Resend

```powershell
npm i resend
npx shadcn@latest add input textarea label
```

1. Create an account at resend.com and an API key with "Sending access" only.
2. Create `.env.local` (ignored by Git):

```dotenv
RESEND_API_KEY=re_your_key_here
CONTACT_TO_EMAIL=the-address-you-use-for-resend
```

3. Create `.env.example` (committed, no values):

```dotenv
RESEND_API_KEY=
CONTACT_TO_EMAIL=
```

Create `src/app/contact/actions.ts`:

```ts
"use server"

import { Resend } from "resend"

export type ContactState = { ok: boolean; message: string }

export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field.
  if (formData.get("hp_field")) return { ok: true, message: "Thanks, message sent." }

  const name = String(formData.get("name") ?? "").replace(/[\r\n]+/g, " ").trim()
  const email = String(formData.get("email") ?? "").trim()
  const message = String(formData.get("message") ?? "").trim()

  if (
    !name || name.length > 100 ||
    !email.includes("@") || email.length > 254 ||
    message.length < 10 || message.length > 5000
  ) {
    return { ok: false, message: "Please fill in every field. Messages need at least 10 characters." }
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  if (!apiKey || !to) {
    console.error("Contact form: RESEND_API_KEY or CONTACT_TO_EMAIL is not set")
    return { ok: false, message: "The message could not be sent. Please try again later." }
  }

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>",
    to: [to],
    replyTo: email,
    subject: `Portfolio message from ${name}`,
    text: `${message}\n\nFrom: ${name} <${email}>`,
  })

  if (error) return { ok: false, message: "The message could not be sent. Please try again later." }
  return { ok: true, message: "Thanks, message sent." }
}
```

Create `src/app/contact/contact-form.tsx`:

```tsx
"use client"

import { useActionState } from "react"
import { sendContact, type ContactState } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const initialState: ContactState = { ok: false, message: "" }

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContact, initialState)

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" rows={6} required />
      </div>
      <input type="text" name="hp_field" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <Button type="submit" disabled={pending}>
        {pending ? "Sending..." : "Send"}
      </Button>
      {state.message && (
        <p role="status" className={state.ok ? "text-sm" : "text-sm text-destructive"}>
          {state.message}
        </p>
      )}
    </form>
  )
}
```

Create `src/app/contact/page.tsx`:

```tsx
import { ContactForm } from "./contact-form"

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight">Contact</h1>
      <ContactForm />
    </main>
  )
}
```

**What it does:** `"use server"` turns `sendContact` into a Server Action. The form posts to it directly, with no API route, and the code runs only on the server, so the API key never reaches the browser. `useActionState` (React 19) tracks the result and the pending state. `replyTo` lets you answer the visitor straight from your inbox. The honeypot field catches simple bots without a CAPTCHA dependency. Its name is deliberately meaningless: a field named `company` can be filled by browser autofill, which would silently drop real messages. Your own address lives in an env var, so it stays out of the public repo.

Three details in `actions.ts` are deliberate:
- The Resend client is created inside the function, not at module level. `new Resend()` throws when the key is missing, so a module-level client can fail `next build` on any machine or CI run without `.env.local`.
- Missing env vars return a normal error message and log the cause on the server, instead of crashing the action.
- Line breaks are removed from `name` and its length is capped, because `name` goes into the email subject.

The honeypot does not stop a person or script that submits repeatedly. Rate limiting is an open decision for the planning chat.

Resend's Next.js guide shows a Route Handler. A Server Action calls the same `resend.emails.send()` and suits a form better. Resend says `onboarding@resend.dev` is for testing only. Before you share the site widely, verify a domain you own at resend.com/domains and change `from` to an address on it. A free `*.vercel.app` address cannot be verified, so this needs a custom domain.

**Check:** submit the form in `npm run dev` and confirm the email arrives. Commit (Git ignores `.env.local`).

---

## Step 13: Push to GitHub and deploy on Vercel

```powershell
gh repo create portfolio --private --source . --remote origin --push
```

**What it does:** creates the GitHub repository, links it as `origin`, and pushes your commits. Use `--public` instead if you want recruiters to read the code. The secrets are safe either way because `.env.local` is not committed.

Then, in the browser:
1. Go to vercel.com/new and import the `portfolio` repository. Vercel detects Next.js and needs no build settings.
2. Before the first deploy, open **Environment Variables** and add `RESEND_API_KEY` and `CONTACT_TO_EMAIL`.
3. Deploy.

**What it does:** every push to `main` now deploys to production, and every other branch gets a preview URL. Vercel injects the env vars at build and run time, which is the only other place the key lives.

**Check:** the contact form works on the deployed URL.

---

## Step 14: Add the Claude Code files

1. Create `CLAUDE.md` at the root with the content from `prompts-v1.md`, section 2.
2. Create `.claude/settings.json` with the JSON from `prompts-v1.md`, section 2.

`docs/decisions.md` and `docs/setup.md` already exist from Step 1. `prompts-v1.md` is not part of this repo; keep it next to this guide until Step 14 is done.

**What it does:** Claude Code loads `CLAUDE.md` at the start of every session, and the `@docs/decisions.md` line inside it imports the decisions file too. `.claude/settings.json` holds enforced rules: the allow list skips prompts for safe commands, and the deny list blocks reading `.env` files. CLAUDE.md is guidance that Claude follows, while settings are enforced whether or not it does, which is why the secrets rule appears in both.

**Check:** open the folder in VS Code, start Claude Code, and run `/context` (confirm with `/help` whether your version also accepts `/context all`). CLAUDE.md and decisions.md appear under Memory files. Commit.

---

## Step 15: Connect the MCP servers and plugins

**shadcn MCP (local, no account).** Create `.mcp.json` at the root by hand:

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "cmd",
      "args": ["/c", "npx", "shadcn@latest", "mcp"]
    }
  }
}
```

On native Windows, `npx` is a batch file (`npx.cmd`) that Claude Code cannot start directly, so the Claude Code MCP docs say to wrap it in `cmd /c`. Without the wrapper, the server is listed but never connects. Write this entry in the file instead of with `claude mcp add`, because the CLI has had bugs that rewrite `/c` as `C:/`.

**Vercel and Resend MCP (remote, OAuth).** These commands add entries to the same `.mcp.json`:

```powershell
claude mcp add --transport http vercel --scope project https://mcp.vercel.com
claude mcp add --transport http resend --scope project https://mcp.resend.com/mcp
```

**Context7 and frontend-design (plugins, user level).** Inside Claude Code:

```text
/plugin marketplace add upstash/context7
/plugin install context7@context7-marketplace
/plugin install frontend-design@claude-plugins-official
```

If Claude Code says the `claude-plugins-official` marketplace is not found, run `/plugin marketplace add anthropics/claude-plugins-official` first. Restart Claude Code after installing plugins.

Then run `/mcp`. Approve the project servers when asked, and sign in to Vercel, Resend, and Context7 when each opens a browser.

**What it does:**
- `--scope project` writes to `.mcp.json`, which you commit, so the setup travels with the repo. No server in it holds a key: shadcn needs none, and Vercel and Resend sign in through OAuth, with tokens stored in your user profile.
- Context7 and frontend-design install as plugins at user level, so they work in every project and add nothing to the repo. Context7's plugin route needs no API key.
- Resend also offers a plugin (`resend@claude-plugins-official`) that bundles its skills with the MCP server. The plain MCP server is the leaner choice. Add the plugin later if you want the skills.
- Every connected server adds its tool definitions to each Claude Code session. Resend's server exposes more than 85 tools, and this site sends one kind of email. Whether to connect Resend and Vercel at all is an open decision for the planning chat.

**Check:** `/mcp` shows shadcn, vercel, resend, and context7 as connected. Ask Claude Code "Which shadcn components would suit a project card?" to confirm it uses the shadcn server. Commit `.mcp.json`.

---

## Final checks

- [ ] `npm run lint` and `npm run build` pass.
- [ ] `git status` shows no `.env.local`.
- [ ] The deployed site switches themes and sends a contact email.
- [ ] Claude Code loads CLAUDE.md and decisions.md (`/context all`) and lists four MCP servers (`/mcp`).

---

## Docs checked (2026-11-20)

- Next.js: [Installation](https://nextjs.org/docs/app/getting-started/installation), [MDX guide](https://nextjs.org/docs/app/guides/mdx), [ESLint config](https://nextjs.org/docs/app/api-reference/config/eslint)
- Tailwind CSS v4.3: [Install with Next.js](https://tailwindcss.com/docs/guides/nextjs)
- shadcn/ui: [Next.js install](https://ui.shadcn.com/docs/installation/next), [CLI](https://ui.shadcn.com/docs/cli), [components.json](https://ui.shadcn.com/docs/components-json), [Dark mode](https://ui.shadcn.com/docs/dark-mode/next), [MCP](https://ui.shadcn.com/docs/mcp)
- Resend: [Send with Next.js](https://resend.com/docs/send-with-nextjs), [MCP server](https://resend.com/docs/mcp-server)
- Vercel: [Vercel MCP](https://vercel.com/docs/agent-resources/vercel-mcp)
- Context7: [Claude Code](https://context7.com/docs/clients/claude-code)
- Node.js: [Release schedule](https://nodejs.org/en/about/previous-releases), [Evolving the release schedule](https://nodejs.org/en/blog/announcements/evolving-the-nodejs-release-schedule)
- Claude Code: [.claude directory](https://code.claude.com/docs/en/claude-directory), [MCP](https://code.claude.com/docs/en/mcp), [Memory](https://code.claude.com/docs/en/memory), [Settings](https://code.claude.com/docs/en/settings), [Skills](https://code.claude.com/docs/en/skills)