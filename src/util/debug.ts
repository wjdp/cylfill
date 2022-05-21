export const areDebugFeaturesEnabled = () => {
  return import.meta.env.VITE_DEBUG_FEATURES === "true";
};
