import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProviderWithNotifications } from './modules/auth';
import { BrowserRouter } from 'react-router-dom';
import { NotificationProvider, useNotifications } from './modules/notifications';
import { setNotificationHandler } from './services/httpClient';

// Компонент для инициализации обработчика уведомлений
const NotificationInitializer: React.FC = () => {
  const { addNotification } = useNotifications();
  
  useEffect(() => {
    // Устанавливаем обработчик уведомлений для HTTP клиента
    setNotificationHandler(addNotification);
  }, [addNotification]);
  
  return null;
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <NotificationProvider>
      <NotificationInitializer />
      <AuthProviderWithNotifications>
        <App />
      </AuthProviderWithNotifications>
    </NotificationProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(results => {...}))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Полностью отключаем ранее зарегистрированные Service Worker,
// чтобы избежать устаревших ответов из кэша (особенно при разработке)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister().catch(() => {
        // игнорируем ошибки
      });
    });
  });
}
