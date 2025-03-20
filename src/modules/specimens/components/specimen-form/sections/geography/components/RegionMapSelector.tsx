import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { RegionData } from '@/modules/map/types/mapTypes';
import MapPage from '@/modules/map/components/MapPage';
import { useMapData } from '../hooks/useMapData';
import { MapMarker } from './MapMarker';
import { MAP_LAYERS, useMapConfig } from '@/modules/map/contexts/MapConfigContext';
import { Switch } from '@/modules/ui/components/Form';
import { MapProvider } from '@/modules/map/contexts/MapContext';

// Тип для слоев карты
type MapLayerType = typeof MAP_LAYERS[keyof typeof MAP_LAYERS];

interface MapLayer {
  id: MapLayerType;
  label: string;
}

interface SimpleLayerSelectorProps {
  className?: string;
  layers: MapLayer[];
  visibleLayers: MapLayerType[];
  onToggleLayer: (layerId: MapLayerType) => void;
}

// Простой селектор слоев без зависимости от контекста
const SimpleLayerSelector: React.FC<SimpleLayerSelectorProps> = ({
  className,
  layers,
  visibleLayers,
  onToggleLayer
}) => {
  // Проверяем, видим ли указанный слой
  const isLayerVisible = (layerId: MapLayerType) => visibleLayers.includes(layerId);

  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      <h3 className="font-medium text-gray-900 mb-1">Слои карты</h3>
      
      {layers.map(layer => (
        <Switch 
          key={layer.id}
          label={layer.label}
          checked={isLayerVisible(layer.id)}
          onChange={() => onToggleLayer(layer.id)}
        />
      ))}
    </div>
  );
};

// Компонент панели управления картой
const MapControls: React.FC = () => {
  const { mapConfig, updateMapConfig, toggleLayer } = useMapConfig();
  
  // Слои для отображения в селекторе
  const availableLayers: MapLayer[] = useMemo(() => [
    { id: MAP_LAYERS.REGIONS, label: 'Участки' },
    { id: MAP_LAYERS.PLANTS, label: 'Растения' }
  ], []);
  
  // Обработчик переключения кластеризации
  const handleToggleClustering = useCallback(() => {
    updateMapConfig({ enableClustering: !mapConfig.enableClustering });
  }, [mapConfig.enableClustering, updateMapConfig]);
  
  return (
    <div className="space-y-4">
      <div>
        <SimpleLayerSelector
          layers={availableLayers}
          visibleLayers={mapConfig.visibleLayers as MapLayerType[]}
          onToggleLayer={toggleLayer}
        />
      </div>
      <div className="mt-3">
        <Switch 
          label="Группировать маркеры растений"
          checked={mapConfig.enableClustering}
          onChange={handleToggleClustering}
        />
      </div>
    </div>
  );
};

interface RegionMapSelectorProps {
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
    minZoom: -1
  }), []);
  
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
              onPositionChange={onCoordinatesChange}
            />
          }
          onRegionClick={onRegionClick}
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