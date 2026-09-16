// Lighthouse mobile gate (default config = mobile emulation + simulated throttling).
// Usage: node scripts/serve-dist.mjs & node scripts/lighthouse.mjs [url]
// Gate (040): the median of LH_RUNS runs — performance ≥ 90, accessibility 100, CLS < 0.1.
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { mkdir, writeFile } from 'node:fs/promises';

const url = process.argv[2] ?? 'http://localhost:4173/';
const RUNS = Number(process.env.LH_RUNS ?? 3);
// Each word writes its own folder; earlier gate evidence stays untouched. Bumped to 043
// in 040 §C.1 after a run clobbered 040's and 042's screenshots.
const OUT = process.env.GATE_DIR ?? 'docs/gate/043-live-embed';
// 'simulate' (Lighthouse default, the gate) or 'devtools' (applied throttling: the network and CPU
// are really slowed, so paint times are measured, not estimated). Separate files per mode.
const THROTTLING = process.env.LH_THROTTLING === 'devtools' ? 'devtools' : 'simulate';
const SUFFIX = THROTTLING === 'devtools' ? '-devtools' : '';
const score = (lhr, c) => Math.round((lhr.categories[c]?.score ?? 0) * 100);

await mkdir(OUT, { recursive: true });
const runs = [];
for (let i = 0; i < RUNS; i++) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-first-run'] });
  try {
    const result = await lighthouse(url, {
      port: chrome.port,
      output: 'html',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      throttlingMethod: THROTTLING,
    });
    runs.push(result);
  } finally {
    try {
      await chrome.kill();
    } catch {
      /* Windows temp-profile cleanup can throw EPERM; harmless. */
    }
  }
}

runs.sort((a, b) => score(a.lhr, 'performance') - score(b.lhr, 'performance'));
const median = runs[Math.floor(runs.length / 2)];
const { lhr } = median;
const audit = (id) => lhr.audits[id]?.displayValue ?? null;
const summary = {
  url,
  formFactor: lhr.configSettings.formFactor,
  throttling: lhr.configSettings.throttlingMethod,
  lighthouseVersion: lhr.lighthouseVersion,
  fetchTime: lhr.fetchTime,
  runs: runs.map((r) => ({ performance: score(r.lhr, 'performance'), accessibility: score(r.lhr, 'accessibility') })),
  median: {
    performance: score(lhr, 'performance'),
    accessibility: score(lhr, 'accessibility'),
    bestPractices: score(lhr, 'best-practices'),
    seo: score(lhr, 'seo'),
    FCP: audit('first-contentful-paint'),
    LCP: audit('largest-contentful-paint'),
    TBT: audit('total-blocking-time'),
    CLS: audit('cumulative-layout-shift'),
    SpeedIndex: audit('speed-index'),
  },
  failedA11yAudits: Object.values(lhr.audits)
    .filter((a) => lhr.categories.accessibility.auditRefs.some((r) => r.id === a.id) && a.score === 0)
    .map((a) => a.id),
};

summary.worst = { performance: Math.min(...summary.runs.map((r) => r.performance)), accessibility: Math.min(...summary.runs.map((r) => r.accessibility)) };
summary.lcpByRun = runs.map((r) => r.lhr.audits['largest-contentful-paint']?.displayValue ?? null);
const cls = (r) => r.lhr.audits['cumulative-layout-shift']?.numericValue ?? Number.POSITIVE_INFINITY;
summary.clsByRun = runs.map((r) => Number(cls(r).toFixed(3)));
summary.worst.cls = Math.max(...summary.clsByRun);
await writeFile(`${OUT}/lighthouse-mobile${SUFFIX}.json`, JSON.stringify(summary, null, 2));
await writeFile(`${OUT}/lighthouse-mobile${SUFFIX}.html`, median.report);
console.log(JSON.stringify(summary, null, 2));

const medianCls = cls(median);
if (summary.median.performance < 90 || summary.median.accessibility < 100 || !(medianCls < 0.1)) {
  console.error(
    `GATE FAIL: median performance ${summary.median.performance} (≥ 90), accessibility ${summary.median.accessibility} (100), CLS ${medianCls} (< 0.1)`,
  );
  process.exitCode = 1;
}
