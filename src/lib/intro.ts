import { ease } from '../design/tokens';

/**
 * The first-visit intro (word 042): the Veo clip of the mascot opening the laptop, played once in the
 * hero panel, then dissolved into the mascot still so the hero ends in exactly its resting state.
 *
 * Runs only when index.html's inline script set `html.karka-intro` — a first visit in this tab with
 * motion welcome. The beats, 6.5 s end to end:
 *  - the clip plays full-panel while the copy, readable from the first paint, comes up to full opacity;
 *  - at LIFT_AT the lid is open and its wordmark is last square-on: ours appears over it and flies,
 *    scaling, into the nav slot (a FLIP transition);
 *  - the smile lands, and the clip cross-fades into the mascot still.
 * Skip jumps straight to the resting state. Anything that goes wrong does the same.
 *
 * The clip and the button are created here rather than in React, so the server-rendered markup is the
 * same on both paths; both are absolutely placed inside the panel, so neither can shift the page.
 * The video is mounted after the first paint and fetched only then (preload="none"), so it never
 * competes with the hero for the largest paint.
 */
const FLAG = 'karka:intro-played';

/** Seconds into the trimmed clip. The lid is open and its wordmark is last square-on at 2.8s. */
const LIFT_AT = 2.8;
const LIFT_MS = 800;
const COPY_MS = 500;
const CROSSFADE_MS = 300;
/** Hard ceiling: the intro is decoration, and it never outstays the budget. */
const MAX_MS = 6500;

const EASE = `cubic-bezier(${ease.out.join(', ')})`;

// H.264 MP4 only. Every target browser plays it, and at this length VP9 encoded larger anyway
// (93KB vs 160KB), so a WebM would only add bytes to the deploy and a second decoder path.
const SOURCES = [{ src: '/video/intro-mascot.mp4', type: 'video/mp4' }];

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
  // The clip is fetched only after `load`, never inside the LCP window. Decoding the hero image is
  // not the right signal: it resolves almost at once, while the hero's paint waits on the main thread
  // (measured render delay 3.4s), so the fetch still landed at ~1.3s and cost the gate 6 points.
  // The cap keeps a stalled resource from stranding the intro.
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    requestAnimationFrame(() => requestAnimationFrame(() => play(root)));
  };
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
  window.setTimeout(start, 4_000);
}

function play(root: HTMLElement): void {
  const media = document.querySelector<HTMLElement>('[data-hero-media]');
  // The rounded clip lives on the panel, so the clip goes inside it; the Skip button sits in the
  // wrapper above, where the panel's corner radius can't cut it.
  const panel = document.querySelector<HTMLElement>('[data-hero-panel]');
  const copy = document.querySelector<HTMLElement>('[data-hero-copy]');
  const lift = document.querySelector<HTMLElement>('[data-intro-wordmark]');
  const navMark = document.querySelector<HTMLElement>('[data-nav-wordmark]');

  let done = false;
  let timer = 0;
  // Every animation started here, so Skip can cancel them: a running Web Animation overrides both the
  // stylesheet and inline styles, so without this the copy would stay at its intro opacity.
  const running: Animation[] = [];
  const finish = (video?: HTMLVideoElement, skip?: HTMLButtonElement) => {
    if (done) return;
    done = true;
    window.clearTimeout(timer);
    for (const animation of running) {
      try {
        animation.cancel();
      } catch {
        /* already finished */
      }
    }
    video?.pause();
    video?.remove();
    skip?.remove();
    root.classList.remove('karka-intro');
    // The wordmark flew away; it must not reappear on the lid when the class goes.
    if (lift) lift.style.opacity = '0';
    if (navMark) navMark.style.opacity = '1';
  };

  if (!media || !panel || !lift || !navMark) {
    finish();
    return;
  }

  const video = document.createElement('video');
  video.className = 'karka-intro-video';
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.preload = 'none';
  video.setAttribute('aria-hidden', 'true');
  video.setAttribute('data-intro-video', '');
  for (const s of SOURCES) {
    const source = document.createElement('source');
    source.src = s.src;
    source.type = s.type;
    video.appendChild(source);
  }

  const skip = document.createElement('button');
  skip.type = 'button';
  skip.className = 'karka-intro-skip';
  skip.textContent = 'Skip';
  skip.setAttribute('data-intro-skip', '');
  skip.addEventListener('click', () => finish(video, skip));

  panel.append(video);
  media.append(skip);
  timer = window.setTimeout(() => finish(video, skip), MAX_MS);

  // 'both': it holds full opacity for the rest of the clip. With 'backwards' the copy would drop back
  // to its start value the moment the animation ended.
  const copyRise = copy?.animate([{ opacity: 0.35 }, { opacity: 1 }], {
    duration: COPY_MS,
    delay: 200,
    easing: EASE,
    fill: 'both',
  });
  if (copyRise) running.push(copyRise);

  // The lid wordmark lifts into the nav: measured now, animated as one transform.
  let lifted = false;
  const liftOff = () => {
    if (lifted) return;
    lifted = true;
    const from = lift.getBoundingClientRect();
    const to = navMark.getBoundingClientRect();
    if (from.width === 0 || to.width === 0) return;
    lift.style.opacity = '1';
    const flight = lift.animate(
      [
        { transform: 'none' },
        {
          transform: `translate(${Math.round(to.left - from.left)}px, ${Math.round(
            to.top - from.top,
          )}px) scale(${(to.width / from.width).toFixed(3)})`,
        },
      ],
      { duration: LIFT_MS, easing: EASE, fill: 'both' },
    );
    const handover = navMark.animate([{ opacity: 0 }, { opacity: 0 }, { opacity: 1 }], {
      duration: LIFT_MS,
      easing: 'linear',
      fill: 'backwards',
    });
    running.push(flight, handover);
    flight.finished
      .then(() => {
        lift.style.opacity = '0';
        navMark.style.opacity = '1';
        flight.cancel();
      })
      .catch(() => {
        /* interrupted: finish() has already put the hero in its resting state */
      });
  };

  video.addEventListener('timeupdate', () => {
    if (video.currentTime >= LIFT_AT) liftOff();
  });

  // The clip dissolves into the still underneath, so the hero lands in its resting state.
  video.addEventListener('ended', () => {
    const fade = video.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: CROSSFADE_MS,
      easing: 'linear',
      fill: 'forwards',
    });
    fade.finished.then(() => finish(video, skip)).catch(() => finish(video, skip));
  });

  video.addEventListener('error', () => finish(video, skip));
  video.play().catch(() => finish(video, skip));
}
