// The Students poster: a still of the LIVE board, not a stand-in.
//
// public/posters/README.md said "when the live /embed/ route ships, use a still of
// p11-proj-two-clocks-one-time". It shipped (CBSEPhysics11 main 486141c), so this grabs the frame's
// own first picture — step 0/1, the scene mounted and frozen with the ball at launch, which is
// exactly what a visitor sees behind the iframe until it fades in.
//
// Loaded top-level, not framed: the route's own origin is on its allowlist, so it runs and draws.
//   node scripts/make-embed-poster.mjs
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const ORIGIN = process.env.KARKA_EMBED_ORIGIN ?? 'https://cbsephysics11.karkalabs.ai';
const SCENE = 'p11-proj-two-clocks-one-time';
// 800x576 is the loop's size, and what <Poster> is measured at — same box, no layout change.
const OUT = 'public/posters/students-two-clocks.webp';
const [W, H] = [800, 576];

const tmp = mkdtempSync(path.join(tmpdir(), 'karka-poster-'));
const png = path.join(tmp, 'frame.png');

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
await page.goto(`${ORIGIN}/embed/?scene=${SCENE}&audience=students`, { waitUntil: 'load' });
// The bridge sets data-scene on <body> immediately before it posts `ready`.
await page.waitForFunction(() => document.body.dataset.scene, null, { timeout: 15_000 });
await page.waitForTimeout(600); // the readout is placed after a measure pass
await page.screenshot({ path: png });
await browser.close();

execFileSync('ffmpeg', ['-y', '-i', png, '-vf', `scale=${W}:${H}:flags=lanczos`, '-c:v', 'libwebp', '-quality', '82', OUT], {
  stdio: 'inherit',
});
rmSync(tmp, { recursive: true, force: true });
console.log(`wrote ${OUT}`);
