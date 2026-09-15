/**
 * Tiny "is Lenis scrolling" store. Kept separate from smoothScroll.ts so components can
 * subscribe without pulling GSAP/Lenis into their chunk.
 */
type Listener = (scrolling: boolean) => void;

const listeners = new Set<Listener>();
let scrolling = false;

export function setScrolling(next: boolean): void {
  if (next === scrolling) return;
  scrolling = next;
  listeners.forEach((listener) => listener(next));
}

export function onScrollingChange(listener: Listener): () => void {
  listeners.add(listener);
  listener(scrolling);
  return () => {
    listeners.delete(listener);
  };
}
