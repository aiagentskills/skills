# Skills Library

This repository is a catalog of reusable AI skills. Each skill is a self-contained package of guidance and metadata that an agent can load on demand to perform a focused task.

## What You Will Find Here

- Curated skill packs that cover UI/UX, performance, content creation, and data tasks.
- A consistent structure so skills can be discovered, loaded, and executed by tooling.
- Compiled guides that agents can read directly without additional context.

## How Skills Are Organized

- `skills/<skill-id>/` — one folder per skill (namespaces are allowed, such as `skills/anthropic/<skill-id>/`)
- Each skill folder includes:
  - `README.md` — scope, intended users, and usage notes
  - `SKILL.md` — name, description, and triggers
  - `AGENTS.md` — compiled guide for agents
  - `metadata.json` — versioning and ownership details
  - `rules/` — source rule files and templates

## How Subagents Are Organized

This repo also stores subagent definitions in a parallel top-level folder:

- `subagents/` — subagent definitions stored as Markdown files with YAML frontmatter

Subagents are specialized assistants with their own system prompts, tool access, and permission settings. Claude delegates to them when a task matches their description, which helps preserve main context, enforce constraints, and control cost. They are commonly used for high-volume tasks (e.g., exploration, test output, or research) so the main conversation stays focused.

For reference on subagent behavior, scopes, and configuration, see the Claude Code documentation: https://code.claude.com/docs/en/sub-agents

## Current Skills

Current skill folders in `skills/`:

- `action-creator`
- `add-admin-api-endpoint`
- `add-malli-schemas`
- `add-pattern`
- `add-uint-support`
- `agent-guardrails`
- `agent-identifier`
- `algorithmic-art`
- `algorithmic-art-modelscope`
- `analyzing-financial-statements`
- `app-review`
- `applying-brand-guidelines`
- `artifacts-builder`
- `ask-questions-if-underspecified`
- `at-dispatch-v2`
- `attack-tree-construction`
- `auth-implementation-patterns`
- `brand-guidelines`
- `cache-components`
- `campaign-planner`
- `candidate-evaluation`
- `canvas-design`
- `changelog-generator`
- `changeset-validation`
- `clojure-review`
- `clojure-write`
- `code-change-verification`
- `code-change-verification-js`
- `command-development`
- `command-name`
- `competitive-ads-extractor`
- `competitive-landscape`
- `concept-workflow`
- `configured-agent`
- `connect`
- `connect-apps`
- `connect-apps-plugin`
- `content-creator`
- `content-prd`
- `content-research-writer`
- `cookbook-audit`
- `create-database-migration`
- `create-plan`
- `create-pr`
- `create-unit-test-ask`
- `creating-financial-models`
- `creating-financial-models-modelscope`
- `data-storytelling`
- `developer-growth-analysis`
- `doc-coauthoring`
- `docs-review`
- `docs-sync`
- `docs-sync-js`
- `docs-write`
- `docstring`
- `document-skills`
- `docx`
- `domain-name-brainstormer`
- `electron-chromium-upgrade`
- `enter-services`
- `example-skill`
- `examples-auto-run`
- `examples-auto-run-js`
- `executive-briefing`
- `fact-check`
- `file-organizer`
- `final-release-review`
- `final-release-review-js`
- `find-bugs`
- `frontend-design`
- `g2-legend-expert`
- `g2-translation-guidelines`
- `g2-unit-testing-skills`
- `gemini-pr-creator`
- `gemini-skill-creator`
- `gerrit-storj`
- `hermes-tweet`
- `gh-address-comments`
- `hook-development`
- `image-enhancer`
- `implementing-jsc-classes-cpp`
- `implementing-jsc-classes-zig`
- `infographic-creator`
- `infographic-item-creator`
- `infographic-structure-creator`
- `infographic-syntax-creator`
- `infographic-template-updater`
- `integration-tests`
- `internal-comms`
- `invoice-organizer`
- `issue-maker`
- `kimi-cli-help`
- `kpi-dashboard-design`
- `landing-page-optimizer`
- `langsmith-fetch`
- `lead-research-assistant`
- `listener-creator`
- `mcp-builder`
- `mcp-integration`
- `meeting-insights-analyzer`
- `model-debugging`
- `monitor-experiment`
- `notion-knowledge-capture`
- `notion-spec-to-implementation`
- `openai-knowledge`
- `openai-knowledge-js`
- `openai-skill-creator`
- `openai-skill-creator-system`
- `openai-skill-installer`
- `openai-skill-installer-system`
- `patterns`
- `pdf`
- `plugin-settings`
- `postmortem-writing`
- `pptx`
- `pr-draft-summary`
- `pr-draft-summary-js`
- `product-prd`
- `product-strategist`
- `r2-glacier-migration`
- `raffle-winner-picker`
- `react-best-practices`
- `readme-writing`
- `resource-curator`
- `rule-identifier`
- `rust-errors`
- `sast-configuration`
- `scanning-tools`
- `security-compliance`
- `senior-security`
- `seo-review`
- `single-or-array-pattern`
- `skill-creator`
- `skill-creator-kimi`
- `skill-development`
- `skill-development-official`
- `skill-share`
- `skill-writer`
- `slack-gif-creator`
- `social-media`
- `solidity-security`
- `stripe-best-practices`
- `styling`
- `svelte`
- `tailored-resume-generator`
- `template-skill`
- `tempo-codegen`
- `test-coverage-improver`
- `test-coverage-improver-js`
- `test-with-spanner`
- `test-writer`
- `theme-factory`
- `tier-management`
- `tldraw-skill-creator`
- `typescript`
- `typescript-review`
- `typescript-write`
- `vercel-react-best-practices`
- `video-downloader`
- `voting-status`
- `web-artifacts-builder`
- `webapp-testing`
- `workflow`
- `write-concept`
- `write-docs`
- `write-e2e-tests`
- `write-example`
- `write-issue`
- `write-pr`
- `write-unit-tests`
- `writing-bundler-tests`
- `writing-dev-server-tests`
- `xlsx`
- `zig-system-calls`

## Learn More

Open any skill folder and start with its `README.md` to see what it covers and how it is meant to be used. For more detail, visit [https://aiagentskills.xyz/](https://aiagentskills.xyz/).
