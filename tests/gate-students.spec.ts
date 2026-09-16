import { test, expect, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { progressToStep } from '../src/sections/studentsLogic';
import { tileStateForStep } from '../src/product/mastery';
import { schools, students } from '../src/content/copy';

// The pinned sections on the live-embed path (fixture build, :4174): lockstep at 390 and 1440.
// Not launch evidence since 040 (v1 ships the loop — see gate-launch.spec.ts), so the captures go
// to test-results/ unless GATE_EMBED_DIR says otherwise.
const OUT = process.env.GATE_EMBED_DIR ?? 'test-results/embed-path';
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
] as const;
const PROGRESS = [0, 0.5, 1] as const;
const TOTAL = 6;
const DRAW_SETTLE_MS = 1000; // placeholder draws each step over 700 ms

async function lenisTo(page: Page, y: number) {
  await page.evaluate((y) => {
    const lenis = (window as unknown as { __karkaLenis?: { scrollTo: (y: number, o: object) => void } }).__karkaLenis;
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  }, y);
}

async function openPinned(page: Page, id: string) {
  await page.goto('/');
  // Both pins published and in page order: Schools can only be measured right once Students' spacer exists.
  await page.waitForFunction(() => {
    const s = document.getElementById('students')?.dataset;
    const c = document.getElementById('schools')?.dataset;
    return Boolean(s?.pinEnd && c?.pinStart && Number(c.pinStart) > Number(s.pinEnd));
  });
  const start = await page.locator(`#${id}`).evaluate((el) => Number(el.dataset.pinStart));
  await lenisTo(page, start);
  await expect(page.locator(`#${id} [data-embed-status="live"]`)).toBeVisible({ timeout: 15_000 });
}

async function scrollToProgress(page: Page, id: string, p: number) {
  const y = await page.locator(`#${id}`).evaluate((el, p) => {
    const start = Number(el.dataset.pinStart);
    const end = Number(el.dataset.pinEnd);
    return Math.round(start + p * (end - start));
  }, p);
  await lenisTo(page, y);
}

for (const vp of VIEWPORTS) {
  test.describe(`pinned sections @ ${vp.width}×${vp.height}`, () => {
    test.use({ viewport: vp });

    test('Students: board, captions and concept state in lockstep', async ({ page }) => {
      await openPinned(page, 'students');
      for (const p of PROGRESS) {
        await scrollToProgress(page, 'students', p);
        const expected = progressToStep(p, TOTAL);
        await expect(page.locator(`#students [data-frame-step="${expected}"]`)).toBeVisible();
        await expect(page.locator('#students [data-concept-state]')).toHaveAttribute(
          'data-concept-state',
          tileStateForStep(expected, TOTAL),
        );
        await page.waitForTimeout(DRAW_SETTLE_MS);
        const pct = String(Math.round(p * 100)).padStart(3, '0');
        await page.screenshot({ path: `${OUT}/students-${vp.width}x${vp.height}-${pct}.png` });
      }
    });

    test('Schools (classroom variant): hold at the top step, class question, teacher view', async ({ page }) => {
      await openPinned(page, 'schools');
      const section = page.locator('#schools');
      await expect(section.locator('[data-concept-state]')).toHaveCount(0);
      await expect(section.locator('[data-teacher-view]')).toContainText('Checks for understanding');
      for (const p of PROGRESS) {
        await scrollToProgress(page, 'schools', p);
        const expected = progressToStep(p, TOTAL);
        await expect(section.locator(`[data-frame-step="${expected}"]`)).toBeVisible();
        const atHold = expected === schools.classroom.holdAtStep;
        if (atHold) {
          await expect(section.locator('[data-caption-track]')).toContainText(schools.classroom.holdLabel);
          await expect(section.locator('[data-caption-track]')).toContainText(schools.classroom.classQuestion);
        } else {
          await expect(section.locator('[data-caption-track]')).not.toContainText(schools.classroom.holdLabel);
        }
        await page.waitForTimeout(DRAW_SETTLE_MS);
        const pct = String(Math.round(p * 100)).padStart(3, '0');
        await page.screenshot({ path: `${OUT}/schools-${vp.width}x${vp.height}-${pct}.png` });
      }
      await expect(section.locator('[data-hold="true"]')).toHaveCount(1); // the marked pill
    });
  });
}

test.describe('reduced motion @ 390×844', () => {
  test.use({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });

  test('Students: no pin, no frame: poster + full transcript + state summary', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#students');
    await expect(section.locator('[data-embed-status="poster"]')).toBeVisible();
    await expect(section.locator('iframe')).toHaveCount(0);
    await expect(page.locator('.pin-spacer')).toHaveCount(0);
    // No frame mounts under reduced motion, so the transcript is copy.ts's lines, not the
    // stand-in's step count (TOTAL): the two differ since the real scene's five steps landed.
    await expect(section.locator('ol li')).toHaveCount(students.embed.captions.length);
    await expect(section.locator('[data-concept-state="summary"]')).toHaveText('Concept stateNot started → Shaky');
    await section.locator('img[src*="/posters/"]').evaluate((img: HTMLImageElement) => img.decode());
    await section.screenshot({ path: `${OUT}/students-390x844-reduced-motion.png` });
  });

  test('Schools: transcript carries the hold and the class question', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#schools');
    await expect(section.locator('iframe')).toHaveCount(0);
    await expect(section.locator('[data-hold-transcript]')).toContainText(schools.classroom.classQuestion);
    // The poster is loading="lazy": it only loads once near the viewport, so bring it there first.
    await section.scrollIntoViewIfNeeded();
    await section.locator('img').first().evaluate((img: HTMLImageElement) => img.decode());
    await section.screenshot({ path: `${OUT}/schools-390x844-reduced-motion.png` });
  });
});
