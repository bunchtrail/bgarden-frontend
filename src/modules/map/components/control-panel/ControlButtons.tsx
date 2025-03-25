import React from 'react';
import { useMapConfig, MAP_MODES } from '../../contexts/MapConfigContext';
import { cardClasses, textClasses } from '../../../../styles/global-styles';

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
    <div className={`${className} flex flex-col space-y-2`}>
      {isDrawingMode && hasCompletedDrawing && onSaveRegions && (
        <button
          onClick={onSaveRegions}
          className={`px-4 py-2 bg-green-600 text-white rounded-lg 
                    hover:bg-green-700 transition-colors flex items-center justify-center`}
        >
          <span className={`${textClasses.body} text-white`}>Сохранить области</span>
        </button>
      )}
      
      {onSave && showSaveButton && (
        <button
          onClick={onSave}
          className={`px-4 py-2 bg-blue-600 text-white rounded-lg 
                    hover:bg-blue-700 transition-colors flex items-center justify-center`}
        >
          <span className={`${textClasses.body} text-white`}>Сохранить настройки</span>
        </button>
      )}
      
      {onReset && (
        <button
          onClick={onReset}
          className={`px-4 py-2 bg-gray-200 text-gray-800 rounded-lg 
                    hover:bg-gray-300 transition-colors flex items-center justify-center`}
        >
          <span className={`${textClasses.body}`}>Сбросить</span>
        </button>
      )}
    </div>
  );
};

export default ControlButtons; 