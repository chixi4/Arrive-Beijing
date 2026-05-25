# Phase 01: Skeleton And Content Facts

Use this phase when starting from screenshots, PDFs, Obsidian notes, or rough teacher prototypes. The goal is to preserve structure and facts before visual redesign.

## Inputs

- User instructions and constraints.
- Source screenshots, PDFs, videos, or exported image folders.
- Existing project files and docs.
- User-written notes that explain page logic.

## Workflow

1. Read project instructions first. If the repo has required docs, open them before editing.
2. Identify the target platform: static web, SPA, mobile preview size, framework or no framework, deployment target.
3. Build a page map before building UI. Include route, source reference, page goal, key click targets, and status.
4. Build a content inventory from human visual reading and user-provided text only.
5. Mark uncertain text explicitly. Do not silently invent missing Chinese copy.
6. Implement a clickable baseline before visual polish.
7. If page count is high or copy accuracy is more important than polish, use screenshot pages with transparent hotspots as the first baseline.
8. Once route coverage is stable, migrate high-value pages into real HTML components.

## Screenshot-Hotspot Baseline

Use this approach when the original UI has many pages and the user cares about exact page hierarchy/copy:

- Store source screenshots in a predictable asset folder.
- Render each screenshot inside the fixed mobile viewport.
- Add transparent buttons or anchors over known click areas.
- Keep the screenshot as the visual fact source while the click graph is still being discovered.
- Replace pages with real HTML only after their copy and interactions are stable.

Do not use this as a final shortcut when the user asks for real component reconstruction. It is a scaffold for coverage and fact preservation.

## Page Map Template

```markdown
| Route | Source | Page Goal | Key Clicks | Status |
| --- | --- | --- | --- | --- |
| `#/example` | Screenshot 01 | Main service page | tab A, item B, back | covered |
```

## Content Inventory Rules

- Separate "observed copy" from "inferred copy".
- Keep screenshots or user notes as the final source when conflicts occur.
- Do not normalize punctuation, station names, labels, or date formats unless the user asks.
- Record business rules and teacher comments separately from UI copy.
- If a page uses generated images, do not read text facts from those images unless the user explicitly authorizes that image as a content source.

## Interaction Coverage

At minimum, verify:

- Main entry flow.
- All bottom navigation items.
- All tabs and segmented controls.
- List item detail entry.
- Back buttons.
- Primary action buttons.
- Form prototype feedback.
- Role switches, if the product has multiple roles.
- Empty/loading/confirmation states when described.

## Validation

Use the project stack if it has one. For static HTML prototypes, useful checks are:

```bash
node /Users/yuookie/.codex/skills/low-ai-mobile-prototype/scripts/check_routes.mjs --root . --files app.js,index.html
node /Users/yuookie/.codex/skills/low-ai-mobile-prototype/scripts/check_assets.mjs --root . --html index.html --include-css
```

If the route script cannot infer declared routes, create a small project-local route manifest and pass it with `--routes-file`.

## Phase Done Means

- Page map exists and covers all known pages.
- Content inventory exists and records uncertain copy.
- Main click flow is reachable.
- Missing pages or deliberately stubbed actions are documented.
- The user can navigate the prototype without depending on explanation from the agent.

