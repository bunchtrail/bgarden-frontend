import React, { useState, useEffect, useCallback } from 'react';
import { Notification, useNotifications } from '../contexts/NotificationContext';
import { 
  notificationStyles, 
  getNotificationClasses, 
  notificationIconColors,
  darkNotificationStyles 
} from '../styles';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { removeNotification } = useNotifications();
  const { id, type, title, message, dismissible, duration } = notification;
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Определяем функцию handleDismiss
  const handleDismiss = useCallback(() => {
    if (isExiting) return;        // защита от повторного клика
    setIsExiting(true);

    setTimeout(() => {
      removeNotification(id);
    }, 300); // длина анимации
  }, [id, removeNotification, isExiting]);

  // Эффект для начальной анимации появления
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(timer);
  }, []);

  // Эффект для автоматического удаления
  useEffect(() => {
    if (!duration || duration <= 0) return;
    
    const dismissTimer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(dismissTimer);
  }, [duration, handleDismiss]);

  // Определяем CSS классы для анимации
  const getAnimationState = (): 'initial' | 'enter' | 'exit' => {
    if (isExiting) return 'exit';
    if (isVisible) return 'enter';
    return 'initial';
  };

  const notificationClasses = [
    getNotificationClasses(type as 'success' | 'error' | 'warning' | 'info', getAnimationState()),
    darkNotificationStyles.item.base,
    darkNotificationStyles.item[type as keyof typeof darkNotificationStyles.item],
  ].join(' ');

  return (
    <div 
      id={`notification-${id}`}
      className={notificationClasses}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className={notificationStyles.content.layout}>
        {/* Иконка уведомления */}
        <div className={notificationStyles.content.icon}>
          {getNotificationIcon(type)}
        </div>
        
        {/* Содержимое уведомления */}
        <div className={notificationStyles.content.body}>
          {title && (
            <h3 className={`${notificationStyles.content.title} ${darkNotificationStyles.content.title}`}>
              {title}
            </h3>
          )}
          <div className={`${notificationStyles.content.message} ${darkNotificationStyles.content.message}`}>
            {message}
          </div>
        </div>
        
        {/* Кнопка закрытия */}
        {dismissible && (
          <button
            type="button"
            className={`${notificationStyles.closeButton} ${darkNotificationStyles.closeButton}`}
            aria-label="Закрыть уведомление"
            onClick={handleDismiss}
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={2}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Функция для получения иконки уведомления
const getNotificationIcon = (type: string): React.ReactElement => {
  const iconColor = notificationIconColors[type as keyof typeof notificationIconColors] || notificationIconColors.info;
  
  const iconProps = {
    className: `w-5 h-5 ${iconColor}`,
    fill: "currentColor",
    viewBox: "0 0 20 20"
  };

  switch (type) {
    case 'success':
      return (
        <svg {...iconProps}>
          <path 
            fillRule="evenodd" 
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
            clipRule="evenodd" 
          />
        </svg>
      );
    
    case 'error':
      return (
        <svg {...iconProps}>
          <path 
            fillRule="evenodd" 
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
            clipRule="evenodd" 
          />
        </svg>
      );
    
    case 'warning':
      return (
        <svg {...iconProps}>
          <path 
            fillRule="evenodd" 
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
            clipRule="evenodd" 
          />
        </svg>
      );
    
    case 'info':
    default:
      return (
        <svg {...iconProps}>
          <path 
            fillRule="evenodd" 
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" 
            clipRule="evenodd" 
          />
        </svg>
      );
  }
};

export default NotificationItem; 