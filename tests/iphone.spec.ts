import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { lenisTo, pinStart } from './helpers';

// 040 gate: iPhone Safari emulation (WebKit, iPhone 13 profile, 390 wide) — the board loop plays
// inline in the page and never takes over the screen.
const OUT = process.env.GATE_DIR ?? 'docs/gate/040';
mkdirSync(OUT, { recursive: true });

test('iPhone Safari @ 390: the board loop plays inline, no fullscreen hijack', async ({ page }) => {
  await page.goto('/');
  expect(await page.evaluate(() => window.innerWidth)).toBe(390);
  await lenisTo(page, await pinStart(page, 'students'));

  const section = page.locator('#students');
  const video = section.locator('video');
  await expect(video).toHaveAttribute('playsinline', '');
  await expect(section.locator('[data-embed-status="live"]')).toBeVisible({ timeout: 20_000 });

  const state = await video.evaluate(async (v: HTMLVideoElement) => {
    const t0 = v.currentTime;
    await new Promise((r) => setTimeout(r, 1500));
    const webkit = v as HTMLVideoElement & { webkitDisplayingFullscreen?: boolean; webkitPresentationMode?: string };
    const doc = document as Document & { webkitFullscreenElement?: Element | null };
    return {
      advanced: v.currentTime > t0,
      paused: v.paused,
      muted: v.muted,
      displayingFullscreen: webkit.webkitDisplayingFullscreen ?? false,
      presentationMode: webkit.webkitPresentationMode ?? 'inline',
      fullscreenElement: Boolean(document.fullscreenElement ?? doc.webkitFullscreenElement),
    };
  });
  expect(state).toEqual({
    advanced: true,
    paused: false,
    muted: true,
    displayingFullscreen: false,
    presentationMode: 'inline',
    fullscreenElement: false,
  });

  // Inline = inside the page's own layout, within the 390 viewport.
  const box = (await video.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(390);
  expect(box.height).toBeLessThan(844);
  await page.screenshot({ path: `${OUT}/iphone-safari-390-students.png` });
});
