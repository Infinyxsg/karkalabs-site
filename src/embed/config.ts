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
}

/**
 * 040 §C.3: "Hear Aarya" is off — not rendered, not in the DOM. It stays off until a real recording
 * of the scene exists: the frame's five steps now carry `t: null` (TODO:VB-audio), so there is no
 * clock to drive. The six-chime placeholder that stood in for one was removed when the live embed
 * landed — its timings belonged to six draft lines the board never says (038b gate report).
 */
export const NARRATION_ENABLED = import.meta.env.VITE_NARRATION_ENABLED === 'true';

/**
 * 037 ruling 2: one audio file per embedded scene, Aarya's real voice. TODO:VB-audio — no recording
 * of two-clocks exists, and no placeholder stands in for one, so this is empty and `NARRATION_ENABLED`
 * has nothing to turn on. Drop a real cut in here (and give each step its `t`) to light the button up.
 */
export const NARRATION: Partial<Record<Audience, Narration>> = {};

/**
 * Origin of the Karka frontend that serves /embed/. Committed in .env (public, not a secret):
 * https://cbsephysics11.karkalabs.ai, live since CBSEPhysics11 main 486141c.
 */
const KARKA_EMBED_ORIGIN: string | undefined = import.meta.env.VITE_KARKA_EMBED_ORIGIN;

/**
 * 040 §C: the Students board panel, chosen at build time.
 * - 'embed' (C1, shipping): the live /embed/ route.
 * - 'video' (C2): a muted loop of the real board, cut from the demo recordings.
 * Unsetting VITE_KARKA_EMBED_ORIGIN puts the whole section back on C2 — the loop is not dead code,
 * it is also the runtime fallback when a mounted frame misses its ready deadline (see LOOPS).
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

/**
 * Provenance (source recording, cut, crop): public/posters/README.md.
 * Also the live embed's fallback: real footage of the real board beats a still, so a frame that
 * never reports `ready` hands the panel to this rather than leaving a bare poster.
 */
export const LOOPS: Partial<Record<Audience, BoardLoop>> = {
  students: { src: '/video/students-board.mp4', type: 'video/mp4' },
};

export function embedSrc(scene: string | null, audience: Audience): string {
  const q = new URLSearchParams(scene ? { scene, audience } : { audience });
  // GitHub Pages serves embed/index.html; `/embed/?…` avoids the /embed → /embed/ redirect hop.
  return `${(KARKA_EMBED_ORIGIN ?? '').replace(/\/$/, '')}/embed/?${q}`;
}
