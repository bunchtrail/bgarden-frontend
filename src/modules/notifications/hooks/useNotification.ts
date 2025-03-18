import { useNotifications, NotificationType } from '../contexts/NotificationContext';

interface NotificationOptions {
  title?: string;
  duration?: number;
  dismissible?: boolean;
}

const useNotification = () => {
  const { addNotification } = useNotifications();

  const showNotification = (
    type: NotificationType, 
    message: string, 
    options?: NotificationOptions
  ) => {
    addNotification({
      type,
      message,
      ...options
    });
  };

  const success = (message: string, options?: NotificationOptions) => {
    showNotification('success', message, options);
  };

  const error = (message: string, options?: NotificationOptions) => {
    showNotification('error', message, options);
  };

  const warning = (message: string, options?: NotificationOptions) => {
    showNotification('warning', message, options);
  };

  const info = (message: string, options?: NotificationOptions) => {
    showNotification('info', message, options);
  };

  return {
    success,
    error,
    warning,
    info,
    notify: showNotification
  };
};

export default useNotification; 