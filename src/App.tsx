import { useEffect } from 'react';
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';
import { useReducedMotion } from './lib/useReducedMotion';
import { Hero } from './sections/Hero';
import { PinnedScene } from './sections/PinnedScene';
import { AudienceSection } from './sections/AudienceSection';
import { SiteFooter, SiteHeader } from './sections/SiteChrome';
import { LOOPS, NARRATION, SCENE_PICKS, SCHOOLS_PANEL, STUDENTS_PANEL } from './embed/config';
import { licensingHref, schoolDemoHref, whatsappHref } from './content/contact';
import { parents, schools, students, tuition } from './content/copy';

export function App() {
  const reduced = useReducedMotion();

  // Smooth scroll only when motion is welcome; the engine loads as its own chunk after first paint.
  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    let stop: (() => void) | undefined;
    void import('./lib/smoothScroll').then(({ startSmoothScroll }) => {
      if (!cancelled) stop = startSmoothScroll();
    });
    return () => {
      cancelled = true;
      stop?.();
    };
  }, [reduced]);

  // The first-visit intro, if index.html's inline script flagged one. It loads after paint and is
  // decorative: it never blocks the page, and it does nothing at all on a return visit.
  useEffect(() => {
    void import('./lib/intro').then(({ runIntro }) => runIntro());
  }, []);

  // 040 §C: the Students board is the live embed (C1), switched on by VITE_KARKA_EMBED_ORIGIN in
  // .env. Unset it and the same section builds the muted loop (C2) instead — which is also what a
  // built embed falls back to at runtime if the frame never reports ready.
  const loop = STUDENTS_PANEL === 'video';

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-pill focus:bg-ink focus:px-4 focus:py-2 focus:text-on-ink"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">
          <Hero />
          <PinnedScene
            id="students"
            audience="students"
            scene={SCENE_PICKS.students}
            variant="student"
            panel={STUDENTS_PANEL}
            loop={LOOPS.students}
            eyebrow={students.eyebrow}
            headline={students.headline}
            line={students.body}
            tutor={students.tutor}
            frameTitle={loop ? students.loop.title : students.embed.frameTitle}
            captionLabel={loop ? students.loop.captionLabel : undefined}
            poster={loop ? students.loop.poster : students.embed.poster}
            captions={loop ? students.loop.captions : students.embed.captions}
            loopFallback={
              loop || !LOOPS.students
                ? undefined
                : {
                    loop: LOOPS.students,
                    poster: students.loop.poster,
                    captions: students.loop.captions,
                    title: students.loop.title,
                    captionLabel: students.loop.captionLabel,
                  }
            }
            narration={NARRATION.students}
            ground="paper"
            glyph={students.glyph}
          />
          <AudienceSection id="parents" content={parents} href={whatsappHref} tone="scene" />
          {SCHOOLS_PANEL === 'classroom' ? (
            <PinnedScene
              id="schools"
              audience="schools"
              scene={SCENE_PICKS.schools}
              variant="classroom"
              eyebrow={schools.eyebrow}
              headline={schools.headline}
              line={schools.body}
              tutor={schools.classroom.tutor}
              frameTitle={schools.classroom.frameTitle}
              poster={students.embed.poster}
              captions={students.embed.captions}
              classroom={schools.classroom}
            />
          ) : (
            <AudienceSection id="schools" content={schools} href={schoolDemoHref} />
          )}
          <AudienceSection id="tuition" content={tuition} href={licensingHref} tone="scene" />
        </main>
        <SiteFooter />
      </LazyMotion>
    </MotionConfig>
  );
}
