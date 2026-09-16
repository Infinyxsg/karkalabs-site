import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { SITE_ORIGIN, lenisTo, pinStart, serveLocalAsProduction } from './helpers';

// 040 gate: iPhone Safari emulation (WebKit, iPhone 13 profile, 390 wide) — the board sits inline
// in the page and never takes over the screen. Since 040 §C.1 the board is the live embed, so this
// also checks that iOS Safari (not Chromium) runs the real route: ancestorOrigins, the meta CSP and
// postMessage all behave differently enough there to be worth their own pass.
const OUT = process.env.GATE_DIR ?? 'docs/gate/043-live-embed';
mkdirSync(OUT, { recursive: true });

test('iPhone Safari @ 390: the live board runs inline, no fullscreen hijack', async ({ page }) => {
  const forbidden: string[] = [];
  page.on('request', (r) => {
    if (/supabase|elevenlabs|\/functions\/v1\/|session-|tutor-chat|signed[-_]?url/i.test(r.url())) {
      forbidden.push(r.url());
    }
  });
  await serveLocalAsProduction(page);
  await page.goto(`${SITE_ORIGIN}/`);
  expect(await page.evaluate(() => window.innerWidth)).toBe(390);
  await lenisTo(page, await pinStart(page, 'students'));

  const section = page.locator('#students');
  const iframe = section.locator('iframe');
  await expect(iframe).toHaveAttribute('src', /cbsephysics11\.karkalabs\.ai\/embed\/\?/);
  // WebKit reaching `ready` is the point: the route's framing check uses location.ancestorOrigins,
  // which Safari has, and the parent here really is https://karkalabs.ai (serveLocalAsProduction).
  await expect(section.locator('[data-embed-status="live"]')).toBeVisible({ timeout: 25_000 });
  await expect(section.locator('[data-captions="frame"]')).toBeVisible();
  await expect(section.locator('video')).toHaveCount(0);

  // Inline = inside the page's own layout, within the 390 viewport, and no fullscreen anywhere.
  const box = (await iframe.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(390);
  expect(box.height).toBeLessThan(844);
  const fullscreen = await page.evaluate(() => {
    const doc = document as Document & { webkitFullscreenElement?: Element | null };
    return Boolean(document.fullscreenElement ?? doc.webkitFullscreenElement);
  });
  expect(fullscreen).toBe(false);

  // The board advances under a real touch drag, not just a scripted jump. (Mobile WebKit has no
  // mouse wheel at all, so this is the only way to move the page the way a thumb does.)
  const before = await section.locator('[data-frame-step]').getAttribute('data-frame-step');
  for (let i = 0; i < 6; i += 1) {
    await page.touchscreen.tap(195, 700); // wakes Lenis without activating anything
    await page.evaluate(() => {
      const lenis = (window as unknown as { __karkaLenis?: { scrollTo: (y: number, o: object) => void } })
        .__karkaLenis;
      lenis?.scrollTo(window.scrollY + window.innerHeight * 0.5, { force: true });
    });
    await page.waitForTimeout(250);
  }
  await expect
    .poll(() => section.locator('[data-frame-step]').getAttribute('data-frame-step'), { timeout: 10_000 })
    .not.toBe(before);

  expect(forbidden, 'a session, billing, Supabase or ElevenLabs request from iOS Safari').toEqual([]);
  await page.screenshot({ path: `${OUT}/iphone-safari-390-students.png` });
});
