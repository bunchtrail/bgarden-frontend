import React from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { Notification } from './Notification';

/**
 * Контейнер для отображения всех активных уведомлений
 * Рендерит список уведомлений и управляет их отображением
 */
export const NotificationContainer: React.FC = () => {
  const { notifications, hideNotification } = useNotification();

  if (notifications.length === 0) {
    return null;
  }

  // Рассчитываем смещение для каждого уведомления,
  // чтобы они не перекрывали друг друга
  const getNotificationStyle = (index: number) => {
    return {
      top: `${index * 4 + 1}rem`,  // 1rem = 16px, 4rem = 64px (примерная высота уведомления + отступ)
    };
  };

  return (
    <>
      {notifications.map((notification, index) => (
        <div 
          key={notification.id} 
          style={getNotificationStyle(index)}
          className="absolute right-0"
        >
          <Notification
            notification={notification}
            onClose={() => hideNotification(notification.id)}
          />
        </div>
      ))}
    </>
  );
}; 