/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KARKA_EMBED_ORIGIN?: string;
  /** 'true' only in the embed-path test build (scripts/build-fixture.mjs). */
  readonly VITE_NARRATION_ENABLED?: string;
  /** 'true' = Schools as the 039 classroom embed (needs VITE_KARKA_EMBED_ORIGIN). */
  readonly VITE_SCHOOLS_CLASSROOM?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
