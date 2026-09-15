import { hero } from '../content/copy';
import { schoolDemoHref, whatsappHref } from '../content/contact';
import { Button } from '../components/Button';

/**
 * Hero on the board's flat scene ground (design system: handoff/ui_kits/website/Website.jsx).
 * 420px floor and 60px bottom padding follow the kit, on the 4px grid (min-h-105, pb-15).
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden="true" className="board-grid absolute inset-0" />
      <div className="relative mx-auto flex min-h-105 max-w-6xl flex-col justify-end gap-6 px-gutter pt-8 pb-15 lg:px-gutter-lg">
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
    </section>
  );
}
