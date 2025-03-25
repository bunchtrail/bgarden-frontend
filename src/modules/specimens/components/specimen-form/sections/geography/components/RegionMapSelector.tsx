import React, { useMemo } from 'react';
import { MapProvider } from '@/modules/map/contexts/MapContext';
import MapPage from '@/modules/map/components/MapPage';
import { RegionData } from '@/modules/map/types/mapTypes';
import { MapMarker } from './MapMarker';
import { useMapData } from '../hooks';
import regionBridge from '@/services/regions/RegionBridge';

// Константы для типов слоев на карте
export const MAP_LAYERS = {
  IMAGERY: 'imagery',
  REGIONS: 'regions',
  PLANTS: 'plants',
  GRID: 'grid'
};

// Дополнительные контролы для карты в форме
const MapControls = () => {
  return (
    <div className="bg-white rounded shadow-sm p-3 mt-3">
      <h3 className="text-md font-medium mb-2">Местоположение образца</h3>
      <p className="text-sm text-gray-600">
        Выберите географический регион и точное местоположение образца на карте.
      </p>
    </div>
  );
};

export interface RegionMapSelectorProps {
  regions: RegionData[];
  selectedRegionIds: string[];
  onRegionClick: (regionId: string) => void;
  onCoordinatesChange: (lat: number, lng: number) => void;
  markerPosition: [number, number] | null;
}

export const RegionMapSelector: React.FC<RegionMapSelectorProps> = ({ 
  regions, 
  selectedRegionIds, 
  onRegionClick, 
  onCoordinatesChange, 
  markerPosition 
}) => {
  const { mapData, loading } = useMapData();
  
  // Преобразуем ID регионов в ID областей для карты
  const selectedAreaIds = useMemo(() => {
    return selectedRegionIds.map(id => regionBridge.regionIdToAreaId(Number(id)));
  }, [selectedRegionIds]);
  
  // Обработчик клика по региону
  const handleRegionClick = (regionId: string) => {
    // Извлекаем числовой ID региона из ID области
    if (regionId.startsWith('region-')) {
      const numericId = regionBridge.areaIdToRegionId(regionId);
      onRegionClick(String(numericId));
    } else {
      onRegionClick(regionId);
    }
  };
  
  // Адаптер для преобразования координат
  const handleCoordinatesChange = (lat: number, lng: number) => {
    onCoordinatesChange(lat, lng);
  };
  
  // Формируем начальную конфигурацию для карты
  const initialMapConfig = useMemo(() => ({
    lightMode: true,
    showControls: true,
    controlPanelMode: 'geography' as 'geography',
    aspectRatio: 'landscape' as 'landscape',
    enableClustering: true,
    visibleLayers: [MAP_LAYERS.IMAGERY, MAP_LAYERS.REGIONS, MAP_LAYERS.PLANTS],
    showLayerSelector: true,
    showClusteringToggle: true,
    showTooltips: true,
    maxZoom: 2,
    minZoom: -1,
    selectedAreaIds // Передаем выбранные области
  }), [selectedAreaIds]);
  
  return (
    <div className="relative">
      <MapProvider>
        <MapPage 
          mode="light"
          initialConfig={initialMapConfig}
          customLayers={[]}
          plugins={
            <MapMarker 
              position={markerPosition}
              onPositionChange={handleCoordinatesChange}
            />
          }
          onRegionClick={handleRegionClick}
          extraControls={<MapControls />}
        />
      </MapProvider>
      
      <small className="block mt-2 text-gray-500">
        Выберите участок сада, нажав на него на карте. Для установки точного местоположения растения кликните на карту или перетащите маркер.
      </small>
    </div>
  );
};

export default RegionMapSelector; 