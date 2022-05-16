import { useRegisterSW } from "virtual:pwa-register/vue";

const intervalMS = 30 * 60 * 1000;

export const updateServiceWorker = useRegisterSW({
  onRegistered(r) {
    r && r.update();
    r && setInterval(r.update, intervalMS);
  },
});
