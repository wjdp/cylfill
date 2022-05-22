import Plausible, { EventOptions, PlausibleOptions } from "plausible-tracker";

let plausible: ReturnType<typeof Plausible>;

export function initTracking() {
  if (!import.meta.env.VITE_PLAUSIBLE_DOMAIN) {
    return;
  }

  plausible = Plausible({ domain: import.meta.env.VITE_PLAUSIBLE_DOMAIN });
  plausible.enableAutoPageviews();
}

export function trackEvent(
  eventName: string,
  options?: EventOptions,
  eventData?: PlausibleOptions
): void {
  if (!plausible) return;
  plausible.trackEvent(eventName, options, eventData);
}
