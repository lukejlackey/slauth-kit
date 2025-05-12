import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  root: ".",
  plugins: [
    react(),
    dts({ insertTypesEntry: true })
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: "src/index.ts",
      name: "SlauthModal",
      formats: ["es", "cjs"],
      fileName: (format) =>
        format === "es" ? "index.esm.js" : "index.cjs.js",
    },
    rollupOptions: {
      external: ["react", "react-dom", "axios", "framer-motion", "react-icons"]
    },
  },
});
