import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Notification, useNotifications } from '../contexts/NotificationContext';
import '../styles/notification.css';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { removeNotification } = useNotifications();
  const { id, type, title, message, dismissible, duration } = notification;
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Определяем функцию handleDismiss перед использованием в useEffect
  const handleDismiss = useCallback(() => {
    // Если уведомление ещё не успело появиться, сразу удаляем его
    if (!isVisible) {
      removeNotification(id);
      return;
    }

    setIsExiting(true);

    // Регистрируем слушатель события окончания анимации
    if (elementRef.current) {
      const onTransitionEnd = (e: TransitionEvent) => {
        if (e.propertyName === 'opacity' || e.propertyName === 'transform') {
          removeNotification(id);
        }
      };

      elementRef.current.addEventListener('transitionend', onTransitionEnd, { once: true });

      // Подстраховка на случай, если transitionend не сработает
      setTimeout(() => removeNotification(id), 350);
    } else {
      // Запасной вариант, если что-то пошло не так с анимацией
      setTimeout(() => {
        removeNotification(id);
      }, 300);
    }
  }, [id, removeNotification, isVisible]);

  // Используем один эффект для установки видимости с небольшой задержкой
  useEffect(() => {
    // Небольшая задержка для начальной настройки
    requestAnimationFrame(() => {
      setIsVisible(true);
      
      // Регистрируем слушатель события окончания анимации
      if (elementRef.current) {
        elementRef.current.addEventListener('transitionend', (e) => {
          if (e.propertyName === 'opacity' || e.propertyName === 'transform') {
            // Анимация появления завершена
          }
        }, { once: true });
      }
    });
  }, [id]);

  // Отдельный эффект для автоматического удаления
  useEffect(() => {
    if (!duration || duration <= 0) return;
    
    const dismissTimer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(dismissTimer);
  }, [duration, id, handleDismiss]);

  // Упрощаем классы для анимации - используем CSS-переходы вместо keyframes
  const animationClass = isExiting 
    ? 'notification-exit' 
    : (isVisible ? 'notification-enter' : 'notification-initial');

  // Классы для типов уведомлений
  const notificationTypeClass = `notification-${type}`;

  return (
    <div 
      ref={elementRef}
      id={`notification-${id}`}
      className={`p-4 rounded-lg border shadow-md notification-item ${notificationTypeClass} ${animationClass}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getIcon(type)}
        </div>
        <div className="flex-1">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          <div className="text-sm">{message}</div>
        </div>
        {dismissible && (
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-gray-500 rounded-lg inline-flex h-6 w-6 hover:bg-gray-200 notification-close-button"
            aria-label="Закрыть"
            onClick={handleDismiss}
          >
            <span className="sr-only">Закрыть</span>
            <svg className="w-4 h-4 m-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Перемещено в отдельную функцию для улучшения читаемости
const getIcon = (type: string) => {
  const iconColors: Record<string, string> = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  };

  const iconColor = iconColors[type] || iconColors.info;

  switch (type) {
    case 'success':
      return (
        <svg className={`w-5 h-5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    case 'error':
      return (
        <svg className={`w-5 h-5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    case 'warning':
      return (
        <svg className={`w-5 h-5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    case 'info':
    default:
      return (
        <svg className={`w-5 h-5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
  }
};

export default NotificationItem; 