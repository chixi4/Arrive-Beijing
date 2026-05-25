---
name: low-ai-mobile-prototype
description: Use when turning low-fidelity mobile app screenshots, teacher prototypes, Obsidian specs, or image-heavy UI drafts into polished low-AI-feel mobile static web prototypes with HTML/CSS/JS, including page skeletons, content facts, style recipes, design systems, icon workflows, bitmap asset production, verification, documentation, and git checkpoints.
---

# Low AI Mobile Prototype

## Purpose

Use this skill to convert rough mobile UI references into a polished, clickable, static mobile web prototype. The target output is normally pure HTML/CSS/JS with a fixed mobile preview, clear route coverage, preserved Chinese copy, reusable design tokens, systematic icons, managed bitmap assets, verification evidence, and git history.

This is a workflow skill. Load only the reference file for the current phase.

## Hard Rules

- Read the user's project instructions and local docs before editing.
- Do not use OCR, bitmap-to-text, image-to-CSV, or automated recognition to extract UI copy. Copy must come from human visual reading or an existing user-provided text source.
- Do not treat generated images as content facts. Generated images can guide style and supply assets, not decide page copy or business logic.
- Prefer page coverage and click-flow correctness before visual polish.
- Keep project-specific discoveries in the project's docs, not in this skill.
- Keep every meaningful implementation step verifiable: local preview, route checks, asset checks, screenshots, or pixel/image checks as appropriate.
- Use git checkpoints for project changes when the workspace is a git repo.

## Phase Router

1. **Skeleton and content facts**: read `references/phase-01-skeleton-and-content.md` when starting a prototype, building route coverage, extracting page hierarchy, preserving copy, or making a screenshot-hotspot baseline.
2. **Style and design system**: read `references/phase-02-style-and-design-system.md` when creating visual anchors, extracting tokens, building component primitives, or reducing "AI feel" through density and hierarchy rules.
3. **Icon system**: read `references/phase-03-icon-system.md` when auditing icons, generating 3x3 icon sheets, converting targets into currentColor SVG masks, or replacing page-level ad hoc icons.
4. **Bitmap assets**: read `references/phase-04-bitmap-assets.md` when producing station/building/hero/navigation/AR/background images or adapting them into portrait and landscape UI slots.

Do not jump to a later phase if the previous phase's facts are still unclear. If the user asks for a later phase directly, do the minimum context check needed to avoid corrupting content or routes.

## Standard Deliverables

For a new project, create or update these project-local docs unless the repo already has equivalent files:

- `docs/page-map.md`: routes, source references, page goals, key clicks.
- `docs/content-inventory.md`: manually read copy and uncertain text notes.
- `docs/working-notes.md`: decisions, findings, risks, verification notes, git checkpoints.
- `docs/ui/style-recipes.yaml`: visual rules extracted from anchors.
- `docs/design-tokens.md`: token names and intended use.
- `docs/ui/icon-inventory.json`: semantic icon inventory and status.
- `docs/asset-plan.md`: bitmap asset list, sources, variants, usage, and regeneration notes.

Use local naming if the repo already has a convention, but preserve the same responsibilities.

## Useful Scripts

Scripts in this skill are generic helpers. Run them with `--help` before first use:

- `scripts/check_routes.mjs`: compare clickable hash targets against declared routes or a route manifest.
- `scripts/check_assets.mjs`: verify local HTML/CSS/JS/image asset references exist.
- `scripts/screenshot_mobile.mjs`: capture a fixed-size mobile screenshot with Chrome headless.
- `scripts/bump_cache_version.mjs`: update JS/CSS cache-busting query strings in HTML files.
- `scripts/icon_sheet_tools.py`: slice 3x3 icon boards, threshold targets, create CSV masks, diff binary targets, and emit currentColor SVG masks.

## Closeout Checklist

Before considering a phase done:

- The relevant project doc was updated.
- The relevant route/page/asset/icon checks were run or a reason is recorded.
- A mobile screenshot or visual check was made for user-facing UI changes.
- The git status is understood; unrelated user changes were not reverted.
- The final note states what changed, what was verified, and what remains risky.

