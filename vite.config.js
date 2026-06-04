import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-redux", "react-router-dom"],
          ui: ["styled-components", "recharts"],
          forms: ["react-hook-form", "@hookform/resolvers", "yup"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
