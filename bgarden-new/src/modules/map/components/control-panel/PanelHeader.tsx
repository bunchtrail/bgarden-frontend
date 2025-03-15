import React, { ReactNode } from 'react';

/**
 * Компонент заголовка панели управления
 */
const PanelHeader: React.FC<{
  customHeader?: ReactNode;
  onClose?: () => void;
}> = ({ customHeader, onClose }) => (
  <div className="flex justify-between items-center mb-3">
    {customHeader || <h3 className="font-medium text-gray-800">Настройки карты</h3>}
    {onClose && (
      <button 
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    )}
  </div>
);

export default PanelHeader; 