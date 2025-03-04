import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
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

  console.log('Запуск сервера по HTTP на порту 3000')
  return config
}) 