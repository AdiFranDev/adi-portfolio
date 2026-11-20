# Agents and Claude Code folder structure

This file maps every Claude Code file in the repo. Keep it in sync with `.claude/agents/` (D-009).

## Agents

```text
.
└── .claude
    └── agents
        ├── design
        │   └── ui-qa.md            breakpoints, screenshots, design and a11y audit
        ├── quality
        │   └── reviewer.md         diff vs decisions and rules, lint, type check
        └── research
            └── docs-check.md       confirms an API exists in the installed version

5 directories, 3 files
```

The orchestrator is not a file in this folder. It is the main Claude Code session, configured by `CLAUDE.md` and `.claude/settings.json`. Subagents cannot start other subagents, so only the main session can coordinate them.

| Folder | Holds agents that | Agent | Model | Can edit files |
|---|---|---|---|---|
| `design/` | check what the visitor sees | ui-qa | Sonnet | No |
| `quality/` | check code before it is committed | reviewer | Sonnet | No |
| `research/` | look things up and return facts | docs-check | Sonnet | No |

## Full Claude Code layout

```text
.
├── CLAUDE.md                       orchestrator instructions, imports docs/decisions.md
├── .mcp.json                       project MCP servers (next-devtools)
├── .claude
│   ├── settings.json               model, attribution off, permissions
│   ├── agents
│   │   ├── design
│   │   │   └── ui-qa.md
│   │   ├── quality
│   │   │   └── reviewer.md
│   │   └── research
│   │       └── docs-check.md
│   ├── rules
│   │   ├── engineering.md          always loaded
│   │   ├── server.md               actions, route handlers, src/lib, next.config.ts
│   │   ├── typescript.md           all .ts and .tsx files
│   │   └── ui.md                   components, pages, MDX, globals.css
│   └── skills                      installed by the skills CLI (D-003), one folder per skill
│       ├── frontend-design
│       ├── impeccable              plus its companion command skills
│       ├── shadcn
│       ├── vercel-react-best-practices
│       ├── web-design-guidelines
│       └── <next.js skill>         exact name recorded in D-003
└── docs
    ├── agents.md                   this file
    ├── decisions.md                every settled decision
    └── setup.md                    how the project was built
```

Not in the repo, because they live in your user profile: superpowers, find-skills, and the Context7 plugin. Modern Web Guidance (D-008) goes wherever its installer puts it; D-008 records the location.

## How Claude Code reads this folder

- It loads every `.md` file under `.claude/agents/`, including the subfolders.
- An agent is identified by the `name` field in its frontmatter, not by its folder or file name. Two agents with the same `name` conflict, even in different folders.
- The folders only organize the files for you. Moving a file between folders changes nothing for Claude Code.
- Keep only agent files in this folder. A README or notes file here would be read as an agent, which is why this guide lives in `docs/`.

## Adding an agent

1. **Check that you need one.** Add an agent only when a task is reading-heavy, repeats often, and returns a short report. One-off work stays with the orchestrator.
2. **Write a decision entry first,** in the planning chat: the agent's job, model, tools, and which folder it belongs to.
3. **Choose the folder.** Reuse `design/`, `quality/`, or `research/` when the job fits. Create a new folder only for a new kind of job, such as `content/` or `ops/`.
4. **Name the file** in lowercase kebab case, matching its `name` field: `content/case-study-editor.md` contains `name: case-study-editor`.
5. **Start from this template:**

```markdown
---
name: kebab-case-name
description: One or two sentences on when the orchestrator should call it and what it returns. Claude Code routes tasks by this text, so be specific.
model: sonnet
disallowedTools: Write, Edit, NotebookEdit
---

What the agent does, in one paragraph.

## Steps

1. ...

## Report format

- ...
```

6. **Add it** to the delegation table in `CLAUDE.md` and to the trees and table in this file.
7. **Check** with `/agents` in Claude Code, then commit: `chore: add <name> agent`.

## Candidates, not created

These could be added later, each with its own decision entry. They are listed so the folder names stay consistent, not as a plan to build them.

```text
.claude/agents
├── content
│   └── case-study-editor.md        turns project notes into an MDX case study draft
└── ops
    └── deploy-checker.md           reads the Vercel build log after Step 13
```

On the Pro plan, every extra agent spends usage, so keep the list short.