import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getMapImageUrl, MapData } from '../services/mapService';
import { RegionData } from '../types/mapTypes';
import { LoadingSpinner } from '@/modules/ui';
import { 
  MapBoundsHandler,
  BaseMapContainer
} from './map-components';
import { MapLayersManager } from './map-submodules';
import { useMapConfig, MapConfigProvider, MapConfig } from '../contexts/MapConfigContext';
import { MapProvider } from '../contexts/MapContext';

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

  // Вычисляем размеры изображения перед рендерингом MapContainer
  useEffect(() => {
    if (mapImageUrl) {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const calculatedBounds: L.LatLngBoundsExpression = [
          [0, 0],
          [height, width]
        ];
        setImageBounds(calculatedBounds);
      };
      img.src = mapImageUrl;
    }
  }, [mapImageUrl]);

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
      <BaseMapContainer
        mapConfig={mapConfig}
        showControls={showControls}
      >
        <MapLayersManager 
          visibleLayers={mapConfig.visibleLayers}
          mapImageUrl={mapImageUrl}
          imageBounds={imageBounds}
          regions={regions}
          customLayers={[]}
          mapConfig={mapConfig}
          onRegionClick={onRegionClick}
          selectedRegionIds={selectedRegionIds}
          highlightSelected={false}
        />
        
        <MapBoundsHandler imageBounds={imageBounds} />
      </BaseMapContainer>
    </div>
  );
};

// Обертка с провайдером конфигурации
const LightMapView: React.FC<LightMapViewProps> = (props) => {
  return (
    <MapConfigProvider initialConfig={LIGHT_CONFIG}>
      <MapProvider>
        <LightMapViewContent {...props} />
      </MapProvider>
    </MapConfigProvider>
  );
};

export default LightMapView; 