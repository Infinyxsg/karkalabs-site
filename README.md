# karkalabs-site

Marketing site for **karkalabs.ai**. Its immersive sections show the real Karka board, driven by scroll, with the tutor's voice as the hero.

**v1 (word 040):** the Students board is a muted loop of the real board, cut from the demo recordings. The live `/embed/` route replaces it with one build setting, `VITE_KARKA_EMBED_ORIGIN`.

- **Stack:** Vite + React + TypeScript + Tailwind v4 · Framer Motion · GSAP ScrollTrigger + Lenis.
- **Build:** pre-rendered with `vite-react-ssg` (critical CSS inlined by beasties), then hydrated. The static output in `dist/` is for GitHub Pages (`CNAME` = `karkalabs.ai`, `.nojekyll`, `404.html`).
- **Deploy:** `.github/workflows/pages.yml`. On push to `main`, the gate job runs: build, the test suite and Lighthouse. Only then does `actions/deploy-pages` publish. The Pages source is GitHub Actions.
- **Fonts:** the display face is Source Serif 4, Latin subset only, vendored in `public/fonts/` (OFL).
- **Narration:** pre-recorded and played in the page. It is off in v1, and only the test build plays a chime stand-in (`tests/fixtures/audio/`, `TODO:VB-audio`).
- **Stills:** real product surfaces, with no identifiable student; the Parents still is a labelled sample. Provenance is in [`public/posters/README.md`](public/posters/README.md).
- **Rules:** [`CLAUDE.md`](CLAUDE.md) covers the ring-fence, token freeze, reduced motion, the Lighthouse gate, `TODO:VB`, and the no-student-data rule.
- **Embed:** [`docs/EMBED_CONTRACT.md`](docs/EMBED_CONTRACT.md) covers the postMessage contract, the `/embed/` route spec, the framing stopgap and its limits, and the scenes.
- **Gate evidence:** `docs/gate/<word>/` holds screenshots and Lighthouse results.

```
npm install
npm run dev
npm run build && npm test              # npm test also builds dist-fixture/ (the live-embed path)
node scripts/serve-dist.mjs            # then, from a cold process:
npm run gate:lighthouse                # simulated throttling (Lighthouse default): the gate
npm run gate:lighthouse:applied        # applied (devtools) throttling: measured paint times
```

Pushing, enabling Pages and changing DNS are done by hand, by Vinodh.
