---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# TypeScript rules

- Strict mode is on. Keep `noUncheckedIndexedAccess: true` in tsconfig.json.
- Never use `any`. For a value of unknown shape, use `unknown` and narrow it with runtime checks.
- No `as` cast without a runtime check right before it. Prefer type guards and `satisfies`.
- Model values with several states as discriminated unions, for example `status: "idle" | "pending" | "success" | "error"`, not as separate booleans.
- Component props: a named `type XProps = { ... }`, required props first, at most 7 props. Destructure what the component uses. No catch-all `data` prop.
- Extract a generic type only when the same shape appears for 2 or more types.
