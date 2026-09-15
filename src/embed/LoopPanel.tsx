import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { duration, ease, nudge } from '../design/tokens';
import { embed as embedTiming } from '../config/behaviour';
import { useReducedMotion } from '../lib/useReducedMotion';
import { BoardFrame } from '../components/BoardFrame';
import { captionIndexAt, type Caption, type Poster } from './KarkaEmbed';
import type { Audience, BoardLoop } from './config';

type Status = 'idle' | 'loading' | 'live' | 'fallback';

const transcriptTone = {
  ink: { card: 'bg-on-ink/6 text-on-ink', index: 'text-on-ink-muted' },
  paper: { card: 'bg-board text-ink border border-line', index: 'text-ink-muted' },
} as const;

export interface LoopPanelProps {
  loop: BoardLoop;
  audience: Audience;
  /** The loop's first frame. */
  poster: Poster;
  /** The loop's lines, timed to the video (`t` in seconds). */
  captions: readonly Caption[];
  /** Accessible name of the video. */
  title: string;
  /** Caption eyebrow. */
  captionLabel: string;
  onReady?: (totalSteps: number) => void;
  /** The caption on screen, 1-based (0 = none) — the loop's equivalent of the frame's step. */
  onStepShown?: (n: number) => void;
  tone?: 'ink' | 'paper';
}

/**
 * 040 §C.2 (path C2): the real board as a muted loop cut from the demo recordings, dressed in the
 * same BoardFrame as the live embed. The video's own clock (`timeupdate`) drives the captions and,
 * through onStepShown, the section's step and concept chip — where the embed uses the frame's
 * `step` events. Like the embed it mounts within 1 viewport, unmounts beyond 2, and plays only in
 * view. Reduced motion, a refused autoplay or a load error: poster + the full transcript.
 */
export function LoopPanel({
  loop,
  audience,
  poster,
  captions,
  title,
  captionLabel,
  onReady,
  onStepShown,
  tone = 'ink',
}: LoopPanelProps) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);

  const mounted = near && !reduced && status !== 'fallback';

  const callbacks = useRef({ onReady, onStepShown });
  useEffect(() => {
    callbacks.current = { onReady, onStepShown };
  });

  // A loop's step count is its caption count, known up front.
  useEffect(() => {
    callbacks.current.onReady?.(captions.length);
  }, [captions.length]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || reduced) return;
    const viewObs = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      threshold: embedTiming.inViewThreshold,
    });
    const mountObs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setNear(true);
      },
      { rootMargin: `${embedTiming.mountMarginPct}% 0px` },
    );
    const unmountObs = new IntersectionObserver(
      ([entry]) => {
        if (entry && !entry.isIntersecting) setNear(false);
      },
      { rootMargin: `${embedTiming.unmountMarginPct}% 0px` },
    );
    viewObs.observe(el);
    mountObs.observe(el);
    unmountObs.observe(el);
    return () => {
      viewObs.disconnect();
      mountObs.disconnect();
      unmountObs.disconnect();
    };
  }, [reduced]);

  // Video clock → caption index. Declared before the play effect so `playing` is heard.
  useEffect(() => {
    const video = videoRef.current;
    if (!mounted || !video) return;
    // React sets `muted` only as a property; defaultMuted puts the attribute on the element too.
    video.defaultMuted = true;
    video.muted = true;
    setStatus('loading');
    const sync = () => setIndex(captionIndexAt(captions, video.currentTime));
    const playing = () => {
      setStatus('live');
      sync();
    };
    const fail = () => setStatus('fallback');
    video.addEventListener('timeupdate', sync);
    video.addEventListener('seeked', sync);
    video.addEventListener('playing', playing);
    video.addEventListener('error', fail);
    return () => {
      video.removeEventListener('timeupdate', sync);
      video.removeEventListener('seeked', sync);
      video.removeEventListener('playing', playing);
      video.removeEventListener('error', fail);
      setStatus((s) => (s === 'fallback' ? s : 'idle'));
      setIndex(0);
    };
  }, [mounted, captions]);

  // Plays only in view, unless the visitor paused it.
  useEffect(() => {
    const video = videoRef.current;
    if (!mounted || !video) return;
    if (!inView || userPaused) {
      video.pause();
      return;
    }
    video.play().catch((err: unknown) => {
      // AbortError = a pause() overtook this play(). Anything else (autoplay refused, e.g. iOS Low
      // Power Mode) = this visit gets the poster and the transcript.
      if ((err as { name?: string } | null)?.name !== 'AbortError') setStatus('fallback');
    });
  }, [mounted, inView, userPaused]);

  const live = status === 'live';
  const shownStep = live ? index + 1 : 0;
  useEffect(() => {
    callbacks.current.onStepShown?.(shownStep);
  }, [shownStep]);

  const showTranscript = reduced || status === 'fallback';
  const tt = transcriptTone[tone];
  const currentText = shownStep > 0 ? captions[shownStep - 1]?.text : undefined;

  const trackCaption =
    captions.length > 0 && !showTranscript ? (
      <AnimatePresence mode="wait" initial={false}>
        <m.p
          key={shownStep}
          className="mt-1.5 text-lead text-pretty"
          initial={{ opacity: 0, y: nudge.sm }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -nudge.sm }}
          transition={{ duration: duration.fast, ease: ease.out }}
        >
          {currentText ?? ' '}
        </m.p>
      </AnimatePresence>
    ) : undefined;

  return (
    <div
      ref={rootRef}
      data-panel="video"
      data-embed-status={reduced ? 'poster' : status}
      data-loop-step={shownStep}
      data-audience={audience}
    >
      <BoardFrame poster={{ ...poster, hidden: live }} tutor={captionLabel} caption={trackCaption} tone={tone}>
        {mounted && (
          <video
            ref={videoRef}
            src={loop.src}
            poster={poster.src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label={title}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-(--dur-base) ease-karka-out ${
              live ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
        {mounted && live && (
          // WCAG 2.2.2: moving content longer than 5 s needs a pause. Absolutely placed: no layout shift.
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            className="absolute right-3 bottom-3 inline-flex min-h-hit-target cursor-pointer items-center rounded-pill bg-ink/80 px-4 text-caption font-semibold text-on-ink transition-colors duration-(--dur-fast) ease-karka-out hover:bg-ink"
          >
            {userPaused ? 'Play' : 'Pause'}
            <span className="sr-only"> the board video</span>
          </button>
        )}
      </BoardFrame>

      {showTranscript && captions.length > 0 && (
        <ol className={`mt-4 grid gap-1 rounded-card p-3 text-body ${tt.card}`} aria-label={captionLabel}>
          {captions.map((c, i) => (
            <li key={`${i}-${c.t}`} className="grid grid-cols-[1.5rem_1fr] gap-2 p-1">
              <span className={`tabular-nums ${tt.index}`}>{i + 1}.</span>
              <span>{c.text}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
