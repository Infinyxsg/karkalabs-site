import { test, expect } from '@playwright/test';
import { readFileSync, statSync } from 'node:fs';
import { duration } from '../src/design/tokens';
import { brand, footer, hero, meta, parents, schools, students, tuition } from '../src/content/copy';
import { DEMO_EMAIL, contactProblems, licensingHref, schoolDemoHref, whatsappHref } from '../src/content/contact';
import { tileStateForStep } from '../src/product/mastery';
import { expectNoTodo, lenisTo, pinStart, revealAll } from './helpers';

// The production build (dist/ on :4173): exactly what ships in v1 (040).
test.use({ viewport: { width: 390, height: 844 } });

const loop = students.loop;
const launchCopy = [
  hero.headline,
  hero.sub,
  students.headline,
  students.body,
  parents.headline,
  parents.body,
  schools.headline,
  schools.body,
  tuition.headline,
  tuition.body,
  footer.company,
];

test('pre-rendered: the 040 §A copy, title and meta are in the HTML before any JS runs', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/');
  const text = await page.locator('body').innerText();
  for (const line of launchCopy) expect(text).toContain(line);
  await expect(page).toHaveTitle(meta.title);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', meta.description);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://karkalabs.ai/og/og-karkalabs.png');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', meta.title);
  expect(await page.content()).not.toContain('%KARKA_');
  await ctx.close();
});

test('no TODO anywhere in the rendered page', async ({ page }) => {
  await page.goto('/');
  await revealAll(page);
  await expectNoTodo(page);
});

test('the page logs no browser errors (a hydration mismatch is one)', async ({ page }) => {
  // Origin: a glyph <img> + Eyebrow (a <p>) wrapped in a <p>. The browser re-nests it, hydration
  // fails with React #418, and Lighthouse drops best-practices to 96.
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto('/');
  await revealAll(page);
  expect(errors).toEqual([]);
});

test('CTAs resolve to the real contact targets (040 §B)', async ({ page, context }) => {
  expect(whatsappHref).toBe("https://wa.me/6596470065?text=Hi%2C%20I'd%20like%20to%20try%20a%20Karka%20session.");
  expect(schoolDemoHref).toBe('mailto:vinodh@karkalabs.ai?subject=Karka%20school%20demo');
  expect(licensingHref).toBe('mailto:vinodh@karkalabs.ai?subject=Karka%20licensing');

  await page.goto('/');
  const heroSection = page.locator('section[aria-labelledby="hero-title"]');
  const links = [
    [heroSection, hero.ctaSession, whatsappHref],
    [heroSection, hero.ctaDemo, schoolDemoHref],
    [page.locator('#parents'), parents.cta, whatsappHref],
    [page.locator('#schools'), schools.cta, schoolDemoHref],
    [page.locator('#tuition'), tuition.cta, licensingHref],
    [page.locator('footer'), DEMO_EMAIL, `mailto:${DEMO_EMAIL}`],
  ] as const;
  for (const [scope, name, href] of links) {
    await expect(scope.getByRole('link', { name, exact: true })).toHaveAttribute('href', href);
  }

  // "Try a session" opens WhatsApp's chat link in a new tab. Intercepted: nothing leaves the machine.
  await context.route('https://wa.me/**', (route) => route.fulfill({ contentType: 'text/html', body: '<title>wa.me</title>' }));
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    heroSection.getByRole('link', { name: hero.ctaSession }).click(),
  ]);
  const landed = new URL(popup.url());
  expect(`${landed.origin}${landed.pathname}`).toBe('https://wa.me/6596470065');
  expect(landed.searchParams.get('text')).toBe("Hi, I'd like to try a Karka session.");
});

test('the contact guard fails the build on empty or malformed targets', () => {
  expect(contactProblems()).toEqual([]);
  expect(contactProblems('', DEMO_EMAIL)).toEqual(['WHATSAPP_NUMBER is empty']);
  expect(contactProblems('+6596470065', '')).toEqual(['DEMO_EMAIL is empty']);
  expect(contactProblems('96470065', 'not-an-email')).toHaveLength(2);
});

test('v1 ships no placeholder, no embed and no narration', async ({ page, request }) => {
  const urls: string[] = [];
  page.on('request', (r) => urls.push(r.url()));
  await page.goto('/');
  await revealAll(page);
  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(page.locator('audio')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Hear|Mute/ })).toHaveCount(0);
  expect(urls.filter((u) => /placeholder|\/embed\/|\/audio\//.test(u))).toEqual([]);
  for (const p of ['/embed-placeholder.html', '/embed/', '/audio/two-clocks-narration.placeholder.m4a', '/posters/students-placeholder.webp']) {
    expect((await request.get(p)).status(), p).toBe(404);
  }
});

test('Students: a muted, inline, looping board; its clock drives captions, step and chip', async ({ page }) => {
  await page.goto('/');
  await lenisTo(page, await pinStart(page, 'students'));
  const section = page.locator('#students');
  await expect(section.locator('[data-embed-status="live"]')).toBeVisible({ timeout: 15_000 });
  const video = section.locator('video');
  for (const attr of ['autoplay', 'muted', 'loop', 'playsinline']) await expect(video).toHaveAttribute(attr, '');
  await expect(video).toHaveAttribute('poster', loop.poster.src);
  expect(await video.evaluate((v: HTMLVideoElement) => v.muted && !v.paused)).toBe(true);

  const track = section.locator('[data-caption-track]');
  await expect(track).toContainText(loop.captionLabel);
  for (const [i, c] of loop.captions.entries()) {
    await video.evaluate((v: HTMLVideoElement, t) => {
      v.currentTime = t;
    }, c.t + 0.3);
    await expect(track).toContainText(c.text);
    await expect(section.locator(`[data-loop-step="${i + 1}"]`)).toBeVisible();
    await expect(section.getByRole('img', { name: `Step ${i + 1} of ${loop.captions.length}` })).toBeVisible();
    await expect(section.locator('[data-concept-state]')).toHaveAttribute(
      'data-concept-state',
      tileStateForStep(i + 1, loop.captions.length),
    );
  }
});

test('Students: the loop pauses on the visitor’s Pause and off-screen', async ({ page }) => {
  await page.goto('/');
  await lenisTo(page, await pinStart(page, 'students'));
  const section = page.locator('#students');
  const video = section.locator('video');
  await expect(section.locator('[data-embed-status="live"]')).toBeVisible({ timeout: 15_000 });
  await section.getByRole('button', { name: 'Pause the board video' }).click();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await section.getByRole('button', { name: 'Play the board video' }).click();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(false);
  await lenisTo(page, 'bottom');
  await expect
    .poll(async () => (await video.count()) === 0 || (await video.evaluate((v: HTMLVideoElement) => v.paused)))
    .toBe(true);
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('Students: no pin, no video — the loop’s first frame and its full transcript', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#students');
    await expect(section.locator('[data-embed-status="poster"]')).toBeVisible();
    await expect(section.locator('video')).toHaveCount(0);
    await expect(page.locator('.pin-spacer')).toHaveCount(0);
    await expect(section.locator('ol li')).toHaveCount(loop.captions.length);
    await expect(section.locator('img[src*="/posters/"]')).toHaveAttribute('src', loop.poster.src);
    await expect(section.locator('[data-concept-state="summary"]')).toHaveText('Concept stateNot started → Shaky');
    await revealAll(page);
    await expectNoTodo(page);
  });
});

test('stills: WebP ≤ 200 KB with alt text, loop ≤ 2 MB, OG image 1200×630', async ({ page, request }) => {
  for (const s of [loop.poster, parents.poster, schools.poster, tuition.poster]) {
    expect(s.src).toMatch(/\.webp$/);
    expect(statSync(`public${s.src}`).size, s.src).toBeLessThanOrEqual(200 * 1024);
    expect((await request.get(s.src)).status(), s.src).toBe(200);
    expect(s.alt.length, s.src).toBeGreaterThan(20);
  }
  expect(statSync('public/video/students-board.mp4').size).toBeLessThanOrEqual(2 * 1024 * 1024);
  const og = readFileSync('public/og/og-karkalabs.png');
  expect([og.readUInt32BE(16), og.readUInt32BE(20)]).toEqual([1200, 630]);

  await page.goto('/');
  await revealAll(page);
  for (const [id, content] of [['parents', parents], ['schools', schools], ['tuition', tuition]] as const) {
    const img = page.locator(`#${id} img[src*="/posters/"]`);
    await expect(img).toHaveAttribute('alt', content.poster.alt);
    await expect.poll(() => img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
  }
});

test('brand: badge in nav and footer, the mascot in the hero, a glyph mark per section', async ({ page }) => {
  const loaded = (sel: string) =>
    page.locator(sel).evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0);

  await page.goto('/');
  // The mascot is in the hero, and it is there before any scrolling.
  const mascot = page.locator('[data-hero-panel] img');
  await expect(mascot).toHaveAttribute('src', brand.mascot.src);
  await expect(mascot).toHaveAttribute('alt', brand.mascot.alt);
  await expect.poll(() => loaded('[data-hero-panel] img')).toBe(true);
  expect(await mascot.evaluate((el) => el.getBoundingClientRect().top < window.innerHeight)).toBe(true);

  // The badge, small, in the nav and the footer — decorative beside the wordmark and the company line.
  for (const sel of ['[data-nav-badge]', '[data-footer-badge]']) {
    await expect(page.locator(sel)).toHaveAttribute('alt', '');
    await expect(page.locator(sel)).toHaveAttribute('aria-hidden', 'true');
  }
  await expect.poll(() => loaded('[data-nav-badge]')).toBe(true);

  // One decorative subject glyph per audience section, and the grounds alternate.
  await revealAll(page);
  const sections = [
    ['students', students.glyph, 'paper'],
    ['parents', parents.glyph, 'scene'],
    ['schools', schools.glyph, 'paper'],
    ['tuition', tuition.glyph, 'scene'],
  ] as const;
  for (const [id, glyphSrc, ground] of sections) {
    const mark = page.locator(`#${id} img[src*="/glyphs/"]`);
    await expect(mark).toHaveAttribute('src', glyphSrc);
    await expect(mark).toHaveAttribute('alt', '');
    await expect(page.locator(`#${id}`)).toHaveAttribute('data-ground', ground === 'scene' ? 'scene' : 'paper');
    await expect.poll(() => loaded(`#${id} img[src*="/glyphs/"]`)).toBe(true);
  }
  // Ink, paper and scene are distinct grounds, so the page isn't one flat tone.
  const grounds = await page.evaluate(() =>
    ['students', 'parents', 'schools', 'tuition'].map((id) => getComputedStyle(document.getElementById(id)!).backgroundColor),
  );
  expect(new Set(grounds).size).toBe(2);
  expect(grounds[0]).toBe(grounds[2]);
  expect(grounds[1]).toBe(grounds[3]);

  // The teal accent is on the concept chip's title (the state colours stay the board's).
  await expect(page.locator('#students [data-concept-state] span').nth(1)).toHaveClass(/text-teal/);
});

test('brand art ships as WebP under 250 KB', () => {
  for (const f of [
    'public/brand/student-hero.webp',
    'public/brand/student-hero-640.webp',
    'public/brand/karka-badge.webp',
    'public/brand/karka-badge-56.webp',
    'public/brand/wordmark-lift.webp',
    'public/glyphs/graph.webp',
    'public/glyphs/book.webp',
    'public/glyphs/atom.webp',
    'public/glyphs/pi.webp',
  ]) {
    expect(statSync(f).size, f).toBeLessThanOrEqual(250 * 1024);
  }
});

test('Pages plumbing: CNAME, .nojekyll, 404.html and icons', async ({ request }) => {
  expect((await (await request.get('/CNAME')).text()).trim()).toBe('karkalabs.ai');
  expect((await request.get('/.nojekyll')).status()).toBe(200);
  const missing = await request.get('/no-such-page');
  expect(missing.status()).toBe(404);
  expect(await missing.text()).toContain('Page not found');
  for (const p of ['/favicon-32.png', '/apple-touch-icon.png', '/og/og-karkalabs.png']) {
    expect((await request.get(p)).status(), p).toBe(200);
  }
});

test('no layout shift from the pin under a throttled mobile load (CLS < 0.1)', async ({ browser }) => {
  // Regression (039 gate): a pin created out of order, or refreshed at load, flashed position:fixed at
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
      // Every shift, input-flagged or not: Lighthouse counts them (its session reports an early input).
      for (const e of list.getEntries() as unknown as { value: number }[]) {
        (window as unknown as { __cls: number }).__cls += e.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto('/');
  await page.waitForFunction(() => document.getElementById('students')?.dataset.pinEnd, null, { timeout: 30_000 });
  await page.waitForTimeout(4000);
  expect(await page.evaluate(() => (window as unknown as { __cls: number }).__cls)).toBeLessThan(0.1);
  await ctx.close();
});

test('CSS motion tokens mirror src/design/tokens.ts', async ({ page }) => {
  await page.goto('/');
  const cssMs = await page.evaluate(() => {
    const s = getComputedStyle(document.documentElement);
    // The minifier may rewrite 120ms as .12s — compare in ms.
    return ['instant', 'fast', 'base', 'slow', 'reveal'].map((k) => {
      const v = s.getPropertyValue(`--dur-${k}`).trim();
      return v.endsWith('ms') ? parseFloat(v) : Math.round(parseFloat(v) * 1000);
    });
  });
  expect(cssMs).toEqual(Object.values(duration).map((sec) => Math.round(sec * 1000)));
});
