import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

const pagesRoot = fileURLToPath(new URL("./github-pages", import.meta.url));
const publicDir = fileURLToPath(new URL("./public", import.meta.url));
const outDir = fileURLToPath(new URL("./dist-pages", import.meta.url));

export default defineConfig({
  root: pagesRoot,
  base: process.env.PAGES_BASE_PATH || "/",
  publicDir,
  plugins: [react()],
  build: {
    outDir,
    emptyOutDir: true,
  },
});
