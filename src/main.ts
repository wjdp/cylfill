import { createApp } from "vue";
import App from "./App.vue";
import fill from "./service/fill";
import log from "./service/log";
import { updateServiceWorker } from "./pwa";
import { initSentry } from "./sentry";

const app = createApp(App);

initSentry(app);

updateServiceWorker.updateServiceWorker();

fill.loadFromLocalStorage();
log.loadFromLocalStorage();

app.mount("#app");
