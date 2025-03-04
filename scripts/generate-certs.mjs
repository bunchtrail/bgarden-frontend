import fs from 'fs';
import forge from 'node-forge';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CERT_DIR = path.resolve(__dirname, '../certificates');

function generateSelfSignedCertificate() {
  console.log('Генерация самоподписанных SSL-сертификатов для разработки...');

  // Создаем директорию, если она не существует
  if (!fs.existsSync(CERT_DIR)) {
    fs.mkdirSync(CERT_DIR, { recursive: true });
  }

  try {
    // Создаем пару RSA ключей
    const keys = forge.pki.rsa.generateKeyPair(2048);

    // Создаем сертификат
    const cert = forge.pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(
      cert.validity.notBefore.getFullYear() + 1
    );

    // Атрибуты для сертификата
    const attrs = [
      { name: 'commonName', value: 'localhost' },
      { name: 'countryName', value: 'RU' },
      { name: 'organizationName', value: 'Botanical Garden Dev' },
      { shortName: 'OU', value: 'Development' },
    ];

    cert.setSubject(attrs);
    cert.setIssuer(attrs); // Самоподписанный
    cert.sign(keys.privateKey);

    // Преобразуем в PEM формат
    const privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);
    const certPem = forge.pki.certificateToPem(cert);

    // Записываем в файлы
    fs.writeFileSync(path.join(CERT_DIR, 'key.pem'), privateKeyPem);
    fs.writeFileSync(path.join(CERT_DIR, 'cert.pem'), certPem);

    console.log('SSL-сертификаты успешно сгенерированы в папке "certificates"');
  } catch (error) {
    console.error('Ошибка при генерации сертификатов:', error);
    process.exit(1);
  }
}

generateSelfSignedCertificate();
