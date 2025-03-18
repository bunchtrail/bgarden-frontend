import { setNotificationHandler } from '../services/httpClient';

// Функция для логирования ошибок (может использоваться, если нет доступа к хуку useNotification)
export const logError = (message: string, error?: any) => {
  if (error) {
    console.error(message, error);
  } else {
    console.error(message);
  }
  // В production можно отправлять ошибки в систему мониторинга
};

// Функция для логирования предупреждений
export const logWarning = (message: string) => {
  console.warn(message);
  // В production можно отправлять предупреждения в систему мониторинга
};

// Функция для логирования информации
export const logInfo = (message: string) => {
  console.info(message);
  // В production можно отправлять информацию в систему мониторинга
};

export default {
  error: logError,
  warning: logWarning,
  info: logInfo
}; 