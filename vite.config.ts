import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'

// Проверка наличия сертификатов
const hasCertificates = () => {
  try {
    return fs.existsSync(path.resolve(__dirname, './certificates/key.pem')) && 
           fs.existsSync(path.resolve(__dirname, './certificates/cert.pem'))
  } catch (e) {
    return false
  }
}

// https://vite.dev/config/
// ПРИМЕЧАНИЕ: В Vite 6.x флаг --https в командной строке не работает.
// HTTPS настраивается только через конфигурацию в этом файле.
export default defineConfig(({ command, mode }) => {
  const config = {
    plugins: [react()],
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
      console.log('HTTPS сертификаты найдены и загружены успешно.')
    } catch (error) {
      console.error('Ошибка при загрузке SSL сертификатов:', error)
      console.log('Запуск сервера будет выполнен без HTTPS.')
    }
  } else {
    console.log('SSL сертификаты не найдены. Запуск сервера будет выполнен без HTTPS.')
    console.log('Для генерации сертификатов выполните: npm run generate-certs')
  }

  return config
})
