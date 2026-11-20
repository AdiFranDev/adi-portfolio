---
paths:
  - "src/app/**/actions.ts"
  - "src/app/**/route.ts"
  - "src/lib/**/*.ts"
  - "next.config.ts"
---

# Server and security rules

- Treat all client input as untrusted: form data, params, search params, headers, and cookies. Check type, length, and format on the server before using it. The contact form validates by hand; do not add Zod without a decision entry.
- Read secrets from process.env inside the function that uses them. Never hard-code a key. Never give a server secret the NEXT_PUBLIC_ prefix. Add every new variable name, without a value, to .env.example.
- Never pass user input to a shell command, eval, or a file path. File reads use only slugs from generateStaticParams.
- No dangerouslySetInnerHTML with user content.
- Never write an empty catch. Log the cause with context on the server and return a typed result such as `{ ok: false, message }` to the client. Never send stack traces or internal error text to the user.
- Run `npm audit` before each release. Fix High and Critical findings, or record in docs/decisions.md why one is accepted.
