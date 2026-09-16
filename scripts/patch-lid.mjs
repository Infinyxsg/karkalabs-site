// One-off: remove the wordmark printed on the laptop lid in the KarkaLogin mascot art, so the intro's
// lift-off wordmark doesn't leave a duplicate behind. The lid is a smooth gradient, so the box is
// filled by interpolating the colours just outside it (bilinear), not by cloning a flat strip.
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';

const [src, out] = process.argv.slice(2);
const BOX = { x: 528, y: 950, w: 246, h: 60 }; // measured: text spans ~545-748 x, ~962-1000 y
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
const dataUrl = `data:image/png;base64,${readFileSync(src).toString('base64')}`;
const png = await page.evaluate(async ({ dataUrl, BOX }) => {
  const img = new Image();
  img.src = dataUrl;
  await img.decode();
  const c = document.createElement('canvas');
  c.width = img.width; c.height = img.height;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  const d = g.getImageData(0, 0, c.width, c.height);
  const at = (x, y) => { const i = (y * d.width + x) * 4; return [d.data[i], d.data[i + 1], d.data[i + 2]]; };
  const put = (x, y, p) => { const i = (y * d.width + x) * 4; d.data[i] = p[0]; d.data[i + 1] = p[1]; d.data[i + 2] = p[2]; };
  const { x: bx, y: by, w, h } = BOX;
  for (let y = by; y < by + h; y++) {
    for (let x = bx; x < bx + w; x++) {
      const L = at(bx - 2, y), R = at(bx + w + 1, y), T = at(x, by - 2), B = at(x, by + h + 1);
      const fx = (x - bx) / (w - 1), fy = (y - by) / (h - 1);
      const horiz = [0, 1, 2].map((k) => L[k] * (1 - fx) + R[k] * fx);
      const vert = [0, 1, 2].map((k) => T[k] * (1 - fy) + B[k] * fy);
      // The lid's gradient runs mostly across, so weight the horizontal blend a little higher.
      put(x, y, [0, 1, 2].map((k) => Math.round(horiz[k] * 0.6 + vert[k] * 0.4)));
    }
  }
  g.putImageData(d, 0, 0);
  return c.toDataURL('image/png');
}, { dataUrl, BOX });
writeFileSync(out, Buffer.from(png.split(',')[1], 'base64'));
await browser.close();
console.log('wrote', out);
