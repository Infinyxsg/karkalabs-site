// One-off diagnostic: every layout shift on load, with the nodes that moved, against the karka:* marks.
// Usage: node scripts/measure-cls.mjs [url] [--no-intro] [--width=412] [--cpu=4] [--slow]
import { chromium } from '@playwright/test';
const args = process.argv.slice(2);
const url = args.find((a) => a.startsWith('http')) ?? 'http://localhost:4173/';
const width = Number((args.find((a) => a.startsWith('--width=')) ?? '--width=1440').split('=')[1]);
const cpu = Number((args.find((a) => a.startsWith('--cpu=')) ?? '--cpu=1').split('=')[1]);
const slow = args.includes('--slow');
const noIntro = args.includes('--no-intro');
const mobile = width < 700;
const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({
  viewport: { width, height: mobile ? 823 : 900 },
  deviceScaleFactor: mobile ? 1.75 : 1,
  isMobile: mobile,
  hasTouch: mobile,
});
const p = await ctx.newPage();
if (noIntro) await p.addInitScript(() => { try { sessionStorage.setItem('karka:intro-played', '1'); } catch {} });
await p.addInitScript(() => {
  window.__shifts = [];
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) {
      window.__shifts.push({
        value: Number(e.value.toFixed(4)),
        at: Math.round(e.startTime),
        input: e.hadRecentInput,
        sources: (e.sources || []).map((s) => ({
          node: s.node ? `${s.node.nodeName}#${s.node.id || ''}.${String(s.node.className || '').slice(0, 34)}` : null,
          from: s.previousRect ? [Math.round(s.previousRect.x), Math.round(s.previousRect.y), Math.round(s.previousRect.width), Math.round(s.previousRect.height)] : null,
          to: s.currentRect ? [Math.round(s.currentRect.x), Math.round(s.currentRect.y), Math.round(s.currentRect.width), Math.round(s.currentRect.height)] : null,
        })),
      });
    }
  }).observe({ type: 'layout-shift', buffered: true });
});
const cdp = await ctx.newCDPSession(p);
if (cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
if (slow) {
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
}
await p.goto(url);
await p.waitForTimeout(7000);
const out = await p.evaluate(() => ({ shifts: window.__shifts, marks: performance.getEntriesByType('mark').map((m) => ({ name: m.name, at: Math.round(m.startTime) })) }));
console.log(`--- ${noIntro ? 'no intro' : 'intro'} @ ${width} cpu x${cpu}${slow ? ' slow-net' : ''}: CLS ${out.shifts.reduce((t, s) => t + s.value, 0).toFixed(4)}`);
console.log('marks:', JSON.stringify(out.marks));
for (const s of out.shifts.filter((s) => s.value > 0.001)) console.log(' ', s.value, 'at', s.at, JSON.stringify(s.sources).slice(0, 300));
await b.close();
