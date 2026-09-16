// Test build of the embed code path against a frame we control (040 §C). The site ships path C1
// pointed at the live route; this build points the same source at the fixture server
// (node scripts/serve-dist.mjs --fixture, :4174), which serves the stand-in frame from
// tests/fixtures/. That keeps the protocol tests hermetic — they can make a frame misbehave, which
// the live gate (tests/gate-live-embed.spec.ts) cannot. The fixture is not in public/, so it never
// ships. Output: dist-fixture/ (git-ignored). Run by `npm test` (pretest).
import { execSync } from 'node:child_process';

execSync('npx vite-react-ssg build', {
  stdio: 'inherit',
  env: {
    ...process.env,
    KARKA_OUT_DIR: 'dist-fixture',
    VITE_KARKA_EMBED_ORIGIN: 'http://localhost:4174',
    VITE_SCHOOLS_CLASSROOM: 'true',
  },
});
