/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// In development the API runs on :5000; the proxy keeps requests same-origin so login cookies just work.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy: { '/api': { target: process.env.API_URL || 'http://localhost:5000', changeOrigin: false } } },
})
