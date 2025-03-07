import React from 'react';

interface ErrorPanelProps {
  error: string | null;
  onDismiss?: () => void;
  showIcon?: boolean;
  className?: string;
}

/**
 * Компонент для отображения ошибок
 */
export const ErrorPanel: React.FC<ErrorPanelProps> = ({
  error,
  onDismiss,
  showIcon = true,
  className = '',
}) => {
  if (!error) return null;

  return (
    <div
      className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative ${className}`}
      role='alert'
    >
      <div className='flex items-center'>
        {showIcon && (
          <svg
            className='h-5 w-5 mr-2 text-red-600'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
              clipRule='evenodd'
            />
          </svg>
        )}
        <strong className='font-bold mr-1'>Ошибка:</strong>
        <span className='block sm:inline'>{error}</span>
      </div>

      {onDismiss && (
        <button
          className='absolute top-0 bottom-0 right-0 px-4 py-3'
          onClick={onDismiss}
        >
          <svg
            className='h-4 w-4 text-red-600'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      )}
    </div>
  );
};
