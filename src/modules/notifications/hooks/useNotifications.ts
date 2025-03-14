import { useNotification } from '../contexts/NotificationContext';
import { NotificationType } from '../types';

/**
 * Хук для удобного использования уведомлений в компонентах
 */
export const useNotifications = () => {
  const notification = useNotification();

  /**
   * Показать успешное уведомление
   */
  const showSuccess = (message: string, duration?: number) => {
    return notification.showNotification({
      type: NotificationType.SUCCESS,
      message,
      duration
    });
  };

  /**
   * Показать информационное уведомление
   */
  const showInfo = (message: string, duration?: number) => {
    return notification.showNotification({
      type: NotificationType.INFO,
      message,
      duration
    });
  };

  /**
   * Показать предупреждающее уведомление
   */
  const showWarning = (message: string, duration?: number) => {
    return notification.showNotification({
      type: NotificationType.WARNING,
      message,
      duration
    });
  };

  /**
   * Показать уведомление об ошибке
   */
  const showError = (message: string, duration?: number) => {
    return notification.showNotification({
      type: NotificationType.ERROR,
      message,
      duration,
      // Ошибки по умолчанию не закрываются автоматически
      autoClose: false
    });
  };

  /**
   * Показать уведомление о сохранении черновика
   */
  const showDraftSaved = () => {
    return notification.showNotification({
      type: NotificationType.SUCCESS,
      message: 'Черновик сохранен',
      duration: 2000
    });
  };

  return {
    ...notification,
    showSuccess,
    showInfo,
    showWarning,
    showError,
    showDraftSaved
  };
}; 