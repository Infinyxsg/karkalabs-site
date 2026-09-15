import { audiences, footer } from '../content/copy';
import { DEMO_EMAIL } from '../content/contact';

export function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-gutter py-4 lg:px-gutter-lg">
      <a href="/" aria-label="KarkaLabs home" className="inline-flex min-h-11 items-center">
        <img
          src="/brand/wordmark-240.webp"
          srcSet="/brand/wordmark-240.webp 1x, /brand/wordmark-240@2x.webp 2x"
          width={240}
          height={40}
          alt="KarkaLabs"
          className="h-7 w-auto lg:h-8"
        />
      </a>
      <nav aria-label="Primary" className="hidden lg:block">
        <ul className="flex gap-6">
          {audiences.map((a) => (
            <li key={a.id}>
              <a href={`#${a.id}`} className="text-body font-medium text-ink-muted hover:text-ink">
                {a.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

/** 040 §A: the company line and the contact email. Nothing else. */
export function SiteFooter() {
  return (
    <footer className="bg-ink text-on-ink-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-gutter py-10 text-caption lg:flex-row lg:items-center lg:justify-between lg:px-gutter-lg">
        <p>{footer.company}</p>
        <p>
          <a
            href={`mailto:${DEMO_EMAIL}`}
            className="inline-flex min-h-hit-target items-center text-on-ink underline underline-offset-4 hover:text-teal-on-ink"
          >
            {DEMO_EMAIL}
          </a>
        </p>
      </div>
    </footer>
  );
}
