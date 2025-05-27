import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';

// https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    https: {
      key: fs.readFileSync('./test-spotify-site.local-key.pem'),
      cert: fs.readFileSync('./test-spotify-site.local.pem'),
    },
    host: 'test-spotify-site.local',
  }
})
