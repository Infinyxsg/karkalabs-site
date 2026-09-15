// Test build of the live-embed code path (040 §C): v1 ships the muted loop (C2), and swapping to the
// live embed (C1) must stay a config change — so the same source is also built with the embed on,
// pointed at the fixture server (node scripts/serve-dist.mjs --fixture, :4174). That server serves
// the stand-in frame and the chime narration from tests/fixtures/; neither is in public/, so neither
// ships. Output: dist-fixture/ (git-ignored). Run by `npm test` (pretest).
import { execSync } from 'node:child_process';

execSync('npx vite-react-ssg build', {
  stdio: 'inherit',
  env: {
    ...process.env,
    KARKA_OUT_DIR: 'dist-fixture',
    VITE_KARKA_EMBED_ORIGIN: 'http://localhost:4174',
    VITE_NARRATION_ENABLED: 'true',
    VITE_SCHOOLS_CLASSROOM: 'true',
  },
});
