/**
 * postMessage contract between the site (parent) and a Karka board frame.
 * Spec: docs/EMBED_CONTRACT.md. Implemented by tests/fixtures/embed-placeholder.html (test-only) and by the
 * Karka frontend's /embed/ route (cbse11-embed lane) — both must stay compatible with these shapes.
 */

/** Parent → frame. Steps are 1-based. */
export type EmbedCommand =
  | { cmd: 'play' }
  | { cmd: 'pause' }
  | { cmd: 'reset' }
  | { cmd: 'step'; n: number }
  /**
   * Reserved, never sent by the site (037 ruling 2): narration is pre-recorded and plays in the
   * parent page. A frame must ignore these and must never open a voice connection.
   */
  | { cmd: 'unmute' }
  | { cmd: 'mute' };

/**
 * One scene step as the frame describes it in `ready`: its number, what the tutor says, and (v3)
 * where that line starts in the narration. `t` is `null` until a recording of the scene exists
 * (TODO:VB-audio), and the site ignores it either way — caption timings live in copy.ts, beside the
 * audio file they belong to.
 */
export interface ReadyStep {
  n: number;
  say: string;
  t?: number | null;
}

/**
 * Frame → parent.
 * `ready` — the scene is mounted. v1 carried `n` (total steps); v2 frames may instead (or also)
 * carry `scene` and `steps`, from which the total is `steps.length`. May arrive more than once.
 * `step` — the board now shows step `n`.
 */
export type EmbedEvent =
  | { evt: 'ready'; n?: number; scene?: string; steps?: ReadyStep[] }
  | { evt: 'step'; n: number };

const isCount = (n: unknown): n is number => typeof n === 'number' && Number.isInteger(n) && n >= 0;

function isReadyStep(s: unknown): s is ReadyStep {
  if (typeof s !== 'object' || s === null) return false;
  const { n, say } = s as { n?: unknown; say?: unknown };
  return isCount(n) && typeof say === 'string';
}

export function isEmbedEvent(data: unknown): data is EmbedEvent {
  if (typeof data !== 'object' || data === null) return false;
  const { evt, n, steps } = data as { evt?: unknown; n?: unknown; steps?: unknown };
  if (evt === 'step') return isCount(n);
  if (evt !== 'ready') return false;
  const stepsOk = steps === undefined || (Array.isArray(steps) && steps.every(isReadyStep));
  return stepsOk && (isCount(n) || (Array.isArray(steps) && steps.length > 0));
}

/** Total step count a `ready` announces. */
export function readyTotal(e: Extract<EmbedEvent, { evt: 'ready' }>): number {
  return e.n ?? e.steps?.length ?? 0;
}
