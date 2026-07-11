import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

/**
 * HEBRA build configuration.
 *
 * - `base: './'` — the experience deploys to GitHub Pages under a
 *   sub-path today and may live on its own domain tomorrow; relative
 *   asset URLs survive both.
 * - Manual chunks keep the first paint light: the rendering stack and
 *   the direction stack ship as separate long-cache bundles.
 */
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          rendering: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing', 'postprocessing'],
          direction: ['@theatre/core', '@theatre/r3f', 'gsap', 'lenis'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
});
