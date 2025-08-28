import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),  tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",   // listen on all interfaces (needed for Docker)
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true, // ensures hot reload works in Docker volumes
    },
  },
})
