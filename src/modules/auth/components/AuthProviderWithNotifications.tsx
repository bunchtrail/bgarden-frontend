import React from 'react';
import { AuthProvider, NotificationFunctions } from '../contexts/AuthContext';
import { useNotifications } from '../../notifications';

// Компонент-обертка для AuthProvider с уведомлениями
const AuthProviderWithNotifications: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notifications = useNotifications();
  
  const notificationFunctions: NotificationFunctions = {
    success: (message) => notifications.addNotification({ type: 'success', message }),
    error: (message) => notifications.addNotification({ type: 'error', message }),
    warning: (message) => notifications.addNotification({ type: 'warning', message }),
    info: (message) => notifications.addNotification({ type: 'info', message })
  };
  
  return (
    <AuthProvider notificationFunctions={notificationFunctions}>
      {children}
    </AuthProvider>
  );
};

export default AuthProviderWithNotifications; 