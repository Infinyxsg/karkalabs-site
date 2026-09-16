import type { Audience } from '../embed/config';
import type { Caption, Poster } from '../embed/KarkaEmbed';
import type { TeacherView } from '../sections/PinnedScene';
import type { TileState } from '../product/mastery';

/**
 * Every visitor-facing string lives here.
 * - 040 §A: the v1 launch copy, final as written (Vinodh, session chat, 2026-09-15), wired verbatim.
 * - Lines with a `Source:` note are product or demo text, quoted verbatim.
 * - Nothing may render as TODO: tests/site.spec.ts and tests/gate-launch.spec.ts assert it.
 * Node imports this file too (vite.config.ts, scripts/make-posters.mjs): type-only imports here.
 */

/**
 * Brand art from the KarkaLogin page (Infinyxsg/KarkaLogin, assets/), optimised to WebP.
 * The glyphs are the design system's set; `handoff/guidelines/brand-glyphs.html` lists all seven.
 */
export const brand = {
  mascot: {
    src: '/brand/student-hero.webp',
    /** Phones get a quarter of the pixels to decode (the panel is ~358px wide at 390). */
    small: '/brand/student-hero-640.webp',
    /** A 412px screen at DPR 1.75 needs ~721px: without this step it takes the 1100px file. */
    medium: '/brand/student-hero-800.webp',
    alt: 'A student at a laptop, chin on hand, looking up mid-thought, with books, a plant and pencils on the desk.',
    width: 1100,
    height: 1006,
  },
  /** The full badge only reads at >= 64px; smaller uses take the central emblem (Vinodh, 2026-09-16). */
  badge: { src: '/brand/karka-badge.webp', alt: 'The Karka badge' },
  emblem: { small: '/brand/karka-emblem-32.webp', medium: '/brand/karka-emblem-56.webp' },
  wordmarkLift: { src: '/brand/wordmark-lift.webp', alt: 'KarkaLabs' },
};

/** Decorative subject mark per section (empty alt: the headline carries the meaning). */
export const glyph = (name: 'atom' | 'book' | 'graph' | 'pi' | 'sqrt' | 'mic' | 'triangle') => `/glyphs/${name}.webp`;

/**
 * The login art's seven glyphs, settled around the mascot as hero decoration, in roughly the
 * positions they hold in the KarkaLogin image. The intro drifts them in from just outside the panel;
 * with reduced motion they are simply already here.
 */
export const heroGlyphs: ReadonlyArray<{
  name: string;
  src: string;
  /** Intrinsic size of the file: it reserves the box, so a decoding glyph never resizes itself. */
  width: number;
  height: number;
  at: { top?: string; bottom?: string; left?: string; right?: string };
}> = [
  { name: 'pi', src: glyph('pi'), width: 72, height: 82, at: { top: '5%', left: '3%' } },
  { name: 'graph', src: glyph('graph'), width: 72, height: 60, at: { top: '21%', left: '12%' } },
  { name: 'sqrt', src: glyph('sqrt'), width: 72, height: 52, at: { top: '5%', right: '5%' } },
  { name: 'triangle', src: glyph('triangle'), width: 72, height: 68, at: { top: '21%', right: '14%' } },
  { name: 'atom', src: glyph('atom'), width: 72, height: 64, at: { bottom: '17%', right: '4%' } },
  { name: 'book', src: glyph('book'), width: 72, height: 50, at: { bottom: '4%', right: '17%' } },
  { name: 'mic', src: glyph('mic'), width: 72, height: 66, at: { bottom: '13%', left: '4%' } },
];

/**
 * The headline, split so "with" and "from" can be set in the display face's real italic
 * (fonts.css loads the italic file; `font-synthesis: none` forbids a faked slant).
 * The words are unchanged — `hero.headline` is still joined from these parts.
 */
const heroHeadlineParts: ReadonlyArray<{ text: string; italic?: boolean }> = [
  { text: 'Learn ' },
  { text: 'with', italic: true },
  { text: ' AI, not ' },
  { text: 'from', italic: true },
  { text: ' AI.' },
];

export const hero = {
  headlineParts: heroHeadlineParts,
  headline: heroHeadlineParts.map((p) => p.text).join(''),
  sub: "Karka is a voice tutor that teaches on a live board. You talk. Aarya listens, catches what's wrong, and redraws it until the concept holds.",
  ctaSession: 'Try a session',
  ctaDemo: 'Book a school demo',
};

/** <title>, meta description and OG tags — from the hero copy (040 §E). Filled into index.html by vite.config.ts. */
export const meta = {
  title: `KarkaLabs · ${hero.headline}`,
  description: hero.sub,
  ogImageAlt: 'The headline “Learn with AI, not from AI.” and the KarkaLabs wordmark, beside the Karka board drawing a velocity–time graph.',
};

export const audiences: ReadonlyArray<{ id: Audience; label: string }> = [
  { id: 'students', label: 'Students' },
  { id: 'parents', label: 'Parents' },
  { id: 'schools', label: 'Schools' },
  { id: 'tuition', label: 'Tuition centres' },
];

/** First frame of the Students loop. Provenance of every still: public/posters/README.md. */
const boardLoopPoster: Poster = {
  src: '/posters/students-board.webp',
  alt: 'The Karka board drawing a velocity–time graph for constant acceleration, with the area under the line shaded as the distance travelled.',
  width: 800,
  height: 576,
};

// Source: the VO of demo scene 6, "Graphs & step-by-step" (id s08), D:\Demo videos\CBSE Onboarding\
// demo-assets\vo\script.json, verbatim, one caption per sentence. The loop is that scene's bed
// (scenes/bed_s08.mp4, first 14.4 s); `t` = where each sentence starts in vo/s08.mp3 (silencedetect).
const boardLoopCaptions: readonly Caption[] = [
  { t: 0, text: "Graphs aren't pictures here — they're drawn live, point by point, while Aarya explains what each part means." },
  { t: 6.2, text: 'And worked problems go one step at a time.' },
  { t: 8.7, text: "He waits at every step — if the student is stuck, he doesn't reveal the answer." },
  { t: 12.5, text: 'He guides them to it.' },
];

// TODO:VB — DRAFT lines written only to exercise the stand-in frame's 6 steps (embed path, C1). A frame
// that sends `ready.steps` (contract v2) replaces them line by line. Never rendered by the v1 build.
const twoClocksDraftCaptions: readonly Caption[] = [
  { t: 0, text: 'A ball is launched at an angle. Let’s follow its path, and its velocity, the whole way.' },
  { t: 5, text: 'Its velocity has two parts: one across, one up. Keep an eye on both.' },
  { t: 10, text: 'Gravity only pulls down. So only the upward part shrinks as the ball rises.' },
  { t: 15, text: 'You said the ball stops at the top. Let’s check that on the board.' },
  { t: 20, text: 'At the top, only the upward part is zero. The across part never changed, so it keeps moving.' },
  { t: 26, text: 'That’s why the path is a curve, not straight up and down. Now you’ve got it.' },
];

export const students = {
  glyph: glyph('graph'),
  eyebrow: 'For students',
  headline: 'You say it. Aarya catches it. The board redraws it.',
  // Vinodh's ruling after 040 (session chat): rewritten to match the loop, which shows a graph, not a throw.
  body: 'Say what you think the graph is telling you. Aarya hears the mistake before you finish the sentence, and the board shows you why. No marking scheme, no waiting a week.',
  tutor: 'Aarya',
  /** 040 C2 — the muted loop of the real board (v1). */
  loop: {
    title: 'The Karka board, muted: a velocity–time graph drawn live, then a worked explanation step by step',
    // The lines are the demo's narrator describing the board, not Aarya speaking — so not labelled "Aarya".
    captionLabel: 'On the board',
    poster: boardLoopPoster,
    captions: boardLoopCaptions,
  },
  /** 040 C1 — the live embed, built when VITE_KARKA_EMBED_ORIGIN is set. */
  embed: {
    frameTitle: 'Karka board: Aarya explains a projectile’s path, step by step',
    // TODO:VB — a still of p11-proj-two-clocks-one-time once the live route ships; the loop's first frame until then.
    poster: boardLoopPoster,
    captions: twoClocksDraftCaptions,
  },
};

const parentsBody =
  'After every session, a plain-English report: what was learned, the questions asked, and where the evidence is still thin. Not started, Tarnished, Shaky, Held — the same words your child sees.';
const firstSentenceEnd = parentsBody.indexOf('. ') + 1;

export const parents = {
  glyph: glyph('book'),
  eyebrow: 'For parents',
  headline: 'See the concept, not just the score.',
  body: parentsBody,
  cta: 'Try a session',
  poster: {
    src: '/posters/parents-sample.webp',
    small: '/posters/parents-sample-640.webp',
    alt: 'A sample Karka parent report for “Your child”, O-Level Physics: a plain-English summary and three concepts marked Held, Shaky and Not started.',
    width: 1200,
    height: 900,
  },
  /**
   * The Parents still, rendered from these lines by scripts/make-posters.mjs in the layout of
   * handoff/ui_kits/parent_dashboard/ParentDashboard.jsx. Vinodh's ruling (040, session chat): no real
   * student data on the public site — never the recorded report; sample data, labelled as such.
   */
  sample: {
    eyebrow: 'Sample report',
    student: 'Your child',
    subject: 'O-Level Physics',
    // The Parents body above, verbatim: its first sentence as the summary, its second under the chips.
    summary: parentsBody.slice(0, firstSentenceEnd),
    statesNote: parentsBody.slice(firstSentenceEnd + 1),
    // Source: ParentDashboard.jsx:7, the report's column heading.
    learnedTitle: 'What they learned',
    // Concepts: tiles of the O-Level 6091 mastery board (Kinematics, as in posters/tuition.webp).
    // States: one Held, one Shaky, one Not started (the ruling), in the board's colours.
    learned: [
      { concept: 'Speed vs velocity', state: 'held' },
      { concept: 'Acceleration definition', state: 'shaky' },
      { concept: 'Motion graph interpretation', state: 'missing' },
    ] as ReadonlyArray<{ concept: string; state: TileState }>,
  },
};

export const schools: {
  glyph: string;
  eyebrow: string;
  headline: string;
  body: string;
  cta: string;
  poster: Poster;
  classroom: {
    tutor: string;
    frameTitle: string;
    holdAtStep: number;
    holdLabel: string;
    classQuestion: string;
    teacherView: TeacherView;
  };
} = {
  glyph: glyph('atom'),
  eyebrow: 'For schools',
  headline: 'A board that listens to the whole room.',
  body: "In class, Aarya draws while students answer. Teachers hold the board at the moment that matters, and see every student's concept states afterwards — not just the three who raised their hands.",
  cta: 'Book a school demo',
  poster: {
    src: '/posters/schools-hold.webp',
    small: '/posters/schools-hold-640.webp',
    alt: 'The Karka board held mid-lesson: a bus on a road, drawn to explain reference frames, under the banner “Holding · after real-world scene, before next quick-check”.',
    width: 960,
    height: 720,
  },
  /** The 039 classroom variant (pinned embed + the teacher's hold): built only with the live route. */
  classroom: {
    tutor: 'Aarya',
    frameTitle: 'Karka board in a classroom: Aarya explains a projectile’s path and the teacher holds at the top',
    // The stand-in frame reaches the top at step 4. A frame that sends its own steps holds at its
    // last step instead: 038b's step script ends on "top".
    holdAtStep: 4,
    // Source: D:\CBSEPhysics11\index.html:235 — the product's hold banner ("Aarya is holding …").
    holdLabel: 'Aarya is holding',
    // Source: D:\CBSEPhysics11\physics-cbse11-manifest.js:741 — the subtopic's tryIt for phy11-3-p6.
    classQuestion: 'At the very top of the flight, what is the ball’s acceleration?',
    // Fields: WF-03D as implemented (karka-supabase 0047_classroom_session_facts.sql; check outcomes per
    // DASHBOARD_DATA_CONTRACT.md:110). Labels: the teacher dashboard's own, D:\dashboard\teacher_record.js
    // (:188 "Checks for understanding", :169-171 outcome labels, :156 "Where you stepped in" = holds).
    teacherView: {
      checksTitle: 'Checks for understanding',
      outcomes: ['answered correctly', 'answered incorrectly', 'no answer from the room'],
      holdsTitle: 'Where you stepped in',
    },
  },
};

export const tuition = {
  glyph: glyph('pi'),
  eyebrow: 'For tuition centres',
  headline: 'Your syllabus, one concept at a time.',
  body: "O-Level Physics 6091 mapped as a concept graph, gated so students can't skip what they haven't held. Ask about running Karka under your own name.",
  cta: 'Ask about licensing',
  poster: {
    src: '/posters/tuition.webp',
    small: '/posters/tuition-640.webp',
    alt: 'The Karka mastery board for O-Level Physics: every syllabus skill as a tile, each Not started, Tarnished, Shaky or Held.',
    width: 960,
    height: 720,
  },
};

export const footer = {
  company: 'Infinyx Labs Pte. Ltd. · Singapore',
};
