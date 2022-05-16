import { createApp } from "vue";
import App from "./App.vue";
import fill from "./service/fill";
import { updateServiceWorker } from "./pwa";

updateServiceWorker.updateServiceWorker();
fill.loadFromLocalStorage();
createApp(App).mount("#app");
