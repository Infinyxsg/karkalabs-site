/**
 * Motion tokens — generated from handoff/tokens/motion.css (design system → site).
 * CSS mirrors are --dur-*, --ease-karka-*, --nudge-* in src/styles/index.css; tests/embed.spec.ts
 * asserts the durations agree. Behaviour timings (scroll, embed) are not design tokens and live in
 * src/config/behaviour.ts.
 */

/** Seconds (Framer Motion / GSAP units). motion.css: 120 / 200 / 360 / 600 / 800 ms. */
export const duration = {
  instant: 0.12,
  fast: 0.2,
  base: 0.36,
  slow: 0.6,
  reveal: 0.8,
} as const;

/** Cubic-bezier control points. motion.css: --ease-karka-out, --ease-karka-in-out. */
export const ease = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

/** Enter/exit y-offsets in px. motion.css: --nudge-sm, --nudge-md. */
export const nudge = {
  sm: 6,
  md: 16,
} as const;
