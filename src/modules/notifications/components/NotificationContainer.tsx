import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import NotificationItem from './NotificationItem';
import { notificationStyles } from '../styles';

const NotificationContainer: React.FC = () => {
  const { notifications } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div 
      className={`${notificationStyles.container} ${notificationStyles.responsive.mobile}`}
      aria-live="polite"
      aria-atomic="false"
      aria-label="Уведомления"
    >
      <div className="flex flex-col gap-3">
        {notifications.map((notification) => (
          <NotificationItem 
            key={notification.id} 
            notification={notification} 
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationContainer; 