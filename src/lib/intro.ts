import { ease } from '../design/tokens';

/**
 * The first-visit intro (word 041 §B), driven by the Web Animations API — no library, and only
 * transforms and opacities, so it cannot shift layout.
 *
 * It runs only when index.html's inline script set `html.karka-intro`, which it does on a first visit
 * with motion welcome. The sequence, about 1.2 s end to end and never blocking the page:
 *  - the mascot panel scales back from filling the hero to its place;
 *  - the copy, already readable underneath, comes up to full opacity;
 *  - the seven glyphs drift in from just outside the panel, slightly staggered, and settle;
 *  - the wordmark on the laptop lid lifts, scales and lands on the nav wordmark (a FLIP transition).
 *
 * It starts after the first paint, and reads only three rects: measuring every glyph put a forced
 * reflow in the hydration path, which cost 120 ms of blocking time and 0.5 s of LCP.
 */
const FLAG = 'karka:intro-played';

/** ms — the whole sequence stays well inside the 2 s budget. */
const PANEL_MS = 900;
const COPY_MS = 500;
const GLYPH_MS = 700;
const LIFT_MS = 800;
const LIFT_DELAY = 420;

const EASE = `cubic-bezier(${ease.out.join(', ')})`;

/** The whole sequence, end to end: the 2 s budget the word sets. */
export const INTRO_BUDGET_MS = LIFT_DELAY + LIFT_MS;

const rememberPlayed = () => {
  try {
    sessionStorage.setItem(FLAG, '1');
  } catch {
    /* private mode or blocked storage: the intro simply plays again next time */
  }
};

export function runIntro(): void {
  const root = document.documentElement;
  if (!root.classList.contains('karka-intro')) return;
  rememberPlayed();
  // Decoration waits for the first paint: nothing here belongs in the hydration path.
  requestAnimationFrame(() => requestAnimationFrame(() => play(root)));
}

function play(root: HTMLElement): void {
  const panel = document.querySelector<HTMLElement>('[data-hero-panel]');
  const copy = document.querySelector<HTMLElement>('[data-hero-copy]');
  const lift = document.querySelector<HTMLElement>('[data-intro-wordmark]');
  const navMark = document.querySelector<HTMLElement>('[data-nav-wordmark]');
  const glyphs = [...document.querySelectorAll<HTMLElement>('[data-hero-glyph]')];

  const finish = () => root.classList.remove('karka-intro');
  if (!panel || !lift || !navMark || typeof panel.animate !== 'function') {
    finish();
    return;
  }

  // The start state, measured once while the class is still on, then the page drops to its resting
  // state and everything animates back from these values.
  const panelStart = getComputedStyle(panel).transform;
  const liftStart = lift.getBoundingClientRect();
  finish();

  const liftRest = lift.getBoundingClientRect();
  const navBox = navMark.getBoundingClientRect();
  const delta = (from: DOMRect, to: DOMRect) =>
    `translate(${Math.round(to.left - from.left)}px, ${Math.round(to.top - from.top)}px) scale(${(
      to.width / from.width
    ).toFixed(3)})`;

  panel.animate([{ transform: panelStart }, { transform: 'none' }], {
    duration: PANEL_MS,
    easing: EASE,
    fill: 'backwards',
  });

  copy?.animate([{ opacity: 0.35 }, { opacity: 1 }], {
    duration: COPY_MS,
    delay: 200,
    easing: EASE,
    fill: 'backwards',
  });

  // Each glyph drifts in from outside the panel. Which way is already known from the corner it is
  // pinned to, so this reads no layout; the varying distance and delay give the parallax.
  glyphs.forEach((g, i) => {
    const dx = (g.style.left ? -1 : 1) * (44 + (i % 3) * 22);
    const dy = (g.style.top ? -1 : 1) * (30 + (i % 2) * 20);
    g.animate(
      [
        { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 },
        { transform: 'none', opacity: 0.55 },
      ],
      { duration: GLYPH_MS + (i % 3) * 90, delay: 260 + i * 60, easing: EASE, fill: 'backwards' },
    );
  });

  const flight = lift.animate([{ transform: delta(liftRest, liftStart) }, { transform: delta(liftRest, navBox) }], {
    duration: LIFT_MS,
    delay: LIFT_DELAY,
    easing: EASE,
    fill: 'both',
  });
  navMark.animate([{ opacity: 0 }, { opacity: 0 }, { opacity: 1 }], {
    duration: LIFT_MS,
    delay: LIFT_DELAY,
    easing: 'linear',
    fill: 'backwards',
  });
  // The lid wordmark has arrived: hand over to the nav's own, and leave the lid clean.
  flight.finished
    .then(() => {
      lift.style.opacity = '0';
      flight.cancel();
    })
    .catch(() => {
      /* interrupted (navigation, cancel): the resting state is already correct */
    });
}
