import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  output: "static",
  site: "https://www.acomit.lk",
  prefetch: true,
  build: {
    assets: "assets",
  },
});
