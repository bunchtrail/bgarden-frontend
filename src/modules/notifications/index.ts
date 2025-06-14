export { NotificationProvider, useNotifications } from './contexts/NotificationContext';
export { default as NotificationContainer } from './components/NotificationContainer';
export { default as NotificationItem } from './components/NotificationItem';
export { default as useNotification } from './hooks/useNotification';
export { 
  notificationStyles, 
  getNotificationClasses, 
  notificationIconColors,
  darkNotificationStyles 
} from './styles';
export type { Notification, NotificationType } from './contexts/NotificationContext'; 