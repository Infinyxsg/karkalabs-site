/** Map pinned-scroll progress (0–1) to a 1-based scene step: 0% → step 1, 100% → last step. */
export function progressToStep(progress: number, total: number): number {
  if (total <= 0) return 0;
  const p = Math.min(1, Math.max(0, progress));
  return Math.min(total, 1 + Math.floor(p * total));
}
