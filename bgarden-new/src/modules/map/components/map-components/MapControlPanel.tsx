import React from 'react';
import { useMapConfig } from '../../context/MapConfigContext';

interface MapControlPanelProps {
  className?: string;
  showLayerSelector?: boolean;
  showModeToggle?: boolean;
  showTooltipToggle?: boolean;
  showLabelToggle?: boolean;
  onClose?: () => void;
}

const MapControlPanel: React.FC<MapControlPanelProps> = ({
  className = '',
  showLayerSelector = true,
  showModeToggle = true,
  showTooltipToggle = true,
  showLabelToggle = true,
  onClose
}) => {
  const { 
    mapConfig, 
    toggleLayer, 
    toggleLightMode, 
    updateMapConfig 
  } = useMapConfig();

  const panelStyles = `
    bg-white bg-opacity-90 rounded-lg shadow-lg 
    p-4 absolute top-4 right-4 z-[1000] 
    max-w-xs w-full border border-gray-200
    ${className}
  `;

  return (
    <div className={panelStyles}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-800">Настройки карты</h3>
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

      {/* Переключатель режима карты */}
      {showModeToggle && (
        <div className="mb-3">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={mapConfig.lightMode}
                onChange={toggleLightMode}
              />
              <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
              <div className={`
                dot absolute left-1 top-1 w-4 h-4 rounded-full transition 
                ${mapConfig.lightMode ? 'bg-green-500 transform translate-x-4' : 'bg-white'}
              `}></div>
            </div>
            <div className="ml-3 text-gray-700 text-sm">
              Облегченный режим
            </div>
          </label>
        </div>
      )}

      {/* Переключатели для видимых слоев */}
      {showLayerSelector && (
        <div className="mb-3">
          <p className="text-sm text-gray-700 mb-2">Видимые слои:</p>
          <div className="space-y-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 text-blue-600"
                checked={mapConfig.visibleLayers.includes('imagery')}
                onChange={() => toggleLayer('imagery')}
              />
              <span className="ml-2 text-sm text-gray-700">Изображение карты</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 text-blue-600"
                checked={mapConfig.visibleLayers.includes('regions')}
                onChange={() => toggleLayer('regions')}
              />
              <span className="ml-2 text-sm text-gray-700">Регионы</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 text-blue-600"
                checked={mapConfig.visibleLayers.includes('labels')}
                onChange={() => toggleLayer('labels')}
              />
              <span className="ml-2 text-sm text-gray-700">Метки</span>
            </label>
          </div>
        </div>
      )}

      {/* Настройки подсказок */}
      {showTooltipToggle && (
        <div className="mb-3">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="form-checkbox h-4 w-4 text-blue-600"
              checked={mapConfig.showTooltips}
              onChange={() => updateMapConfig({ showTooltips: !mapConfig.showTooltips })}
            />
            <span className="ml-2 text-sm text-gray-700">Показывать подсказки</span>
          </label>
        </div>
      )}

      {/* Настройки меток */}
      {showLabelToggle && (
        <div>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="form-checkbox h-4 w-4 text-blue-600"
              checked={mapConfig.showLabels}
              onChange={() => updateMapConfig({ showLabels: !mapConfig.showLabels })}
            />
            <span className="ml-2 text-sm text-gray-700">Показывать названия</span>
          </label>
        </div>
      )}
    </div>
  );
};

export default MapControlPanel; 