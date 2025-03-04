import fs from 'fs';
import { createCertificate } from 'mkcert';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateCertificates() {
  console.log('Генерация SSL-сертификатов для разработки...');

  // Создаем директорию, если она не существует
  const certDir = path.resolve(__dirname, '../certificates');
  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
  }

  try {
    // Создаем сертификат напрямую
    const certificate = await createCertificate({
      domains: ['localhost', '127.0.0.1'],
      validityDays: 365,
      caPath: null, // Используем самоподписанный сертификат
      validFrom: new Date(),
      signatureAlgorithm: 'sha256WithRSAEncryption',
      keySize: 2048,
    });

    // Сохраняем сертификаты
    fs.writeFileSync(path.resolve(certDir, 'cert.pem'), certificate.cert);
    fs.writeFileSync(path.resolve(certDir, 'key.pem'), certificate.key);

    console.log('SSL-сертификаты успешно сгенерированы в папке "certificates"');
  } catch (error) {
    console.error('Ошибка при генерации сертификатов:', error);
  }
}

generateCertificates();
