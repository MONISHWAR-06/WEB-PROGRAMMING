import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT for Electron: use relative paths so dist/index.html
  // can resolve assets when loaded as a local file (file://)
  base: './',
  server: {
    port: 5173,
    open: false
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
