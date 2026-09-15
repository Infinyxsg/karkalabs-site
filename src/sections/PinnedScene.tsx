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
 * Pinned scroll sequence on the ink ground. One implementation for every audience and both panels:
 * - embed: scroll progress → parent sends {cmd:'step', n} → the board draws → the frame's
 *   {evt:'step', n} advances the captions (and, for students, the concept's tile state);
 * - video (C2): the pin holds the board on screen while the loop's own clock (`timeupdate`)
 *   advances the same captions, step pills and chip.
 * Reduced motion: no pin, no frame, no video — poster plus the full transcript.
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
  const video = panel === 'video' && loop !== undefined;

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

  return (
    <section id={id} ref={sectionRef} aria-labelledby={`${id}-title`} className="bg-ink text-on-ink" data-variant={variant}>
      <div ref={spacerRef}>
        <div
          ref={pinRef}
          className={reduced ? 'py-section lg:py-section-lg' : 'flex min-h-svh flex-col justify-center py-6 lg:py-10'}
        >
          <div className="mx-auto grid w-full max-w-6xl gap-5 px-gutter lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-14 lg:px-gutter-lg">
            <header className="flex flex-col gap-3 lg:gap-5">
              <Eyebrow tone="ink">{eyebrow}</Eyebrow>
              <h2 id={`${id}-title`} className="font-display text-h2 font-semibold tracking-display text-balance">
                {headline}
              </h2>
              {line && <p className="max-w-prose text-lead text-pretty text-on-ink-muted">{line}</p>}
              <div className="flex flex-wrap items-center gap-3">
                {variant === 'student' &&
                  (reduced && shownStep === 0 ? (
                    <ConceptChip summary states={JOURNEY_STATES} />
                  ) : (
                    <ConceptChip state={tileStateForStep(shownStep, total)} />
                  ))}
                {!reduced && <StepProgress current={shownStep} total={total} holdAt={holdCue?.atStep} />}
              </div>
              {classroom && <TeacherViewCard view={classroom.teacherView} />}
            </header>
            {video ? (
              <LoopPanel
                loop={loop}
                audience={audience}
                poster={poster}
                captions={captions}
                title={frameTitle}
                captionLabel={captionLabel ?? tutor}
                onReady={setTotal}
                onStepShown={setShownStep}
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
                onStepShown={setShownStep}
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
