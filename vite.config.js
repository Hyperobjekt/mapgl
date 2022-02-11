const path = require("path");
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: "HypMapGL",
      fileName: (format) => `HypMapGL.${format}.js`,
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "mapbox-gl", "react-map-gl"],
      output: {
        globals: {
          react: "react",
          "mapbox-gl": "mapboxgl",
          "react-map-gl": "ReactMapGL",
        },
      },
    },
  },
  plugins: [react()],
});
