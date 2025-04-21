// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target:
          "https://asdf-e4h9gqa5g0akf3d4.westus2-01.azurewebsites.net", // Your backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
