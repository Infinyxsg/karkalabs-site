import { defineConfig, devices } from '@playwright/test';

// Two builds, two Pages-like servers (gzip + ranges + max-age=600):
// - site: the production build (dist/, `npm run build`) on :4173 — exactly what ships, which since
//   040 §C.1 means its Students frame points at the LIVE route on cbsephysics11.karkalabs.ai.
// - embed-path: the same source built against the stand-in frame (dist-fixture/,
//   `npm run build:fixture`, run by `pretest`) on :4174, served from tests/fixtures/. A stand-in can
//   be made to misbehave; the live route cannot, so the protocol's edge cases live there.
// `live-embed` is split out of `site` because it is the only project that needs the network.
export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  projects: [
    {
      name: 'site',
      testMatch: ['site.spec.ts', 'gate-launch.spec.ts', 'gate-intro.spec.ts'],
      use: { baseURL: 'http://localhost:4173', channel: 'chrome' },
    },
    {
      // 040 §C.1 gate: the shipping build against the real /embed/ route. Needs the network.
      name: 'live-embed',
      testMatch: 'gate-live-embed.spec.ts',
      use: { baseURL: 'http://localhost:4173', channel: 'chrome' },
    },
    {
      // 040 gate: iPhone Safari emulation at 390 — the board plays inline.
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
