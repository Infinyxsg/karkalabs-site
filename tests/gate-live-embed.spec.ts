import { test, expect, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { students } from '../src/content/copy';
import { SITE_ORIGIN, lenisTo, pinStart, serveLocalAsProduction } from './helpers';

/**
 * 040 §C.1 — the gate for path C1: the shipping build (dist/ on :4173) framing the REAL Karka
 * /embed/ route on https://cbsephysics11.karkalabs.ai, live since CBSEPhysics11 main 486141c.
 *
 * The build is served AS https://karkalabs.ai (serveLocalAsProduction). That is not dressing: the
 * route's framing check only trusts the production origins, and its localhost allowance applies
 * only when the EMBED page is itself local — so a parent on :4173 is blanked and never gets `ready`.
 *
 * This is the only spec that touches the network. The protocol's edge cases (a silent frame, a
 * hostile origin, a frame that reloads) stay in embed.spec.ts against the stand-in, which can be
 * made to misbehave; what can only be proved here is that the route we actually ship against
 * behaves — and that it still costs nothing to look at.
 */
const OUT = process.env.GATE_LIVE_DIR ?? 'docs/gate/043-live-embed';
mkdirSync(OUT, { recursive: true });

const EMBED_ORIGIN = 'https://cbsephysics11.karkalabs.ai';
const SCENE = 'p11-proj-two-clocks-one-time';
const captions = students.embed.captions;
const TOTAL = captions.length;

/** Anything that would turn a scroll on karkalabs.ai into a session or a bill. */
const FORBIDDEN = /supabase|elevenlabs|\/functions\/v1\/|session-|tutor-chat|signed[-_]?url/i;

/** Everything the embed page is allowed to fetch, and nothing else (038b guard: 7 files + the doc). */
const ALLOWED_PATHS = [
  `/embed/?scene=${SCENE}&audience=students`,
  '/embed/embed.css',
  '/embed/karka-embed-bridge.js',
  '/physics-cbse11-manifest.js',
  '/scenes/p11-embed-steps.js',
  '/scenes/p11-lib.js',
  '/scenes/p11-scenes-ch3.js',
  '/vendor/science-scenes-2d.js',
];

/**
 * Timestamp the iframe's insertion and every frame-to-parent event, before any of the app runs.
 *
 * Two ordering rules, both learned the hard way here: the message listener goes on FIRST, so nothing
 * after it can throw and silently cost us every event; and the observer watches `document`, not
 * `document.documentElement`, because an init script runs before the parser has created the <html>
 * element and `observe(null)` throws.
 */
async function instrument(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as {
      __karkaProbe: { inserted: number | null; ready: number | null; events: string[] };
    };
    w.__karkaProbe = { inserted: null, ready: null, events: [] };
    addEventListener('message', (e) => {
      const d = e.data as { evt?: string; n?: number } | null;
      if (!d?.evt) return;
      w.__karkaProbe.events.push(`${d.evt}:${d.n ?? ''}`);
      if (d.evt === 'ready' && w.__karkaProbe.ready === null) w.__karkaProbe.ready = performance.now();
    });
    new MutationObserver((records) => {
      for (const r of records) {
        for (const node of r.addedNodes) {
          if ((node as Element).tagName === 'IFRAME' && w.__karkaProbe.inserted === null) {
            w.__karkaProbe.inserted = performance.now();
          }
        }
      }
    }).observe(document, { childList: true, subtree: true });
  });
}

/** Middle of step n's band — a band edge rounds into its neighbour at whole-pixel scroll (038b). */
async function scrollToStep(page: Page, n: number) {
  const y = await page.locator('#students').evaluate(
    (el, { n, total }) => {
      const start = Number(el.dataset.pinStart);
      const end = Number(el.dataset.pinEnd);
      return Math.round(start + ((n - 0.5) / total) * (end - start));
    },
    { n, total: TOTAL },
  );
  await lenisTo(page, y);
}

for (const vp of [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
] as const) {
  test.describe(`live embed @ ${vp.width}x${vp.height}`, () => {
    test.use({ viewport: vp });

    test('ready under 2s, steps 1/4/5 on the real board, and no request that costs money', async ({ page }) => {
      const requests: string[] = [];
      page.on('request', (r) => requests.push(r.url()));
      await instrument(page);
      await serveLocalAsProduction(page);
      await page.goto(`${SITE_ORIGIN}/`);
      await lenisTo(page, await pinStart(page, 'students'));

      const section = page.locator('#students');
      await expect(section.locator('[data-embed-status="live"]')).toBeVisible({ timeout: 15_000 });

      // --- ready, measured from the iframe going into the page ---------------------------------
      const probe = await page.evaluate(
        () =>
          (window as unknown as { __karkaProbe: { inserted: number | null; ready: number | null; events: string[] } })
            .__karkaProbe,
      );
      expect(probe.inserted, 'the probe saw the iframe go in').not.toBeNull();
      expect(probe.ready, 'the frame posted {evt:"ready"}').not.toBeNull();
      const latency = probe.ready! - probe.inserted!;
      expect(latency, `ready latency (ms) at ${vp.width}`).toBeLessThan(2000);
      expect(latency, `ready latency (ms) at ${vp.width}`).toBeGreaterThan(0);
      expect(probe.events[0]).toMatch(/^ready:/);

      // --- the frame described its own five steps ----------------------------------------------
      await expect(section.locator('[data-captions="frame"]')).toBeVisible();
      await expect(section.getByRole('img', { name: `Step 1 of ${TOTAL}` })).toBeVisible();

      // --- steps 1, 4 and last, each read after the frame's post-pause echo ---------------------
      for (const n of [1, 4, 5]) {
        await scrollToStep(page, n);
        // data-frame-step moves only on {evt:'step'}, which the bridge posts once the board is frozen.
        await expect(section.locator(`[data-frame-step="${n}"]`)).toBeVisible();
        await expect(section.locator('[data-caption-track]')).toContainText(captions[n - 1]!.text);
        await page.screenshot({ path: `${OUT}/students-${vp.width}x${vp.height}-step${n}.png` });
      }
      // The apex line is the scene's own, and it is what the last step must land on.
      await expect(section.locator('[data-caption-track]')).toContainText('Zero velocity is not zero acceleration');
      await expect(section.locator('[data-concept-state]')).toHaveAttribute('data-concept-state', 'shaky');

      // --- the network, in full -----------------------------------------------------------------
      const forbidden = requests.filter((u) => FORBIDDEN.test(u));
      expect(forbidden, 'requests to a session, billing, Supabase or ElevenLabs endpoint').toEqual([]);
      const fromEmbed = requests.filter((u) => u.startsWith(EMBED_ORIGIN)).map((u) => u.slice(EMBED_ORIGIN.length));
      expect([...new Set(fromEmbed)].sort()).toEqual([...ALLOWED_PATHS].sort());
    });
  });
}

/**
 * What "mounts lazily" can honestly be claimed here.
 *
 * The mount/unmount margins themselves (within 1 viewport, gone beyond 2) are gated in
 * embed.spec.ts against the fixture build, because only that page is long enough to reach either
 * side of them: it carries a second pinned section. On the shipping page Students is 0.11 viewports
 * below the fold at rest and 1.9 above it at the page's end, so it never leaves the mount zone and
 * a margin assertion here would be a test that cannot fail.
 *
 * What is worth proving on the real thing: the board is not part of the first paint, and it is not
 * what the page is waiting on.
 */
test.describe('mounting', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('the board is not part of first paint, and is never the LCP element', async ({ page, request }) => {
    // The pre-rendered document carries no frame at all: nothing cross-origin is in the critical path.
    const html = await (await request.get('http://localhost:4173/')).text();
    expect(html, 'the pre-rendered page ships an iframe').not.toMatch(/<iframe/i);

    await page.addInitScript(() => {
      const w = window as unknown as { __lcp: { tag: string; id: string } | null };
      w.__lcp = null;
      new PerformanceObserver((list) => {
        const e = list.getEntries().at(-1) as (PerformanceEntry & { element?: Element }) | undefined;
        if (!e) return;
        w.__lcp = { tag: e.element?.tagName ?? '', id: e.element?.closest('section')?.id ?? '' };
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
    await serveLocalAsProduction(page);
    await page.goto(`${SITE_ORIGIN}/`);
    await lenisTo(page, await pinStart(page, 'students'));

    const iframe = page.locator('#students iframe');
    await expect(iframe).toHaveCount(1);
    await expect(iframe).toHaveAttribute('loading', 'lazy');
    await expect(iframe).toHaveAttribute('sandbox', 'allow-scripts allow-same-origin');
    await expect(page.locator('#students [data-embed-status="live"]')).toBeVisible({ timeout: 15_000 });

    // An iframe is not an LCP candidate, and the board must not be what the page waits on: the
    // hero's own content is. Reported with its section, so a regression names where LCP moved to.
    const lcp = await page.evaluate(() => (window as unknown as { __lcp: { tag: string; id: string } | null }).__lcp);
    expect(lcp, 'an LCP entry was recorded').not.toBeNull();
    expect(lcp!.tag, `LCP element (was in section "${lcp!.id}")`).not.toBe('IFRAME');
    expect(lcp!.id, 'LCP came from the Students board').not.toBe('students');
  });
});

test('the live frame ignores pointer events while Lenis is scrolling', async ({ page }) => {
  await serveLocalAsProduction(page);
  await page.goto(`${SITE_ORIGIN}/`);
  await lenisTo(page, await pinStart(page, 'students'));
  const iframe = page.locator('#students iframe');
  await expect(page.locator('#students [data-embed-status="live"]')).toBeVisible({ timeout: 15_000 });
  const box = (await iframe.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, 400);
  await expect.poll(() => iframe.evaluate((f: HTMLIFrameElement) => f.style.pointerEvents)).toBe('none');
  // ...and hands them back once Lenis settles, or the board could never be clicked.
  await expect
    .poll(() => iframe.evaluate((f: HTMLIFrameElement) => f.style.pointerEvents), { timeout: 5_000 })
    .toBe('');
});
