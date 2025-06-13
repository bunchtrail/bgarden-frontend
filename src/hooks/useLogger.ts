import { useCallback, useMemo } from 'react';
import { logger, LogLevel } from '../utils/logger';

interface UseLoggerReturn {
  debug: (message: string, data?: any) => void;
  info: (message: string, data?: any) => void;
  warn: (message: string, data?: any) => void;
  error: (message: string, data?: any, error?: Error) => void;
  configure: (config: any) => void;
  getLogs: (level?: LogLevel, module?: string) => any[];
  clearLogs: () => void;
  exportLogs: () => string;
}

/**
 * Хук для использования логгера в React компонентах
 * @param moduleName - Название модуля для автоматической привязки к логам
 * @returns Объект с методами логгирования
 */
export const useLogger = (moduleName?: string): UseLoggerReturn => {
  // Создаем методы логгирования с привязкой к модулю
  const debug = useCallback((message: string, data?: any) => {
    logger.debug(message, moduleName, data);
  }, [moduleName]);

  const info = useCallback((message: string, data?: any) => {
    logger.info(message, moduleName, data);
  }, [moduleName]);

  const warn = useCallback((message: string, data?: any) => {
    logger.warn(message, moduleName, data);
  }, [moduleName]);

  const error = useCallback((message: string, data?: any, errorObj?: Error) => {
    logger.error(message, moduleName, data, errorObj);
  }, [moduleName]);

  // Методы управления логгером
  const configure = useCallback((config: any) => {
    logger.configure(config);
  }, []);

  const getLogs = useCallback((level?: LogLevel, module?: string) => {
    return logger.getLogs(level, module);
  }, []);

  const clearLogs = useCallback(() => {
    logger.clearLogs();
  }, []);

  const exportLogs = useCallback(() => {
    return logger.exportLogs();
  }, []);

  // Мемоизируем возвращаемый объект
  const loggerMethods = useMemo(() => ({
    debug,
    info,
    warn,
    error,
    configure,
    getLogs,
    clearLogs,
    exportLogs
  }), [debug, info, warn, error, configure, getLogs, clearLogs, exportLogs]);

  return loggerMethods;
};

/**
 * Хук для создания логгера с автоматическим определением модуля по имени компонента
 * @param componentName - Имя компонента (можно получить через displayName или вручную)
 * @returns Объект с методами логгирования
 */
export const useComponentLogger = (componentName: string): UseLoggerReturn => {
  return useLogger(`Component:${componentName}`);
};

/**
 * Хук для логгирования ошибок с автоматической обработкой
 * @param moduleName - Название модуля
 * @returns Функция для логгирования ошибок с дополнительной обработкой
 */
export const useErrorLogger = (moduleName?: string) => {
  const { error } = useLogger(moduleName);

  const logError = useCallback((
    message: string,
    errorObj?: Error | any,
    additionalData?: any
  ) => {
    // Определяем тип ошибки
    let processedError: Error | undefined;
    let processedData = additionalData;

    if (errorObj instanceof Error) {
      processedError = errorObj;
    } else if (errorObj && typeof errorObj === 'object') {
      // Если это объект ошибки (например, от API)
      processedData = { ...additionalData, errorDetails: errorObj };
      if (errorObj.message) {
        processedError = new Error(errorObj.message);
      }
    } else if (typeof errorObj === 'string') {
      processedError = new Error(errorObj);
    }

    error(message, processedData, processedError);
  }, [error]);

  return logError;
};

/**
 * Хук для логгирования производительности
 * @param moduleName - Название модуля
 * @returns Объект с методами для измерения производительности
 */
export const usePerformanceLogger = (moduleName?: string) => {
  const { debug, info } = useLogger(moduleName);
  const timers = useMemo(() => new Map<string, number>(), []);

  const startTimer = useCallback((timerName: string) => {
    const startTime = performance.now();
    timers.set(timerName, startTime);
    debug(`Timer started: ${timerName}`);
  }, [debug, timers]);

  const endTimer = useCallback((timerName: string, additionalMessage?: string) => {
    const startTime = timers.get(timerName);
    if (startTime === undefined) {
      debug(`Timer '${timerName}' was not started`);
      return 0;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    timers.delete(timerName);

    const message = additionalMessage 
      ? `${additionalMessage} - Duration: ${duration.toFixed(2)}ms`
      : `Timer '${timerName}' completed in ${duration.toFixed(2)}ms`;

    info(message, { timer: timerName, duration });
    return duration;
  }, [info, timers, debug]);

  const measureAsync = useCallback(async <T>(
    timerName: string,
    asyncOperation: () => Promise<T>,
    additionalMessage?: string
  ): Promise<T> => {
    startTimer(timerName);
    try {
      const result = await asyncOperation();
      endTimer(timerName, additionalMessage);
      return result;
    } catch (error) {
      endTimer(timerName, `${additionalMessage || timerName} - Failed`);
      throw error;
    }
  }, [startTimer, endTimer]);

  return {
    startTimer,
    endTimer,
    measureAsync
  };
};

export default useLogger; 