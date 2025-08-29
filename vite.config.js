// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Yamal-Elshot-Portfolio/',   // 👈 must match your repo name + trailing slash
})
