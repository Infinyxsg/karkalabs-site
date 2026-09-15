import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { duration, ease, nudge } from '../design/tokens';
import { embed as embedTiming } from '../config/behaviour';
import { useReducedMotion } from '../lib/useReducedMotion';
import { onScrollingChange } from '../lib/scrollState';
import { BoardFrame } from '../components/BoardFrame';
import { embedSrc, type Audience, type Narration } from './config';
import { isEmbedEvent, readyTotal, type EmbedCommand, type ReadyStep } from './protocol';

export interface Caption {
  /** Seconds into the scene's narration where this line starts. */
  t: number;
  text: string;
}

export interface Poster {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** Classroom variant: the teacher holds the board at one step and asks the room a question. */
export interface HoldCue {
  atStep: number;
  /** The product's hold banner text. */
  label: string;
  question: string;
}

export interface KarkaEmbedProps {
  /** Manifest slug, or null while unpicked (→ placeholder frame). */
  scene: string | null;
  audience: Audience;
  poster: Poster;
  /** What the tutor says, one entry per step, in step order. Fallback when the frame sends none. */
  captions: readonly Caption[];
  /** iframe title — set per audience. */
  title: string;
  tutor?: string;
  /** Pre-recorded narration for this scene. Plays in this page, never inside the frame. */
  narration?: Narration;
  /** Stub sections: never mount the frame. */
  posterOnly?: boolean;
  /** When set, the parent drives the board (pinned scroll) instead of play/pause autoplay. */
  step?: number;
  holdCue?: HoldCue;
  /** `fromFrame` = the frame described its own steps (contract v2 `ready.steps`). */
  onReady?: (totalSteps: number, fromFrame: boolean) => void;
  /** The step whose caption is on screen (0 = none) — from narration while it plays, else the frame. */
  onStepShown?: (n: number) => void;
  tone?: 'ink' | 'paper';
  className?: string;
}

type Status = 'idle' | 'loading' | 'live' | 'fallback';

const transcriptTone = {
  ink: { card: 'bg-on-ink/6 text-on-ink', index: 'text-on-ink-muted', active: 'bg-on-ink/10', hold: 'text-teal-on-ink' },
  paper: { card: 'bg-board text-ink border border-line', index: 'text-ink-muted', active: 'bg-paper', hold: 'text-teal' },
} as const;

/** Index of the caption being spoken at `time` seconds. */
export function captionIndexAt(captions: readonly Caption[], time: number): number {
  let index = 0;
  captions.forEach((c, i) => {
    if (c.t <= time) index = i;
  });
  return index;
}

const isRealLine = (say: string) => say.trim() !== '' && !say.trim().startsWith('TODO:VB');

/**
 * Captions from the frame's `ready.steps` (contract v2): the frame's `say` line wins; a missing or
 * TODO:VB line falls back to copy.ts. Timings come from copy.ts (they belong to the narration file);
 * a step with no narration timing is never reached by the narration clock.
 */
export function captionsFromFrame(steps: readonly ReadyStep[], fallback: readonly Caption[]): Caption[] {
  return [...steps]
    .sort((a, b) => a.n - b.n)
    .map((s, i) => ({
      t: fallback[i]?.t ?? Number.POSITIVE_INFINITY,
      text: isRealLine(s.say) ? s.say : (fallback[i]?.text ?? ''),
    }));
}

/**
 * A live Karka board in an iframe, driven over postMessage (docs/EMBED_CONTRACT.md), dressed in the
 * design system's BoardFrame. Voice is opt-in: captions carry the tutor's words until the visitor
 * presses "Hear <tutor>", which plays the pre-recorded narration in this page; while it plays, the
 * audio clock drives captions and board, otherwise the board's own `step` events do.
 */
export function KarkaEmbed({
  scene,
  audience,
  poster,
  captions,
  title,
  tutor = 'Aarya',
  narration,
  posterOnly = false,
  step,
  holdCue,
  onReady,
  onStepShown,
  tone = 'ink',
  className,
}: KarkaEmbedProps) {
  const reduced = useReducedMotion();
  const staticOnly = posterOnly || reduced;

  const src = useMemo(() => embedSrc(scene, audience), [scene, audience]);
  // Pre-rendered on the server: there is no window there, and the origin is only needed client-side.
  const frameOrigin = useMemo(
    () => (typeof window === 'undefined' ? '' : new URL(src, window.location.href).origin),
    [src],
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [frameStep, setFrameStep] = useState(0);
  /** Bumps on every {evt:'ready'} — a reloaded frame is a fresh board that needs a resync. */
  const [readyCount, setReadyCount] = useState(0);
  const [frameCaptions, setFrameCaptions] = useState<Caption[] | null>(null);
  const [playing, setPlaying] = useState(false);
  const [narrationIndex, setNarrationIndex] = useState<number | null>(null);

  const lines = frameCaptions ?? captions;
  const narrationStep = playing && narrationIndex !== null ? narrationIndex + 1 : undefined;
  /** What the board should show: the narration's step while it plays, else the parent's scroll step. */
  const boardStep = narrationStep ?? step;

  const callbacks = useRef({ onReady, onStepShown, captions });
  const boardStepRef = useRef(boardStep);
  useEffect(() => {
    callbacks.current = { onReady, onStepShown, captions };
    boardStepRef.current = boardStep;
  });

  const mounted = near && !staticOnly && status !== 'fallback';

  // "In view" drives play/pause (frame and narration). Mount within 1 viewport, unmount beyond 2.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || posterOnly) return;
    const viewObs = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      threshold: embedTiming.inViewThreshold,
    });
    viewObs.observe(el);
    if (reduced) return () => viewObs.disconnect();
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
    mountObs.observe(el);
    unmountObs.observe(el);
    return () => {
      viewObs.disconnect();
      mountObs.disconnect();
      unmountObs.disconnect();
    };
  }, [posterOnly, reduced]);

  // Each mount gets 4s to report ready, else poster for the rest of the visit.
  useEffect(() => {
    if (!mounted) return;
    setStatus('loading');
    const timer = window.setTimeout(
      () => setStatus((s) => (s === 'live' ? s : 'fallback')),
      embedTiming.readyTimeoutMs,
    );
    return () => {
      window.clearTimeout(timer);
      setStatus((s) => (s === 'fallback' ? s : 'idle'));
      setFrameStep(0);
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frameRef.current?.contentWindow || e.origin !== frameOrigin) return;
      if (!isEmbedEvent(e.data)) return;
      if (e.data.evt === 'ready') {
        const steps = e.data.steps;
        const fromFrame = Boolean(steps && steps.length > 0);
        setFrameCaptions(fromFrame ? captionsFromFrame(steps!, callbacks.current.captions) : null);
        setStatus('live');
        setReadyCount((c) => c + 1);
        callbacks.current.onReady?.(readyTotal(e.data), fromFrame);
      } else {
        setFrameStep(e.data.n);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [mounted, frameOrigin]);

  const post = useCallback(
    (msg: EmbedCommand) => frameRef.current?.contentWindow?.postMessage(msg, frameOrigin),
    [frameOrigin],
  );

  // Enter view → play (or resync the driven step); leave view → pause. Re-runs on every `ready`.
  useEffect(() => {
    if (status !== 'live') return;
    if (!inView) post({ cmd: 'pause' });
    else if (boardStepRef.current !== undefined) post({ cmd: 'step', n: boardStepRef.current });
    else post({ cmd: 'play' });
  }, [inView, status, post, readyCount]);

  // Driven steps (scroll or narration) only while visible; the effect above resyncs on return.
  useEffect(() => {
    if (status === 'live' && inView && boardStep !== undefined) post({ cmd: 'step', n: boardStep });
  }, [boardStep, status, inView, post]);

  // Narration clock → caption index.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const sync = () => setNarrationIndex(captionIndexAt(lines, audio.currentTime));
    const start = () => {
      setPlaying(true);
      sync();
    };
    const stop = () => {
      setPlaying(false);
      setNarrationIndex(null);
    };
    audio.addEventListener('timeupdate', sync);
    audio.addEventListener('seeked', sync);
    audio.addEventListener('play', start);
    audio.addEventListener('pause', stop);
    audio.addEventListener('ended', stop);
    return () => {
      audio.removeEventListener('timeupdate', sync);
      audio.removeEventListener('seeked', sync);
      audio.removeEventListener('play', start);
      audio.removeEventListener('pause', stop);
      audio.removeEventListener('ended', stop);
    };
  }, [lines, narration?.src]);

  // Narration stops when the embed leaves view, like the board does.
  useEffect(() => {
    if (!inView) audioRef.current?.pause();
  }, [inView]);

  // Wheel/touch over the frame must keep scrolling the page while Lenis is moving.
  useEffect(() => {
    if (!mounted) return;
    return onScrollingChange((scrolling) => {
      if (frameRef.current) frameRef.current.style.pointerEvents = scrolling ? 'none' : '';
    });
  }, [mounted]);

  const shownStep = narrationStep ?? (status === 'live' ? frameStep : 0);
  useEffect(() => {
    callbacks.current.onStepShown?.(shownStep);
  }, [shownStep]);

  const toggleNarration = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play().catch(() => setPlaying(false));
    else audio.pause();
  };

  const live = status === 'live';
  const showTranscript = staticOnly || status === 'fallback';
  const atHold = Boolean(holdCue) && shownStep === holdCue?.atStep;
  const currentText = atHold ? holdCue!.question : shownStep > 0 ? lines[shownStep - 1]?.text : undefined;
  const tt = transcriptTone[tone];
  // Narration plays in this page and needs no frame, so the button is there from first paint — adding
  // it when the frame went live grew the pinned block and re-centred it (a layout shift, 039 gate).
  const canNarrate = Boolean(narration) && lines.length > 0;

  const trackCaption =
    lines.length > 0 && !showTranscript ? (
      <AnimatePresence mode="wait" initial={false}>
        <m.p
          key={`${shownStep}-${atHold}`}
          className="mt-1.5 text-lead text-pretty"
          initial={{ opacity: 0, y: nudge.sm }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -nudge.sm }}
          transition={{ duration: duration.fast, ease: ease.out }}
        >
          {currentText ?? ' '}
        </m.p>
      </AnimatePresence>
    ) : undefined;

  return (
    <div
      ref={rootRef}
      className={className}
      data-embed-status={staticOnly ? 'poster' : status}
      data-frame-step={frameStep}
      data-narration={playing ? 'playing' : 'idle'}
      data-captions={frameCaptions ? 'frame' : 'copy'}
      data-hold={atHold || undefined}
      data-audience={audience}
    >
      <BoardFrame
        poster={{ ...poster, hidden: live }}
        tutor={tutor}
        captionLabel={atHold ? holdCue!.label : undefined}
        caption={trackCaption}
        tone={tone}
        showVoice={canNarrate}
        voiceOn={playing}
        onToggleVoice={toggleNarration}
        voiceNote={
          narration?.placeholder ? (
            <span className={`text-caption ${tt.index}`}>Placeholder audio · TODO:VB-audio</span>
          ) : undefined
        }
      >
        {mounted && (
          <iframe
            ref={frameRef}
            src={src}
            title={title}
            sandbox="allow-scripts allow-same-origin"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            onError={() => setStatus('fallback')}
            className={`absolute inset-0 size-full border-0 transition-opacity duration-(--dur-base) ease-karka-out ${
              live ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
      </BoardFrame>

      {lines.length > 0 && showTranscript && (
        <ol className={`mt-4 grid gap-1 rounded-card p-3 text-body ${tt.card}`} aria-label={`What ${tutor} says`}>
          {lines.map((c, i) => {
            const speaking = playing && narrationIndex === i;
            return (
              <li
                key={`${i}-${c.t}`}
                aria-current={speaking || undefined}
                className={`grid grid-cols-[1.5rem_1fr] gap-2 rounded-lg p-1 transition-colors duration-(--dur-fast) ${
                  speaking ? tt.active : ''
                }`}
              >
                <span className={`tabular-nums ${tt.index}`}>{i + 1}.</span>
                <span>
                  {c.text}
                  {holdCue?.atStep === i + 1 && (
                    <span className="mt-1 block" data-hold-transcript>
                      <span className={`text-eyebrow font-semibold uppercase tracking-eyebrow ${tt.hold}`}>
                        {holdCue.label}
                      </span>{' '}
                      {holdCue.question}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {narration && <audio ref={audioRef} src={narration.src} preload="none" />}
    </div>
  );
}
