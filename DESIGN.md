---
name: Expediente
description: "A papelería desk-blotter system for websites that get found."
colors:
  primary: "#6a4a8a"
  paper: "#f3efe6"
  paper-2: "#e8e2d4"
  kraft: "#cbb892"
  ink: "#14110c"
  ink-soft: "#3a342c"
  line: "#1a1712"
  orchid: "#6a4a8a"
  orchid-deep: "#4e326c"
  on-orchid: "#f3efe6"
typography:
  display:
    fontFamily: "'Bodoni Moda Variable', 'Bodoni Moda', 'Times New Roman', serif"
    fontSize: "clamp(3.6rem, 13vw, 9.25rem)"
    fontWeight: 700
    lineHeight: 0.84
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "'Bodoni Moda Variable', 'Bodoni Moda', 'Times New Roman', serif"
    fontSize: "3.25rem"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  title:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  body:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    letterSpacing: "0.18em"
  field:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.65
  button:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.65
    letterSpacing: "0.04em"
rounded:
  none: "0px"
  sm: "2px"
spacing:
  wrap: "1180px"
  page-gutter: "1.25rem"
  layout-gap: "clamp(1rem, 4vw, 2rem)"
  header-height: "4.25rem"
  tab-height: "2.15rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-orchid}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "0.7rem 1.2rem"
  button-primary-hover:
    backgroundColor: "{colors.orchid-deep}"
    textColor: "{colors.on-orchid}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "0.7rem 1.2rem"
  button-secondary-hover:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.field}"
    rounded: "{rounded.sm}"
    padding: "0.7rem 0.9rem"
  folder:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "clamp(1.5rem, 3vw, 2.25rem)"
  folder-orchid:
    backgroundColor: "{colors.orchid}"
    textColor: "{colors.on-orchid}"
    rounded: "{rounded.none}"
    padding: "clamp(1.5rem, 3vw, 2.25rem)"
  folder-kraft:
    backgroundColor: "{colors.kraft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "clamp(1.5rem, 3vw, 2.25rem)"
  navigation:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-soft}"
    height: "{spacing.header-height}"
    padding: "0 1.25rem"
  file-tab:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    height: "{spacing.tab-height}"
    padding: "0 1.4rem"
  tag:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.2rem 0.6rem"
---

# Design System: Expediente

## Overview

**Creative North Star: "Expediente / papelería desk blotter"**

Expediente treats the site as a sheet of careful paperwork on a real desk: warm paper, warm-black ink, and a single uncommon purple that reads like a folder field. It is editorial without becoming precious—large type carries the offer, while labels, rules, and tabs make the work feel filed, inspectable, and ready to ship.

The world is intentionally not a dark name-role-cards portfolio. It leaves air in the first viewport, uses no gradients, and gets depth from paper texture, tonal surfaces, hairline borders, and the overlap of rising files. The home story moves from the offer to proof to a clear email action without adding decorative noise.

**Key Characteristics:**
- Paper-first surfaces with a repeated `paper.webp` desk texture.
- Bodoni Moda for display and Archivo for body copy, labels, and controls.
- Manganese purple as a rare folder field, action color, link color, and focus color.
- Hairline ink rules, square folders, gently softened 2px controls, and die-cut tabs.
- Sticky, rising files that make the work feel organized rather than card-grid generic.

## Colors

The palette is warm, paper-first, and restrained. Purple is a field and an action—not a background gradient—and the two ink tones keep the page legible without introducing a second brand color.

### Primary
- **Manganese Purple** (`colors.orchid`): The main folder field, solid primary action, selected text surface, link accent, and focus-ring color.
- **Deep Manganese** (`colors.orchid-deep`): The pressed/hover state and the darker edge used to finish purple surfaces.

### Secondary
- **Kraft Paper** (`colors.kraft`): The warm alternate file surface used to separate method content from the paper and purple files.

### Neutral
- **Warm Paper** (`colors.paper`): The default desk, file, folder, and form background.
- **Paper Shadow** (`colors.paper-2`): The quiet tonal shift for button hover and code surfaces.
- **Warm Black Ink** (`colors.ink`): Headlines, primary copy, and structural text.
- **Soft Ink** (`colors.ink-soft`): Supporting copy, labels, metadata, and secondary navigation text.
- **Hairline** (`colors.line`): One-pixel rules and boundaries.
- **On Orchid** (`colors.on-orchid`): Inverse text and controls on purple fields; it intentionally shares the paper color.

### Named Rules
**The Purple Folder Rule.** Purple should read as a tangible folder field or a deliberate action. Do not dilute its rarity with gradients, decoration, or an all-purple page.

**The Paper-First Rule.** When a surface has no stronger semantic reason to change, it stays paper.

## Typography

**Display Font:** Bodoni Moda Variable (with Bodoni Moda, Times New Roman, serif fallbacks)
**Body Font:** Archivo Variable (with Archivo, system-ui, sans-serif fallbacks)
**Label/Mono Font:** Archivo Variable is also the label face; code uses the system monospace stack from the stylesheet.

**Character:** Bodoni Moda supplies the editorial contrast and the unmistakable oversized voice. Archivo keeps the interface practical: labels are compact and tracked, body copy is quiet, and actions read like clear paperwork rather than product chrome.

### Hierarchy
- **Display** (700, `clamp(3.25rem, 11vw, 8.25rem)`, line-height `0.86`, letter-spacing `-0.03em`): The left-stacked hero offer and large page titles.
- **Headline** (700, `clamp(1.85rem, 4vw, 3.25rem)`, line-height `1.02`, letter-spacing `-0.025em`): File headings, folder headings, and major section titles.
- **Title** (650, `1.2rem`, line-height `1.25`, letter-spacing `-0.015em`): Process headings and compact work titles.
- **Body** (400, `1.0625rem`, line-height `1.65`): Explanatory copy, with ledes held to roughly 58–60ch and prose capped near 68ch.
- **Label** (600, `0.6875rem`, letter-spacing `0.18em`, uppercase): Tabs, file kickers, footer labels, and small editorial metadata. Navigation uses the same face at `0.16em` tracking; the wordmark uses `0.75rem` and `0.18em`.

### Named Rules
**The Two Inks Rule.** Bodoni carries display emphasis; Archivo carries every functional or explanatory voice. Do not introduce a third type family for UI decoration.

## Layout

The layout is a centered paper desk rather than a card grid. The shared wrapper is `min(1180px, 100% - 2.5rem)`, centered with a `1.25rem` mobile gutter. The sticky header is `4.25rem` high. The main hero fills `calc(100svh - 4.25rem)`, aligns its display offer to the bottom, and leaves deliberate empty paper above it.

The home surface uses a negative `-2.75rem` file-stack offset followed by full-viewport-height files that stick below the header as the visitor scrolls. File and folder padding expands with `clamp()` rather than switching to a dense dashboard rhythm. Content stays readable at roughly 58–68ch. Work and post rows become two-column layouts at `720px`; the process grid and method rail become columns at `800px`; the page split becomes two columns at `880px`. Below `640px`, navigation can scroll horizontally and labels shrink. The Start action stays pinned outside the scrolling nav.

## Elevation & Depth

This is flat by default. There are no gradients and no decorative floating-card shadows. Depth comes from the repeated paper texture, the paper/kraft/purple tonal shifts, one-pixel rules, and the controlled overlap of sticky files. The translucent header uses a paper color mix so the desk remains present while content passes beneath it.

### Shadow Vocabulary
- **File overlap** (`box-shadow: 0 -18px 28px rgb(20 17 12 / 0.08)`): The only structural shadow; it separates each rising file from the one it covers.

### Named Rules
**The Flat Desk Rule.** Keep surfaces flat at rest. Use texture, tone, rules, and the file overlap shadow to make depth—not gradients, glass, or generic elevation presets.

## Shapes

Folders and files are square sheets with a one-pixel ink boundary. Controls and fields use the only recurring radius in the system: a restrained `2px`. Tags are outlined rectangles, not pills. The signature tab is a die-cut silhouette: a centered label sits in a `2.15rem` strip with clipped `12px` top corners, an inherited surface color, and no bottom border so it reads as a sheet tab.

Chips are not rounded chips in the usual product-UI sense. They are inline words separated by a hairline rule and padding. The paper grain is a repeated image surface (`/paper.webp`, `1800px` background size), not a decorative gradient.

### Named Rules
**The Die-Cut Rule.** Use the clipped tab silhouette for filing cues; do not turn every control into a pill or rounded card.

## Components

### Buttons
- **Character:** Direct, ink-on-paper actions with one unmistakable purple primary.
- **Shape:** A near-square control with a `2px` radius, one-pixel ink border, and `0.7rem 1.2rem` padding.
- **Primary:** `colors.orchid` background with `colors.on-orchid` text; the nav CTA uses the compact `0.5rem 0.9rem` padding, `0.6875rem` text, `0.12em` tracking, and uppercase treatment.
- **Hover / Focus:** Primary shifts to `colors.orchid-deep`; secondary shifts to `colors.paper-2`. All focus-visible states use a `2px` purple outline with `3px` offset.
- **Inverse:** On a purple file, the solid button reverses to paper background and deep-purple text; the outline button uses paper borders and text.

### Chips
- **Style:** Inline Archivo text at `0.875rem`, transparent by default, with `0.45rem 1.25rem` flex gaps.
- **State:** Each item after the first receives a one-pixel `currentColor` left rule and `1.25rem` left padding. They identify technologies or deliverables; they are not filter pills.

### Cards / Containers
- **Character:** A folder is a sheet, not a floating card.
- **Corner Style:** Square (`0px`) for folders and files; only controls use `2px`.
- **Background:** `colors.paper` by default, `colors.orchid` for highlighted fields, and `colors.kraft` for the method file.
- **Shadow Strategy:** No local shadow on folders. File overlap uses the single shadow defined in Elevation & Depth.
- **Border:** One-pixel `colors.line` boundary; purple surfaces use `colors.orchid-deep` at their top/tab boundary.
- **Internal Padding:** `clamp(1.5rem, 3vw, 2.25rem)` for folder cards; full files use larger viewport-relative padding.

### Inputs / Fields
- **Style:** Paper background, one-pixel ink border, `2px` radius, and `0.7rem 0.9rem` internal padding. The label wrapper is a grid with a `0.35rem` gap.
- **Focus:** Two-pixel purple outline with a two-pixel offset; no glow or border animation.
- **Error / Disabled:** No bespoke error or disabled skin is implemented; preserve the same paper-and-ink language if those states are added.

### Navigation
- **Style:** Sticky header at the top of the paper, with a 1px bottom rule and a paper `color-mix()` background. The brand is uppercase Archivo at `0.75rem`, 700 weight, and `0.18em` tracking. Links are uppercase, `0.6875rem`, 600 weight, and `0.16em` tracking.
- **States:** Default navigation is soft ink; hover and current-page states use warm black. The CTA is the compact solid purple button.
- **Mobile:** At `640px`, links may scroll horizontally and reduce to `0.625rem`. The CTA stays visible: full “Start a project” on wide screens, compact “Start” at `720px` and below.

### File Stack / Die-Cut Tab
The signature component is a sequence of sticky files. Each file is at least one viewport tall, begins with a one-pixel top rule, and sticks below the header while the next file rises over it. Its tab is positioned `2.15rem` above the sheet, inherits the sheet color, uses a one-pixel boundary, and clips its top corners with `polygon(12px 0, calc(100% - 12px) 0, 100% 100%, 0 100%)`. The first purple tab is the memorable `Work / 04 files` filing cue; later tabs reuse the same geometry for Offer, How I work, and Start.

### Stills
Generated photographs live under `/images/` as WebP (`shopfront`, `folders`, `found-street`, `credential`). They sit inside files, never in the first viewport. Caption them as conceptual when a viewer could mistake them for a client photo. No faces, logos, or readable in-image text.

### Plates
Hairline grids, not cartoon scenes: Hours/Map/Contact/Search, Token/Session/File, and Scope/Preview/Tests/Handover. Type and rules only.

## Do's and Don'ts

### Do:
- **Do** let `colors.paper` and the repeated paper texture be the default canvas.
- **Do** use Bodoni Moda for the display/headline hierarchy and Archivo for body, labels, navigation, and controls.
- **Do** reserve `colors.orchid` for folder fields, primary actions, links, selection, and focus; use `colors.orchid-deep` for their pressed/edge state.
- **Do** keep structure visible with one-pixel ink rules and use the `2px` radius only where the CSS already does.
- **Do** use the file/tab geometry and rising sticky overlap when a surface needs to feel like an Expediente, not a generic list of cards.

### Don't:
- **Don't** bring back a dark name-role-cards portfolio or replace the paper desk with a dark app-shell treatment.
- **Don't** add gradients, glossy glass, or a new shadow vocabulary.
- **Don't** turn the purple accent into a full-page wash, decorative pattern, or pill system.
- **Don't** substitute rounded cards for the square folder/file silhouette or replace hairline rules with heavy separators.
- **Don't** introduce another display or UI type family without changing the established two-font system deliberately.
