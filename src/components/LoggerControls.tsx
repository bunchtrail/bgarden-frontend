import React, { useState, useEffect } from 'react';
import LogViewer from './LogViewer';
import { logger, LogLevel } from '../utils/logger';

interface LoggerControlsProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showInProduction?: boolean;
  shortcut?: string; // например, 'ctrl+shift+l'
}

const LoggerControls: React.FC<LoggerControlsProps> = ({
  position = 'bottom-right',
  showInProduction = false,
  shortcut = 'ctrl+shift+l'
}) => {
  const [isLogViewerOpen, setIsLogViewerOpen] = useState(false);
  const [logCount, setLogCount] = useState(0);
  const [hasNewErrors, setHasNewErrors] = useState(false);

  // Проверяем, показывать ли в продакшене
  const shouldShow = process.env.NODE_ENV !== 'production' || showInProduction;

  // Обновление счетчика логов
  useEffect(() => {
    const updateLogCount = () => {
      const logs = logger.getLogs();
      setLogCount(logs.length);
      
      // Проверяем наличие новых ошибок
      const recentErrors = logs.filter(log => 
        log.level === LogLevel.ERROR && 
        Date.now() - log.timestamp.getTime() < 5000 // последние 5 секунд
      );
      setHasNewErrors(recentErrors.length > 0);
    };

    updateLogCount();
    const interval = setInterval(updateLogCount, 1000);
    return () => clearInterval(interval);
  }, []);

  // Обработка горячих клавиш
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Парсим комбинацию клавиш
      const keys = shortcut.toLowerCase().split('+');
      const ctrlRequired = keys.includes('ctrl');
      const shiftRequired = keys.includes('shift');
      const altRequired = keys.includes('alt');
      const key = keys.find(k => !['ctrl', 'shift', 'alt'].includes(k));

      if (
        (!ctrlRequired || event.ctrlKey) &&
        (!shiftRequired || event.shiftKey) &&
        (!altRequired || event.altKey) &&
        event.key.toLowerCase() === key
      ) {
        event.preventDefault();
        setIsLogViewerOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [shortcut]);

  // Стили позиционирования
  const getPositionStyles = () => {
    const base = 'fixed z-40';
    switch (position) {
      case 'top-left':
        return `${base} top-4 left-4`;
      case 'top-right':
        return `${base} top-4 right-4`;
      case 'bottom-left':
        return `${base} bottom-4 left-4`;
      case 'bottom-right':
      default:
        return `${base} bottom-4 right-4`;
    }
  };

  if (!shouldShow) return null;

  return (
    <>
      {/* Плавающая кнопка */}
      <div className={getPositionStyles()}>
        <button
          onClick={() => setIsLogViewerOpen(true)}
          className={`
            relative p-3 rounded-full shadow-lg transition-all duration-200 
            ${hasNewErrors 
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }
            ${isLogViewerOpen ? 'opacity-50' : 'opacity-90 hover:opacity-100'}
          `}
          title={`Открыть логи (${shortcut})`}
        >
          {/* Иконка консоли */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="4,17 10,11 4,5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>

          {/* Счетчик логов */}
          {logCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-500 text-xs text-black rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
              {logCount > 99 ? '99+' : logCount}
            </span>
          )}

          {/* Индикатор новых ошибок */}
          {hasNewErrors && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-ping"></span>
          )}
        </button>
      </div>

      {/* Viewer логов */}
      <LogViewer
        isVisible={isLogViewerOpen}
        onClose={() => setIsLogViewerOpen(false)}
      />
    </>
  );
};

export default LoggerControls; 