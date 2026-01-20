# Skills Library

This repository hosts self-contained AI skills. Each skill packages domain guidance, runnable examples, and trigger metadata so agents can load just what they need.

## Layout

- `skills/<skill-id>/` — one folder per skill
  - `README.md` — scope, usage, and maintenance notes for the skill
  - `SKILL.md` — name/description/trigger metadata
  - `AGENTS.md` — compiled guide an agent can load directly
  - `metadata.json` — version, owner, and reference links
  - `rules/` — source rule files and templates

## Current Skills

- `vercel-react-best-practices` — React and Next.js performance optimization guidelines from Vercel Engineering.
- `landing-page-optimizer` — Conversion-focused landing page optimization playbook.
- `algorithmic-art`
- `brand-guidelines`
- `canvas-design`
- `doc-coauthoring`
- `docx`
- `frontend-design`
- `internal-comms`
- `mcp-builder`
- `pdf`
- `pptx`
- `skill-creator`
- `slack-gif-creator`
- `theme-factory`
- `web-artifacts-builder`
- `webapp-testing`
- `xlsx`

## Adding a New Skill

1. Create `skills/<skill-id>/` and add a `README.md` describing the scope and intended users.
2. Add `SKILL.md` with the frontmatter (name, description, triggers) your agent runtime expects.
3. Place your guidance in `rules/` (include a `_template.md` if helpful) and commit any compiled outputs such as `AGENTS.md`.
4. Capture ownership details in `metadata.json` (version, organization, references).
5. Update the **Current Skills** list above so discoverability stays up to date.
