import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'

// Проверка наличия сертификатов
const hasCertificates = () => {
  try {
    return fs.existsSync(path.resolve(__dirname, './certificates/key.pem')) && 
           fs.existsSync(path.resolve(__dirname, './certificates/cert.pem'))
  } catch (_) {
    return false
  }
}

// https://vite.dev/config/
// ПРИМЕЧАНИЕ: В Vite 6.x флаг --https в командной строке не работает.
// HTTPS настраивается только через конфигурацию в этом файле.
export default defineConfig(() => {
  const config: any = {
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
          target: 'https://localhost:7254',
          changeOrigin: true,
          secure: false, // Для самоподписанных сертификатов сервера
        },
      },
    },
  }

  // Добавляем HTTPS только если сертификаты существуют
  if (hasCertificates()) {
    try {
      config.server.https = {
        key: fs.readFileSync(path.resolve(__dirname, './certificates/key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, './certificates/cert.pem')),
      }
      } catch (_) {
      // Ошибка при загрузке SSL сертификатов
    }
  }

  return config
})
