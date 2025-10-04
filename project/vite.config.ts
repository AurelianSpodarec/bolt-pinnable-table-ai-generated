import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true, // Needed for proper WebContainer address handling
    port: 5173,
    strictPort: true, // Ensure we always use port 5173
    hmr: {
      clientPort: 443, // Required for secure WebContainer connections
    }
  },
  preview: {
    port: 5173,
    strictPort: true,
    host: true,
  }
});