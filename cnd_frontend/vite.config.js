import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: [
      'cndofftakencr.in',
      'www.cndofftakencr.in'
    ],
    hmr: {
      protocol: 'wss',
      host: 'cndofftakencr.in',
      clientPort: 443
    }
  }
})