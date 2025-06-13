import React, { useState, useEffect, useRef } from 'react';
import { logger, LogLevel, LogEntry } from '../utils/logger';

interface LogViewerProps {
  isVisible?: boolean;
  onClose?: () => void;
  maxHeight?: string;
  refreshInterval?: number;
}

const LogViewer: React.FC<LogViewerProps> = ({
  isVisible = false,
  onClose,
  maxHeight = '400px',
  refreshInterval = 1000
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | undefined>(undefined);
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Получение логов
  const refreshLogs = () => {
    const allLogs = logger.getLogs(selectedLevel, selectedModule || undefined);
    const filteredLogs = searchTerm 
      ? allLogs.filter(log => 
          log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (log.module && log.module.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      : allLogs;
    
    setLogs(filteredLogs);
  };

  // Автообновление логов
  useEffect(() => {
    if (!isVisible) return;

    refreshLogs();
    const interval = setInterval(refreshLogs, refreshInterval);
    return () => clearInterval(interval);
  }, [isVisible, selectedLevel, selectedModule, searchTerm, refreshInterval]);

  // Автопрокрутка к концу
  useEffect(() => {
    if (isAutoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isAutoScroll]);

  // Получение уникальных модулей
  const availableModules = Array.from(
    new Set(logger.getLogs().map(log => log.module).filter(Boolean))
  );

  // Форматирование времени
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU');
  };

  // Стили для разных уровней логов
  const getLevelStyles = (level: LogLevel) => {
    switch (level) {
      case LogLevel.DEBUG:
        return 'text-gray-600 bg-gray-50';
      case LogLevel.INFO:
        return 'text-blue-600 bg-blue-50';
      case LogLevel.WARN:
        return 'text-yellow-600 bg-yellow-50';
      case LogLevel.ERROR:
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Получение названия уровня
  const getLevelName = (level: LogLevel) => {
    return LogLevel[level];
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Просмотр логов</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Панель управления */}
        <div className="p-4 border-b bg-gray-50 space-y-3">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Фильтр по уровню */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Уровень:</label>
              <select
                value={selectedLevel ?? ''}
                onChange={(e) => setSelectedLevel(e.target.value ? Number(e.target.value) : undefined)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="">Все</option>
                <option value={LogLevel.DEBUG}>DEBUG</option>
                <option value={LogLevel.INFO}>INFO</option>
                <option value={LogLevel.WARN}>WARN</option>
                <option value={LogLevel.ERROR}>ERROR</option>
              </select>
            </div>

            {/* Фильтр по модулю */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Модуль:</label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="">Все</option>
                {availableModules.map(module => (
                  <option key={module} value={module}>{module}</option>
                ))}
              </select>
            </div>

            {/* Поиск */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Поиск:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Поиск в логах..."
                className="border border-gray-300 rounded px-2 py-1 text-sm w-48"
              />
            </div>

            {/* Автопрокрутка */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isAutoScroll}
                onChange={(e) => setIsAutoScroll(e.target.checked)}
                className="rounded"
              />
              Автопрокрутка
            </label>
          </div>

          {/* Кнопки управления */}
          <div className="flex gap-2">
            <button
              onClick={() => logger.clearLogs()}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              Очистить логи
            </button>
            <button
              onClick={() => {
                const logsData = logger.exportLogs();
                const blob = new Blob([logsData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `logs_${new Date().toISOString().slice(0, 19)}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Экспорт логов
            </button>
            <button
              onClick={refreshLogs}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              Обновить
            </button>
          </div>

          {/* Статистика */}
          <div className="text-sm text-gray-600">
            Показано записей: {logs.length} из {logger.getLogs().length}
          </div>
        </div>

        {/* Список логов */}
        <div 
          className="flex-1 overflow-auto p-4 font-mono text-sm"
          style={{ maxHeight }}
        >
          {logs.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              Нет записей для отображения
            </div>
          ) : (
            <div className="space-y-1">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`p-2 rounded border-l-4 ${getLevelStyles(log.level)}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatTime(log.timestamp)}
                    </span>
                    <span className="text-xs font-semibold px-1 rounded">
                      {getLevelName(log.level)}
                    </span>
                    {log.module && (
                      <span className="text-xs bg-gray-200 px-1 rounded">
                        {log.module}
                      </span>
                    )}
                    <span className="flex-1">
                      {log.message}
                    </span>
                  </div>
                  
                  {log.data && (
                    <div className="mt-1 ml-8 text-xs text-gray-600">
                      <details>
                        <summary className="cursor-pointer">Данные</summary>
                        <pre className="mt-1 whitespace-pre-wrap bg-gray-100 p-2 rounded text-xs">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                  
                  {log.error && (
                    <div className="mt-1 ml-8 text-xs text-red-600">
                      <details>
                        <summary className="cursor-pointer">Ошибка</summary>
                        <pre className="mt-1 whitespace-pre-wrap bg-red-50 p-2 rounded text-xs">
                          {log.error.stack || log.error.message}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogViewer; 