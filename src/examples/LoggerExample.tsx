import React, { useState, useEffect } from 'react';
import { useLogger, useComponentLogger, useErrorLogger, usePerformanceLogger } from '../hooks/useLogger';
import { logger, LogLevel } from '../utils/logger';

/**
 * Пример использования системы логгирования
 * Этот компонент демонстрирует все возможности системы логгирования
 */
const LoggerExample: React.FC = () => {
  // Различные способы использования логгера
  const basicLog = useLogger('LoggerExample');
  const componentLog = useComponentLogger('LoggerExample');
  const logError = useErrorLogger('LoggerExample');
  const { startTimer, endTimer, measureAsync } = usePerformanceLogger('LoggerExample');

  const [counter, setCounter] = useState(0);
  const [data, setData] = useState<any>(null);

  // Логгирование жизненного цикла компонента
  useEffect(() => {
    basicLog.info('Компонент LoggerExample смонтирован');
    
    return () => {
      basicLog.info('Компонент LoggerExample размонтирован');
    };
  }, [basicLog]);

  // Логгирование изменений состояния
  useEffect(() => {
    if (counter > 0) {
      componentLog.debug(`Счетчик изменился: ${counter}`, { previousValue: counter - 1 });
    }
  }, [counter, componentLog]);

  // Пример базового логгирования
  const handleBasicLogging = () => {
    basicLog.debug('Отладочное сообщение', { timestamp: new Date().toISOString() });
    basicLog.info('Информационное сообщение', { action: 'basic_logging' });
    basicLog.warn('Предупреждение о чем-то важном', { level: 'warning' });
  };

  // Пример логгирования ошибок
  const handleErrorLogging = () => {
    try {
      // Симуляция ошибки
      throw new Error('Симулированная ошибка для демонстрации');
    } catch (error) {
      logError('Произошла ошибка в примере', error, { context: 'handleErrorLogging' });
    }

    // Различные типы ошибок
    logError('Ошибка API', { status: 500, message: 'Internal Server Error' });
    logError('Строковая ошибка', 'Что-то пошло не так');
  };

  // Пример измерения производительности
  const handlePerformanceLogging = () => {
    // Синхронное измерение
    startTimer('sync-operation');
    
    // Симуляция работы
    for (let i = 0; i < 1000000; i++) {
      Math.random();
    }
    
    endTimer('sync-operation', 'Завершена синхронная операция');
  };

  // Пример асинхронного измерения производительности
  const handleAsyncPerformanceLogging = async () => {
    try {
      const result = await measureAsync('api-simulation', async () => {
        // Симуляция API запроса
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
        return { data: 'Симулированные данные', timestamp: Date.now() };
      }, 'API запрос завершен');

      setData(result);
      basicLog.info('Данные получены успешно', result);
    } catch (error) {
      logError('Ошибка при получении данных', error);
    }
  };

  // Пример конфигурации логгера
  const handleConfigureLogger = () => {
    const currentLevel = logger.getConfig().level;
    const newLevel = currentLevel === LogLevel.DEBUG ? LogLevel.INFO : LogLevel.DEBUG;
    
    logger.configure({
      level: newLevel,
      prefix: `[Example:${Date.now()}]`
    });

    basicLog.info(`Уровень логгирования изменен с ${LogLevel[currentLevel]} на ${LogLevel[newLevel]}`);
  };

  // Пример экспорта логов
  const handleExportLogs = () => {
    const logs = logger.exportLogs();
    const blob = new Blob([logs], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logger-example-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    basicLog.info('Логи экспортированы', { format: 'JSON' });
  };

  // Пример очистки логов
  const handleClearLogs = () => {
    const logsCount = logger.getLogs().length;
    logger.clearLogs();
    basicLog.info(`Очищено ${logsCount} записей логов`);
  };

  // Пример модульного логгирования
  const handleModuleLogging = () => {
    const authLogger = logger.createModuleLogger('Authentication');
    const apiLogger = logger.createModuleLogger('ApiService');
    const uiLogger = logger.createModuleLogger('UserInterface');

    authLogger.info('Пользователь вошел в систему', { userId: '12345' });
    apiLogger.warn('Медленный ответ API', { duration: '2.5s', endpoint: '/api/data' });
    uiLogger.debug('Компонент перерендерился', { component: 'UserProfile' });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Пример использования системы логгирования
      </h1>
      
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-lg font-semibold mb-2 text-blue-800">
          Информация
        </h2>
        <p className="text-blue-700">
          Этот компонент демонстрирует различные способы использования системы логгирования. 
          Откройте просмотрщик логов (Ctrl+Shift+L) чтобы увидеть результаты.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Базовое логгирование */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-3">Базовое логгирование</h3>
          <button
            onClick={handleBasicLogging}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Создать базовые логи
          </button>
        </div>

        {/* Логгирование ошибок */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-3">Логгирование ошибок</h3>
          <button
            onClick={handleErrorLogging}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Создать ошибки
          </button>
        </div>

        {/* Измерение производительности */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-3">Производительность</h3>
          <div className="space-y-2">
            <button
              onClick={handlePerformanceLogging}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Синхронное измерение
            </button>
            <button
              onClick={handleAsyncPerformanceLogging}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Асинхронное измерение
            </button>
          </div>
        </div>

        {/* Конфигурация */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-3">Конфигурация</h3>
          <button
            onClick={handleConfigureLogger}
            className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Изменить уровень
          </button>
        </div>

        {/* Управление логами */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-3">Управление</h3>
          <div className="space-y-2">
            <button
              onClick={handleExportLogs}
              className="w-full px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              Экспорт логов
            </button>
            <button
              onClick={handleClearLogs}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Очистить логи
            </button>
          </div>
        </div>

        {/* Модульное логгирование */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-3">Модули</h3>
          <button
            onClick={handleModuleLogging}
            className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Логи модулей
          </button>
        </div>
      </div>

      {/* Счетчик для демонстрации отслеживания состояния */}
      <div className="mt-6 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold mb-3">Отслеживание состояния</h3>
        <div className="flex items-center gap-4">
          <span>Счетчик: {counter}</span>
          <button
            onClick={() => setCounter(c => c + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Увеличить
          </button>
          <button
            onClick={() => setCounter(0)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Сбросить
          </button>
        </div>
      </div>

      {/* Отображение полученных данных */}
      {data && (
        <div className="mt-6 p-4 border border-green-200 bg-green-50 rounded-lg">
          <h3 className="font-semibold mb-3 text-green-800">Полученные данные</h3>
          <pre className="text-sm text-green-700 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      {/* Статистика логов */}
      <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h3 className="font-semibold mb-3">Статистика логов</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Всего:</span> {logger.getLogs().length}
          </div>
          <div>
            <span className="font-medium">Ошибки:</span> {logger.getLogs(LogLevel.ERROR).length}
          </div>
          <div>
            <span className="font-medium">Предупреждения:</span> {logger.getLogs(LogLevel.WARN).length}
          </div>
          <div>
            <span className="font-medium">Информация:</span> {logger.getLogs(LogLevel.INFO).length}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold mb-2 text-yellow-800">Горячие клавиши</h3>
        <p className="text-yellow-700 text-sm">
          Нажмите <kbd className="px-2 py-1 bg-yellow-200 rounded text-xs">Ctrl + Shift + L</kbd> 
          для открытия просмотрщика логов
        </p>
      </div>
    </div>
  );
};

export default LoggerExample; 