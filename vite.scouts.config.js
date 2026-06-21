import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/* Build config for the standalone Scouts demo. Outputs to dist-scouts/
 * with scouts.html as the entry; we rename it to index.html in the
 * `build:scouts` npm script so Netlify serves it at the site root. */
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_SCOUTS_STANDALONE': JSON.stringify('true'),
  },
  build: {
    outDir: 'dist-scouts',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'scouts.html'),
    },
  },
})
