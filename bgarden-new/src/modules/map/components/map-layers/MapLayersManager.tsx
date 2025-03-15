import React, { memo, useMemo } from 'react';
import L from 'leaflet';
import { RegionData } from '../../types/mapTypes';
import { MapLayerProps } from '../MapPage';
import { MapImageLayer, MapRegionsLayer } from '../map-components';
import { useMapLayers } from '../../hooks';
import { MapConfig } from '../../contexts/MapConfigContext';

interface MapLayersManagerProps {
  visibleLayers: string[];
  mapImageUrl: string | null;
  imageBounds: L.LatLngBoundsExpression;
  regions: RegionData[];
  customLayers: MapLayerProps[];
  mapConfig: MapConfig;
  onRegionClick?: (regionId: string) => void;
}

/**
 * Компонент для управления отображением слоев карты
 * Оптимизирован для лучшего переиспользования и уменьшения дублирования
 */
const MapLayersManager: React.FC<MapLayersManagerProps> = memo(({ 
  visibleLayers, 
  mapImageUrl, 
  imageBounds, 
  regions, 
  customLayers, 
  mapConfig,
  onRegionClick
}) => {
  // Используем хук для получения информации о видимости слоев
  const { isLayerVisible, sortedLayers, hasMapImage } = useMapLayers({
    visibleLayers,
    customLayers,
    mapImageUrl
  });

  // Мемоизированный рендеринг встроенных слоев
  const builtInLayers = useMemo(() => {
    if (!hasMapImage) return null;

    return (
      <>
        {/* Слой изображения карты */}
        {isLayerVisible('imagery') && (
          <MapImageLayer 
            imageUrl={mapImageUrl!} 
            bounds={imageBounds} 
          />
        )}
        
        {/* Слой регионов */}
        {isLayerVisible('regions') && (
          <MapRegionsLayer 
            regions={regions} 
            highlightSelected={!mapConfig.lightMode}
            showTooltips={mapConfig.showTooltips}
            onClick={onRegionClick}
          />
        )}
      </>
    );
  }, [isLayerVisible, mapImageUrl, imageBounds, regions, mapConfig, onRegionClick, hasMapImage]);

  // Мемоизированный рендеринг пользовательских слоев
  const customLayersRendered = useMemo(() => {
    if (!hasMapImage) return null;

    return sortedLayers.map(layer => {
      const LayerComponent = layer.component;
      return (
        <LayerComponent 
          key={layer.layerId}
          isVisible={isLayerVisible(layer.layerId)} 
          config={layer.config}
        />
      );
    });
  }, [hasMapImage, sortedLayers, isLayerVisible]);
  
  // Возвращаем null, если нет изображения карты
  if (!hasMapImage) return null;

  return (
    <>
      {builtInLayers}
      {customLayersRendered}
    </>
  );
});

export default MapLayersManager; 