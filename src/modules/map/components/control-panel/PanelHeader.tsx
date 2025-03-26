import React, { ReactNode } from 'react';
import { textClasses, animationClasses } from '../../../../styles/global-styles';

interface PanelHeaderProps {
  customHeader?: ReactNode;
  onClose?: () => void;
  onToggleExpand?: () => void;
  isExpanded?: boolean;
  title?: string;
}

/**
 * Компонент заголовка для панели управления
 */
const PanelHeader: React.FC<PanelHeaderProps> = ({
  customHeader,
  onClose,
  onToggleExpand,
  isExpanded = true,
  title = 'Управление картой'
}) => {
  return (
    <div className={`flex items-center justify-between px-4 py-3 border-b border-gray-200/50`}>
      {onToggleExpand && (
        <button 
          onClick={onToggleExpand}
          className={`${textClasses.secondary} hover:${textClasses.primary} ${animationClasses.transition} p-1.5 rounded-full hover:bg-gray-100/50`}
          aria-label={isExpanded ? "Свернуть панель" : "Развернуть панель"}
        >
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      )}
      
      {customHeader ? (
        <div className="flex-1">{customHeader}</div>
      ) : (
        <h3 className={`${textClasses.heading} flex-1 text-center`}>{title}</h3>
      )}
      
      {onClose && (
        <button 
          onClick={onClose}
          className={`${textClasses.secondary} hover:${textClasses.primary} ${animationClasses.transition} p-1.5 rounded-full hover:bg-gray-100/50`}
          aria-label="Закрыть панель"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default PanelHeader; 