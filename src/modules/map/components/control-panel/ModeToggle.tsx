import React from 'react';
import { useMapConfig, MAP_MODES } from '../../contexts/MapConfigContext';

interface ModeToggleProps {
  className?: string;
}

/**
 * Компонент для переключения между режимами взаимодействия с картой
 */
const ModeToggle: React.FC<ModeToggleProps> = ({ className = '' }) => {
  const { mapConfig, updateMapConfig } = useMapConfig();
  
  // Переключение режима взаимодействия с картой
  const handleModeChange = (mode: string) => {
    updateMapConfig({ 
      interactionMode: mode,
      drawingEnabled: mode === MAP_MODES.DRAW
    });
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-sm font-medium text-gray-700 mb-2">Режим карты</h4>
      <div className="bg-white/50 p-2 rounded-lg flex flex-col space-y-1">
        <label className="flex items-center p-1 cursor-pointer hover:bg-white/30 rounded transition-colors">
          <input
            type="radio"
            name="mapMode"
            value={MAP_MODES.VIEW}
            checked={mapConfig.interactionMode === MAP_MODES.VIEW}
            onChange={() => handleModeChange(MAP_MODES.VIEW)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Просмотр</span>
        </label>
        
        <label className="flex items-center p-1 cursor-pointer hover:bg-white/30 rounded transition-colors">
          <input
            type="radio"
            name="mapMode"
            value={MAP_MODES.DRAW}
            checked={mapConfig.interactionMode === MAP_MODES.DRAW}
            onChange={() => handleModeChange(MAP_MODES.DRAW)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Рисование областей</span>
        </label>
        
        <label className="flex items-center p-1 cursor-pointer hover:bg-white/30 rounded transition-colors">
          <input
            type="radio"
            name="mapMode"
            value={MAP_MODES.EDIT}
            checked={mapConfig.interactionMode === MAP_MODES.EDIT}
            onChange={() => handleModeChange(MAP_MODES.EDIT)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Редактирование</span>
        </label>
      </div>
    </div>
  );
};

export default ModeToggle; 