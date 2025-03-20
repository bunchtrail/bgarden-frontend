import React, { useMemo } from 'react';
import { useMapConfig } from '../../contexts/MapConfigContext';
import { BaseMapContainer, MapBoundsHandler, MapReadyHandler } from '../map-components';
import MapLayersManager from '../map-layers/MapLayersManager';
import { MapViewContainerProps } from '../../types/mapTypes';

/**
 * Компонент контейнера вида карты
 * Отвечает за отображение слоев карты и обработку событий карты
 */
const MapViewContainer: React.FC<MapViewContainerProps> = ({
  mapImageUrl,
  imageBounds,
  regions,
  customLayers = [],
  onRegionClick,
  onMapReady,
  plugins
}) => {
  const { mapConfig } = useMapConfig();
  
  // Мемоизация контента для предотвращения лишних перерисовок
  return useMemo(() => {
    if (!mapImageUrl) return null;
    
    return (
      <BaseMapContainer
        mapConfig={mapConfig}
        showControls={true}
      >
        {/* Обработчик события ready */}
        {onMapReady && <MapReadyHandler onMapReady={onMapReady} />}
        
        {/* Слои карты */}
        <MapLayersManager 
          visibleLayers={mapConfig.visibleLayers}
          mapImageUrl={mapImageUrl}
          imageBounds={imageBounds}
          regions={regions}
          customLayers={customLayers}
          mapConfig={mapConfig}
          onRegionClick={onRegionClick}
          highlightSelected={!mapConfig.lightMode}
        />
        
        {/* Обработчик границ карты */}
        <MapBoundsHandler imageBounds={imageBounds} />

        {/* Плагины */}
        {plugins}
      </BaseMapContainer>
    );
  }, [
    mapImageUrl, 
    mapConfig, 
    onMapReady, 
    regions, 
    customLayers, 
    onRegionClick, 
    plugins, 
    imageBounds
  ]);
};

export default MapViewContainer; 