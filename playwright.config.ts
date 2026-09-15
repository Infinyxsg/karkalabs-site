import { defineConfig, devices } from '@playwright/test';

// Two builds, two Pages-like servers (gzip + ranges + max-age=600):
// - site: the production build (dist/, `npm run build`) on :4173 — exactly what ships.
// - embed-path: the live-embed code path (dist-fixture/, `npm run build:fixture`, run by `pretest`)
//   on :4174, with the stand-in frame and chime narration served from tests/fixtures/.
export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  projects: [
    {
      name: 'site',
      testMatch: ['site.spec.ts', 'gate-launch.spec.ts'],
      use: { baseURL: 'http://localhost:4173', channel: 'chrome' },
    },
    {
      // 040 gate: iPhone Safari emulation at 390 — the board loop plays inline.
      name: 'iphone-safari',
      testMatch: 'iphone.spec.ts',
      use: { ...devices['iPhone 13'], baseURL: 'http://localhost:4173' },
    },
    {
      name: 'embed-path',
      testMatch: ['embed.spec.ts', 'gate-students.spec.ts'],
      use: { baseURL: 'http://localhost:4174', channel: 'chrome' },
    },
  ],
  webServer: [
    { command: 'node scripts/serve-dist.mjs', url: 'http://localhost:4173', reuseExistingServer: true, timeout: 30_000 },
    {
      command: 'node scripts/serve-dist.mjs --fixture',
      url: 'http://localhost:4174',
      reuseExistingServer: true,
      timeout: 30_000,
    },
  ],
});
