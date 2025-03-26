// MapDrawingLayer/utils/logDebug.ts

/**
 * Легковесная функция для логирования отладочной информации.
 * В продакшне можно скрывать вывод (или использовать более сложный механизм).
 */
export function logDebug(message: string, data?: any) {
    if (process.env.NODE_ENV !== 'production') {
      if (data) {
        console.log(`[MapDrawingLayer] ${message}`, data);
      } else {
        console.log(`[MapDrawingLayer] ${message}`);
      }
    }
  }
  