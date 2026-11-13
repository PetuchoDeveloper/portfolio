---
name: Dark Dossier
description: "A case file that moves: evidence on a desk, a globe of pages, and an ink pad to leave a mark."
colors:
  onyx: "#161616"
  onyx-2: "#1B1B1D"
  panel: "#202022"
  panel-2: "#242427"
  line: "#2E2E31"
  line-strong: "#3D3D42"
  bone: "#ECE7DE"
  bone-soft: "#A8A296"
  violet: "#7C4FE0"
  violet-deep: "#6936CC"
  on-violet: "#FFFFFF"
  violet-text: "#A182F2"
  desk: "#0B0B0C"
  paper: "#F3EFE6"
  paper-2: "#EAE4D7"
  kraft: "#D2C2A2"
  kraft-2: "#DDD2BE"
  paper-line: "#C7BFAF"
  paper-line-strong: "#777065"
  ink: "#17130F"
  ink-soft: "#5D564D"
  manganese: "#6A4A8A"
  manganese-deep: "#4E326C"
  on-manganese: "#F7F2E8"
  manganese-text: "#553877"
  brass: "#C9A15A"
  brass-paper: "#7D5E22"
  brass-paper-mark: "#A57C2C"
  brass-stamp: "#9A7432"
  paper-desk: "#CBBE9F"
  tile-bone: "#ECE7DE"
  tile-kraft: "#CDB68B"
  tile-violet: "#7C4FE0"
  tile-onyx: "#1E1E21"
typography:
  display:
    fontFamily: "'Fraunces Variable', 'Fraunces', 'Times New Roman', serif"
    fontSize: "clamp(3.1rem, min(11.5vw, 15.5svh), 8.75rem)"
    fontWeight: 640
    lineHeight: 0.88
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "'Fraunces Variable', 'Fraunces', 'Times New Roman', serif"
    fontSize: "clamp(1.9rem, 4vw, 3.3rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  wordmark:
    fontFamily: "'Geist Variable', 'Geist', system-ui, sans-serif"
    fontSize: "min(calc((100cqw - 2.5rem) / 6.75), 11rem)"
    fontWeight: 900
    lineHeight: 0.78
    letterSpacing: "-0.05em"
  title:
    fontFamily: "'Geist Variable', 'Geist', system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  body:
    fontFamily: "'Geist Variable', 'Geist', system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "'Geist Variable', 'Geist', system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    letterSpacing: "0.2em"
  button:
    fontFamily: "'Geist Variable', 'Geist', system-ui, sans-serif"
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
  header-height: "4.25rem"
  tab-height: "2.15rem"
components:
  button-primary:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.on-violet}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "0.7rem 1.2rem"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.bone}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "0.7rem 1.2rem"
  file:
    backgroundColor: "{colors.onyx-2}"
    textColor: "{colors.bone}"
    rounded: "{rounded.none}"
  file-tab:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.on-violet}"
    typography: "{typography.label}"
    height: "{spacing.tab-height}"
    padding: "0 1.4rem"
  evidence-tile:
    width: "112px"
    height: "84px"
    rounded: "{rounded.sm}"
  work-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.bone}"
    rounded: "{rounded.sm}"
---

# Design System: Dark Dossier

## Overview

**Creative North Star: "The case file that finds you."**

The site is a dossier on a desk. Its offer is one line, "Websites that get found", and the whole page acts it out: the web is a globe of evidence, scrolling narrows the search, and what is left are the found files. Then the files lie back into a drawer one by one, and the page ends at an ink pad where the visitor leaves a mark next to the email action.

Two grounds carry the same world. Dark is matte onyx with bone type. Light is paper and kraft with ink type. The theme follows the visitor's system setting until they choose one in the header. Clearance purple is the one identity color in both.

**Key Characteristics:**
- One authored moment per region: globe (top), receding files (middle), ink pad (end). Everything else is quiet.
- Evidence is physical: tiles, stamps, die-cut tabs and kraft cards keep their own paper colors in both themes.
- Fraunces carries every display voice; Geist carries every functional voice.
- Square sheets, 2px controls, hairline rules. Depth comes from 3D space and tone, not from card shadows.

## Colors

### Grounds
- **Onyx / Paper** (`onyx`, `paper`): the desk the page sits on. The light ground has the `/paper.webp` texture.
- **Panel / Kraft** (`panel`, `kraft`): plates, cards and the Method file.
- **Desk** (`desk`, `paper-desk`): shows only behind a file that recedes in the file stack.

### Type
- **Bone / Ink** (`bone`, `ink`): headings and primary copy.
- **Bone soft / Ink soft** (`bone-soft`, `ink-soft`): ledes, labels, metadata.

### Identity
- **Clearance purple** (`violet` dark, `manganese` light): fills only: primary action, file tabs, the Start file, the Tau card, focus ring, selection, scrollbar thumb, the FOUND stamp.
- **Purple text** (`violet-text` dark, `manganese-text` light, CSS `--violet-text`): links, card calls to action, the case line, the current nav item. It holds 4.5:1 or more on every ground and plate; solid violet text does not.

### Brass accent (about 10%)
- **Brass** (`brass` on onyx, `brass-paper` on paper for small text, `brass-paper-mark` for large marks; CSS `--accent`, `--accent-mark`): the full stop of the hero title and of "Leave a mark.", the "Case file 001" label, footer column labels, post dates, the hint rule.
- **Brass plates and seal** (`brass` text on onyx tiles, `brass-stamp` on bone; CSS `--plate-accent`, `--stamp-accent`, the same in both themes): number and № tiles in the globe, the FOUND stamp (double-ring seal).
- Brass is a material, not a second brand color: no fills, no buttons, no gradients or fake foil. Purple keeps every action.

### Evidence tiles (theme-independent)
`tile-bone`, `tile-kraft`, `tile-violet`, `tile-onyx`. The globe tiles are objects, so they do not change with the theme.

### Inks (ink pad only)
Riso-style inks: violet, warm, blue, pink. Each set sits at the opposite lightness to the footer type, so the type reads over any ink.
- Light, multiply on paper: violet `#9B7BFF`, yellow `#FFE11A`, blue `#4DA3F5`, fluorescent pink `#FF48B0`. They overprint like riso layers (pink on yellow gives red-orange). Near-black type holds 5:1 or more on each ink.
- Dark, on onyx: violet `#8A5CF6`, vermilion `#F0461E`, blue `#2F6BFF`, pink `#F2277E`. White type holds 3.8:1 or more on each ink at full strength and 5.7:1 or more where the ink is thin (the wordmark is large text, minimum 3:1). The old kraft and bone inks gave about 2:1 under bone type. The shader cubes the ink weights so each ink keeps its own hue where inks meet (no brown mix), mixes the onyx toward the ink and feeds the screen blend so the page lands exactly on that colour; rims gain chroma at the same lightness, never a bright outline.
These are the only place the palette goes past purple + kraft. They stay inside the footer.

### Named Rules
**The Purple Folder Rule.** Purple is a field or an action, never a wash or decoration.
**The Evidence Rule.** A tile, stamp or card keeps its paper color in both themes; the ground around it changes.

## Typography

**Display:** Fraunces Variable. **UI:** Geist Variable. Code tiles and prose code use the system monospace stack.

- **Display** (640, `clamp(3.1rem, min(11.5vw, 15.5svh), 8.75rem)`, lh 0.88, -0.035em): the hero offer, one line per span, no wrapping. The Spanish title uses `.hero-title--long` (`clamp(2.6rem, min(9.4vw, 12.6svh), 7rem)`).
- **Headline** (600, `clamp(1.9rem, 4vw, 3.3rem)`, lh 1.02): file and section headings.
- **Wordmark** (Geist 900, uppercase, -0.05em, fitted to the footer width up to 11rem): footer name over the ink. Heavy, even strokes read over any ink; Fraunces hairlines did not. White on onyx, ink on paper.
- **Title** (650, 1.2rem): post rows and compact headings.
- **Body** (400, 1.0625rem, lh 1.65): ledes held near 44–58ch.
- **Label** (600, 0.6875rem, 0.2em, uppercase): tabs, the case line, column labels, hints.
- **Tile type** (7.5–52px): decorative type inside 112×84 evidence tiles only.

**The Two Inks Rule.** Fraunces for display, Geist for function. No third family. The footer wordmark is the one display use of Geist.

## Layout

Centered wrap `min(1180px, 100% - 2.5rem)`. Sticky translucent header 4.25rem (8.25rem on phones, where nav scrolls on its own row).

Home, top to bottom:
1. **Scene** (`EvidenceGlobe.astro`): a sticky stage of `100svh` inside a section `100svh + 140svh` tall (`+ 170svh` on phones; scroll only lands the strip, the carousel moves it). Case line on top, the offer bottom-left, the globe right (below the copy on phones).
2. **File stack** (`HomePage.astro`): Offer, Method (kraft), Start (purple). Each file is at least one viewport tall and pins while the next one rises.
3. **Notes**: post rows.
4. **Footer ink pad** (`Footer.astro`): "Leave a mark." + Start a project on the left, link columns on the right, wordmark at the bottom over the ink band.

Breakpoints: 860px switches the scene to one column; 900px puts the footer in two columns.

## Elevation & Depth

Flat at rest. Depth is spatial: the globe and the work strip live in a `perspective: 1800px` stage, and a covered file tilts back (`rotateX` up to 8deg, scale to 0.91, shade overlay to 50%) over the desk color. The rising file casts the one structural shadow (`0 -24px 40px rgb(0 0 0 / 0.4)`).

## Shapes

Files and folders are square. Controls, tiles and cards use 2px. The die-cut tab is `polygon(12px 0, calc(100% - 12px) 0, 100% 100%, 0 100%)`; work cards carry a smaller inverted tab. Stamps are outlined, rotated -8 to -9deg.

## Components

### Evidence globe (`EvidenceGlobe.astro`, `scripts/globe.ts`)
- 82 slots in latitude bands (R 280px, 112×84 tiles), six of them are the work cards. Designs are assigned at build time so repeats sit far apart.
- Tile kinds: image crop (about 60% of tiles), label (plate and method words), number (SED test counts), glyph, words, stamp, SERP snippet (the site's own title), JSON-LD code, ruled client card. No picture-style SVG drawings.
- No JS or reduced motion: a still CSS sphere and a horizontal, scroll-snapped card list. Same content.

### Work cards
Five cards that match the heading "One case study is ready. Three are still being written.": SED (FOUND), Tau, Marketplace operations, Automation verification gate (all three "write-up in progress", from /work), and "This file is still open" → contact. Each card is a real link with a die-cut tab, a face and a fixed caption row (`--cap-h`: 6.6rem, 7.5rem up to 1100px, 8.2rem on phones, so wrapped titles in either language keep the call to action inside). In flight the card is clipped to its face; the caption opens when it lands. Focusing a card scrolls the scene to where it is in view.

**Carousel.** Vertical scroll only flies the cards into the strip (timeline up to P 0.5; scene travel 140svh desktop, 170svh phone). From there the strip is a looping carousel on every screen: arrow buttons (44px, hairline, the authored arrow), five position bars (the current one violet and wider), drag or swipe (a flick goes one card, a slow drag snaps to the nearest), a sideways trackpad swipe, and Left/Right arrow keys between focused cards. Vertical touch moves stay native scroll (`touch-action: pan-y`). A drag never opens the card under the pointer. Focusing a card turns the strip to it the short way round; a polite live region names the current file. The wrap seam sits off screen (desktop window -1.5…3.5 cards from the heading-aligned slot, phones centred); a card fades out just before it crosses the seam. The strip and its controls are centred in the room under the heading.

**Autoplay.** While nobody touches it, the carousel moves one file every 4.5s. The current bar is a violet track whose fill shows the time to the next file. A pointer hovering the files or keyboard focus on a file holds it; any carousel input (drag, swipe, trackpad, arrows, bars, keys) pauses it, and it resumes after 6s of idle. The pause/play button (first of the three 44px buttons) stops it until pressed again. While it plays the live region is `aria-live=off`, so files are not announced one after another. Reduced motion: no autoplay (the engine does not run).

### File stack
Die-cut tab, headline, content. Tabs name the file; no eyebrow above headings.

### Ink pad (`scripts/inkpad.ts`)
WebGL2 stable fluids, no library. Four inks in RGBA, drops are source flows that push older ink into rings, a fixed paper-fibre noise makes ragged soak lines, gradient rims darken edges. The canvas blends with the page (multiply on paper, screen on onyx). Links and buttons stay clickable on top. On first view the band pools behind the wordmark (overlapping washes, upward wicking, then single drops); sizes are in CSS pixels so phones and desktops match.

### Links and arrows
`.link-arrow` uses `--violet-text`; its underline draws in from the left on hover. Arrows are the authored SVG in `Arrow.astro` (nudges 3–4px on hover), never a text glyph.

### Buttons, plates, rails, stills, prose
Unchanged from the earlier dossier: solid purple primary, outline secondary, hairline plates (Hours/Map/Contact/Search), method rail (Scope/Preview/Checks/Handover), captioned stills that say when an image is a generated concept.

## Motion

| Moment | Trigger | Material | Timing |
|---|---|---|---|
| Hero type | load | line blur 14px → 0, rise 0.35em | 900ms, 90ms stagger, `cubic-bezier(.16,1,.3,1)` |
| Globe assembly | load | tiles fly in as shards, left to right | 1.1s each, expo out, ~1s sweep |
| Globe idle | always (in view) | 5°/s spin, drag with inertia, pointer tilts pitch ±5° | per frame |
| Search | scroll P 0.05–0.43 | decor tiles scatter past the camera; cards fly to a curved strip | cubic in-out per tile |
| Autoplay | idle 6s after the last input, no hover or focus on the files | one file every 4.5s; bar fill shows the time left | eases like a manual step |
| Carousel | arrows, bars, drag/swipe, trackpad, keys | strip turns on a drum (2200px desktop, 1100px phone) and loops | eases to the snapped card (`dt * 9`); bar width 420ms expo out |
| FOUND | SED card lands | stamp 2.6× → 1×, card thud | 620ms |
| File recession | covered file | tilt back, scale, shade | linked to scroll |
| Page change | navigation | old sheet tilts away, new sheet rises (`@view-transition`) | 380ms out, 640ms in |
| Ink | drag / tap | fluid simulation | runs 2.5–5s after input, then sleeps |

Rules:
- Each pose is position + quaternion + scale; blend poses, never strings of transforms.
- Loops run only while their section is in view and the tab is visible. The ink sim sleeps when idle.
- `prefers-reduced-motion`: no globe engine (still sphere + list), no file tilt, no view transitions, no type entrance; the ink pad still answers input and seeds its band without animation.

## Assets

- `public/images/globe/*.webp`: 360px resizes (sharp, webp q70) of the existing stills and SED screenshots in `public/images/` and `public/images/sed/`.
- `public/images/cards/*.webp`: 880px resizes (sharp, webp q74) of the SED product screenshots.
- No generated or stock rasters were added in the motion redesign.

## Do's and Don'ts

### Do:
- Keep one authored moment per region and let the rest be quiet.
- Keep evidence physical: paper colors, stamps, tabs, real screenshots, honest captions.
- Label generated images as concepts.

### Don't:
- Don't add an eyebrow label above a heading; the tab or case line does that job.
- Don't add a second 3D or WebGL effect between the globe and the footer.
- Don't invent proof: no client logos, testimonials, prices or outcome numbers.
- Don't spread the ink colors outside the footer.
