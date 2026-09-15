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
}

/**
 * Parents / Schools / Tuition centres in v1 (040): copy, one CTA and a still. Every still is a real
 * product surface with no identifiable student — the Parents one is a sample report
 * (provenance: public/posters/README.md).
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
  tone?: 'paper' | 'ink';
}) {
  const ink = tone === 'ink';
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      data-panel="poster"
      className={`py-section lg:py-section-lg ${ink ? 'bg-ink text-on-ink' : 'border-t border-line'}`}
    >
      <m.div
        initial={{ opacity: 0, y: nudge.md }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: duration.reveal, ease: ease.out }}
        className="mx-auto grid max-w-6xl gap-8 px-gutter lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-gutter-lg"
      >
        <div className="flex flex-col items-start gap-4">
          <Eyebrow tone={ink ? 'ink' : 'paper'}>{content.eyebrow}</Eyebrow>
          <h2 id={`${id}-title`} className="font-display text-h2 font-semibold tracking-display text-balance">
            {content.headline}
          </h2>
          <p className={`max-w-prose text-lead text-pretty ${ink ? 'text-on-ink-muted' : 'text-ink-muted'}`}>
            {content.body}
          </p>
          <Button href={href} variant={ink ? 'accent' : 'primary'} external={href.startsWith('https:')}>
            {content.cta}
          </Button>
        </div>
        <img
          src={content.poster.src}
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
