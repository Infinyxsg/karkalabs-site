import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scroll } from '../config/behaviour';
import { setScrolling } from './scrollState';
import { onPinSpecsChange, pinSpecs, type PinSpec } from './pinRegistry';

gsap.registerPlugin(ScrollTrigger);
// Mobile URL-bar show/hide shouldn't re-measure every pinned sequence.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };

declare global {
  interface Window {
    /** Exposed so Playwright can jump to exact scroll positions. */
    __karkaLenis?: Lenis;
  }
}

let active: Lenis | undefined;

/**
 * Re-measure Lenis's scroll limit. Pin spacers grow the page after Lenis last measured it, and
 * until its debounced resize runs, scrollTo() (anchors, jumps) clamps to the old, shorter page.
 */
export function syncScrollBounds(): void {
  active?.resize();
}

/** One pinned scroll sequence. Created once; killed only when its section unmounts. */
function buildPin(spec: PinSpec): () => void {
  const ctx = gsap.context(() => {
    const st = ScrollTrigger.create({
      trigger: spec.pin,
      start: 'top top',
      end: () => `+=${(window.innerHeight * spec.lengthVh) / 100}`,
      pin: true,
      pinSpacer: spec.spacer,
      invalidateOnRefresh: true,
      onUpdate: (self) => spec.onProgress(self.progress),
      onRefresh: (self) => spec.onBounds(self.start, self.end),
    });
    spec.onBounds(st.start, st.end);
  }, spec.section);
  return () => ctx.revert();
}

/**
 * Build every registered pin exactly once, top-down (each measured after the spacers above it
 * exist), then keep in step with the registry: build newcomers once, kill leavers. Never re-create
 * or refresh a live pin — see src/lib/pinRegistry.ts for why.
 */
function attachPins(): () => void {
  const built = new Map<PinSpec, () => void>();
  const sync = () => {
    const current = pinSpecs();
    for (const [spec, kill] of built) {
      if (!current.includes(spec)) {
        kill();
        built.delete(spec);
      }
    }
    for (const spec of current) {
      if (!built.has(spec)) built.set(spec, buildPin(spec));
    }
    syncScrollBounds();
  };
  sync();
  const stop = onPinSpecsChange(sync);
  return () => {
    stop();
    built.forEach((kill) => kill());
    built.clear();
  };
}

/** Lenis drives the native scroll position; GSAP's ticker drives Lenis; ScrollTrigger listens. */
export function startSmoothScroll(): () => void {
  // User-timing marks land in Lighthouse traces: they place layout shifts relative to pin creation.
  performance.mark('karka:smooth-start');
  const lenis = new Lenis({ lerp: scroll.lerp, anchors: true });
  active = lenis;
  window.__karkaLenis = lenis;
  ScrollTrigger.addEventListener('refresh', syncScrollBounds);

  let settle: number | undefined;
  lenis.on('scroll', () => {
    ScrollTrigger.update();
    setScrolling(true);
    window.clearTimeout(settle);
    settle = window.setTimeout(() => setScrolling(false), scroll.settleMs);
  });

  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  // Pins are built once the page has settled: after the web font has swapped in, at the next idle
  // moment. Built earlier, pin creation could share a frame with the font-swap reflow, and Chrome
  // scores a frame as (all moved area) × (largest distance) — two harmless shifts became CLS 0.4
  // in Lighthouse's session (039 gate).
  let cancelled = false;
  let detachPins: () => void = () => {};
  const idle = (cb: () => void) => {
    // Safari has no requestIdleCallback; a macrotask is the next-best "after the current work".
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(cb, { timeout: scroll.pinBuildIdleTimeoutMs });
    } else {
      setTimeout(cb, 0);
    }
  };
  void (document.fonts?.ready ?? Promise.resolve()).then(() =>
    idle(() => {
      if (cancelled) return;
      detachPins = attachPins();
      performance.mark('karka:pins-built');
    }),
  );

  return () => {
    cancelled = true;
    detachPins();
    ScrollTrigger.removeEventListener('refresh', syncScrollBounds);
    if (active === lenis) active = undefined;
    gsap.ticker.remove(tick);
    window.clearTimeout(settle);
    setScrolling(false);
    lenis.destroy();
    delete window.__karkaLenis;
  };
}
