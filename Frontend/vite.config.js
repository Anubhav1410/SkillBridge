import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Dev-only: proxy API calls to the backend so the frontend can use
  // relative paths (same as the all-in-one production deployment).
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
