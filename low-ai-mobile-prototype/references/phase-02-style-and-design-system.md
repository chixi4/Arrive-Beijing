# Phase 02: Style And Design System

Use this phase after page coverage is stable. The goal is to turn visual references into reusable tokens, recipes, and components instead of page-level decoration.

## Core Principle

Do not copy only surface colors and border radii. Extract higher-level design behavior: density, grouping, hierarchy, typography rhythm, media treatment, and when information belongs in one grouped card instead of many separate cards.

## Visual Anchor Workflow

1. Select or generate a small set of representative anchor screens.
2. Normalize them to the same mobile aspect ratio before comparing.
3. Recreate anchor pages in HTML/CSS if pixel calibration matters.
4. Screenshot the recreated pages at the same size.
5. Compare the screenshots to anchors with a documented threshold or visual rubric.
6. Convert stable choices into tokens and component rules.

## Token Categories

Document semantic tokens, not one-off values:

- Color: page background, surface, line, primary, danger, warning, success, muted text.
- Typography: topbar title, section title, body, secondary text, numeric emphasis.
- Radius: control, small card, standard card, media, pill.
- Spacing: page padding, section gap, card padding, cell padding, grid gap.
- Elevation: default surface border, subtle shadow, media shadow, pressed state.
- Motion: carousel snap, pressed feedback, modal transition.

## Component Baseline

For mobile service prototypes, standardize these first:

- App shell and fixed phone preview.
- Topbar with back/action slots.
- Search bar.
- Text tab row with active underline and optional badge.
- Segmented control when choices are mutually exclusive modes.
- Bottom navigation.
- Section header.
- Card and grouped cell list.
- Badge/tag.
- Primary and secondary buttons.
- Form fields and prototype feedback.
- Media card / image viewport.
- Modal or confirmation sheet.

## Density Translation

When the user says the UI feels sparse, do not only reduce margins. Check:

- Are repeated simple items incorrectly split into separate cards?
- Should they become one grouped list with dividers?
- Are section gaps too large compared with card padding?
- Are rows stretched by a fixed-height parent?
- Are icons sitting inside unnecessary colored tiles?
- Is auxiliary text too small or too bold?
- Are title weights fighting with content weights?

When the user says "AI feel", check:

- Overuse of gradients, glass, glow, huge radius, floating cards, one-note palettes.
- Random colorful icon backgrounds.
- Decorative images that do not carry product information.
- Inconsistent density between pages.
- Too much whitespace under cards or between sections.
- Generic copy or labels that do not match the source.

## Style Recipe File

Keep design behavior in a structured recipe file. Example:

```yaml
mobile_service:
  canvas:
    width: 430
    min_height: 860
  cards:
    radius: standard-card
    border: subtle
    shadow: low
  grouped_lists:
    row_height: 52-58
    divider: inset
  tabs:
    style: text-underline
    active_color: primary
```

## Design System Preview

If the project is an SPA prototype, add a route such as `#/design-system` that previews:

- Color tokens.
- Type scale.
- Radius tokens.
- Buttons.
- Badges.
- Topbar and tab row.
- Cards and cell groups.
- Forms.
- Icons.

This page is a QA surface, not a marketing page.

## Validation

- Screenshot at the fixed mobile size.
- Inspect desktop preview scaling if the user will view it in a desktop browser.
- Check text wrapping in the longest Chinese labels.
- Check bottom bars and sticky topbars do not steal space or create hidden overflow.
- Use `scripts/screenshot_mobile.mjs` for deterministic screenshots:

```bash
node /Users/yuookie/.codex/skills/low-ai-mobile-prototype/scripts/screenshot_mobile.mjs --url http://127.0.0.1:4173/#/design-system --out /tmp/design-system.png --width 430 --height 860
```

## Phase Done Means

- Tokens exist and are used by real pages.
- Component rules are documented.
- At least one preview page shows the system.
- A visual issue can be fixed by changing the system, not every page separately.

