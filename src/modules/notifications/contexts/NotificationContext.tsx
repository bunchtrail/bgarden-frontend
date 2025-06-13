import React, { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
  dismissible?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications должен использоваться внутри NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Используем ref для хранения последних отправленных уведомлений
  const recentNotificationsRef = useRef<Record<string, number>>({});

  // Функция для удаления уведомления по id
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  /**
   * Добавляет новое уведомление, предотвращая дублирование сообщений,
   * отправленных в течение последней секунды с теми же параметрами.
   */
  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const now = Date.now();
    const key = `${notification.type}|${notification.title ?? ''}|${notification.message}`;

    // Если уже есть такое уведомление, отправленное менее секунды назад — игнорируем
    const lastTime = recentNotificationsRef.current[key];
    if (lastTime && now - lastTime < 1000) {
      return;
    }
    recentNotificationsRef.current[key] = now;

    const id = `${now}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      dismissible: notification.dismissible ?? true,
      duration: notification.duration ?? 5000,
    };

    setNotifications((prev) => [...prev, newNotification]);

    // Автоматическое удаление уведомления через указанное время
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
        // Удаляем запись о последнем времени, чтобы разрешить повторные уведомления позже
        delete recentNotificationsRef.current[key];
      }, newNotification.duration);
    } else {
      // Если уведомление бессрочное, очищаем запись через 1 сек., чтобы не блокировать новые
      setTimeout(() => delete recentNotificationsRef.current[key], 1000);
    }
  }, [removeNotification]);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}; 