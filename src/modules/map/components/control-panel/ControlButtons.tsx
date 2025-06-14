import React from 'react';
import { useMapConfig, MAP_MODES } from '../../contexts/MapConfigContext';
import { textClasses } from '../../../../styles/global-styles';

interface ControlButtonsProps {
  onSaveRegions?: () => void;
  onReset?: () => void;
  onSave?: () => void;
  showSaveButton?: boolean;
  className?: string;
}

/**
 * Компонент с кнопками управления для панели карты
 */
const ControlButtons: React.FC<ControlButtonsProps> = ({
  onSaveRegions,
  onReset,
  onSave,
  showSaveButton = true,
  className = ''
}) => {
  const { mapConfig } = useMapConfig();
  const isDrawingMode = mapConfig.interactionMode === MAP_MODES.DRAW;
  const hasCompletedDrawing = mapConfig.hasCompletedDrawing;
  
  return (
    <div className={`${className} flex flex-col space-y-3`}>
      {isDrawingMode && hasCompletedDrawing && onSaveRegions && (
        <button
          onClick={onSaveRegions}
          className="group px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl 
                    hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-[1.02] active:scale-[0.98] 
                    transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
        >
          <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          <span className={`${textClasses.body} text-white font-medium`}>Сохранить области</span>
        </button>
      )}
      
      {onSave && showSaveButton && (
        <button
          onClick={onSave}
          className="group px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl 
                    hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.02] active:scale-[0.98] 
                    transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
        >
          <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          <span className={`${textClasses.body} text-white font-medium`}>Сохранить настройки</span>
        </button>
      )}
      
      {onReset && (
        <button
          onClick={onReset}
          className="group px-4 py-2.5 bg-white/80 text-gray-700 border border-gray-200/50 rounded-xl 
                    hover:bg-gray-50/90 hover:border-gray-300/50 transform hover:scale-[1.02] active:scale-[0.98] 
                    transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
        >
          <svg className="w-4 h-4 group-hover:-rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className={`${textClasses.body} font-medium`}>Сбросить</span>
        </button>
      )}
    </div>
  );
};

export default ControlButtons; 