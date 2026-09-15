import { expect, type Page } from '@playwright/test';

/** Jump to an exact scroll position (through Lenis when it runs, so ScrollTrigger follows). */
export async function lenisTo(page: Page, y: number | 'bottom') {
  await page.evaluate((y) => {
    const target = y === 'bottom' ? document.documentElement.scrollHeight : y;
    const lenis = (window as unknown as { __karkaLenis?: { scrollTo: (y: number, o: object) => void } }).__karkaLenis;
    if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
    else window.scrollTo(0, target);
  }, y);
}

/** The section's pin start, once every pin is built and has published its bounds. */
export async function pinStart(page: Page, id: string): Promise<number> {
  await page.waitForFunction((id) => document.getElementById(id)?.dataset.pinEnd, id, { timeout: 30_000 });
  return page.locator(`#${id}`).evaluate((el) => Number(el.dataset.pinStart));
}

/** Scroll the whole page a step at a time, so every once-only reveal and lazy image has run. */
export async function revealAll(page: Page) {
  const { total, vh } = await page.evaluate(() => ({
    total: document.documentElement.scrollHeight,
    vh: window.innerHeight,
  }));
  for (let y = 0; y <= total; y += Math.round(vh * 0.6)) {
    await lenisTo(page, y);
    await page.waitForTimeout(80);
  }
  await lenisTo(page, 'bottom');
  await page.waitForTimeout(900); // longest reveal (duration.reveal) plus a frame
}

/** 040 §A: no `TODO` anywhere in the rendered DOM (scripts excluded — they are code, not the page). */
export async function expectNoTodo(page: Page) {
  const found = await page.evaluate(() => {
    const clone = document.documentElement.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('script').forEach((s) => s.remove());
    const html = clone.outerHTML;
    const at = html.search(/TODO/i);
    return at < 0 ? null : html.slice(Math.max(0, at - 100), at + 100);
  });
  expect(found, 'TODO in the rendered DOM').toBeNull();
}
