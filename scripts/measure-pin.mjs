// One-off diagnostic: what pinning does to the pinned block's width at 1440 (the desktop CLS jump).
import { chromium } from '@playwright/test';
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.addInitScript(() => { try { sessionStorage.setItem('karka:intro-played', '1'); } catch {} });
const read = () => p.evaluate(() => {
  const section = document.getElementById('students');
  const spacer = section.firstElementChild;
  const pin = spacer.firstElementChild;
  const grid = pin.querySelector('.mx-auto');
  const w = (el) => Math.round(el.getBoundingClientRect().width);
  return {
    section: w(section), spacer: w(spacer), pin: w(pin), grid: w(grid),
    gridX: Math.round(grid.getBoundingClientRect().x),
    pinInline: pin.getAttribute('style') || '(none)',
    spacerInline: (spacer.getAttribute('style') || '(none)').slice(0, 120),
    pinPosition: getComputedStyle(pin).position,
  };
});
await p.goto('http://localhost:4173/');
console.log('before pins:', JSON.stringify(await read(), null, 1));
await p.waitForFunction(() => performance.getEntriesByName('karka:pins-built').length > 0, null, { timeout: 20000 });
await p.waitForTimeout(400);
console.log('after pins :', JSON.stringify(await read(), null, 1));
await b.close();
