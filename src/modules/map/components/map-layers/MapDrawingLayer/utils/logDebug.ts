// MapDrawingLayer/utils/logDebug.ts

import { mapLogger } from '../../../../utils/logger';

/**
 * Легковесная функция для логирования отладочной информации.
 * В продакшне можно скрывать вывод (или использовать более сложный механизм).
 */
export const logDebug = (message: string, data?: any) => {
  mapLogger.log(message, data);
};
  