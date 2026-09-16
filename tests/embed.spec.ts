import { test, expect, type Page } from '@playwright/test';
import { students } from '../src/content/copy';
import { progressToStep } from '../src/sections/studentsLogic';
import { lenisTo } from './helpers';

// The live-embed code path (040 §C, path C1), against the fixture build (dist-fixture/ on :4174).
// The stand-in frame is served at /embed/ and the chime narration at /audio/, both from
// tests/fixtures/, so neither ships. v1 shows the muted loop; these keep the swap a config change.
test.use({ viewport: { width: 390, height: 844 } });

const FRAME_URL = /\/embed\/\?/;
const captions = students.embed.captions;
const frame = (page: Page) => page.frameLocator('#students iframe');

async function live(page: Page) {
  await page.goto('/');
  await expect(page.locator('#students [data-embed-status="live"]')).toBeVisible({ timeout: 15_000 });
}

async function studentsProgress(page: Page, p: number) {
  const y = await page.locator('#students').evaluate((el, p) => {
    return Math.round(Number(el.dataset.pinStart) + p * (Number(el.dataset.pinEnd) - Number(el.dataset.pinStart)));
  }, p);
  await lenisTo(page, y);
}

test('frame mounts near the viewport, from the configured origin, and reports ready', async ({ page }) => {
  await live(page);
  const iframe = page.locator('#students iframe');
  await expect(iframe).toHaveAttribute('src', 'http://localhost:4174/embed/?scene=p11-proj-two-clocks-one-time&audience=students');
  await expect(iframe).toHaveAttribute('sandbox', 'allow-scripts allow-same-origin');
  await expect(iframe).toHaveAttribute('loading', 'lazy');
  await expect(iframe).toHaveAttribute('title', /Aarya/);
  await expect(page.locator('#students video')).toHaveCount(0);
});

test('frame is never reloaded by the pin (exactly one ready from the Students frame)', async ({ page }) => {
  // Regression: ScrollTrigger wrapping the pin in a new .pin-spacer re-parents the iframe → reload.
  await page.addInitScript(() => {
    if (window !== window.top) return;
    (window as unknown as { __readies: number }).__readies = 0;
    addEventListener('message', (e) => {
      const mine = e.source === (document.querySelector('#students iframe') as HTMLIFrameElement | null)?.contentWindow;
      if (mine && (e.data as { evt?: string })?.evt === 'ready') (window as unknown as { __readies: number }).__readies++;
    });
  });
  await live(page);
  await page.waitForFunction(() => document.getElementById('students')?.dataset.pinEnd);
  const pinStart = await page.locator('#students').evaluate((el) => Number(el.dataset.pinStart));
  await lenisTo(page, pinStart);
  await page.waitForTimeout(1500);
  expect(await page.evaluate(() => (window as unknown as { __readies: number }).__readies)).toBe(1);
});

test('contract v2: captions come from the frame’s ready.steps, TODO:VB lines fall back to copy', async ({ page }) => {
  await page.route(FRAME_URL, (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: `<!doctype html><script>
        const steps = [{ n: 1, say: 'Line one, from the frame.' }, { n: 2, say: 'TODO:VB' }, { n: 3, say: 'Line three, from the frame.' }];
        addEventListener('message', (e) => {
          if (e.source !== parent || !e.data || e.data.cmd !== 'step') return;
          parent.postMessage({ evt: 'step', n: e.data.n }, location.origin);
        });
        parent.postMessage({ evt: 'ready', scene: 'p11-proj-two-clocks-one-time', steps }, location.origin);
      </script>`,
    }),
  );
  await live(page);
  const section = page.locator('#students');
  await expect(section.locator('[data-captions="frame"]')).toBeVisible();
  await expect(section.getByRole('img', { name: /Step \d of 3/ })).toBeVisible();
  await page.waitForFunction(() => document.getElementById('students')?.dataset.pinEnd);
  await studentsProgress(page, 0);
  await expect(section.locator('[data-caption-track]')).toContainText('Line one, from the frame.');
  await studentsProgress(page, 0.5);
  await expect(section.locator(`[data-frame-step="${progressToStep(0.5, 3)}"]`)).toBeVisible();
  await expect(section.locator('[data-caption-track]')).toContainText(captions[1]!.text);
});

test('sends pause on leaving view, unmounts 2 viewports away', async ({ page }) => {
  await live(page);
  await page.waitForFunction(() => document.getElementById('students')?.dataset.pinEnd);
  const pinEnd = await page.locator('#students').evaluate((el) => Number(el.dataset.pinEnd));
  const vh = await page.evaluate(() => window.innerHeight);

  await lenisTo(page, pinEnd + Math.round(vh * 1.5)); // out of view, still within 2 viewports
  await expect(frame(page).locator('body')).toHaveAttribute('data-last-cmd', 'pause');

  await lenisTo(page, 'bottom');
  await expect(page.locator('#students iframe')).toHaveCount(0);
  await expect(page.locator('#students [data-embed-status="idle"]')).toHaveCount(1);
});

test('loop fallback when the frame never reports ready within 4s', async ({ page }) => {
  await page.route(FRAME_URL, (route) =>
    route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>silent frame</title>' }),
  );
  await page.goto('/');
  await expect(page.locator('#students [data-embed-status="loading"]')).toBeVisible();
  // The panel hands over to the muted loop — real footage of the real board, not a bare poster.
  await expect(page.locator('#students [data-panel="video"]')).toBeVisible({ timeout: 6_000 });
  await expect(page.locator('#students iframe')).toHaveCount(0);
  await expect(page.locator('#students video')).toHaveCount(1);
  await expect(page.locator('#students video')).toHaveAttribute('poster', students.loop.poster.src);
});

test('iframe ignores pointer events while Lenis is scrolling', async ({ page }) => {
  await live(page);
  const box = await page.locator('#students iframe').boundingBox();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.wheel(0, 400);
  await expect
    .poll(() => page.locator('#students iframe').evaluate((f: HTMLIFrameElement) => f.style.pointerEvents))
    .toBe('none');
  await expect
    .poll(() => page.locator('#students iframe').evaluate((f: HTMLIFrameElement) => f.style.pointerEvents), {
      timeout: 5_000,
    })
    .toBe('');
});

test('frame ignores commands from other origins/sources', async ({ page }) => {
  await live(page);
  const f = page.frame({ url: /\/embed\/\?.*audience=students/ })!;
  await f.evaluate(() => window.postMessage({ cmd: 'step', n: 5 }, '*')); // source is the frame itself, not its parent
  await expect(frame(page).locator('body')).not.toHaveAttribute('data-step', '5');
});

test('framing stopgap: the frame refuses to run under a non-allowlisted ancestor', async ({ page }) => {
  // The server's 404 page has no scripts or frames of its own, so nothing else can post `ready`.
  await page.goto('http://127.0.0.1:4174/__no-such-page');
  let ready = false;
  await page.exposeFunction('__onReady', () => {
    ready = true;
  });
  await page.setContent(
    `<iframe src="http://localhost:4174/embed/"></iframe>
     <script>
       addEventListener('message', (e) => {
         const mine = e.source === document.querySelector('iframe').contentWindow;
         if (mine && e.data && e.data.evt === 'ready') window.__onReady();
       });
     </script>`,
  );
  await expect(page.frameLocator('iframe').locator('body')).toHaveAttribute('data-blocked', 'true');
  await expect(page.frameLocator('iframe').locator('canvas')).toHaveCount(0);
  await page.waitForTimeout(500);
  expect(ready).toBe(false);
});

test('two pins, no layout shift under a throttled mobile load (CLS < 0.1), built in page order', async ({ browser }) => {
  // Regression (039 gate): out-of-order pins + a corrective refresh flashed a pin to position:fixed at
  // scroll 0 — CLS ≈ 1 under Lighthouse throttling, invisible on a fast machine. So throttle like it.
  const ctx = await browser.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
  await page.addInitScript(() => {
    (window as unknown as { __cls: number }).__cls = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as unknown as { value: number }[]) {
        (window as unknown as { __cls: number }).__cls += e.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto('/');
  await page.waitForFunction(() => document.getElementById('schools')?.dataset.pinEnd, null, { timeout: 30_000 });
  await page.waitForTimeout(4000);
  expect(await page.evaluate(() => (window as unknown as { __cls: number }).__cls)).toBeLessThan(0.1);
  const [studentsEnd, schoolsStart] = await page.evaluate(() => [
    Number(document.getElementById('students')!.dataset.pinEnd),
    Number(document.getElementById('schools')!.dataset.pinStart),
  ]);
  expect(schoolsStart).toBeGreaterThan(studentsEnd);
  await ctx.close();
});
