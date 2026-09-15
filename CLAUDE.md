# karkalabs-site: working rules

This is the marketing site for karkalabs.ai. Its immersive sections are the real product: the Karka board, driven by scroll, with the tutor's voice (Aarya, Diya or Ethan) as the hero.
- **v1 (word 040):** the Students board is a **muted loop of the real board**, cut from the demo recordings (path C2).
- **The live embed** (an iframe of the Karka board's `/embed/` route, path C1) is the same section, switched on by one build setting: `VITE_KARKA_EMBED_ORIGIN`.

- **Stack:** Vite + React + TypeScript + Tailwind v4, Framer Motion for element and section motion, and GSAP ScrollTrigger + Lenis for pinned scroll.
- **Build:** pre-rendered with `vite-react-ssg` (single-page mode) into static `dist/` for GitHub Pages (`base: '/'`, `public/CNAME` = `karkalabs.ai`, `public/.nojekyll`, `public/404.html`).
- **Deploy:** `.github/workflows/pages.yml`. On push to `main` it runs the gate job (build, the full suite, Lighthouse), then `actions/deploy-pages`. The Pages source is GitHub Actions.
- **No backend, no analytics, no form backend.**

## Ring-fence
Vinodh does these himself, typed in session after the exact commands are shown. Never do them from a prompt file:
- no `git push`, and no enabling Pages
- no DNS changes (GoDaddy or Cloudflare)
- no ElevenLabs writes
- no spend (that includes TTS generation)

## Hard rules

1. **Never mask an exit code. A red test blocks the commit.**
   - Don't pipe a test or build through `tail`/`grep` without `set -o pipefail` or `${PIPESTATUS[0]}`.
   - Commit only after the suite has exited 0.
   - Origin: commit `5e205ee` went in with a failing test because the exit code was hidden.

2. **The design system is the source of truth** (`handoff/`, the Claude Design handoff, committed in 039). Truth flows one way: design system → site.
   - **Colour, type, spacing, radius, shadow and easing** are generated into `src/styles/index.css` `@theme` from `handoff/tokens/*.css`.
   - **Motion durations and nudges** go into `src/design/tokens.ts`. `tests/site.spec.ts` fails if its CSS mirrors drift.
   - **To change a token:** change the design system, re-export the handoff, regenerate. Never edit the site first, and never add a site-only token.
   - **Behaviour timings are not design tokens.** Scroll and embed timings live in `src/config/behaviour.ts`.
   - **Components come from the handoff:** `src/components/` holds `Button`, `Eyebrow`, `TodoCopy`, `Field`, `LeadForm`, `WhatsAppCta`, `BoardFrame`, `ConceptChip` and `StepProgress`.
     - Props and tokens follow the handoff; behaviour stays the site's (hover is CSS, not React state).
     - Site additions are marked in each file.
   - **Product-mirrored values are quotes of the product, not tokens.** The mastery tile colours in `CONCEPT_STATES` (`src/product/mastery.ts`) come from the 6091 board.

3. **Colour roles (handoff readme).**
   - Teal `#147D7B` is the product accent: eyebrows, hovers, focus borders, active states, the voice button (`teal-deep`).
   - Sage and olive are the wordmark gradient. Beyond the mark they carry only the state washes (secured sage; pending/held/TODO olive, which includes the focus ring).
   - Two section grounds only: paper and ink. The hero sits on the board's flat scene ground (`.board-grid`), and there is no graph-paper grid anywhere.

4. **`prefers-reduced-motion` is honoured everywhere.** The single source is `useReducedMotion()`. When it is set:
   - no Lenis;
   - no pin;
   - no iframe and no video;
   - the poster shows with the full transcript;
   - narration, when enabled, still plays (the captions follow the audio);
   - CSS durations collapse to 0.

5. **Mobile-first. 390px is the design viewport.** Tap targets use `min-h-hit-target` (44px) or `min-h-hit-target-lg` (48px).

6. **Lighthouse mobile is a gate:** performance ≥ 90, accessibility 100, CLS < 0.1 (040).
   - Run it cold, never straight after the test suite.
   - Simulated throttling is the gate. Also report applied throttling, but don't gate on it (040 ruling 3).
   - Report the median and the worst run.

7. **No invented copy or scene slugs.**
   - All strings live in `src/content/copy.ts`, each with its source. The 040 §A launch copy is Vinodh's, verbatim.
   - Placeholders are marked `TODO:VB` / `TODO:VB-audio` in code only. **None may render:** the launch tests assert there is no `TODO` in the DOM.
   - Scene slugs live only in `SCENE_PICKS`, and narration files only in `NARRATION` (`src/embed/config.ts`).
   - Contact targets live only in `src/content/contact.ts`. The build fails if either is empty or malformed.

8. **Narration is pre-recorded and plays in this page.**
   - It is never a live agent and never inside the iframe.
   - It is **off in v1** (`NARRATION_ENABLED`): "Hear Aarya" is not in the DOM.

9. **The site shows the real product.**
   - Mastery states use the board's screen text: Not started / Tarnished / Shaky / Held.
   - The classroom variant uses the product's hold banner and the teacher dashboard's own labels.
   - There is no login-free path to mastery data.

10. **No real student data on the public site** (Vinodh, 040).
    - No name, grade, session count or report text.
    - If a real student is identifiable in a still or clip, it doesn't ship. Crops exclude the app's sidebar, where the student's name is.
    - The Parents still is a **sample** report, rendered by `scripts/make-posters.mjs` from `parents.sample` in copy.ts, and labelled "Sample report".

## The board panel (`src/embed/`, `src/sections/PinnedScene.tsx`)
- **`PinnedScene`** is the one pinned-scroll implementation. It covers:
  - Students (`variant="student"`: concept chip);
  - Schools (`variant="classroom"`: hold marker, class question, teacher view). Classroom is off in v1: Schools is poster + copy + CTA until the live route ships (`SCHOOLS_PANEL`).
- **`panel` (`STUDENTS_PANEL` in `config.ts`)** selects what the section shows:
  - **`'video'`** (C2) renders **`LoopPanel`**:
    - a `<video autoplay muted loop playsinline>` in `BoardFrame`, which mounts within 1 viewport and plays only in view;
    - the video's `timeupdate` drives the captions, step pills and chip;
    - it has a Pause control (WCAG 2.2.2);
    - reduced motion, or a refused autoplay, gives the poster (the loop's first frame) and the transcript;
    - pin length is `loopPinLengthVh`.
  - **`'embed'`** (C1) renders **`KarkaEmbed`**, the iframe and postMessage contract:
    - mounts the iframe within 1 viewport and unmounts it beyond 2;
    - sends play or step on entering view, and pause on leaving;
    - sets `pointer-events:none` while Lenis scrolls;
    - re-syncs on every `ready`;
    - drives captions from the narration clock while it plays;
    - uses captions from the frame's `ready.steps` when present (contract v2).
- **`protocol.ts`** defines the shapes. `unmute`/`mute` are reserved and never sent.
- **The stand-in frame is `tests/fixtures/embed-placeholder.html`.** It is test-only and never in `public/`.
  - `npm run build:fixture` builds the same source with the embed on (`dist-fixture/`).
  - `serve-dist.mjs --fixture` (:4174) serves it at `/embed/`, with the chime narration at `/audio/`.
  - `tests/embed.spec.ts` and `tests/gate-students.spec.ts` run there, so the C1 path stays tested while v1 ships C2.

## Commands
```
npm run dev                   # local dev (client-only)
npm run build                 # typecheck + pre-render + client build → dist/ (what ships)
npm run build:fixture         # the live-embed path → dist-fixture/ (tests only)
node scripts/serve-dist.mjs   # dist on :4173 with gzip + ranges + max-age=600 + 404.html (Pages-like)
npm test                      # pretest builds dist-fixture/; then every project (site, iphone-safari, embed-path). Needs a fresh `npm run build`.
npm run gate:screens          # 040 launch screenshots → docs/gate/040/
npm run gate:lighthouse       # cold! simulated (the gate) → docs/gate/<word>/
npm run gate:lighthouse:applied
npm run posters               # sample Parents report, favicons, OG image (needs ffmpeg + the brand files)
```

## Standing traps
- **Pinning:** pin the inner wrapper and pass our own `pinSpacer`. If ScrollTrigger re-parents an iframe, it reloads.
- **Pins are built once, in page order, and never rebuilt or refreshed live.**
  - A `PinnedScene` registers a spec in `lib/pinRegistry.ts`, synchronously in its effect. `startSmoothScroll()` then builds every pin exactly once, top-down.
  - Pin length is fixed per spec (`lengthVh`), so a change in step count never touches a pin.
  - Why: in the 039 gate, out-of-order creation plus a corrective refresh or rebuild leaked one frame of ScrollTrigger's pinned state. That showed as CLS ≈ 1 under throttled load and was invisible on a fast machine.
  - The throttled CLS tests in `tests/site.spec.ts` (one pin) and `tests/embed.spec.ts` (two pins) guard it.
- **Pins are built after the page settles:** after `document.fonts.ready`, at the next idle moment (`pinBuildIdleTimeoutMs`).
  - Built earlier, pin creation shared a frame with the font-swap reflow. Chrome scores a frame as (all moved area) × (largest distance), so two harmless shifts (0.008 and 0.001) became CLS 0.404 in Lighthouse's session.
  - Lighthouse counts shifts that carry `had_recent_input`, and its session reports an input early. The CLS tests count them too.
  - To see where a shift comes from, run `npm run gate:lighthouse:trace`. It prints every LayoutShift from Lighthouse's own trace, placed against FCP and the `karka:*` marks.
- **The scroll engine:** GSAP, ScrollTrigger and Lenis load dynamically after first paint, so don't import them statically from components. Components use `lib/scrollState.ts`.
- **Pre-render:** it runs on the server, so there is no `window` or `document` during render. The video and the iframe mount client-side only.
- **`<video muted>`:** React sets `muted` only as a property. `LoopPanel` sets `defaultMuted` so the attribute is on the element too; iOS needs muted + `playsinline` to play inline.
- **beasties:** keep `preload: 'media'` and `preloadFonts: false`.
- **Contrast on the scene ground:** teal `#147D7B` on the scene ground `#EEF2F4` is 4.39:1, under AA for 12px text. The site keeps the deeper teal there (`Eyebrow tone="scene"`, `teal-deep`), which has been reported to the design system.
- **`frame-ancestors`** in a `<meta>` CSP is ignored.
- **Copy in node:** `vite.config.ts` and `scripts/make-posters.mjs` import `copy.ts` and `contact.ts` directly, so keep those two free of runtime imports (type-only imports are fine).

## Post-launch first step
**Move the repo to `D:\code\karkalabs-site`.** It's a plain folder move, and the history comes along. It doesn't happen before launch (040 ruling 5). After the move, update:
- the Playwright and Lighthouse paths in any notes that quote the old location;
- the `KARKA_BRAND_DIR` default in `scripts/make-posters.mjs`, if the brand files move too.
