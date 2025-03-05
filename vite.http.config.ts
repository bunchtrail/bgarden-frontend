import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      configPath: './tailwind.config.cjs',
    }),
  ],
  css: {
    postcss: './postcss.config.cjs',
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:7254', // Адрес бэкенда по HTTP
        changeOrigin: true,
      },
    },
  },
}) 