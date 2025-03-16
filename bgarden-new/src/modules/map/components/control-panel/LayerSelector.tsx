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

  // Проверка можно ли отключить слой (всегда должен быть хотя бы один видимый слой)
  const canToggleLayerOff = (layerId: string) => {
    return mapConfig.visibleLayers.length > 1 && isLayerVisible(layerId);
  };

  // Безопасное переключение слоя с проверкой
  const handleToggleLayer = (layerId: string) => {
    // Если слой уже выключен - его можно включить без проверок
    if (!isLayerVisible(layerId)) {
      toggleLayer(layerId);
      return;
    }
    
    // Если слой включен, проверяем, можно ли его выключить
    if (canToggleLayerOff(layerId)) {
      toggleLayer(layerId);
    } else {
      // Можно добавить уведомление пользователю, что слой нельзя отключить
      console.log('Невозможно отключить все слои карты. Хотя бы один слой должен быть активен.');
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      <h3 className="font-medium text-gray-900 mb-1">Слои карты</h3>
      
      <ConfigCheckbox 
        label="Изображение карты"
        checked={isLayerVisible('imagery')}
        onChange={() => handleToggleLayer('imagery')}
      />
      
      <ConfigCheckbox 
        label="Регионы"
        checked={isLayerVisible('regions')}
        onChange={() => handleToggleLayer('regions')}
      />
      
      <ConfigCheckbox 
        label="Растения"
        checked={isLayerVisible('plants')}
        onChange={() => handleToggleLayer('plants')}
      />
      
      <ConfigCheckbox 
        label="Метки"
        checked={isLayerVisible('labels')}
        onChange={() => handleToggleLayer('labels')}
      />
    </div>
  );
};

export default LayerSelector; 