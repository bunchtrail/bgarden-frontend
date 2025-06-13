import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useRef,
  useMemo,
} from 'react';

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
  addNotification: (n: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return ctx;
};

interface Props {
  children: ReactNode;
}

export const NotificationProvider: React.FC<Props> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const recentRef = useRef<Record<string, number>>({});

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback(
    (n: Omit<Notification, 'id'>) => {
      const now = Date.now();
      const dedupeKey = `${n.type}|${n.title ?? ''}|${n.message}`;

      if (recentRef.current[dedupeKey] && now - recentRef.current[dedupeKey] < 1_000) {
        return; // дубликат, отправленный < 1 с назад
      }
      recentRef.current[dedupeKey] = now;

      const id = `${now}-${Math.random().toString(36).slice(2, 9)}`;
      const newNotification: Notification = {
        ...n,
        id,
        duration: n.duration ?? 5_000,
        dismissible: n.dismissible ?? true,
      };

      setNotifications((prev) => [...prev, newNotification]);

      // через секунду снова разрешаем такие же сообщения
      setTimeout(() => delete recentRef.current[dedupeKey], 1_000);
    },
    [],
  );

  const clearAllNotifications = useCallback(() => setNotifications([]), []);

  const contextValue = useMemo(
    () => ({
      notifications,
      addNotification,
      removeNotification,
      clearAllNotifications,
    }),
    [notifications, addNotification, removeNotification, clearAllNotifications],
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}; 