import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    tsconfigPaths: true,
  },

  build: {
    chunkSizeWarningLimit: 1050,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react-vendor",
              test: /node_modules\/(react|react-dom|react-router-dom)\//,
            },
            {
              name: "maplibre-vendor",
              test: /node_modules\/maplibre-gl\//,
            },
            {
              name: "turf-vendor",
              test: /node_modules\/@turf\//,
            },
            {
              name: "drawing-vendor",
              test: /node_modules\/(terra-draw|@watergis)\//,
            },
            {
              name: "supabase-vendor",
              test: /node_modules\/@supabase\//,
            },
            {
              name: "ui-vendor",
              test: /node_modules\/(lucide-react|framer-motion)\//,
            },
          ],
        },
      },
    },
  },
});
