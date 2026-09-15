/**
 * Mirror of the product's mastery vocabulary: the O-Level 6091 mastery board. Quoted, not invented.
 * Paths are in D:\O level\SingaporeOLevelPhysics6091\web\:
 *   order  lib/game/masteryStore.ts:35-40 (TILE_STATE_ORDER, weakest → strongest)
 *   labels components/game/TileBoard.tsx:36-41 (STATE_LABEL) — the board's screen text, ruled authoritative
 *   blurbs components/game/TileBoard.tsx:43-48 (STATE_BLURB)
 *   colour components/game/TileBoard.module.css:24-47 + tile rules :465-504
 * masteryStore.ts:26-29 words tarnished/shaky differently — an O-Level repo defect for a later word.
 */
export const TILE_STATE_ORDER = ['missing', 'tarnished', 'shaky', 'held'] as const;

export type TileState = (typeof TILE_STATE_ORDER)[number];

export const STATE_LABEL: Record<TileState, string> = {
  held: 'Held',
  shaky: 'Shaky',
  tarnished: 'Tarnished',
  missing: 'Not started',
};

/** Shape of one entry in the design system's ConceptChip map (handoff/components/board/ConceptChip.d.ts). */
export interface ConceptState {
  label: string;
  fg: string;
  titleFg?: string;
  bg: string;
  border: string;
  dot: string;
}

/**
 * The design system's `CONCEPT_STATES` map, filled per 039 §A.3: labels are the board's screen text,
 * colours are the board's tile colours, keyed in progression order. (The board draws Not started as
 * a dashed slot; the chip's map carries colour only, so its border is the same colour, solid.)
 */
export const CONCEPT_STATES: Record<TileState, ConceptState> = {
  missing: {
    label: STATE_LABEL.missing,
    fg: 'rgb(226 238 224 / 80%)',
    titleFg: 'var(--color-on-ink-muted)',
    bg: 'rgb(226 238 224 / 3.5%)',
    border: 'rgb(226 238 224 / 40%)',
    dot: 'rgb(226 238 224 / 40%)',
  },
  tarnished: {
    label: STATE_LABEL.tarnished,
    fg: 'rgb(226 238 224 / 90%)',
    titleFg: 'var(--color-on-ink-muted)',
    bg: 'rgb(226 238 224 / 13%)',
    border: 'rgb(226 238 224 / 32%)',
    dot: 'rgb(226 238 224 / 32%)',
  },
  shaky: {
    label: STATE_LABEL.shaky,
    fg: '#f8dcab',
    titleFg: '#f8dcab',
    bg: 'rgb(240 173 67 / 13%)',
    border: 'rgb(240 173 67 / 62%)',
    dot: 'rgb(240 173 67 / 62%)',
  },
  held: {
    label: STATE_LABEL.held,
    fg: '#f4fdf6',
    titleFg: '#f4fdf6',
    bg: 'linear-gradient(152deg, #1d9280, #46a862)',
    border: 'rgb(244 253 246 / 30%)',
    dot: '#f4fdf6',
  },
};

/**
 * The tile the scene's student would hold after each step, read the way the board explains its
 * states (STATE_BLURB): no evidence until the student gets it right → Not started; one correct pass
 * → Shaky ("You have been here, but the evidence is thin."). Held means shown more than once.
 */
export function tileStateForStep(step: number, total: number): TileState {
  return total > 0 && step >= total ? 'shaky' : 'missing';
}

/** The scene's journey, for the chip's reduced-motion summary ("Not started → Shaky"). */
export const JOURNEY_STATES: Record<string, ConceptState> = {
  missing: CONCEPT_STATES.missing,
  shaky: CONCEPT_STATES.shaky,
};
