import { brand, hero } from '../content/copy';
import { schoolDemoHref, whatsappHref } from '../content/contact';
import { Button } from '../components/Button';

/**
 * Hero on the board's flat scene ground (design system: handoff/ui_kits/website/Website.jsx).
 * 1440: copy left, the mascot right in a soft-shadowed panel. 390: the mascot sits below the copy.
 * The mascot is the hero's largest element, so it loads eagerly and is preloaded in index.html.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden="true" className="board-grid absolute inset-0" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-gutter pt-8 pb-15 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-14 lg:px-gutter-lg">
        <div className="flex min-h-105 flex-col justify-end gap-6">
          <h1 id="hero-title" className="max-w-3xl font-display text-display font-semibold tracking-display text-balance">
            {hero.headline}
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
        <div className="overflow-hidden rounded-board bg-board shadow-board" data-hero-panel>
          <img
            src={brand.mascot.src}
            srcSet={`${brand.mascot.small} 640w, ${brand.mascot.src} 1100w`}
            sizes="(min-width: 64rem) 34rem, 100vw"
            alt={brand.mascot.alt}
            width={brand.mascot.width}
            height={brand.mascot.height}
            fetchPriority="high"
            decoding="async"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}
