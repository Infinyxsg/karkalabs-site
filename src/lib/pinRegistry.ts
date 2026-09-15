/**
 * Synchronous, GSAP-free registry of pinned sections. A PinnedScene registers its spec in its own
 * effect; React runs child effects before the parent's, so by the time App starts the scroll engine
 * every pin on the page is here, and smoothScroll.ts can build them all ONCE, top-down.
 *
 * Why this shape (039 gate): pins created independently were measured out of order, and every
 * fix that re-created or refreshed a live pin at load leaked one frame of ScrollTrigger's pinned
 * state — both pins fixed over the viewport at scroll 0, CLS ≈ 1 under throttled load.
 */
export interface PinSpec {
  /** The section the pin belongs to (document order + gsap.context scope). */
  section: HTMLElement;
  /** Our own spacer: ScrollTrigger must never wrap (and so reload) the iframe inside the pin. */
  spacer: HTMLElement;
  pin: HTMLElement;
  /** Scroll length, % of viewport height. Fixed for the pin's life — never derived from a step count. */
  lengthVh: number;
  onProgress: (progress: number) => void;
  onBounds: (start: number, end: number) => void;
}

type Listener = () => void;

const specs = new Set<PinSpec>();
const listeners = new Set<Listener>();

export function registerPinSpec(spec: PinSpec): () => void {
  specs.add(spec);
  listeners.forEach((l) => l());
  return () => {
    specs.delete(spec);
    listeners.forEach((l) => l());
  };
}

/** Registered specs in document order. */
export function pinSpecs(): PinSpec[] {
  return [...specs].sort((a, b) =>
    a.section.compareDocumentPosition(b.section) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
  );
}

export function onPinSpecsChange(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
