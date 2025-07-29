import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js' // ✅ This is correct
  },
  server: {
    port: 8080,
    historyApiFallback: true       // ✅ This must be outside of css
  }
})
