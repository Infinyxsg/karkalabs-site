import { useEffect, useRef, useState, type ReactNode } from 'react';
import { KarkaEmbed, type Caption, type HoldCue, type Poster } from '../embed/KarkaEmbed';
import { LoopPanel } from '../embed/LoopPanel';
import type { Audience, BoardLoop, Narration } from '../embed/config';
import { scroll } from '../config/behaviour';
import { registerPinSpec } from '../lib/pinRegistry';
import { useReducedMotion } from '../lib/useReducedMotion';
import { ConceptChip } from '../components/ConceptChip';
import { Eyebrow } from '../components/Eyebrow';
import { StepProgress } from '../components/StepProgress';
import { JOURNEY_STATES, tileStateForStep } from '../product/mastery';
import { progressToStep } from './studentsLogic';

export interface TeacherView {
  checksTitle: string;
  outcomes: readonly string[];
  holdsTitle: string;
}

export interface PinnedSceneProps {
  id: 'students' | 'schools';
  audience: Audience;
  scene: string | null;
  eyebrow: string;
  headline: string;
  /** Section copy under the headline. */
  line?: string;
  tutor: string;
  frameTitle: string;
  poster: Poster;
  captions: readonly Caption[];
  narration?: Narration;
  /** 'embed' = the live board (040 C1); 'video' = a muted loop of the real board (040 C2). */
  panel?: 'embed' | 'video';
  /** The loop, when panel = 'video'. */
  loop?: BoardLoop;
  /** Caption eyebrow for the loop: its lines are the demo's narration, not the tutor's words. */
  captionLabel?: string;
  /**
   * What panel = 'embed' falls back to when the frame misses its `ready` deadline: the same muted
   * loop path C2 ships, with its own footage, poster and lines (they are timed to the video, and
   * are not the frame's). Without it the embed keeps its poster + transcript.
   */
  loopFallback?: {
    loop: BoardLoop;
    poster: Poster;
    captions: readonly Caption[];
    title: string;
    captionLabel: string;
  };
  /** Section ground. The four audience sections alternate, so the page isn't one flat tone. */
  ground?: 'ink' | 'paper';
  /** Decorative subject mark (src from `glyph()` in copy.ts). */
  glyph?: string;
  /** 'student' shows the concept's tile state; 'classroom' shows the teacher's hold and view. */
  variant: 'student' | 'classroom';
  classroom?: {
    /** Hold step for the stand-in frame; a frame that describes its steps holds at its last ("top"). */
    holdAtStep: number;
    holdLabel: string;
    classQuestion: string;
    teacherView: TeacherView;
  };
  children?: ReactNode;
}

/**
 * Pinned scroll sequence. One implementation for every audience and both panels:
 * - embed: scroll progress → parent sends {cmd:'step', n} → the board draws → the frame's
 *   {evt:'step', n} advances the captions (and, for students, the concept's tile state);
 * - video (C2): the pin holds the board on screen while the loop's own clock (`timeupdate`)
 *   advances the same captions, step pills and chip.
 * An embed that misses its `ready` deadline hands the panel to that same loop (`loopFallback`) —
 * real footage of the real board, which beats a still. The pin keeps the length it was built with.
 * Reduced motion: no pin, no frame, no video — poster plus the full transcript.
 * On a paper ground the concept chip keeps the board's own state colours by sitting in an ink strip:
 * those colours are the product's and are built for the dark board.
 */
export function PinnedScene({
  id,
  audience,
  scene,
  eyebrow,
  headline,
  line,
  tutor,
  frameTitle,
  poster,
  captions,
  narration,
  panel = 'embed',
  loop,
  captionLabel,
  loopFallback,
  ground = 'ink',
  glyph,
  variant,
  classroom,
  children,
}: PinnedSceneProps) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [total, setTotal] = useState(captions.length);
  const [framed, setFramed] = useState(false);
  const [driveStep, setDriveStep] = useState(1);
  const [shownStep, setShownStep] = useState(0);
  const [embedGaveUp, setEmbedGaveUp] = useState(false);
  /**
   * The build-time choice. The pin is sized from THIS and never from the runtime one: a fallback
   * mid-visit must not re-register a built pin (see pinRegistry), so a fallen-back embed keeps the
   * embed's longer pin and the loop simply runs under it.
   */
  const video = panel === 'video' && loop !== undefined;
  /** What is on screen now: the loop also takes over when a live embed gives up. */
  const fellBackToLoop = !video && embedGaveUp && loopFallback !== undefined;
  const light = ground === 'paper';
  const tone = light ? 'paper' : 'ink';

  // The step count can change when the frame reports its own; the pin must not (see pinRegistry).
  const totalRef = useRef(total);
  useEffect(() => {
    totalRef.current = total;
  }, [total]);

  // Register synchronously; App builds every registered pin once, in page order, when the scroll
  // engine starts (src/lib/smoothScroll.ts). Bounds are published for the gate tests.
  useEffect(() => {
    const section = sectionRef.current;
    const spacer = spacerRef.current;
    const pin = pinRef.current;
    if (reduced || !section || !spacer || !pin) return;
    return registerPinSpec({
      section,
      spacer,
      pin,
      lengthVh: video ? scroll.loopPinLengthVh : scroll.pinLengthVh,
      onProgress: (progress) => setDriveStep(progressToStep(progress, totalRef.current)),
      onBounds: (start, end) => {
        section.dataset.pinStart = String(Math.round(start));
        section.dataset.pinEnd = String(Math.round(end));
      },
    });
  }, [reduced, video]);

  const holdCue: HoldCue | undefined = classroom
    ? { atStep: framed ? total : classroom.holdAtStep, label: classroom.holdLabel, question: classroom.classQuestion }
    : undefined;

  const chip =
    variant === 'student' ? (
      reduced && shownStep === 0 ? (
        <ConceptChip summary states={JOURNEY_STATES} />
      ) : (
        <ConceptChip state={tileStateForStep(shownStep, total)} />
      )
    ) : null;

  return (
    <section
      id={id}
      ref={sectionRef}
      aria-labelledby={`${id}-title`}
      data-variant={variant}
      data-ground={light ? 'paper' : 'ink'}
      className={light ? 'border-t border-line bg-paper text-ink' : 'bg-ink text-on-ink'}
    >
      <div ref={spacerRef}>
        <div
          ref={pinRef}
          // Content sits near the top of the pinned block, not centred: centring left a ~250px empty
          // band between the hero and the Students eyebrow at 1440 (measured with scripts/measure-gap.mjs).
          className={reduced ? 'py-section lg:py-section-lg' : 'flex min-h-svh flex-col justify-start py-8 lg:py-12'}
        >
          <div className="mx-auto grid w-full max-w-6xl gap-5 px-gutter lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-14 lg:px-gutter-lg">
            <header className="flex flex-col gap-3 lg:gap-5">
              {/* A div, not a p: Eyebrow renders a <p>, and a paragraph inside a paragraph breaks hydration. */}
              <div className="flex items-center gap-2">
                {glyph && (
                  <img src={glyph} alt="" aria-hidden="true" width={24} height={24} className="size-6 object-contain" />
                )}
                <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
              </div>
              <h2 id={`${id}-title`} className="font-display text-h2 font-semibold tracking-display text-balance">
                {headline}
              </h2>
              {line && (
                <p className={`max-w-prose text-lead text-pretty ${light ? 'text-ink-muted' : 'text-on-ink-muted'}`}>
                  {line}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3">
                {chip &&
                  (light ? (
                    <span className="inline-flex rounded-pill bg-ink p-1" data-chip-strip>
                      {chip}
                    </span>
                  ) : (
                    chip
                  ))}
                {!reduced && <StepProgress current={shownStep} total={total} holdAt={holdCue?.atStep} tone={tone} />}
              </div>
              {classroom && <TeacherViewCard view={classroom.teacherView} />}
            </header>
            {video || fellBackToLoop ? (
              <LoopPanel
                loop={fellBackToLoop ? loopFallback!.loop : loop!}
                audience={audience}
                poster={fellBackToLoop ? loopFallback!.poster : poster}
                captions={fellBackToLoop ? loopFallback!.captions : captions}
                title={fellBackToLoop ? loopFallback!.title : frameTitle}
                captionLabel={fellBackToLoop ? loopFallback!.captionLabel : (captionLabel ?? tutor)}
                onReady={setTotal}
                onStepShown={setShownStep}
                tone={tone}
              />
            ) : (
              <KarkaEmbed
                scene={scene}
                audience={audience}
                poster={poster}
                captions={captions}
                title={frameTitle}
                tutor={tutor}
                narration={narration}
                step={reduced ? undefined : driveStep}
                holdCue={holdCue}
                onReady={(n, fromFrame) => {
                  setTotal(n);
                  setFramed(fromFrame);
                }}
                onFallback={() => setEmbedGaveUp(true)}
                onStepShown={setShownStep}
                tone={tone}
              />
            )}
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}

/** What the teacher's report surfaces after the lesson — labels are the dashboard's own; "—" is its empty value. */
function TeacherViewCard({ view }: { view: TeacherView }) {
  return (
    <div className="rounded-card bg-on-ink/6 p-3 text-caption" data-teacher-view>
      <p className="font-semibold text-on-ink">{view.checksTitle}</p>
      <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-on-ink-muted">
        {view.outcomes.map((o) => (
          <li key={o}>
            <span className="font-semibold text-on-ink tabular-nums">—</span> {o}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-on-ink-muted">
        <span className="font-semibold text-on-ink">{view.holdsTitle}</span> —
      </p>
    </div>
  );
}
