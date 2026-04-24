/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADSENSE_CLIENT?: string;
  readonly VITE_ADSENSE_SLOT_MIDDLE?: string;
  readonly VITE_ADSENSE_SLOT_BOTTOM?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
