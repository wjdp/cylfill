/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  VITE_COMMIT_SHA?: string;
  VITE_SENTRY_DSN?: string;
  VITE_DEBUG_FEATURES?: string;
  VITE_PLAUSIBLE_DOMAIN?: string;
}
