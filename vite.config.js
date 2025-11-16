import { defineConfig } from "vite";
import { resolve } from "node:path";

const htmlInputs = {
  main: resolve(__dirname, "index.html"),
  meals: resolve(__dirname, "meals.html"),
};

export default defineConfig({
  base: "/",
  root: ".",
  server: {
    port: 5173,
    open: "/index.html",
  },
  preview: {
    port: 5173,
    open: "/index.html",
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: htmlInputs,
    },
  },
});
