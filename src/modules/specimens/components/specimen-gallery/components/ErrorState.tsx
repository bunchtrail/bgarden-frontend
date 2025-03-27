import React from 'react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = "Не удалось загрузить изображения", 
  onRetry 
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 py-6 rounded-lg">
      <svg className="w-14 h-14 text-red-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <p className="text-base font-medium text-gray-700 mb-3">{message}</p>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors duration-200"
        >
          Повторить
        </button>
      )}
    </div>
  );
};

export default ErrorState; 