# KarkaLabs Design System

Karka is an AI voice tutor that teaches on a **live drawing board**: the tutor (Aarya — CBSE Physics, Diya — CBSE Maths, Ethan — tuition centres) explains a concept aloud while the board draws figures, graphs and 3D scenes in real time. Audiences: Singapore O-Level and CBSE students, their parents, schools, and tuition centres. Tagline: **"Learn with AI, not from AI."**

Brand feel: calm, precise, exam-serious — not playful edtech. Dark ink on warm paper, generous whitespace, mobile-first (390px design viewport). The board is the visual signature; everything else stays quiet around it.

## Sources
- **Marketing site codebase** (first-pass scaffold, **downstream** of this system — its tokens should be regenerated from `tokens/`, not copied back): local folder `Demo videos/Karka Website/karkalabs-site` — Vite + React + Tailwind v4 `@theme` tokens in `src/styles/index.css`, motion tokens in `src/design/tokens.ts`, all visitor copy in `src/content/copy.ts`.
- **Brand guidelines**: `Demo videos/KarkaLabs - Brand files/KarkaLabs_brand.docx` (wordmark usage, three brand colours) + wordmark PNGs (also in `uploads/`).
- **Login page assets**: GitHub [Infinyxsg/KarkaLogin](https://github.com/Infinyxsg/KarkaLogin) — glyph icons, circular badge, wordmarks, student hero image. (The repo's live `index.html` is only a redirect; the original login UI lives in its git history.) Explore the repo further to improve recreations.
- **Product screenshots**: `Demo videos/O level/` (worksheet marking flow, 7 frames desktop+mobile) and `Demo videos/CBSE Onboarding/` (demo scripts, parent-dashboard screenshot). Copies in `reference/`.
- **Demo videos**: `Demo videos/*.mp4|m4v` — session recordings of the board app (not framewise-inspected here).

## Products represented
1. **Marketing website** (karkalabs.ai) — hero on the board's flat scene ground, ink "Students" section with pinned scroll board embed, paper audience sections (Parents / Schools / Tuition centres) with lead capture.
2. **O-Level worksheet marking** (web-worksheet) — upload a worksheet, crop-confirm, per-question marking with held/queued states. Radically honest copy.
3. **Parent dashboard** — per-child session reports: summary prose, what they learned, questions asked, suggested next session, confidence/accuracy chips.
4. **The board app itself** (three-panel: transcript · Karka board · chapter map) — seen only in videos/screenshots; not recreated as code here.

## CONTENT FUNDAMENTALS
- **Voice**: plain, spoken-cadence sentences. Short. No subordinate clauses ("VO lines are written for spoken delivery — short sentences"). Frequent em-dashes and colons for rhythm.
- **Second person for students/parents** ("You say it. Aarya catches it."), first-person-plural for the company ("We ask because it decides whether we're allowed to use it at all.").
- **Radical honesty is a brand behavior**: disabled options say *why* ("still being checked with a lawyer, and we'd rather wait for that answer than guess"); unbuilt features say "NOT READY YET" and promise no date; unconnected forms say "submissions go nowhere". Never fake a state.
- **Neutral, non-punitive language** for pending states: "It hasn't been marked right or wrong — nothing is counted either way." Held ≠ wrong.
- **Sentence case everywhere**; UPPERCASE only for eyebrows and status labels ("WAITING FOR A TEACHER", "WHAT THEY LEARNED").
- **No emoji.** No exclamation-point enthusiasm. Precision over pep.
- Tutors are named and gendered persons (Aarya he/him, Diya she/her) and are the grammatical subject: "Aarya catches it", "Diya plots the points".
- Example headlines: "Real-time, human-like voice tutors" · "You say it. Aarya catches it. The board redraws it."

## VISUAL FOUNDATIONS
- **Colours**: Karka Ink `#1A232B` (text + dark section grounds), Paper `#F7F6F1` (page), Board white `#FFFFFF` (cards), Line `#DAD8CF` hairlines.
  - **Product accent — teal, sampled from the board stills**: `#147D7B` (eyebrows, emphasis text, hairline borders on light), deep `#0F6564` (any fill carrying on-ink text — 6.2:1), press `#0B4D4C`, `#5FB3B1` for AA small text on ink, active tab pill = a teal→green gradient `#1F8673 → #2D9269`. The board scene ground is a flat pale blue-grey `#EEF2F4` / `#DFE8EE` with `#9FBCCD` hairlines and muted scene labels.
  - **Sage Green `#788C5B` and Olive Gold `#B7A06A` are the WORDMARK gradient** (KarkaLabs_brand.docx). Beyond the mark, sage carries only the secured/positive wash (`#E7ECDD` + `#4F6139` text) and olive only the focus ring and pending/TODO washes (`#F2ECDC`). Neither is the product accent; neither appears on the board. All interactive accent — eyebrows, hovers, focus borders, active states — is teal.
  - Max two section grounds per page: paper and ink.
- **Type**: Source Serif 4 (variable) for display/headings — confirmed against the board stills, whose skill headings are a bold transitional serif; the marketing site declares the same face in `package.json`. Semibold, tracking −0.015em, very tight leading (1.02–1.08). System sans for everything else, and mono caps for scene labels on the board. Fluid clamp() scale from 390→1440px. Eyebrows: 12px semibold uppercase, +0.14em tracking — teal `#147D7B` on light, `#5FB3B1` on ink (AA-safe at 12px).
- **Spacing**: 4px base grid. Gutters 20px (40px lg). Section padding 80px (128px lg). Generous whitespace is a feature.
- **Backgrounds**: flat colour only — no gradients (the only gradients are inside the "Labs" wordmark and the board's active tab pill), no textures, **no graph-paper grid**. The board ground is a flat pale blue-grey panel; `.board-grid` is the hook Hero.tsx expects, matched to that flat ground.
- **Corners**: cards 16px, the board 20px, fields 8px, buttons/chips full pills.
- **Shadows**: essentially none — except `--shadow-board`, a deep two-layer shadow reserved for the board frame. Cards separate by 1px `--color-line` borders, not shadows.
- **Motion**: fast and damped. Durations 120/200/360/600/800ms; signature easing `cubic-bezier(0.22,1,0.36,1)` (karka-out). Enter/exit = small y-nudges (6px) + fade; section reveals = 16px nudge, 800ms, once. Full reduced-motion support (durations → 0, pinned scroll → static transcript). No bounces, no springs.
- **Hover**: colour shifts only (chip border → teal; accent fill teal-deep → teal-press), 200ms. **Press**: no scale effects. **Focus**: 2px olive outline, 3px offset; fields take a teal border instead.
- **Transparency/blur**: none. Opacity only for on-ink hierarchies (`on-ink/25` borders, `on-ink/6` card fills) and disabled states (`ink/8` fill).
- **Imagery**: product itself (board scenes, posters from demo videos) — warm-neutral, no stock photography. Dashed borders mark placeholder/disabled/TODO states.
- **Layout**: max-w-6xl (1152px) centered; 2-col `5fr/7fr` or `1fr/1fr` grids on lg, stacked on mobile; content bottom-anchored in the hero. Min hit target 44px, primary controls 48px.

## ICONOGRAPHY
- **No icon font, no icon library.** The codebase's only SVG icon is a hand-rolled inline speaker (voice toggle) at 20px, stroke-width 2, round caps — matching Lucide's grammar. If more icons are needed, use **Lucide** (CDN) at `size-5`, stroke 2 — flag any additions.
- **Subject glyphs**: hand-drawn-style PNG glyphs from the login page — `assets/glyphs/` (atom, book, graph, mic, pi, sqrt, triangle). Used decoratively (orbiting animation on login).
- **Status dots**: 8px filled circles (sage-deep = secured, olive = pending). Progress: 6px pill segments, active segment stretched to 20px olive.
- **✓/✗ marks** in worksheet results are text glyphs (green check / amber-brown cross), not icons.
- **No emoji, ever.**

## Logos (`assets/brand/`)
- `wordmark.png` / `@2x` — primary, transparent, for light grounds ("Karka" ink + "Labs" sage→olive gradient).
- `wordmark-on-dark.png` / `@2x` — reversed ("Karka" white), for ink/busy grounds.
- `wordmark-white.png`, `wordmark-alt.png` — from the login repo.
- `karka-circular-logo.png` — circular badge (right-panel login badge); `karka-badge-transparent.png` — same without circular clipping.
- Clear space = height of the capital "K" on all sides. Never stretch, recolour, or change gradient direction.

## Index
- `styles.css` → `tokens/` (colors, typography, spacing, motion, fonts, base)
- `assets/` — brand/ (wordmarks, badges), glyphs/ (subject PNGs), imagery/ (student-hero)
- `components/core/` — Button · `components/board/` — BoardFrame, ConceptChip, StepProgress · `components/forms/` — Field, LeadForm, WhatsAppCta · `components/content/` — Eyebrow, TodoCopy
- `ui_kits/website/` — marketing site recreation · `ui_kits/worksheet/` — O-Level worksheet flow · `ui_kits/parent_dashboard/` — parent report
- `templates/website/Website.dc.html` — "Marketing page" template consuming projects can start from (the website screen, converted)
- `guidelines/` — foundation specimen cards
- `reference/` — product screenshots (source truth for the worksheet + dashboard kits)

### Intentional additions
- **Button** — the codebase styles CTAs inline (ink pill, olive pill, chip); consolidated as one component so consumers don't re-derive the classes.
- **Eyebrow** — the uppercase-tracked label pattern repeated in every section.
- **BoardFrame** — the embed's visual chrome (board surface + caption card + voice button) as a static component, minus postMessage plumbing.

### Known gaps / substitutions
- ⚠️ **Concept-state vocabulary is unset.** `ConceptChip` reads its state labels and colours from the `CONCEPT_STATES` map in `components/board/ConceptChip.jsx`; both labels are `TODO:VB` placeholders pending the product's real mastery vocabulary. Nothing hard-codes a state word — update that one map and the chip, its summary line and all consumers follow. Each state carries its own `titleFg`, so maps with three or more states stay legible.
- Source Serif 4 loaded from Google Fonts (site uses @fontsource; no binaries in sources). Same typeface.
- `.board-grid` is referenced by Hero.tsx but never defined in the shipped CSS. My first pass invented a 32px graph-paper grid; **corrected** against the board stills, which have no grid — it is now the board's flat pale blue-grey ground.
- Accent **corrected**: the first pass took sage from the site scaffold; the board is teal (`#147D7B`). Sage/olive are now documented as wordmark + marketing colours only. The marketing UI kit still renders in sage/olive because that is what its source code ships.
- **Where olive survives, and where it does not**: the `karkalabs-site` scaffold's `KarkaEmbed.tsx` (`text-olive` tutor eyebrow, `bg-olive` voice button), `StudentsSection.tsx` (`text-olive` section eyebrow), `ConceptChip.tsx` (olive dot) and `StepProgress.tsx` (olive pills) were **first-pass generated defaults, not product source — nobody chose olive**. All of that chrome is re-derived from the brand docx and the sampled board palette: section and tutor eyebrows, step pills and the concept dot in teal (`--color-teal-on-ink` `#5FB3B1` for AA on ink), voice button `--color-teal-deep` with on-ink text (6.2:1). Sage-deep's interactive roles (chip hover border, field focus) moved to teal for the same reason.
- ⚠️ **Direction of truth: the `karkalabs-site` scaffold's tokens are to be updated FROM this design system, not the other way round.** Where the scaffold and this system disagree, this system wins; the scaffold's `@theme` block is downstream and should be regenerated from `tokens/`.
- **No hero grid — deliberately.** The product board has no grid (Ethan's surface aside), and the site's promise is that visitors are seeing the real board, so a marketing-only grid motif the product contradicts was rejected. `.board-grid` paints the board's flat scene ground and owns that background; the DC template and the UI kit both defer to it.
- The original login UI markup is not in the repo (redirect only); no login screen was recreated.
- The board app's three-panel workspace exists only in video; not recreated.
