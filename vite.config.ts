import { defineConfig } from 'vite';

// Static single-page build. Outputs to /dist for Cloudflare Pages.
// See CLAUDE.md — no backend, no API routes, no frameworks.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    target: 'es2020',
    sourcemap: false,
  },
  server: {
    port: 5173,
  },
});
