import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Listen on all interfaces (IPv4 + IPv6) so http://localhost:5173 and
  // http://127.0.0.1:5173 both work regardless of how the OS/browser
  // resolves "localhost".
  server: { host: true, port: 5173, strictPort: true },
})
