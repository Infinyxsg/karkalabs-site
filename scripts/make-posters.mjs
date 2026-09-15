// Renders the launch stills that are drawn rather than cut from a recording (040):
// - public/posters/parents-sample.webp — a SAMPLE parent report in the layout of
//   handoff/ui_kits/parent_dashboard/ParentDashboard.jsx, filled from copy.ts `parents.sample`.
//   Vinodh's ruling (040): no real student data ships, so the recorded report is never used.
// - public/favicon-32.png, public/apple-touch-icon.png — the wordmark's "K", on ink.
// - public/og/og-karkalabs.png — 1200×630: the on-dark wordmark beside the Students loop's first frame.
// Needs ffmpeg on PATH (webp) and the brand files (KARKA_BRAND_DIR). Video stills and the loop are
// cut by hand: commands in public/posters/README.md.
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parents } from '../src/content/copy.ts';
import { CONCEPT_STATES } from '../src/product/mastery.ts';

const repo = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const BRAND = process.env.KARKA_BRAND_DIR ?? 'D:/Demo videos/KarkaLabs - Brand files';
const INK = '#1a232b'; // handoff/tokens/colors.css --color-ink
const tmp = mkdtempSync(path.join(tmpdir(), 'karka-posters-'));
const dataUrl = (file, type) => `data:${type};base64,${readFileSync(file).toString('base64')}`;
const writeDataUrl = (file, url) => writeFileSync(file, Buffer.from(url.split(',')[1], 'base64'));
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const browser = await chromium.launch({ channel: 'chrome' });

// --- Parents: the sample report -------------------------------------------------------------------
{
  const s = parents.sample;
  const chip = (state) => {
    const c = CONCEPT_STATES[state];
    return `<span class="chip" style="background:${c.bg};color:${c.fg};border-color:${c.border}"><span class="dot" style="background:${c.dot}"></span>${esc(c.label)}</span>`;
  };
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<link rel="stylesheet" href="${pathToFileURL(path.join(repo, 'handoff/styles.css')).href}">
<style>
  html, body { margin: 0; background: var(--color-board); }
  .page { box-sizing: border-box; width: 600px; height: 450px; padding: 22px 28px; display: grid; gap: 12px; align-content: start;
    font-family: var(--font-sans); color: var(--color-ink); background: var(--color-board); }
  .brand { margin: 0; font-size: 1rem; font-weight: 700; }
  .brand .labs { color: var(--color-sage); }
  .brand .role { font-weight: 400; color: var(--color-ink-muted); }
  .eyebrow { margin: 6px 0 0; font-size: var(--text-eyebrow); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-teal); }
  .who { margin: 0; font-size: 1.375rem; font-weight: 700; }
  .who span { font-size: var(--text-caption); font-weight: 400; color: var(--color-ink-muted); }
  article { border-radius: var(--radius-card); border: 1px solid var(--color-line); background: var(--color-paper); padding: 16px 20px; display: grid; gap: 12px; }
  .summary { margin: 0; line-height: var(--leading-body); }
  .label { margin: 0 0 6px; font-size: var(--text-eyebrow); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-ink-muted); }
  .states { border-radius: var(--radius-field); background: var(--color-ink); padding: 8px 14px; display: grid; }
  .row { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 5px 0; color: var(--color-on-ink); font-weight: 600; }
  .chip { display: inline-flex; align-items: center; gap: 8px; min-height: 28px; border: 1px solid; border-radius: var(--radius-pill); padding: 0 12px; font-size: var(--text-caption); font-weight: 600; }
  .dot { width: 8px; height: 8px; border-radius: 50%; }
  .note { margin: 0; font-size: var(--text-caption); color: var(--color-ink-muted); }
</style></head><body><div class="page">
  <p class="brand">Karka<span class="labs">Labs</span> <span class="role">· Parent</span></p>
  <p class="eyebrow">${esc(s.eyebrow)}</p>
  <p class="who">${esc(s.student)} <span>${esc(s.subject)}</span></p>
  <article>
    <p class="summary">${esc(s.summary)}</p>
    <div>
      <p class="label">${esc(s.learnedTitle)}</p>
      <div class="states">${s.learned.map((l) => `<div class="row"><span>${esc(l.concept)}</span>${chip(l.state)}</div>`).join('')}</div>
    </div>
    <p class="note">${esc(s.statesNote)}</p>
  </article>
</div></body></html>`;
  const file = path.join(tmp, 'parents-sample.html');
  writeFileSync(file, html);
  // 600×450 CSS px at 2× → 1200×900, the section's 4:3 panel.
  const page = await browser.newPage({ viewport: { width: 600, height: 450 }, deviceScaleFactor: 2 });
  await page.goto(pathToFileURL(file).href);
  await page.evaluate(() => document.fonts.ready);
  const overflow = await page.evaluate(() => document.querySelector('.page').scrollHeight > 450);
  if (overflow) throw new Error('sample report overflows its 600×450 panel');
  const png = path.join(tmp, 'parents-sample.png');
  await page.screenshot({ path: png });
  await page.close();
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', png, '-c:v', 'libwebp', '-quality', '82', path.join(repo, 'public/posters/parents-sample.webp')]);
  console.log('wrote public/posters/parents-sample.webp');
}

// --- Favicons and OG image (canvas; images passed as data URLs so the canvas stays readable) --------
{
  const page = await browser.newPage();
  const wordmark = dataUrl(path.join(BRAND, 'KarkaLabs_wordmark_on-dark@2x.png'), 'image/png');
  const poster = dataUrl(path.join(repo, 'public/posters/students-board.webp'), 'image/webp');

  const { k, icons, og } = await page.evaluate(
    async ({ wordmark, poster, ink }) => {
      const load = async (src) => {
        const img = new Image();
        img.src = src;
        await img.decode();
        return img;
      };
      const [mark, board] = await Promise.all([load(wordmark), load(poster)]);

      // The K = the first run of inked columns from the left (light glyph pixels on the on-dark mark).
      const c = document.createElement('canvas');
      c.width = mark.width;
      c.height = mark.height;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.drawImage(mark, 0, 0);
      const { data, width, height } = g.getImageData(0, 0, c.width, c.height);
      const inked = (x, y) => {
        const i = (y * width + x) * 4;
        return data[i + 3] > 64 && data[i] + data[i + 1] + data[i + 2] > 3 * 110;
      };
      const colInked = (x) => {
        for (let y = 0; y < height; y++) if (inked(x, y)) return true;
        return false;
      };
      let x0 = 0;
      while (x0 < width && !colInked(x0)) x0++;
      let x1 = x0;
      while (x1 < width && colInked(x1)) x1++;
      let y0 = height;
      let y1 = 0;
      for (let y = 0; y < height; y++)
        for (let x = x0; x < x1; x++)
          if (inked(x, y)) {
            y0 = Math.min(y0, y);
            y1 = Math.max(y1, y + 1);
          }
      const k = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };

      const icons = {};
      for (const size of [32, 180]) {
        const s = document.createElement('canvas');
        s.width = s.height = size;
        const sg = s.getContext('2d');
        sg.fillStyle = ink;
        sg.fillRect(0, 0, size, size);
        sg.imageSmoothingQuality = 'high';
        const h = size * 0.64;
        const w = (h * k.w) / k.h;
        sg.drawImage(mark, k.x, k.y, k.w, k.h, (size - w) / 2, (size - h) / 2, w, h);
        icons[size] = s.toDataURL('image/png');
      }

      const o = document.createElement('canvas');
      o.width = 1200;
      o.height = 630;
      const og = o.getContext('2d');
      og.fillStyle = ink;
      og.fillRect(0, 0, 1200, 630);
      const bw = 640;
      const bh = Math.round((bw * board.height) / board.width);
      const bx = 1200 - 48 - bw;
      const by = Math.round((630 - bh) / 2);
      og.save();
      og.beginPath();
      og.roundRect(bx, by, bw, bh, 20); // the board frame's radius
      og.clip();
      og.drawImage(board, bx, by, bw, bh);
      og.restore();
      const ww = bx - 96;
      const wh = Math.round((ww * mark.height) / mark.width);
      og.drawImage(mark, 48, Math.round((630 - wh) / 2), ww, wh);
      return { k, icons, og: o.toDataURL('image/png') };
    },
    { wordmark, poster, ink: INK },
  );
  // A K is taller than it is wide; anything else means the scan ran into the next letter.
  if (!(k.w > 0 && k.w < k.h)) throw new Error(`could not isolate the K: ${JSON.stringify(k)}`);
  writeDataUrl(path.join(repo, 'public/favicon-32.png'), icons[32]);
  writeDataUrl(path.join(repo, 'public/apple-touch-icon.png'), icons[180]);
  writeDataUrl(path.join(repo, 'public/og/og-karkalabs.png'), og);
  console.log(`wrote favicon-32.png, apple-touch-icon.png (K at ${JSON.stringify(k)}), og/og-karkalabs.png`);
  await page.close();
}

await browser.close();
