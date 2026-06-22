/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_PORT: string;
  VITE_API_URL: string;
  API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
