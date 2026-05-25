# Phase 04: Bitmap Assets

Use this phase for realistic station images, hero images, splash images, navigation maps, AR views, backgrounds, or any visual that would be weak if drawn with simple SVG.

## Asset Decision Rule

Use bitmap assets when the visual needs:

- Realistic architecture or environment cues.
- Texture, lighting, depth, or spatial realism.
- A hero or splash image.
- 3D, flat map, or AR-style navigation imagery.
- A specific object or place whose silhouette matters.

Use HTML/CSS/SVG when the visual is:

- A simple icon.
- A control or layout primitive.
- A chart or diagram that must be data-driven.
- Text-heavy UI content.

## Planning

Create or update an asset plan with:

- Asset ID.
- Page usage.
- Required aspect ratio and slot size.
- Source/reference strategy.
- Prompt summary.
- Final file path.
- Variants needed: portrait, landscape, thumbnail, darkened, cropped.
- Known inaccuracies.

## Image Model Workflow

1. Write the intended UI slot first: size, crop behavior, overlay text, and what edges must align.
2. Gather visual facts from allowed sources. If using web research, use real references but do not copy protected images into the project unless licensed.
3. Write a text prompt that describes the subject, style, camera angle, crop, and forbidden elements.
4. Generate.
5. Visually inspect the image in the actual UI slot, not only as a standalone file.
6. If it fails, revise the prompt and regenerate.
7. Save only useful final candidates into the project asset folder.
8. Update the asset plan and git.

## Station / Place Images

For each place, prefer two variants:

- Landscape: homepage hero, media card, wide preview.
- Portrait: carousel card or selection tile.

Prompt structure:

```text
Create a polished mobile app asset of [specific place].
Show recognizable architectural features: [features].
Composition: [landscape/portrait], [camera angle], subject fits the crop, no text, no people close-up, no logos.
Style: realistic but clean government transit service app visual, soft daylight, controlled contrast, not cinematic, not fantasy, no heavy blur.
```

If multiple places look too similar, add place-specific architectural features and regenerate.

## Navigation Images

Separate navigation modes:

- 3D overview: layered floors, clear vertical separation, simplified geometry, consistent color palette.
- 3D single floor: one selected layer prominent, other layers absent or ghosted only if useful.
- Flat map: simplified station floor plan, legible zones, no fake small text.
- AR: realistic camera-like station corridor or plaza overlay, minimal arrows and markers.

Do not put UI controls inside the generated image if the web page will provide those controls. Generated images should be content, not duplicate the interface chrome.

## Image Fitting QA

Check inside the browser:

- Does the image touch the intended card edges?
- Is it cropped or stretched intentionally?
- Does overlay text remain readable?
- Are left/right/bottom gradients strong enough?
- Is there unwanted blank space below the image?
- Does the image style match the current design system?
- Are all referenced files included in deployment?

## Validation

Use asset checks after wiring images:

```bash
node /Users/yuookie/.codex/skills/low-ai-mobile-prototype/scripts/check_assets.mjs --root . --html index.html --include-css
```

Use fixed mobile screenshots for image-heavy pages:

```bash
node /Users/yuookie/.codex/skills/low-ai-mobile-prototype/scripts/screenshot_mobile.mjs --url http://127.0.0.1:4173/#/nav/map --out /tmp/nav.png --width 430 --height 860
```

## Phase Done Means

- Asset plan is updated.
- Final assets live under project paths, not temporary generation folders.
- Portrait/landscape variants exist when required by UI slots.
- Browser screenshots confirm image fit.
- Asset checker reports no missing files.

