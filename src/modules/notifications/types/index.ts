/**
 * Типы уведомлений
 */
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

/**
 * Интерфейс для уведомления
 */
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  autoClose?: boolean;
  duration?: number;
  icon?: React.ReactNode;
}

/**
 * Параметры для создания уведомления
 */
export interface NotificationOptions {
  type: NotificationType;
  message: string;
  autoClose?: boolean;
  duration?: number;
  icon?: React.ReactNode;
}

/**
 * Интерфейс контекста уведомлений
 */
export interface NotificationContextType {
  notifications: Notification[];
  showNotification: (options: NotificationOptions) => string;
  hideNotification: (id: string) => void;
  hideAllNotifications: () => void;
} 