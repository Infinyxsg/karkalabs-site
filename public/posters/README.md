# Stills and the board loop: provenance

These are the stills and the loop that ship on the site. Every one is a real product surface, except the Parents still, which is a labelled sample.

**The rule (Vinodh, 040): no real student data on the public site.** That means no name, grade, session count or report text.
- If a real student is identifiable in a still or clip, it doesn't ship.
- Recording crops start right of the app's sidebar, where the student's name is.
- Each file below was checked by eye for names on 2026-09-15.

| File | Source | Frame | Cut |
|---|---|---|---|
| `../video/students-board.mp4` | `Demo videos/CBSE Onboarding/demo-assets/scenes/bed_s08.mp4`, the bed of demo scene 6, "Graphs & step-by-step": a velocity–time graph drawn live, then Aarya's Worked Explanation, step by step | 0–14.42 s | `crop=1140:822:355:165,scale=800:-2` → 800×576, H.264 High, CRF 26, 24 fps, no audio, `+faststart` (101 KB) |
| `students-board.webp` | the loop's first frame (the Students poster, and the reduced-motion view) | 0 s | — |
| `schools-hold.webp` | `Demo videos/Screen Recording 2026-07-24 123029.mp4`, a 1:1 session in its hold state (banner "Holding · after real-world scene, before next quick-check") | 239 s | `crop=1150:862:360:85` → 960×720 |
| `tuition.webp` | `KarkaLabs - Exam Ready.mp4`, the O-Level 6091 mastery board (no student name on screen) | 106 s | `crop=750:562:290:70` → 960×720 |
| `parents-sample.webp` | **Sample data.** Rendered by `scripts/make-posters.mjs` from `parents.sample` in `src/content/copy.ts`, in the layout of `handoff/ui_kits/parent_dashboard/ParentDashboard.jsx` | — | 600×450 @2x |
| `../og/og-karkalabs.png`, `../favicon-32.png`, `../apple-touch-icon.png` | `scripts/make-posters.mjs`: the on-dark wordmark (`KarkaLabs - Brand files`) beside `students-board.webp`, and the wordmark's "K" on ink | — | — |

The loop and the recording stills are cut by hand. For example:

```
ffmpeg -i "CBSE Onboarding/demo-assets/scenes/bed_s08.mp4" -t 14.42 -an \
  -vf "crop=1140:822:355:165,scale=800:-2:flags=lanczos,format=yuv420p" \
  -c:v libx264 -profile:v high -preset slow -crf 26 -r 24 -movflags +faststart students-board.mp4
ffmpeg -ss 239 -i "Screen Recording 2026-07-24 123029.mp4" -frames:v 1 \
  -vf "crop=1150:862:360:85,scale=960:720:flags=lanczos" -c:v libwebp -quality 78 schools-hold.webp
```

**Stand-ins:**
- **The Schools hold frame** stands in for the two-clocks classroom hold. No recording of that scene exists yet.
- **The loop shows a velocity–time graph, not a throw.** The Students copy talks about a throw, but no projectile recording exists yet.

When the live `/embed/` route ships, use a still of `p11-proj-two-clocks-one-time` for both.
