import React from 'react';
import { Button } from '../../../ui';

interface EmptyMapViewProps {
  onRefresh: () => void;
  message?: string;
  icon?: 'noData' | 'warning' | 'error';
  actionText?: string;
}

const EmptyMapView: React.FC<EmptyMapViewProps> = ({
  onRefresh,
  message = 'Карта не найдена. Убедитесь, что на сервере есть активная карта.',
  icon = 'warning',
  actionText = 'Проверить еще раз'
}) => {
  // Выбор цвета и иконки в зависимости от типа сообщения
  const getIconAndColors = () => {
    switch (icon) {
      case 'noData':
        return {
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-600',
          iconPath: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          )
        };
      case 'error':
        return {
          bgColor: 'bg-red-50',
          textColor: 'text-red-600',
          iconPath: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          )
        };
      case 'warning':
      default:
        return {
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-600',
          iconPath: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          )
        };
    }
  };

  const { bgColor, textColor, iconPath } = getIconAndColors();

  return (
    <div className="p-8 text-center">
      <div className={`inline-block p-4 mb-4 rounded-xl ${bgColor} ${textColor}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {iconPath}
        </svg>
        <p className="text-center">{message}</p>
      </div>
      <Button 
        variant="secondary" 
        onClick={onRefresh}
      >
        {actionText}
      </Button>
    </div>
  );
};

export default EmptyMapView; 