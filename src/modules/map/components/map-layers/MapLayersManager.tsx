import React, { memo, ReactNode, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { TileLayer } from 'react-leaflet'; // Импортируем TileLayer
import { RegionData } from '@/services/regions/types';
import { MapImageLayer, MapRegionsLayer } from '../map-components';
import { useMapLayers } from '../../hooks/useMapLayers';
import {
  MapConfig,
  MAP_LAYERS,
  MAP_TYPES,
  MAP_MODES,
} from '../../contexts/MapConfigContext';
import { Plant } from '@/services/regions/types';
import MapDrawingLayer from './MapDrawingLayer';
import { EnhancedPlantMarkersLayer } from '../plant-info';
import { useMapConfig } from '../../contexts/MapConfigContext';

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
  onPlantsLoaded?: (plants: Plant[]) => void;
}

/**
 * Управляет слоями, переключая базовый слой (схема или гео) и
 * условно отображая другие слои в зависимости от типа карты.
 */
const MapLayersManager: React.FC<MapLayersManagerProps> = ({
  visibleLayers,
  mapImageUrl,
  imageBounds,
  regions,
  customLayers = [],
  mapConfig,
  onRegionClick,
  highlightSelected = true,
  onPlantsLoaded,
}) => {
  const { mapConfig: mapConfigContext } = useMapConfig();

  const {
    isLayerVisible,
    sortedLayers,
    hasMapImage,
    filteredRegions,
    shouldShowRegions,
  } = useMapLayers({
    visibleLayers,
    regions,
    customLayers,
    mapImageUrl,
    config: mapConfigContext,
  });

  const handlePlantsLoaded = useCallback(
    (plantsData: Plant[]) => {
      if (onPlantsLoaded) {
        onPlantsLoaded(plantsData);
      }
    },
    [onPlantsLoaded]
  );

  const renderLayers = () => {
    const isGeoMap = mapConfigContext.mapType === MAP_TYPES.GEO;

    // Динамический выбор базового слоя
    const baseLayer = isGeoMap
      ? isLayerVisible(MAP_LAYERS.GEO_TILES) && (
          <TileLayer
            key="geo-tile-layer"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxNativeZoom={18}
            maxZoom={mapConfigContext.maxZoom}
            minZoom={mapConfigContext.minZoom}
          />
        )
      : mapImageUrl &&
        hasMapImage && (
          <MapImageLayer
            key="map-base-image"
            imageUrl={mapImageUrl}
            bounds={imageBounds}
          />
        );

    const layers = [
      baseLayer, // Слой регионов - доступен на всех типах карт
      shouldShowRegions && filteredRegions.length > 0 && (
        <MapRegionsLayer
          key="map-regions"
          regions={filteredRegions}
          onClick={onRegionClick}
          highlightSelected={highlightSelected}
          showTooltips={mapConfigContext.showTooltips}
        />
      ),

      // Слой растений (теперь работает на обеих картах)
      isLayerVisible(MAP_LAYERS.PLANTS) && (
        <EnhancedPlantMarkersLayer
          key="map-plants"
          isVisible={true}
          mapConfig={mapConfigContext}
          onPlantsLoaded={handlePlantsLoaded}
        />
      ), // Слой рисования и редактирования - доступен в режимах DRAW и EDIT
      (mapConfigContext.interactionMode === MAP_MODES.DRAW ||
        mapConfigContext.interactionMode === MAP_MODES.EDIT) && (
        <MapDrawingLayer
          key="map-drawing"
          isVisible={true}
          config={{
            color: '#3B82F6',
            fillColor: '#60A5FA',
            fillOpacity: 0.3,
            weight: 2,
          }}
        />
      ),

      ...sortedLayers.map((layer) => {
        const CustomLayer = layer.component;
        return (
          <CustomLayer
            key={`custom-layer-${layer.layerId}`}
            isVisible={layer.isVisible}
            config={layer.config}
          />
        );
      }),
    ].filter(Boolean);

    return layers;
  };

  return <>{renderLayers()}</>;
};

export default memo(MapLayersManager);
