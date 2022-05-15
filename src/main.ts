import { createApp } from "vue";
import App from "./App.vue";
import fill from "./service/fill";
fill.loadFromLocalStorage();

createApp(App).mount("#app");
