// One image for Vinodh: the design system's "Marketing page" template (left) next to the built
// Students section (right), both at 1440. Needs the dist server (node scripts/serve-dist.mjs) and
// ffmpeg on PATH. The template renders from handoff/ over file:// (it loads Source Serif from Google Fonts).
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const base = process.argv[2] ?? 'http://localhost:4173';
const OUT = process.env.GATE_DIR ?? 'docs/gate/039';
mkdirSync(OUT, { recursive: true });
const tmp = mkdtempSync(path.join(tmpdir(), 'karka-sbs-'));
const left = path.join(tmp, 'template.png');
const right = path.join(tmp, 'site.png');
const vp = { width: 1440, height: 900 };

const browser = await chromium.launch({ channel: 'chrome' });

// Left: the design system's template (its Students section shows step 3 of 6).
const ds = await browser.newPage({ viewport: vp });
await ds.goto(pathToFileURL(path.resolve('handoff/templates/website/Website.dc.html')).href);
await ds.waitForSelector('#students', { timeout: 30_000 });
await ds.waitForTimeout(2500); // fonts + bundle components
await ds.locator('#students').screenshot({ path: left });

// Right: the built site, Students pinned at step 3 to match.
const site = await browser.newPage({ viewport: vp });
await site.goto(base);
await site.waitForFunction(() => document.getElementById('students')?.dataset.pinEnd);
const y = await site.locator('#students').evaluate((el) => {
  const start = Number(el.dataset.pinStart);
  const end = Number(el.dataset.pinEnd);
  return Math.round(start + (2.5 / 6) * (end - start)); // progress → step 3
});
await site.evaluate((y) => window.__karkaLenis?.scrollTo(y, { immediate: true, force: true }), y);
await site.locator('#students [data-frame-step="3"]').waitFor({ timeout: 15_000 });
await site.waitForTimeout(1200);
await site.screenshot({ path: right });
await browser.close();

const out = `${OUT}/side-by-side-students-1440.png`;
execFileSync('ffmpeg', [
  '-v', 'error', '-y', '-i', left, '-i', right,
  '-filter_complex', '[0]scale=-2:900,pad=iw+24:ih:0:0:color=white[a];[1]scale=-2:900[b];[a][b]hstack',
  out,
]);
console.log(`wrote ${out} (left: design system template · right: built site)`);
