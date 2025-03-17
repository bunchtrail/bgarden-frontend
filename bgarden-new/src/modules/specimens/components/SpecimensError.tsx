import React from 'react';
import Button from '../../ui/components/Button';

interface SpecimensErrorProps {
  errorMessage: string;
  onRetry: () => void;
}

/**
 * Компонент для отображения ошибки при загрузке образцов
 */
const SpecimensError: React.FC<SpecimensErrorProps> = ({ 
  errorMessage, 
  onRetry 
}) => {
  return (
    <div className="bg-[#FFE5E5] text-[#FF3B30] p-6 rounded-xl shadow-md border border-[#FF3B30]/30">
      <h2 className="text-xl font-bold flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Ошибка
      </h2>
      <p className="mt-2">{errorMessage}</p>
      <Button 
        variant="danger"
        className="mt-4"
        onClick={onRetry}
      >
        Попробовать снова
      </Button>
    </div>
  );
};

export default SpecimensError; 