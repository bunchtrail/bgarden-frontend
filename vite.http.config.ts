import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(() => {
  const config = {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:7254', // Адрес бэкенда по HTTP
          changeOrigin: true,
        },
      },
    },
  }

  return config
}) 