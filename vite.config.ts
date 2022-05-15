/// <reference types="vitest" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      includeAssets: ["favicon.ico", "robots.txt"],
      manifest: {
        name: "cylfill",
        short_name: "cylfill",
        description: "Tiny app to track filling of compressed air cylinders",
        theme_color: "#0F1629",
      },
      workbox: {
        globPatterns: ["assets/*", "*.html", "manifest.webmanifest"],
      },
    }),
  ],
  test: {
    environment: "jsdom",
  },
});
