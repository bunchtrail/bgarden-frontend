import React, { useMemo, useState, useCallback } from 'react';
import { useMapConfig } from '../../contexts/MapConfigContext';
import { BaseMapContainer, MapBoundsHandler, MapReadyHandler } from '../map-components';
import LockBoundsAtInit from '../map-components/LockBoundsAtInit';
import MapLayersManager from '../map-layers/MapLayersManager';
import { MapViewContainerProps } from '../../types/mapTypes';
import { Plant } from '@/services/regions/types';
import { MAP_TYPES } from '../../contexts/MapConfigContext';
import { useMapEvents } from 'react-leaflet';
import { mapLogger } from '../../utils/logger';

/**
 * Компонент для логирования событий взаимодействия с картой.
 * Срабатывает, когда пользователь заканчивает перемещать карту или изменять масштаб.
 */
const MapInteractionLogger = () => {
  useMapEvents({
    moveend: (e) => {
      const map = e.target;
      const center = map.getCenter();
      const zoom = map.getZoom();

      console.log('[Map] Позиция карты изменена (перемещение остановлено):', {
        center: { lat: center.lat.toFixed(6), lng: center.lng.toFixed(6) },
        zoom: zoom,
        timestamp: new Date().toISOString(),
      });
    },
  });

  return null; // Компонент ничего не рендерит
};

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
      const state = {
        hasPlants: plants && plants.length > 0,
        hasRegions: regions && regions.length > 0,
        isEmpty: isEmpty
      };
      mapLogger.log('Состояние данных карты изменилось:', state);
      onDataStateChange(state);
    }
  }, [regions, onDataStateChange]);
  
  // Мемоизация контента для предотвращения лишних перерисовок
  return useMemo(() => {
    if (!mapImageUrl && mapConfig.mapType !== MAP_TYPES.GEO) {
      mapLogger.log('Нет URL изображения карты для схематического режима');
      return null;
    }
    
    return (
      <BaseMapContainer
        mapConfig={mapConfig}
        showControls={true}
      >
        {/* Обработчик события ready */}
        {onMapReady && <MapReadyHandler onMapReady={onMapReady} />}
        
        {/* Логирование изменений позиции карты */}
        <MapInteractionLogger />

        {/* Фиксация границ для гео-карты */}
        {mapConfig.mapType === MAP_TYPES.GEO && (
          <LockBoundsAtInit />
        )}

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
        
        {/* Обработчик границ карты - только для схематической карты */}
        {mapConfig.mapType === MAP_TYPES.SCHEMATIC && (
          <MapBoundsHandler imageBounds={imageBounds} />
        )}

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