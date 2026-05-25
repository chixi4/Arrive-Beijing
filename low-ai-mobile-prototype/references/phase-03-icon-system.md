# Phase 03: Icon System

Use this phase when icons look inconsistent, are semantically wrong, are hand-drawn per page, or need to be converted from image-model targets into a reusable currentColor SVG library.

This module should be followed strictly. Icon drift is one of the fastest ways for a prototype to look low-quality.

## Non-Negotiables

- Icons are semantic assets, not page decorations.
- Do not draw page-specific SVGs inline unless prototyping a new icon before adding it to the library.
- Do not use a wrong icon because it is visually convenient.
- Do not fix one icon by changing its size in one page. Size, optical offset, and scale belong in the icon registry.
- Icons should render as `currentColor` so pages control color through CSS.
- Remove colored rounded icon backplates unless the design system explicitly requires them.

## Step 1: Inventory

Scan the codebase and produce or update `docs/ui/icon-inventory.json`.

Track:

- Semantic name.
- Current source: replica SVG, hand SVG, image, external library, missing.
- Pages where it appears.
- Whether it is semantically correct.
- Whether it needs calibration.

Group by meaning, not by page. Example decisions:

- `map`, `route`, and `navigation` may need separate icons if the UI uses them differently.
- `parking` and `car` should not be reused if one means self-driving parking and the other means generic vehicle.
- `message`, `mail`, and `notification` are not interchangeable.

## Step 2: Choose A 3x3 Batch

Each generation batch should contain at most 9 icons. Keep the batch visually related when possible.

For each icon, define:

- `name`: stable semantic key.
- `meaning`: one short description.
- `must_have`: visual elements that identify it.
- `avoid`: shapes that would confuse it with another icon.

## Step 3: Generate The Image Target

Use the image model to generate one square 3x3 board.

Prompt pattern:

```text
Create a clean 3x3 grid of black outline mobile UI icons on a pure white background.
Style: consistent rounded monoline, slightly bold stroke, no fill except tiny necessary accents, no shadows, no gradients, no colored backgrounds, no text, no labels.
Canvas: square, evenly spaced 3x3 cells, each icon centered and optically balanced.
Icons in reading order:
1. [name and visual description]
...
9. [name and visual description]
The result must be suitable for converting into currentColor SVG icons.
```

If the first result is thin, inconsistent, decorative, or includes text, regenerate with stricter wording. Do not continue with a weak target.

## Step 4: Clean And Slice

Use `scripts/icon_sheet_tools.py`.

```bash
python3 /Users/yuookie/.codex/skills/low-ai-mobile-prototype/scripts/icon_sheet_tools.py clean raw-board.png board-clean.png --threshold 180
python3 /Users/yuookie/.codex/skills/low-ai-mobile-prototype/scripts/icon_sheet_tools.py slice board-clean.png out/icons --rows 3 --cols 3 --prefix board-01 --trim --padding 4
```

Inspect the slices. If an icon is visually off-center, too small, or semantically unclear, either regenerate the board or correct the icon registry with an optical transform after the mask step.

## Step 5: CSV / Alpha Simulation

Create a binary CSV representation for each target. This is not OCR; it is a pixel mask simulation for icon geometry.

```bash
python3 /Users/yuookie/.codex/skills/low-ai-mobile-prototype/scripts/icon_sheet_tools.py csv out/icons/board-01-01.png out/csv/board-01-01.csv --preview out/preview/board-01-01.png
```

Use the preview to verify the binary target still matches the intended icon.

## Step 6: SVG Mask Replica

Convert the cleaned single icon into a currentColor SVG mask:

```bash
python3 /Users/yuookie/.codex/skills/low-ai-mobile-prototype/scripts/icon_sheet_tools.py svg-mask out/icons/board-01-01.png out/svg/search.svg
```

The generated SVG is allowed to be mechanically dense. If the project already has a better mask compression script, use that, but preserve the same target/diff discipline.

## Step 7: Pixel Diff

Compare the SVG-rendered output or generated preview against the cleaned target. If the project has a browser renderer, use it. Otherwise compare the binary PNG outputs available in the workflow.

```bash
python3 /Users/yuookie/.codex/skills/low-ai-mobile-prototype/scripts/icon_sheet_tools.py diff target.png replica.png --limit 0.05
```

Acceptance rule:

- `diffRatio <= 0.05` is acceptable.
- `0.05 < diffRatio <= 0.10` requires visual judgment and documentation.
- `diffRatio > 0.10` must be reworked unless the target itself is bad and is being replaced.

## Step 8: Registry Integration

Add icons to a single icon registry. Recommended shape:

```js
const ICON_REPLICA_LIBRARY = {
  search: {
    viewBox: "0 0 64 64",
    body: "<path d=\"...\"/>",
    scale: 1,
    dx: 0,
    dy: 0
  }
};
```

Rendering rules:

- `renderIcon(name)` first checks the replica library.
- A simple hand-authored fallback library may exist, but missing replicas must be visible in inventory.
- Components receive semantic names, not SVG strings.
- Optical corrections are stored in registry metadata.

## Step 9: Preview And Replace

- Add every icon batch to the design-system preview.
- Replace page-level icon markup with the shared icon component.
- Remove obsolete PNG/SVG references from pages when possible.
- Re-run inventory and asset checks.

## Failure Modes

- **Different batches feel different**: regenerate all related batches with one shared prompt and stroke instruction.
- **Icon looks too small**: trim to ink bounds, add consistent padding, then use registry scale only if needed.
- **Search icon looks left-heavy**: use a small optical `dx`, not a page-specific margin.
- **Vehicle icons look smaller than square icons**: set registry scale for that semantic icon.
- **Icons disappear on deployment**: make sure replica JS/SVG files are included in runtime assets, or embed critical definitions in the main bundle.

## Phase Done Means

- Inventory reports no unknown or unintended icons.
- High-frequency icons use the shared registry.
- Design-system preview shows every icon batch.
- Icon files required by runtime deployment exist.
- The process and thresholds are recorded in project docs.

