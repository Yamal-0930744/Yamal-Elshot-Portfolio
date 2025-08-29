import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Yamal-Elshot-Portfolio/'   // <= replace with your repo name
})
