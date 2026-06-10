import { defineConfig } from 'vite';

// Static single-page build. Outputs to /dist for Cloudflare Pages.
// See CLAUDE.md — no backend, no API routes, no frameworks.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    target: 'es2020',
    sourcemap: false,
    // Split the large, stable Phaser runtime into its own chunk so gameplay
    // tweaks ship a tiny game chunk and returning players keep Phaser cached.
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
        },
      },
    },
    chunkSizeWarningLimit: 1600,
  },
  server: {
    port: 5173,
  },
});
