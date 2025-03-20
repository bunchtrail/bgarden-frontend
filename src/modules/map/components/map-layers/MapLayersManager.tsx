import React, { memo, useEffect, useState, ReactNode } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster'; // Убедитесь, что этот пакет установлен
import { RegionData } from '../../types/mapTypes';
// Убираем импорт и используем локальное объявление
// import { MapLayerProps } from '../MapPage';
import { MapImageLayer, MapRegionsLayer } from '../map-components';
import { useMapLayers } from '../../hooks/useMapLayers';
import { MapConfig, MAP_LAYERS } from '../../contexts/MapConfigContext';
import { getAllSpecimens, convertSpecimensToPlants } from '../../services/plantService';
import { Plant } from '../../contexts/MapContext';
import { useMap } from 'react-leaflet';
import { MAP_COLORS } from '../../styles';
// Импортируем компонент напрямую, а не через индексный файл
import MapDrawingLayer from './MapDrawingLayer';
import { EnhancedPlantMarkersLayer } from '../plant-info';


// Интерфейс для пользовательских слоёв
export interface CustomMapLayerProps {
  isVisible: boolean;
  config?: Record<string, any>;
}

export interface MapLayerProps {
  layerId: string;
  order: number;
  component: React.ComponentType<CustomMapLayerProps>;
  isVisible: boolean;
  config?: Record<string, any>;
}

interface MapLayersManagerProps {
  visibleLayers: string[];
  mapImageUrl: string | null;
  imageBounds: L.LatLngBoundsExpression;
  regions: RegionData[];
  customLayers?: MapLayerProps[];
  mapConfig: MapConfig;
  onRegionClick?: (regionId: string) => void;
  selectedRegionIds?: string[];
  highlightSelected?: boolean;
  children?: ReactNode;
}

/**
 * Улучшенный компонент для управления слоями карты
 * Использует хук useMapLayers для эффективного управления видимостью и сортировкой слоев
 */
const MapLayersManager: React.FC<MapLayersManagerProps> = ({
  visibleLayers,
  mapImageUrl,
  imageBounds,
  regions,
  customLayers = [],
  mapConfig,
  onRegionClick,
  selectedRegionIds = [],
  highlightSelected = true
}) => {
  // Используем расширенный хук для управления слоями
  const {
    isLayerVisible,
    sortedLayers,
    hasMapImage,
    filteredRegions,
    shouldShowRegions
  } = useMapLayers({
    visibleLayers,
    regions,
    customLayers,
    mapImageUrl,
    config: mapConfig
  });

  // Проверяем, что мы находимся внутри контекста Leaflet
  const renderLayers = () => {
    const layers = [
      // Слой изображения карты (всегда первый)
      mapImageUrl && hasMapImage && (
        <MapImageLayer 
          key="map-base-image"
          imageUrl={mapImageUrl} 
          bounds={imageBounds}
        />
      ),
      
      // Слой регионов (всегда второй)
      shouldShowRegions && filteredRegions.length > 0 && (
        <MapRegionsLayer
          key="map-regions"
          regions={filteredRegions}
          onClick={onRegionClick}
          highlightSelected={highlightSelected}
          showTooltips={mapConfig.showTooltips}
        />
      ),
      
      // Слой растений (всегда третий)
      isLayerVisible(MAP_LAYERS.PLANTS) && (
        <EnhancedPlantMarkersLayer 
          key="map-plants"
          isVisible={true}
          mapConfig={mapConfig}
        />
      ),
      
      // Слой рисования (всегда последний)
      mapConfig.drawingEnabled && (
        <MapDrawingLayer
          key="map-drawing"
          isVisible={true}
          config={{
            color: '#3B82F6',
            fillColor: '#60A5FA',
            fillOpacity: 0.3,
            weight: 2
          }}
        />
      ),
      
      // Пользовательские слои
      ...sortedLayers.map(layer => {
        const CustomLayer = layer.component;
        return (
          <CustomLayer
            key={`custom-layer-${layer.layerId}`}
            isVisible={layer.isVisible} 
            config={layer.config}
          />
        );
      })
    ].filter(Boolean);
    
    return layers;
  };

  // Возвращаем обернутый в фрагмент список слоев вместо массива
  return (
    <>
      {renderLayers()}
    </>
  );
};

export default memo(MapLayersManager); 