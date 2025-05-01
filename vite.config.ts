import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/popup.html'),
        offscreen: resolve(__dirname, 'src/offscreen/offscreen.html'),
        'service-worker': resolve(__dirname, 'src/background/service-worker.ts')
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === 'service-worker') return 'background/service-worker.js';
          if (chunk.name === 'popup') return 'assets/popup.js';
          if (chunk.name === 'offscreen') return 'assets/offscreen.js';
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (name?.endsWith('.html')) return 'src/[name].[ext]'; // HTML still goes to dist/src/
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  }
});
