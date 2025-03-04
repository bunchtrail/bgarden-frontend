import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CERT_DIR = path.resolve(__dirname, '../certificates');

// Создаем директорию, если она не существует
if (!fs.existsSync(CERT_DIR)) {
  fs.mkdirSync(CERT_DIR, { recursive: true });
}

console.log('Генерация доверенных сертификатов с помощью mkcert...');

// Путь к сертификатам
const keyPath = path.join(CERT_DIR, 'key.pem');
const certPath = path.join(CERT_DIR, 'cert.pem');

// Инициализация mkcert и установка CA в системное хранилище
exec('npx mkcert -install', (error, stdout, stderr) => {
  if (error) {
    console.error(`Ошибка при установке mkcert CA: ${error.message}`);
    console.error('Продолжаем без добавления CA в системное хранилище...');
  } else {
    console.log('mkcert CA успешно установлен в системное хранилище');
    console.log(stdout);
  }

  // Генерация сертификатов для localhost
  exec(
    `npx mkcert -key-file ${keyPath} -cert-file ${certPath} localhost 127.0.0.1 ::1`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Ошибка при генерации сертификатов: ${error.message}`);
        process.exit(1);
      } else {
        console.log('Сертификаты успешно сгенерированы:');
        console.log(`- Ключ: ${keyPath}`);
        console.log(`- Сертификат: ${certPath}`);
        console.log(stdout);
        console.log('\nТеперь вы можете запустить приложение с HTTPS:');
        console.log('npm run dev:https');
      }
    }
  );
});
