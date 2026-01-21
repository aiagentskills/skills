---
name: agent-guardrails
description: General agent safety and workflow guardrails that prevent high-impact mistakes across tooling, verification, versions, integration layers, environment/config, import-time side effects, and high-risk actions. Use when defining or applying behavioral constraints for coding agents, repo automation rules, or operational safety checklists.
---

# General Agent Guardrails

## Purpose

Apply these rules to prevent high-impact agent mistakes (tooling drift, bypassed checks, version mismatches, integration bypasses, env/config corruption, serverless import side effects).

When unsure, consult:
- AGENTS.md for agent behavior and non-negotiables
- CONVENTIONS.md for repo-wide contracts (imports, build/runtime expectations, platform constraints)

If still unclear after checking those docs and existing code patterns: stop and ask.

---

## 1) Follow Existing Contracts (don't invent new ones)

- Prefer the repository's existing choices: tooling, frameworks, package manager, test runner, build pipeline, import style, integration patterns.
- Do not introduce "better" alternatives (new frameworks/tools, new config styles, new package managers, new test runners, mass import rewrites) as part of unrelated work.
- Before changing any cross-cutting behavior, confirm the standard by:
  1) checking AGENTS.md and CONVENTIONS.md
  2) inspecting existing scripts/config (package.json, lockfiles, CI config)
  3) mirroring dominant patterns in the codebase
- If a change would affect multiple files/systems or alter how the repo builds/tests/deploys: stop and ask for explicit approval.

(Examples of "contracts": package manager and lockfile, test framework, bundler import rules, gateway/adapter usage, serverless-safe patterns.)

---

## 2) Never Bypass Verification or Silence Failures

- Treat verification gates (hooks, CI, tests, lint, typecheck, build steps, security scans) as mandatory.
- Do not bypass, disable, weaken, or work around verification:
  - no `--no-verify`
  - no skipping steps conditionally to "make builds pass"
  - no turning errors into warnings without approval
- If a check fails:
  1) capture the exact failing command and error output
  2) fix the root cause or revert/isolate the change that introduced it
  3) re-run until green
- If you suspect it is pre-existing, provide evidence (baseline or prior green reference). Without evidence: treat as yours to fix.
- If the gate is flaky or misconfigured: gather logs and reproduction, then stop and ask.

---

## 3) Version and Entry-Point Discipline (APIs, types, imports)

- Match code to the versions installed in the repo (package.json and lockfile).
- Do not copy patterns from other major versions or random examples without verifying compatibility.
- Treat compiler/type errors as signals of mismatch (version, entrypoint, runtime), not noise.
- Prefer canonical entrypoints:
  - If the repo provides wrappers/re-exports for typed libs (ORMs, SDK clients, codegen types), use them.
  - Avoid mixing import paths that create duplicate type identities.
- If multiple patterns exist and it is unclear which is canonical: check CONVENTIONS.md, then stop and ask.

---

## 4) Use Canonical Integration Layers (don't bypass platforms/wrappers)

- Use the canonical integration layer already used in the repo.
- Do not bypass it by:
  - calling vendor SDKs directly
  - creating ad-hoc clients/config styles
  - hardcoding endpoints/keys when centralized routing is expected
- If the abstraction seems insufficient:
  - explain why
  - propose a minimal extension to the canonical layer
  - stop and ask for approval before implementing a parallel path

(This covers "provider functions vs gateway strings" and similar patterns for auth, payments, analytics, storage, etc.)

---

## 5) Environment and Deployment Reality (scope, platforms, reproducibility)

### Environment scope

- Keep env/config scoped to the runtime that consumes it (app/service/job), not the repo root.
- Do not assume `.env` is shared across apps/services, or that local/CI/prod behave the same.
- Identify the consumer runtime, find where it loads env, and apply changes at the narrowest valid scope.
- If scope is unclear: check CONVENTIONS.md, then stop and ask.

### Managed platform constraints

- Follow platform defaults and repo lockfile/tooling choices for deploy environments.
- Do not switch package managers/tooling in managed platforms unless explicitly documented and verified.
- Avoid conflicting lockfiles and non-reproducible installs.

### Safe config writes

- Treat env/config values as byte-sensitive.
- Do not introduce hidden whitespace/newlines when writing secrets/config.
- Use newline-safe write patterns (for example, `printf`) and sanity-check results.

---

## 6) Import-Time Purity (safe initialization across contexts)

- Assume imports may run during build/bundling/test discovery/SSR/workflow registration/cold start.
- Do not require runtime-only resources or perform side effects at module scope:
  - initializing clients that require secrets/config
  - opening network connections/listeners
  - filesystem writes, global patching, background timers
- Defer initialization to explicit runtime boundaries (handlers/jobs/CLI main) or lazy getters/factories.
- If unsure whether import-time code is safe: check CONVENTIONS.md, then stop and ask.

---

## 7) High-Risk Actions Require Explicit Approval (AGENTS.md)

- Do not implement or automate high-blast-radius operations by default (money movement, billing changes, permission changes, destructive data ops, bulk actions).
- If requested, check AGENTS.md and CONVENTIONS.md for the approved workflow; if not documented, stop and ask for explicit human approval.
