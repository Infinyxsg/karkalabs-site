import { brand, hero, heroGlyphs } from '../content/copy';
import { schoolDemoHref, whatsappHref } from '../content/contact';
import { Button } from '../components/Button';

/**
 * Hero on the board's flat scene ground (design system: handoff/ui_kits/website/Website.jsx).
 * 1440: copy left, the mascot right in a soft-shadowed panel. 390: the mascot sits below the copy.
 * The mascot is the hero's largest element, so it loads eagerly and is preloaded in index.html.
 *
 * The intro (src/lib/intro.ts) animates the pieces marked here, and only on a first visit with motion
 * welcome: the panel scales down to place, the glyphs drift in, and the wordmark on the laptop lid
 * lifts into the nav. Every one of those is a transform or an opacity, so nothing can shift layout.
 * The lid wordmark is a real element because the printed one was painted out of the image.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden" data-hero>
      <div aria-hidden="true" className="board-grid absolute inset-0" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-gutter pt-8 pb-15 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-14 lg:px-gutter-lg">
        <div className="flex min-h-105 flex-col justify-end gap-6" data-hero-copy>
          <h1 id="hero-title" className="max-w-3xl font-display text-display font-semibold tracking-display text-balance">
            {hero.headlineParts.map((part, i) =>
              part.italic ? <em key={i}>{part.text}</em> : <span key={i}>{part.text}</span>,
            )}
          </h1>
          <p className="max-w-prose text-lead text-pretty text-ink-muted">{hero.sub}</p>
          <div className="flex flex-wrap gap-3">
            <Button href={whatsappHref} external>
              {hero.ctaSession}
            </Button>
            <Button href={schoolDemoHref} variant="chip">
              {hero.ctaDemo}
            </Button>
          </div>
        </div>

        <div className="relative" data-hero-media>
          <div className="overflow-hidden rounded-board bg-board shadow-board" data-hero-panel>
            <img
              src={brand.mascot.src}
              srcSet={`${brand.mascot.small} 640w, ${brand.mascot.medium} 800w, ${brand.mascot.src} 1100w`}
              sizes="(min-width: 64rem) 34rem, 100vw"
              alt={brand.mascot.alt}
              width={brand.mascot.width}
              height={brand.mascot.height}
              fetchPriority="high"
              decoding="async"
              data-hero-still
              className="w-full"
            />
          </div>
          {/* Sits over the laptop lid, where the art's own wordmark was. Outside the panel, so the
              intro can carry it past the panel's rounded clip and into the nav. */}
          <img
            src={brand.wordmarkLift.src}
            alt=""
            aria-hidden="true"
            data-intro-wordmark
            // Decoration: it must not race the mascot, which is the LCP element.
            fetchPriority="low"
            decoding="async"
            className="pointer-events-none absolute"
            style={{ left: '41.5%', top: '80%', width: '15.5%' }}
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" data-hero-glyphs>
            {heroGlyphs.map((g) => (
              <img
                key={g.name}
                src={g.src}
                alt=""
                data-hero-glyph
                data-glyph={g.name}
                // Each glyph's own size, so the box is reserved and a decoding glyph never resizes
                // itself (that showed up as 0.003 of shift inside the hero).
                width={g.width}
                height={g.height}
                // Seven small files that used to be fetched before the stylesheet, ahead of the LCP
                // image. They are decoration: they can wait their turn.
                loading="lazy"
                fetchPriority="low"
                decoding="async"
                className="absolute h-auto w-7 object-contain lg:w-10"
                style={g.at}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
