import React, { useEffect, useState } from 'react';
import { MapContainer, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getMapImageUrl, MapData } from '../services/mapService';
import { RegionData } from '../types/mapTypes';
import { MAP_STYLES } from '../styles';
import { LoadingSpinner } from '@/modules/ui';
import { 
  MapRegionsLayer, 
  MapImageLayer, 
  MapBoundsHandler,
  LoadingView
} from './map-components';
import { useMapConfig, MapConfigProvider, MapConfig } from '../contexts/MapConfigContext';

// Конфигурация для облегченной версии карты
const LIGHT_CONFIG: Partial<MapConfig> = {
  lightMode: true,
  showTooltips: false,
  showLabels: false,
  visibleLayers: ['imagery', 'regions'],
  maxZoom: 2,
  minZoom: -1
};

interface LightMapViewProps {
  mapData: MapData | null;
  regions: RegionData[];
  selectedRegionIds?: string[];
  onRegionClick?: (regionId: string) => void;
  className?: string;
  loading?: boolean;
  showControls?: boolean;
  aspectRatio?: 'square' | 'landscape' | 'portrait';
}

// Компонент облегченной карты
const LightMapViewContent: React.FC<LightMapViewProps> = ({
  mapData,
  regions,
  selectedRegionIds = [],
  onRegionClick,
  className = '',
  loading = false,
  showControls = false,
  aspectRatio = 'landscape'
}) => {
  const [imageBounds, setImageBounds] = useState<L.LatLngBoundsExpression>([[0, 0], [1000, 1000]]);
  const { mapConfig } = useMapConfig();

  // Фильтруем регионы, если указаны конкретные ID
  const filteredRegions = selectedRegionIds.length > 0 
    ? regions.filter(region => selectedRegionIds.includes(String(region.id)))
    : regions;

  // Получаем URL изображения карты
  const mapImageUrl = mapData ? getMapImageUrl(mapData) : null;

  // Определяем стиль контейнера в зависимости от соотношения сторон
  const aspectRatioClass = {
    'square': 'aspect-square',
    'landscape': 'aspect-video',
    'portrait': 'aspect-[3/4]'
  }[aspectRatio];

  // Стиль контейнера
  const containerStyles = `
    relative overflow-hidden rounded-lg border border-gray-200
    ${aspectRatioClass}
    ${className}
  `;

  if (loading) {
    return (
      <div className={`${containerStyles} bg-gray-50 flex items-center justify-center`}>
        <LoadingSpinner size="small" message="Загрузка карты..." />
      </div>
    );
  }

  if (!mapImageUrl) {
    return (
      <div className={`${containerStyles} bg-gray-50 flex items-center justify-center`}>
        <p className="text-gray-500 text-sm text-center px-4">
          Изображение карты не найдено
        </p>
      </div>
    );
  }

  return (
    <div className={containerStyles}>
      <MapImageLayer 
        imageUrl={mapImageUrl} 
        setImageBounds={setImageBounds} 
      />
      
      <MapContainer
        center={mapConfig.center}
        zoom={mapConfig.zoom}
        maxZoom={mapConfig.maxZoom}
        minZoom={mapConfig.minZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={showControls}
        crs={L.CRS.Simple}
        maxBounds={mapConfig.maxBounds}
        maxBoundsViscosity={mapConfig.maxBoundsViscosity}
        attributionControl={false}
        className={mapConfig.lightMode ? MAP_STYLES.lightMode : ''}
        scrollWheelZoom={showControls}
        dragging={showControls}
      >
        {showControls && <ZoomControl position={mapConfig.zoomControlPosition} />}
        
        <MapImageLayer 
          imageUrl={mapImageUrl} 
          bounds={imageBounds} 
        />
        
        <MapRegionsLayer 
          regions={filteredRegions} 
          highlightSelected={false}
          showTooltips={mapConfig.showTooltips}
          onClick={onRegionClick}
        />
        
        <MapBoundsHandler imageBounds={imageBounds} />
      </MapContainer>
    </div>
  );
};

// Обертка с провайдером конфигурации
const LightMapView: React.FC<LightMapViewProps> = (props) => {
  return (
    <MapConfigProvider initialConfig={LIGHT_CONFIG}>
      <LightMapViewContent {...props} />
    </MapConfigProvider>
  );
};

export default LightMapView; 