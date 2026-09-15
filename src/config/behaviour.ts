/**
 * Behaviour constants — timings and thresholds the design system does not own (it covers colour,
 * type, space and motion). Moved out of src/design/tokens.ts in 039 when that file was regenerated
 * from the handoff, so neither file carries magic numbers and tokens.ts mirrors the bundle exactly.
 */

export const scroll = {
  /** Lenis smoothing factor (0–1, lower = smoother). */
  lerp: 0.12,
  /**
   * Scroll length of a pinned sequence, as % of viewport height, shared evenly by the scene's steps
   * (360 = the 6-step placeholder at 60 each; the contract's 8-step maximum still gets 45 each).
   * Constant on purpose: a frame reporting a different step count must never rebuild a live pin.
   */
  pinLengthVh: 360,
  /**
   * Scroll length of a pinned muted loop (040 C2), % of viewport height. The loop runs on its own
   * clock (`timeupdate`), not on scroll, so the pin only needs to hold the board for about one pass.
   */
  loopPinLengthVh: 150,
  /** ms without a Lenis scroll event before we consider scrolling finished. */
  settleMs: 150,
  /** Longest wait for an idle moment before building pins (after the web font is ready). */
  pinBuildIdleTimeoutMs: 1000,
} as const;

export const embed = {
  /** Poster fallback if the frame hasn't posted {evt:'ready'} by then. */
  readyTimeoutMs: 4000,
  /** Mount the iframe when within this much of the viewport (% of viewport height). */
  mountMarginPct: 100,
  /** Unmount once further than this (% of viewport height). */
  unmountMarginPct: 200,
  /** Fraction of the embed that must be visible to count as "in view" (play/pause). */
  inViewThreshold: 0.35,
} as const;
