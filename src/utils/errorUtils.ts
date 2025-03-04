/**
 * Утилиты для обработки и форматирования ошибок в приложении
 */

/**
 * Интерфейс для расширенных ошибок API
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string>;
  status?: number;
}

/**
 * Форматирует ошибку для отображения пользователю
 * @param error - Объект ошибки
 * @returns Отформатированное сообщение об ошибке
 */
export const formatErrorMessage = (error: any): string => {
  if (!error) return 'Произошла неизвестная ошибка';

  // Обработка ошибок в новом формате с полем message
  if (error.message) {
    return error.message;
  }

  // Обработка ошибок в формате Error
  if (error instanceof Error) {
    return error.message;
  }

  // Если ошибка - строка
  if (typeof error === 'string') {
    return error;
  }

  return 'Произошла неизвестная ошибка';
};

/**
 * Определяет тип ошибки по коду или сообщению
 * @param error - Объект ошибки
 * @returns Описание типа ошибки
 */
export const getErrorType = (errorMessage: string) => {
  // Проверяем, является ли ошибка ошибкой авторизации
  if (
    errorMessage.includes('авторизац') ||
    errorMessage.includes('логин') ||
    errorMessage.includes('пароль') ||
    errorMessage.includes('сессия') ||
    errorMessage.includes('войдите') ||
    errorMessage.includes('токен') ||
    errorMessage.includes('401')
  ) {
    return { type: 'auth', color: 'error' };
  }

  // Проверяем, является ли ошибка сетевой ошибкой
  if (
    errorMessage.includes('сеть') ||
    errorMessage.includes('соединение') ||
    errorMessage.includes('подключение') ||
    errorMessage.includes('сервер') ||
    errorMessage.includes('запрос')
  ) {
    return { type: 'network', color: 'warning' };
  }

  // По умолчанию - общая ошибка
  return { type: 'general', color: 'info' };
};

/**
 * Формирует детальное сообщение об ошибке в зависимости от типа
 * @param error - Объект ошибки
 * @returns Детальное сообщение и рекомендации
 */
export const getErrorDetails = (error: any): string | undefined => {
  if (!error) return undefined;

  // Проверяем наличие дополнительных деталей в объекте ошибки
  if (error.statusCode) {
    return `Код ошибки: ${error.statusCode}`;
  }

  return undefined;
};

/**
 * Получает рекомендуемое действие для ошибки
 * @param error - Объект ошибки
 * @returns Текст действия
 */
export const getErrorAction = (errorMessage: string): string | null => {
  const errorType = getErrorType(errorMessage).type;

  if (errorType === 'auth') {
    return 'Войти снова';
  }

  if (errorType === 'network') {
    return 'Повторить';
  }

  return null;
};

/**
 * Проверяет, является ли ошибка критической
 * @param error - Объект ошибки
 * @returns true, если ошибка критическая
 */
export const isCriticalError = (error: unknown): boolean => {
  const { type } = getErrorType(formatErrorMessage(error));
  return type === 'server';
};

/**
 * Объединяет несколько ошибок в одно сообщение
 * @param errors - Массив ошибок
 * @returns Объединенное сообщение об ошибке
 */
export const combineErrors = (errors: unknown[]): string => {
  if (!errors.length) return '';
  
  return errors
    .map(formatErrorMessage)
    .filter(Boolean)
    .join('. ');
}; 