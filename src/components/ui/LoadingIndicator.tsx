import React from 'react';
import { buttonClasses } from '../../styles/global-styles';

interface LoadingIndicatorProps {
  fullScreen?: boolean;
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  fullScreen = false,
  size = 'medium',
  message,
}) => {
  // Определяем размер спиннера в зависимости от пропса size
  const getSpinnerSize = () => {
    switch (size) {
      case 'small':
        return 'w-6 h-6 border-2';
      case 'large':
        return 'w-12 h-12 border-4';
      case 'medium':
      default:
        return 'w-10 h-10 border-3';
    }
  };

  // Создаем класс для контейнера в зависимости от того, полноэкранный ли индикатор
  const containerClass = fullScreen
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-50'
    : 'flex items-center justify-center p-4 bg-white bg-opacity-80 rounded-lg';

  return (
    <div className={containerClass}>
      <div className={`animate-spin rounded-full border-t-transparent border-primary ${getSpinnerSize()}`} />
      {message && (
        <p className='mt-4 text-gray-600 text-sm font-medium'>{message}</p>
      )}
    </div>
  );
};

// Дополнительный компонент для использования в шаблонах загрузки данных
export const DataLoadingPlaceholder: React.FC = () => {
  return (
    <div className='animate-pulse space-y-4'>
      <div className='h-4 bg-gray-200 rounded w-3/4'></div>
      <div className='h-4 bg-gray-200 rounded w-1/2'></div>
      <div className='h-4 bg-gray-200 rounded w-5/6'></div>
      <div className='h-4 bg-gray-200 rounded w-2/3'></div>
    </div>
  );
};

// Компонент для отображения ошибок загрузки
export const ErrorIndicator: React.FC<{ message?: string }> = ({
  message = 'Произошла ошибка при загрузке данных.',
}) => {
  return (
    <div className='flex flex-col items-center justify-center p-6 text-center'>
      <div className='text-red-500 mb-3'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-12 w-12'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
          />
        </svg>
      </div>
      <h3 className='text-lg font-semibold text-gray-800 mb-2'>Ошибка</h3>
      <p className='text-gray-600'>{message}</p>
    </div>
  );
};

// Компонент для отображения пустого состояния
export const EmptyState: React.FC<{
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({
  title = 'Нет данных',
  message = 'Данные отсутствуют или не найдены.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className='flex flex-col items-center justify-center p-6 text-center'>
      <div className='text-blue-500 mb-3'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-12 w-12'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
          />
        </svg>
      </div>
      <h3 className='text-lg font-semibold text-gray-800 mb-2'>{title}</h3>
      <p className='text-gray-600 mb-4'>{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className={`${buttonClasses.base} ${buttonClasses.primary} px-4 py-2`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}; 