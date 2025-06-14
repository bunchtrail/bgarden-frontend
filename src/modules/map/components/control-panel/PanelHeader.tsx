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
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/30 bg-gradient-to-r from-gray-50/30 to-white/30 backdrop-blur-sm">
      {onToggleExpand && (
        <button 
          onClick={onToggleExpand}
          className={`${textClasses.secondary} hover:text-blue-600 ${animationClasses.transition} p-2 rounded-xl hover:bg-blue-50/50 group transform hover:scale-105 active:scale-95`}
          aria-label={isExpanded ? "Свернуть панель" : "Развернуть панель"}
        >
          {isExpanded ? (
            <svg className="h-4 w-4 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      )}
      
      {customHeader ? (
        <div className="flex-1 px-2">{customHeader}</div>
      ) : (
        <div className="flex-1 text-center">
          <h3 className={`${textClasses.heading} text-gray-800 font-semibold text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
            {title}
          </h3>
        </div>
      )}
      
      {onClose && (
        <button 
          onClick={onClose}
          className={`${textClasses.secondary} hover:text-red-600 ${animationClasses.transition} p-2 rounded-xl hover:bg-red-50/50 group transform hover:scale-105 active:scale-95`}
          aria-label="Закрыть панель"
        >
          <svg className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default PanelHeader; 