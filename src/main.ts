import { createApp } from "vue";
import App from "./App.vue";
import fill from "./service/fill";
import log from "./service/log";
import { updateServiceWorker } from "./pwa";

updateServiceWorker.updateServiceWorker();
fill.loadFromLocalStorage();
log.loadFromLocalStorage();
createApp(App).mount("#app");
