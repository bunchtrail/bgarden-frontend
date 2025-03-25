import React, { useMemo, useState, useCallback } from 'react';
import { useMapConfig } from '../../contexts/MapConfigContext';
import { BaseMapContainer, MapBoundsHandler, MapReadyHandler } from '../map-components';
import MapLayersManager from '../map-layers/MapLayersManager';
import { MapViewContainerProps } from '../../types/mapTypes';
import { Plant } from '../../contexts/MapContext';

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
  plugins,
  onDataStateChange
}) => {
  const { mapConfig } = useMapConfig();
  
  // Храним информацию о растениях
  const [plantsData, setPlantsData] = useState<Plant[]>([]);
  
  // Обработчик загруженных растений
  const handlePlantsLoaded = useCallback((plants: Plant[]) => {
    setPlantsData(plants);
    
    // Проверяем, пуста ли карта (нет ни растений, ни регионов)
    const isEmpty = 
      (!regions || regions.length === 0) && 
      (!plants || plants.length === 0);
    
    // Уведомляем родительский компонент об изменении состояния данных
    if (onDataStateChange) {
      onDataStateChange({
        hasPlants: plants && plants.length > 0,
        hasRegions: regions && regions.length > 0,
        isEmpty: isEmpty
      });
    }
  }, [regions, onDataStateChange]);
  
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
          onPlantsLoaded={handlePlantsLoaded}
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
    imageBounds,
    handlePlantsLoaded
  ]);
};

export default MapViewContainer; 