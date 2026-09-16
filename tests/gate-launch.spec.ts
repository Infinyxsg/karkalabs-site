import { test, expect, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { hero, parents, schools, students, tuition } from '../src/content/copy';
import { licensingHref, schoolDemoHref, whatsappHref } from '../src/content/contact';
import { expectNoTodo, lenisTo, pinStart, revealAll } from './helpers';

// 040 gate evidence: every section at 390 and 1440, and the full page. Each word writes its own folder.
const OUT = process.env.GATE_DIR ?? 'docs/gate/043-live-embed';
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
] as const;
const SECTIONS = ['hero', 'students', 'parents', 'schools', 'tuition', 'footer'] as const;

// The launch screenshots are of the resting site; the intro has its own evidence (gate-intro.spec.ts).
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem('karka:intro-played', '1');
    } catch {
      /* blocked storage: the intro runs, and the captures simply include it */
    }
  });
});

async function scrollToSection(page: Page, id: (typeof SECTIONS)[number]) {
  if (id === 'footer') return lenisTo(page, 'bottom');
  if (id === 'students') return lenisTo(page, await pinStart(page, 'students'));
  const selector = id === 'hero' ? 'section[aria-labelledby="hero-title"]' : `#${id}`;
  const y = await page.locator(selector).evaluate((el) => Math.round(el.getBoundingClientRect().top + window.scrollY));
  await lenisTo(page, y);
}

async function expectRealCtas(page: Page) {
  const heroSection = page.locator('section[aria-labelledby="hero-title"]');
  await expect(heroSection.getByRole('link', { name: hero.ctaSession })).toHaveAttribute('href', whatsappHref);
  await expect(heroSection.getByRole('link', { name: hero.ctaDemo })).toHaveAttribute('href', schoolDemoHref);
  await expect(page.locator('#parents').getByRole('link', { name: parents.cta })).toHaveAttribute('href', whatsappHref);
  await expect(page.locator('#schools').getByRole('link', { name: schools.cta })).toHaveAttribute('href', schoolDemoHref);
  await expect(page.locator('#tuition').getByRole('link', { name: tuition.cta })).toHaveAttribute('href', licensingHref);
}

for (const vp of VIEWPORTS) {
  test.describe(`launch page @ ${vp.width}×${vp.height}`, () => {
    test.use({ viewport: vp });

    test('every section and the full page; real CTAs; no TODO', async ({ page }) => {
      await page.goto('/');
      await revealAll(page);
      await expectNoTodo(page);
      await expectRealCtas(page);

      for (const id of SECTIONS) {
        await scrollToSection(page, id);
        await page.waitForTimeout(400);
        if (id === 'students') {
          const section = page.locator('#students');
          await expect(section.locator('[data-embed-status="live"]')).toBeVisible({ timeout: 15_000 });
          // Freeze the loop on its third line so the capture is repeatable.
          await section.getByRole('button', { name: 'Pause the board video' }).click();
          const line = students.loop.captions[2]!;
          await section.locator('video').evaluate(async (v: HTMLVideoElement, t) => {
            const seeked = new Promise((r) => v.addEventListener('seeked', r, { once: true }));
            v.currentTime = t;
            await seeked;
          }, line.t + 0.5);
          await expect(section.locator('[data-caption-track]')).toContainText(line.text);
          await page.waitForTimeout(500); // let the caption's cross-fade finish before the capture
        }
        await page.screenshot({ path: `${OUT}/${id}-${vp.width}x${vp.height}.png` });
      }

      await lenisTo(page, 0);
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${OUT}/full-page-${vp.width}x${vp.height}.png`, fullPage: true });
    });
  });
}

test.describe('reduced motion @ 390×844', () => {
  test.use({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });

  test('full page: posters and transcript, no TODO', async ({ page }) => {
    await page.goto('/');
    await revealAll(page);
    await expectNoTodo(page);
    await expectRealCtas(page);
    await lenisTo(page, 0);
    await page.screenshot({ path: `${OUT}/full-page-390x844-reduced-motion.png`, fullPage: true });
  });
});
