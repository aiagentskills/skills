# Vercel React Best Practices

Performance optimization guidance for React and Next.js applications, authored by Vercel Engineering. This skill is intended for agents that generate, review, or refactor React/Next.js code with an emphasis on eliminating waterfalls and trimming bundle size.

## What’s Inside

- `AGENTS.md` — compiled guide the agent can consume directly
- `SKILL.md` — name/description/trigger metadata
- `metadata.json` — version, owner, and references
- `rules/` — source rules (one file per rule), plus `_sections.md` and `_template.md` for structure

No build tooling is committed here; if you regenerate `AGENTS.md` from `rules/`, run your own script or update the compiled file manually to keep it in sync.

## Adding or Editing Rules

1. Copy `rules/_template.md` to `rules/<area>-<slug>.md` (e.g., `async-parallel.md`).
2. Use the prefix that matches the section:
   - `async-` Eliminating Waterfalls
   - `bundle-` Bundle Size Optimization
   - `server-` Server-Side Performance
   - `client-` Client-Side Data Fetching
   - `rerender-` Re-render Optimization
   - `rendering-` Rendering Performance
   - `js-` JavaScript Performance
   - `advanced-` Advanced Patterns
3. Fill in the frontmatter, include incorrect vs correct examples, and explain impact.
4. Rebuild/update `AGENTS.md` so the compiled guide matches the rule sources.

## Scope

Use this skill when working on:
- React components, hooks, and data-fetching patterns
- Next.js route handlers, server components, and server actions
- Bundle-size optimizations and rendering performance fixes

Originally created by [@shuding](https://x.com/shuding) at [Vercel](https://vercel.com).
