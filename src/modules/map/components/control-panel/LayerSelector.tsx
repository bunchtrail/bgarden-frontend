import React from 'react';
import { useMapConfig } from '../../contexts/MapConfigContext';
import { Switch } from '../../../ui/components/Form';

// Интерфейс для описания слоя карты
export interface MapLayer {
  id: string;
  label: string;
}

// Обновленный интерфейс LayerSelector с новыми свойствами
export interface LayerSelectorProps {
  className?: string;
  // Опциональные параметры - если не указаны, используются внутренние
  layers?: MapLayer[];
  visibleLayers?: string[];
  onToggleLayer?: (layerId: string) => void;
}

/**
 * Компонент выбора слоев карты
 */
const LayerSelector: React.FC<LayerSelectorProps> = ({ 
  className,
  layers,
  visibleLayers,
  onToggleLayer
}) => {
  const { mapConfig, toggleLayer: contextToggleLayer } = useMapConfig();
  
  // Используем переданные значения или берем из контекста
  const actualVisibleLayers = visibleLayers || mapConfig.visibleLayers;
  const toggleLayerFn = onToggleLayer || contextToggleLayer;
  
  // Создаем массив слоев по умолчанию, если не переданы
  const defaultLayers: MapLayer[] = [
    { id: 'imagery', label: 'Изображение карты' },
    { id: 'regions', label: 'Регионы' },
    { id: 'plants', label: 'Растения' },
    { id: 'labels', label: 'Метки' }
  ];
  
  // Используем переданные слои или слои по умолчанию
  const layersToRender = layers || defaultLayers;
  
  // Проверяем, видим ли указанный слой
  const isLayerVisible = (layerId: string) => actualVisibleLayers.includes(layerId);

  // Проверка можно ли отключить слой (всегда должен быть хотя бы один видимый слой)
  const canToggleLayerOff = (layerId: string) => {
    return actualVisibleLayers.length > 1 && isLayerVisible(layerId);
  };

  // Безопасное переключение слоя с проверкой
  const handleToggleLayer = (layerId: string) => {
    // Если слой уже выключен - его можно включить без проверок
    if (!isLayerVisible(layerId)) {
      toggleLayerFn(layerId);
      return;
    }
    
    // Если слой включен, проверяем, можно ли его выключить
    if (canToggleLayerOff(layerId)) {
      toggleLayerFn(layerId);
    } else {
      // Можно добавить уведомление пользователю, что слой нельзя отключить
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      <h3 className="font-medium text-gray-900 mb-1">Слои карты</h3>
      
      {layersToRender.map(layer => (
        <Switch 
          key={layer.id}
          label={layer.label}
          checked={isLayerVisible(layer.id)}
          onChange={() => handleToggleLayer(layer.id)}
        />
      ))}
    </div>
  );
};

export default LayerSelector; 