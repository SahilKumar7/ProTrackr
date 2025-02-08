import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.NODE_ENV === "production" ? "/ProTrackr/" : "/",
  server: {
    watch: { usePolling: true },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test.setup.js",
    css: true,
  },
});
