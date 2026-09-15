// Static server for dist/ that behaves like GitHub Pages where it matters for the gate:
// gzip for text assets, `Cache-Control: max-age=600`, HTTP Range (206) for media, and 404.html for
// any missing path. No per-route headers (Pages can't set them either).
//   node scripts/serve-dist.mjs            dist/ on :4173 (what ships)
//   node scripts/serve-dist.mjs --fixture  dist-fixture/ on :4174, plus the test-only stand-ins from
//                                          tests/fixtures/ (the frame at /embed/, the chime at /audio/)
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const fixture = process.argv.includes('--fixture');
const fromHere = (p) => path.resolve(fileURLToPath(new URL(p, import.meta.url)));
const root = fromHere(fixture ? '../dist-fixture' : '../dist');
const fixtures = fromHere('../tests/fixtures');
const port = Number(process.env.PORT ?? (fixture ? 4174 : 4173));
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.m4a': 'audio/mp4',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
};
const compressible = new Set(['.html', '.js', '.css', '.svg', '.json', '.txt']);

/** Parse a single `bytes=` range against `size`; null = unsatisfiable. */
function parseRange(header, size) {
  const m = /^bytes=(\d*)-(\d*)$/.exec(header);
  if (!m || (m[1] === '' && m[2] === '')) return null;
  const start = m[1] === '' ? Math.max(0, size - Number(m[2])) : Number(m[1]);
  const end = m[1] === '' || m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1);
  return start <= end && start < size ? { start, end } : null;
}

/** URL path → file on disk, or null if it escapes the served folders. */
function resolveFile(p) {
  if (fixture && p === '/embed/index.html') return path.join(fixtures, 'embed-placeholder.html');
  const [base, rel] = fixture && p.startsWith('/audio/') ? [fixtures, p] : [root, p];
  const file = path.join(base, rel);
  return file.startsWith(base) ? file : null;
}

function send(req, res, status, body, ext) {
  const headers = { 'Content-Type': types[ext] ?? 'application/octet-stream', 'Cache-Control': 'max-age=600' };
  if (compressible.has(ext)) {
    if (/\bgzip\b/.test(req.headers['accept-encoding'] ?? '')) {
      body = gzipSync(body);
      headers['Content-Encoding'] = 'gzip';
      headers['Vary'] = 'Accept-Encoding';
    }
    res.writeHead(status, headers).end(body);
    return;
  }
  headers['Accept-Ranges'] = 'bytes';
  if (req.headers.range && status === 200) {
    const r = parseRange(req.headers.range, body.length);
    if (!r) {
      res.writeHead(416, { 'Content-Range': `bytes */${body.length}` }).end();
      return;
    }
    res
      .writeHead(206, {
        ...headers,
        'Content-Range': `bytes ${r.start}-${r.end}/${body.length}`,
        'Content-Length': r.end - r.start + 1,
      })
      .end(body.subarray(r.start, r.end + 1));
    return;
  }
  res.writeHead(status, { ...headers, 'Content-Length': body.length }).end(body);
}

http
  .createServer(async (req, res) => {
    let p = decodeURIComponent(new URL(req.url ?? '/', 'http://local').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = resolveFile(p);
    if (!file) {
      res.writeHead(403).end();
      return;
    }
    try {
      send(req, res, 200, await readFile(file), path.extname(file));
    } catch {
      // Pages serves the site's 404.html for any missing path.
      try {
        send(req, res, 404, await readFile(path.join(root, '404.html')), '.html');
      } catch {
        res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
      }
    }
  })
  .listen(port, () =>
    console.log(`${path.basename(root)} on http://localhost:${port} (gzip, ranges, max-age=600${fixture ? ', fixtures' : ''})`),
  );
