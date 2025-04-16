import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: fileURLToPath(new URL('./popup.html', import.meta.url)),
        "service-worker": fileURLToPath(new URL('./src/background/service-worker.ts', import.meta.url))
      },
      output: {

        entryFileNames: chunk => {
          if (chunk.name === 'service-worker') {
            return 'background/service-worker.js'
          }
          return 'assets/[name].js'
        }
      }
    }
  }
})
