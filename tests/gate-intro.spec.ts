import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

// 042 gate evidence: the intro at its three beats — the clip's first frame, the moment the wordmark
// lifts off the lid, and the resting state it dissolves into — at both design widths.
const OUT = process.env.GATE_DIR ?? 'docs/gate/042';
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
] as const;

/** Seconds into the clip where intro.ts lifts the wordmark (src/lib/intro.ts LIFT_AT). */
const LIFT_AT = 2.8;

for (const vp of VIEWPORTS) {
  test(`intro beats @ ${vp.width}×${vp.height}`, async ({ browser }) => {
    // A fresh context each time: the intro is first-visit only.
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    await page.goto('/');

    // First paint — the copy is already readable underneath, at the intro's low opacity, before the
    // clip has even mounted.
    await page.waitForTimeout(120);
    await page.screenshot({ path: `${OUT}/intro-firstpaint-${vp.width}.png` });

    const video = page.locator('[data-intro-video]');
    await expect(video).toBeAttached({ timeout: 8_000 });
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState), { timeout: 15_000 }).toBeGreaterThan(0);

    // 0s — the clip's first frame, with the copy already readable underneath.
    await video.evaluate((v: HTMLVideoElement) => {
      v.pause();
      v.currentTime = 0;
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/intro-0s-${vp.width}.png` });

    // The lift — the lid is open, and the wordmark is on its way to the nav.
    await video.evaluate((v: HTMLVideoElement, t) => {
      v.currentTime = t;
    }, LIFT_AT + 0.05);
    await expect
      .poll(() => page.locator('[data-intro-wordmark]').evaluate((el) => Number(getComputedStyle(el).opacity)), {
        timeout: 5_000,
      })
      .toBeGreaterThan(0);
    await page.waitForTimeout(350);
    await page.screenshot({ path: `${OUT}/intro-lift-${vp.width}.png` });

    // The end — the clip runs out, dissolves into the still, and the hero is in its resting state.
    await video.evaluate((v: HTMLVideoElement) => {
      v.currentTime = Math.max(0, v.duration - 0.15);
      void v.play();
    });
    await expect
      .poll(() => page.evaluate(() => document.documentElement.classList.contains('karka-intro')), { timeout: 12_000 })
      .toBe(false);
    await expect(page.locator('[data-intro-video]')).toHaveCount(0);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/intro-end-${vp.width}.png` });

    // The wordmark ended up in the nav, not on the lid.
    expect(await page.locator('[data-nav-wordmark]').evaluate((el) => Number(getComputedStyle(el).opacity))).toBe(1);
    expect(await page.locator('[data-intro-wordmark]').evaluate((el) => Number(getComputedStyle(el).opacity))).toBe(0);
    await ctx.close();
  });
}
