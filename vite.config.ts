/// <reference types="vitest" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      includeAssets: [
        "cylfill-rect.png",
        "cylfill-logo-192.png",
        "cylfill-logo-512.png",
        "robots.txt",
      ],
      manifest: {
        name: "cylfill",
        short_name: "cylfill",
        description: "Tiny app to track filling of compressed air cylinders",
        theme_color: "#0F1629",
        icons: [
          {
            src: "cylfill-logo-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "cylfill-logo-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "cylfill-logo-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
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
