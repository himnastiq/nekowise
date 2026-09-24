import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Proxy targets — configurable for Docker environments where
// "localhost" resolves to the container itself, not the server.
const apiTarget = process.env.VITE_PROXY_API_TARGET || "http://localhost:5000";
const wsTarget = process.env.VITE_PROXY_WS_TARGET || "ws://localhost:5000";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: true, // Listen on all interfaces (required for Docker)
    proxy: {
      "/api": {
        target: apiTarget,
        changeOrigin: true,
      },
      "/ws": {
        target: wsTarget,
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
