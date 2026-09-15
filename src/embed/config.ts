export type Audience = 'students' | 'parents' | 'schools' | 'tuition';

/**
 * Scene per audience. `null` = not picked yet. Slugs live ONLY here.
 * 037 ruling 1: Students and Parents = p11-proj-two-clocks-one-time; Tuition centres has no embed
 * (still image only). Post-037 ruling: Schools defaults to the same scene with a teacher hold
 * (shortlist #1 in docs/EMBED_CONTRACT.md §4) — one concept, three audiences, one embed route.
 */
export const SCENE_PICKS: Record<Audience, string | null> = {
  students: 'p11-proj-two-clocks-one-time',
  parents: 'p11-proj-two-clocks-one-time',
  schools: 'p11-proj-two-clocks-one-time',
  tuition: null,
};

/** Pre-recorded narration, played in the parent page — never inside the frame, never a live agent. */
export interface Narration {
  src: string;
  /** True until Vinodh's recording of the scene lands (TODO:VB-audio). */
  placeholder: boolean;
}

/**
 * 040 §C.3: "Hear Aarya" is off for v1 — not rendered, not in the DOM. Only the test build of the
 * embed path (scripts/build-fixture.mjs) turns it on, so the narration wiring stays tested until a
 * recording of the scene exists.
 */
export const NARRATION_ENABLED = import.meta.env.VITE_NARRATION_ENABLED === 'true';

/**
 * 037 ruling 2: one audio file per embedded scene, Aarya's real voice.
 * TODO:VB-audio — no recording of two-clocks exists; the test build serves a chime track (one chime
 * per caption `t`) from tests/fixtures/audio/. No TTS (spend).
 */
export const NARRATION: Partial<Record<Audience, Narration>> = NARRATION_ENABLED
  ? { students: { src: '/audio/two-clocks-narration.placeholder.m4a', placeholder: true } }
  : {};

/** Origin of the Karka frontend that serves /embed/. Unset until the cbse11-embed route is deployed. */
const KARKA_EMBED_ORIGIN: string | undefined = import.meta.env.VITE_KARKA_EMBED_ORIGIN;

/**
 * 040 §C: the Students board panel.
 * - 'video' (C2, v1): a muted loop of the real board, cut from the demo recordings.
 * - 'embed' (C1): the live /embed/ route. Setting VITE_KARKA_EMBED_ORIGIN at build time is the whole
 *   swap; the embed path stays built and tested (tests/embed.spec.ts runs against the fixture build).
 */
export const STUDENTS_PANEL: 'embed' | 'video' = KARKA_EMBED_ORIGIN ? 'embed' : 'video';

/**
 * 040 v1: Schools is poster + copy. The 039 classroom variant (a pinned embed with the teacher's
 * hold) needs the live route, and is switched on with it (VITE_SCHOOLS_CLASSROOM=true).
 */
export const SCHOOLS_PANEL: 'classroom' | 'poster' =
  KARKA_EMBED_ORIGIN && import.meta.env.VITE_SCHOOLS_CLASSROOM === 'true' ? 'classroom' : 'poster';

/** A muted loop of the real board (040 §C.2). */
export interface BoardLoop {
  src: string;
  type: string;
}

/** Provenance (source recording, cut, crop): public/posters/README.md. */
export const LOOPS: Partial<Record<Audience, BoardLoop>> = {
  students: { src: '/video/students-board.mp4', type: 'video/mp4' },
};

export function embedSrc(scene: string | null, audience: Audience): string {
  const q = new URLSearchParams(scene ? { scene, audience } : { audience });
  // GitHub Pages serves embed/index.html; `/embed/?…` avoids the /embed → /embed/ redirect hop.
  return `${(KARKA_EMBED_ORIGIN ?? '').replace(/\/$/, '')}/embed/?${q}`;
}
