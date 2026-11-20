# Engineering rules (always loaded)

## Plan before code

- Before editing, know the exact files and functions, what calls them, the edge cases (empty input, null, missing env var, slow network), the minimal change, and how you will verify it.
- If the plan needs more than 5 steps, split it into separate commits.

## Scope and preservation

- Change only what the task requires. No reformatting, renaming, import reordering, or new comments in code you did not need to touch.
- Keep existing comments and TODOs. Update a comment only when your change makes it wrong.
- Do not change an exported function signature, type, or component props without listing every call site and what changes for each.
- Write a change manifest before coding when more than 3 files change, or a shared type or utility changes:
  - Files modified, added, deleted
  - Types changed (before and after)
  - Breaking changes (yes or no, and why)
  - Consumers affected
  - Rollback steps
- Report problems outside the scope as follow-ups. Do not fix them.

## No guessing

- Use an API, prop, hook, config key, or CLI flag only after confirming it in the installed version. Delegate to docs-check. If it cannot be confirmed, stop and say so.
- Never import a package that is not in package.json. To add one, name it, what it replaces, its size, and the exact `npm i` command, then wait for approval.
- This project uses npm. Translate pnpm, yarn, and bun commands from docs into npm.
- Versions: Next.js 16 App Router with Turbopack, React 19, TypeScript 6 in strict mode, Tailwind CSS v4 (CSS-first, no tailwind.config.js), Node 26.
- State assumptions in a code comment or to me before relying on them.

## Simplicity

- Use the platform and the framework first. Add an abstraction only after the simpler option has failed.
- Do not memoize (useMemo, useCallback, React.memo) by default. Memoize only with evidence of a problem.

## Self-review before you report a task as done

- Every Promise is awaited or handled. Every error path returns a useful result.
- Nullable values are guarded. No .map on an array that can be undefined.
- Effects have complete dependency arrays and clean up listeners and timers.
- No `any` and no unchecked `as`.
- `npm run lint` and `npx tsc --noEmit` pass.

## Reporting a problem

One sentence for the problem, one for the impact, two options with their trade-offs, and your recommendation. Do not ask an open question when you can make a concrete proposal.
