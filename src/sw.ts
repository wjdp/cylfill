import { useRegisterSW } from "virtual:pwa-register/vue";

const intervalMS = 60 * 60 * 1000;

export const updateServiceWorker = useRegisterSW({
  onRegistered(r) {
    r && setInterval(r.update, intervalMS);
  },
});
