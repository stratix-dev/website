import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: 'stratixdev.com',
    port: 3000,
    strictPort: true,
    open: true
  }
})
