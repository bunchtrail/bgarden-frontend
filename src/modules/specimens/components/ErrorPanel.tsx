import React from 'react';

export enum MessageType {
  ERROR = 'error',
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
}

interface MessagePanelProps {
  message: string;
  type?: MessageType;
  onClose?: () => void;
}

export const MessagePanel: React.FC<MessagePanelProps> = ({
  message,
  type = MessageType.ERROR,
  onClose,
}) => {
  // Определение стилей в зависимости от типа уведомления
  const getStyles = () => {
    switch (type) {
      case MessageType.SUCCESS:
        return {
          container: 'bg-green-50 border-green-500 text-green-700',
          icon: 'text-green-500',
          path: (
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
              clipRule='evenodd'
            />
          ),
        };
      case MessageType.INFO:
        return {
          container: 'bg-blue-50 border-blue-500 text-blue-700',
          icon: 'text-blue-500',
          path: (
            <path
              fillRule='evenodd'
              d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2zm8-5a8 8 0 11-16 0 8 8 0 0116 0z'
              clipRule='evenodd'
            />
          ),
        };
      case MessageType.WARNING:
        return {
          container: 'bg-yellow-50 border-yellow-500 text-yellow-700',
          icon: 'text-yellow-500',
          path: (
            <path
              fillRule='evenodd'
              d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
              clipRule='evenodd'
            />
          ),
        };
      case MessageType.ERROR:
      default:
        return {
          container: 'bg-red-50 border-red-500 text-red-700',
          icon: 'text-red-500',
          path: (
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
              clipRule='evenodd'
            />
          ),
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`p-4 mb-4 rounded-lg shadow-sm border-l-4 ${styles.container} animate-fadeIn`}
    >
      <div className='flex items-start'>
        <div className='flex-shrink-0'>
          <svg
            className={`w-5 h-5 ${styles.icon}`}
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            {styles.path}
          </svg>
        </div>
        <div className='ml-3 flex-1'>
          <p className='text-sm'>{message}</p>
        </div>
        {onClose && (
          <button
            type='button'
            className='ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 focus:outline-none'
            onClick={onClose}
            aria-label='Закрыть'
          >
            <span className='sr-only'>Закрыть</span>
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Экспортируем для обратной совместимости
export const ErrorPanel: React.FC<{
  message: string;
  onClose?: () => void;
  className?: string;
}> = ({ message, onClose, className }) => {
  return (
    <MessagePanel
      message={message}
      type={MessageType.ERROR}
      onClose={onClose}
    />
  );
};
