// One-off diagnostic: does a jump to the bottom actually land, and what does Lenis think its limit is?
// Reproduces the suite's sequence: open Students' pin, press play, then jump to the bottom.
import { chromium } from '@playwright/test';
const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 6 });
await p.addInitScript(() => { try { sessionStorage.setItem('karka:intro-played', '1'); } catch {} });
await p.goto('http://localhost:4173/');
await p.waitForFunction(() => document.getElementById('students')?.dataset.pinEnd, null, { timeout: 30000 });
const read = () => p.evaluate(() => {
  const l = window.__karkaLenis;
  return {
    scrollY: Math.round(window.scrollY),
    scrollHeight: document.documentElement.scrollHeight,
    innerHeight: window.innerHeight,
    lenis: l ? { scroll: Math.round(l.scroll ?? -1), limit: Math.round(l.limit ?? -1), isStopped: l.isStopped ?? null } : null,
    videoPaused: document.querySelector('#students video')?.paused ?? 'no video',
  };
});
console.log('after pins :', JSON.stringify(await read()));
const start = await p.locator('#students').evaluate((el) => Number(el.dataset.pinStart));
await p.evaluate((y) => window.__karkaLenis ? window.__karkaLenis.scrollTo(y, { immediate: true, force: true }) : window.scrollTo(0, y), start);
await p.waitForTimeout(400);
console.log('at pinStart:', JSON.stringify(await read()));
await p.evaluate(() => {
  const target = document.documentElement.scrollHeight;
  window.__karkaLenis ? window.__karkaLenis.scrollTo(target, { immediate: true, force: true }) : window.scrollTo(0, target);
});
await p.waitForTimeout(400);
console.log('after jump :', JSON.stringify(await read()));
await p.waitForTimeout(2000);
console.log('2s later   :', JSON.stringify(await read()));
await b.close();
