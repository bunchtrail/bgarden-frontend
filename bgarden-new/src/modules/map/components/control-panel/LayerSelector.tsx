import React from 'react';
import { useMapConfig } from '../../contexts/MapConfigContext';
import { ConfigCheckbox } from './index';

interface LayerSelectorProps {
  className?: string;
}

/**
 * Компонент выбора слоев карты
 */
const LayerSelector: React.FC<LayerSelectorProps> = ({ className }) => {
  const { mapConfig, toggleLayer } = useMapConfig();
  
  // Проверяем, видим ли указанный слой
  const isLayerVisible = (layerId: string) => mapConfig.visibleLayers.includes(layerId);

  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      <h3 className="font-medium text-gray-900 mb-1">Слои карты</h3>
      
      <ConfigCheckbox 
        label="Изображение карты"
        checked={isLayerVisible('imagery')}
        onChange={() => toggleLayer('imagery')}
      />
      
      <ConfigCheckbox 
        label="Регионы"
        checked={isLayerVisible('regions')}
        onChange={() => toggleLayer('regions')}
      />
      
      <ConfigCheckbox 
        label="Растения"
        checked={isLayerVisible('plants')}
        onChange={() => toggleLayer('plants')}
      />
      
      <ConfigCheckbox 
        label="Метки"
        checked={isLayerVisible('labels')}
        onChange={() => toggleLayer('labels')}
      />
    </div>
  );
};

export default LayerSelector; 