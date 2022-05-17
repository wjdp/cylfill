import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";
import { App } from "vue";

export const initSentry = (app: App) => {
  if (!import.meta.env.VITE_SENTRY_DSN) {
    return;
  }
  Sentry.init({
    app,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 0.2,
  });
};
