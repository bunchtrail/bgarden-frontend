import React from 'react';

// Интерфейс для слоя карты
export interface MapLayerConfig {
  id: string;
  label: string;
  isVisible?: boolean;
  icon?: React.ReactNode;
}

/**
 * Компонент секции слоев карты
 */
const LayerSelector: React.FC<{
  layers: MapLayerConfig[];
  visibleLayers: string[];
  onLayerToggle: (layerId: string) => void;
}> = ({ layers, visibleLayers, onLayerToggle }) => (
  <div className="mb-3">
    <p className="text-sm text-gray-700 mb-2">Видимые слои:</p>
    <div className="space-y-2">
      {layers.map(layer => (
        <label key={layer.id} className="flex items-center">
          <input 
            type="checkbox" 
            className="form-checkbox h-4 w-4 text-blue-600"
            checked={visibleLayers.includes(layer.id)}
            onChange={() => onLayerToggle(layer.id)}
          />
          <span className="ml-2 text-sm text-gray-700">
            {layer.icon && <span className="mr-1">{layer.icon}</span>}
            {layer.label}
          </span>
        </label>
      ))}
    </div>
  </div>
);

export default LayerSelector; 