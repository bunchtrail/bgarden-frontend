import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Notification,
  NotificationContextType,
  NotificationOptions,
  NotificationType
} from '../types';

// Создаем контекст с значением по умолчанию undefined
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
  maxNotifications?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  maxNotifications = 5
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /**
   * Показывает новое уведомление
   */
  const showNotification = (options: NotificationOptions): string => {
    const id = `notification-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const notification: Notification = {
      id,
      type: options.type,
      message: options.message,
      autoClose: options.autoClose ?? true,
      duration: options.duration ?? 3000,
      icon: options.icon
    };

    setNotifications(prevNotifications => {
      // Удаляем старые уведомления, если превышен лимит
      const updatedNotifications = [notification, ...prevNotifications];
      if (updatedNotifications.length > maxNotifications) {
        return updatedNotifications.slice(0, maxNotifications);
      }
      return updatedNotifications;
    });

    // Автозакрытие уведомления, если включено
    if (notification.autoClose) {
      setTimeout(() => {
        hideNotification(id);
      }, notification.duration);
    }

    return id;
  };

  /**
   * Скрывает указанное уведомление
   */
  const hideNotification = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  /**
   * Скрывает все уведомления
   */
  const hideAllNotifications = () => {
    setNotifications([]);
  };

  // Значение контекста
  const value: NotificationContextType = {
    notifications,
    showNotification,
    hideNotification,
    hideAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Хук для использования контекста уведомлений
 */
export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
};

export default NotificationContext; 