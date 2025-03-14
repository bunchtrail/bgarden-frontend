import React, { useEffect, useState } from 'react';
import { Notification as NotificationType, NotificationType as NotificationTypeEnum } from '../types';
import { animationClasses } from '../../../styles/global-styles';

interface NotificationProps {
  notification: NotificationType;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({
  notification,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Эффект для анимации появления
  useEffect(() => {
    // Добавляем небольшую задержку перед показом для правильной работы анимации
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  // Получаем стили в зависимости от типа уведомления
  const getStyles = () => {
    switch (notification.type) {
      case NotificationTypeEnum.SUCCESS:
        return {
          container: 'bg-[#E2F9EB] border border-[#30D158] text-[#30D158]',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )
        };
      case NotificationTypeEnum.ERROR:
        return {
          container: 'bg-[#FFEBEB] border border-[#FF453A] text-[#FF453A]',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )
        };
      case NotificationTypeEnum.WARNING:
        return {
          container: 'bg-[#FFF9EC] border border-[#FF9500] text-[#FF9500]',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )
        };
      case NotificationTypeEnum.INFO:
      default:
        return {
          container: 'bg-[#E1F0FF] border border-[#0A84FF] text-[#0A84FF]',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2zm0-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
            </svg>
          )
        };
    }
  };

  const styles = getStyles();
  const icon = notification.icon || styles.icon;

  return (
    <div 
      className={`fixed top-4 right-4 max-w-xs ${styles.container} rounded-xl p-4 shadow-lg 
        ${isVisible ? animationClasses.fadeIn : 'opacity-0'} 
        z-50 flex items-center transform transition-all duration-300 ease-in-out`}
    >
      <div className="h-5 w-5 mr-3 flex-shrink-0">
        {icon}
      </div>
      <p className="font-medium">{notification.message}</p>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 focus:outline-none"
        onClick={onClose}
        aria-label="Закрыть"
      >
        <span className="sr-only">Закрыть</span>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}; 