import { m } from 'framer-motion';
import { duration, ease, nudge } from '../design/tokens';
import type { Poster } from '../embed/KarkaEmbed';
import { Button } from '../components/Button';
import { Eyebrow } from '../components/Eyebrow';

export interface AudienceContent {
  eyebrow: string;
  headline: string;
  body: string;
  cta: string;
  poster: Poster;
  /** Decorative subject mark (src from `glyph()` in copy.ts). */
  glyph: string;
}

/**
 * Parents / Schools / Tuition centres in v1 (040): copy, one CTA and a still. Every still is a real
 * product surface with no identifiable student — the Parents one is a sample report
 * (provenance: public/posters/README.md).
 * Grounds alternate paper / the board's scene ground, so the page isn't one flat tone.
 */
export function AudienceSection({
  id,
  content,
  href,
  tone = 'paper',
}: {
  id: 'parents' | 'schools' | 'tuition';
  content: AudienceContent;
  href: string;
  tone?: 'paper' | 'scene';
}) {
  const scene = tone === 'scene';
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      data-panel="poster"
      data-ground={tone}
      // The paper ground is set explicitly, not inherited, so the alternation is visible to tests too.
      className={`py-section lg:py-section-lg ${scene ? 'bg-scene' : 'border-t border-line bg-paper'}`}
    >
      <m.div
        initial={{ opacity: 0, y: nudge.md }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: duration.reveal, ease: ease.out }}
        className="mx-auto grid max-w-6xl gap-8 px-gutter lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-gutter-lg"
      >
        <div className="flex flex-col items-start gap-4">
          {/* A div, not a p: Eyebrow renders a <p>, and a paragraph inside a paragraph breaks hydration. */}
          <div className="flex items-center gap-2">
            <img src={content.glyph} alt="" aria-hidden="true" width={24} height={24} loading="lazy" className="size-6 object-contain" />
            {/* teal on paper; the deeper teal on the scene ground, which fails AA at this size. */}
            <Eyebrow tone={scene ? 'scene' : 'paper'}>{content.eyebrow}</Eyebrow>
          </div>
          <h2 id={`${id}-title`} className="font-display text-h2 font-semibold tracking-display text-balance">
            {content.headline}
          </h2>
          <p className="max-w-prose text-lead text-pretty text-ink-muted">{content.body}</p>
          <Button href={href} external={href.startsWith('https:')}>
            {content.cta}
          </Button>
        </div>
        <img
          src={content.poster.src}
          {...(content.poster.small
            ? { srcSet: `${content.poster.small} 640w, ${content.poster.src} ${content.poster.width}w`, sizes: '(min-width: 64rem) 34rem, 100vw' }
            : {})}
          alt={content.poster.alt}
          width={content.poster.width}
          height={content.poster.height}
          loading="lazy"
          decoding="async"
          className="aspect-4/3 w-full rounded-board object-cover shadow-board"
        />
      </m.div>
    </section>
  );
}
