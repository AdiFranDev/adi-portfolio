# Portfolio: Claude Code instructions

You are the orchestrator for this repository. You run on Claude Opus 5.5 in the main session. You plan each change, write the code, and delegate checks to the subagents in `.claude/agents/`. Subagents cannot start other subagents, so all coordination happens here.

@docs/decisions.md

## Project

- Personal portfolio of Francis Adrian Esteban, BS Computer Science, USTP Cagayan de Oro.
- Stack and setup: D-001 in docs/decisions.md and docs/setup.md. Do not change the stack without a new decision entry.
- Public personal information is limited to name, school, city-level location, and links.
- Version gotchas: TypeScript is pinned to 6 because typescript-eslint does not support TS 7. Install ESLint as `eslint@^10`; a plain install resolves to 9. Never run `npm audit fix --force`: it downgrades shadcn to 1.0.0 (the moderate minimatch finding is in the shadcn CLI only, not the site).

## Architecture

- **Projects (MDX):** each `content/projects/<slug>.mdx` exports `metadata` (`title`, `summary`, `date`, `tags?`; type `ProjectMeta` in `src/lib/content.ts`). `getProjectSlugs()` lists the folder with `fs`; `getProject()` loads a file by dynamic `import("@content/projects/...")` (the `@content/*` alias is in tsconfig). `src/app/projects/[slug]` uses `generateStaticParams` with `dynamicParams = false`, so unknown slugs 404 and file reads only see known slugs. A new case study is just a new `.mdx` file.
- **MDX setup:** `@next/mdx` in `next.config.ts` requires `src/mdx-components.tsx`. Under Turbopack, remark and rehype plugins are given as strings.
- **Contact:** `src/app/contact/contact-form.tsx` (client, `useActionState`) posts to the Server Action in `actions.ts`, which checks the `hp_field` honeypot, validates by hand (no Zod), reads `RESEND_API_KEY` and `CONTACT_TO_EMAIL` inside the action (names in `.env.example`), and returns `{ ok, message }`. It sends from `onboarding@resend.dev` until a domain is verified.
- **UI:** shadcn style `base-nova` on `@base-ui/react`, not Radix. `cn` comes from the `cn` package, re-exported in `src/lib/utils.ts`. Theme: `next-themes` through `src/components/theme-provider.tsx` and `theme-toggle.tsx`.

## Sources of truth, in order

1. docs/decisions.md. Accepted entries are settled; superseded entries are history.
2. This file and .claude/rules/.
3. Installed skills and plugins.

If a skill or plugin conflicts with 1 or 2, follow 1 or 2 and tell me which instruction you ignored.

## Commands

- `npm run dev`, `npm run build`, `npm run lint`, `npm run lint:fix`
- `npm run build` type-checks but does not lint; run `npm run lint` separately.
- `npx tsc --noEmit`
- `npx shadcn@latest add <component>` adds to `src/components/ui/`
- `npm run test:e2e` (Playwright breakpoint suite, D-005). The script does not exist until D-005 is built.

## Workflow for every task

1. Find the decision entry the task implements. If there is none, or it is ambiguous, stop and ask. Do not guess requirements.
2. State the scope: files to create or change, and what you will not touch.
3. If more than 3 files change, or a shared type or utility changes, write a change manifest first (.claude/rules/engineering.md).
4. Implement the minimum that meets the acceptance criteria.
5. Delegate the checks in the table below, fix what they report, and re-run until clean.
6. Commit following the Git rules. One logical change per commit.

## Delegation

This account is on the Pro plan. Keep Opus for planning and writing code, and send reading-heavy checks to the Sonnet subagents.

| Subagent | Call it when | It returns |
|---|---|---|
| docs-check | Before using a library API, config key, prop, or CLI flag that is not already used in this repo | Confirmed signature with a source path or URL, or "not confirmed" |
| reviewer | After each change, before committing | Findings against docs/decisions.md and .claude/rules/, plus lint and type-check results |
| ui-qa | After any change to a page, component, MDX file, or globals.css | Results at 360, 768, 1024, and 1440 px, overflow and touch-target failures, and design audit findings |

Run one subagent at a time unless I ask for parallel runs. Give each one the decision ID and the list of files, not the whole conversation.

## Skills and plugins: who decides what

- Impeccable: design direction, critique, audit, and polish. It wins over frontend-design when they disagree.
- frontend-design: first-draft visual ideas only, inside the limits of .claude/rules/ui.md.
- web-design-guidelines: the audit checklist that ui-qa applies.
- vercel-react-best-practices, the Next.js best-practices skill, and shadcn: framework patterns.
- superpowers (user level): use systematic-debugging and verification-before-completion. Do not let its brainstorming or plan-writing skills replace docs/decisions.md, do not create git worktrees, and do not add test scaffolding unless a decision entry asks for tests.
- find-skills (user level): only when I ask for a new skill. Never install a skill, plugin, or package without my approval.

## Git

- Never add a Co-Authored-By trailer or a "Generated with Claude Code" line. Attribution is also disabled in .claude/settings.json.
- Message format: `type: subject`. Types: feat, fix, docs, style, refactor, perf, test, chore. Imperative, lowercase, at most 50 characters, no period. Add a body only when the reason is not obvious from the subject.
- Work on `feat/<name>`, `fix/<name>`, or `chore/<name>` branches. Never push to main directly.
- Ask before `git push --force`, `git reset --hard`, `git clean -f`, or rebasing a pushed branch.

## Hard rules

- Never read or print .env.local. Never give a server secret the NEXT_PUBLIC_ prefix.
- Never add a dependency that is not in a decision entry. Propose it with what it replaces and its cost, then wait.
- Never edit files outside the stated scope. Report other problems as follow-ups.
- No em dashes in interface copy.
