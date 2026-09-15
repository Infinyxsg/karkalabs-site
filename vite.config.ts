import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { contactProblems } from './src/content/contact';
import { meta } from './src/content/copy';

// 040 §B: no build without real contact targets — never a placeholder number.
const problems = contactProblems();
if (problems.length > 0) {
  throw new Error(`Contact targets not set (src/content/contact.ts): ${problems.join('; ')}`);
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Fills index.html's %KARKA_*% slots from copy.ts, so <title> and meta tags share the page's copy. */
function siteMeta(): Plugin {
  const slots: Record<string, string> = {
    '%KARKA_TITLE%': meta.title,
    '%KARKA_DESCRIPTION%': meta.description,
    '%KARKA_OG_ALT%': meta.ogImageAlt,
  };
  return {
    name: 'karka-site-meta',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) =>
        Object.entries(slots).reduce((out, [slot, value]) => out.replaceAll(slot, escapeHtml(value)), html),
    },
  };
}

// GitHub Pages at the apex domain (CNAME = karkalabs.ai) → base '/'.
// Built by `vite-react-ssg build`: a server pass pre-renders index.html, then the client bundle hydrates it.
export default defineConfig(({ isSsrBuild }) => ({
  base: '/',
  plugins: [siteMeta(), react(), tailwindcss()],
  ssgOptions: {
    // Critical CSS is inlined. The full stylesheet loads as media="print" → "all" (with a <noscript>
    // fallback): beasties' default appends a plain <link rel=stylesheet> to <body>, and Chrome holds
    // the first paint until it arrives (~0.8 s on throttled mobile). Font preloads off — they put every
    // font in front of the headline.
    beastiesOptions: { preload: 'media', preloadFonts: false },
  },
  build: {
    // dist/ ships; the embed-path test build writes dist-fixture/ (scripts/build-fixture.mjs).
    outDir: process.env.KARKA_OUT_DIR ?? 'dist',
    target: 'es2020',
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            // Keep the scroll engine out of the React chunk so the hero paints first.
            manualChunks: {
              scroll: ['gsap', 'gsap/ScrollTrigger', 'lenis'],
            },
          },
        },
  },
}));
