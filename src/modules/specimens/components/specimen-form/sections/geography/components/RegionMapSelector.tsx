import React, { useMemo } from 'react';
import { MapProvider } from '@/modules/map/contexts/MapContext';
import MapPage from '@/modules/map/components/MapPage';
import { RegionData } from '@/modules/map/types/mapTypes';
import { MapMarker } from './MapMarker';
import { useMapData } from '../hooks';
import regionBridge from '@/services/regions/RegionBridge';
import {
  PositionedControlPanel,
  UNIFIED_PANEL_PRESETS,
} from '@/modules/map/components/control-panel';
import { MAP_TYPES } from '@/modules/map/contexts/MapConfigContext';

// Константы для типов слоев на карте
export const MAP_LAYERS = {
  IMAGERY: 'imagery',
  REGIONS: 'regions',
  PLANTS: 'plants',
  GRID: 'grid',
};

export interface RegionMapSelectorProps {
  regions: RegionData[];
  selectedRegionIds: string[];
  onRegionClick: (regionId: string) => void;
  onCoordinatesChange: (lat: number, lng: number) => void;
  markerPosition: [number, number] | null;
  showTooltips?: boolean;
  initialMapType?: (typeof MAP_TYPES)[keyof typeof MAP_TYPES];
}

export const RegionMapSelector: React.FC<RegionMapSelectorProps> = ({
  regions,
  selectedRegionIds,
  onRegionClick,
  onCoordinatesChange,
  markerPosition,
  showTooltips = false,
  initialMapType = MAP_TYPES.SCHEMATIC,
}) => {
  const { mapData, loading } = useMapData();

  // Преобразуем ID регионов в ID областей для карты
  const selectedAreaIds = useMemo(() => {
    return selectedRegionIds.map((id) =>
      regionBridge.regionIdToAreaId(Number(id))
    );
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
  }; // Используем стандартную панель управления с явной конфигурацией для режима "specimen"
  const mapControlPanel = useMemo(
    () => (
      <PositionedControlPanel
        config={UNIFIED_PANEL_PRESETS.specimen}
        panelId="geography-map-controls"
        position="topRight"
        collapsible={false}
      />
    ),
    []
  );

  // Формируем начальную конфигурацию для карты
  const initialMapConfig = useMemo(
    () => ({
      lightMode: true,
      visibleLayers: [MAP_LAYERS.IMAGERY, MAP_LAYERS.REGIONS],
      showTooltips: showTooltips,
      maxZoom: 2,
      minZoom: -1,
      selectedAreaIds,
      enableClustering: true,
      mapInteractionPriority: 'marker',
      showControls: false,
      mapType: initialMapType,
    }),
    [selectedAreaIds, showTooltips, initialMapType]
  );

  return (
    <div className="relative">
      <MapProvider>
        <MapPage
          mode="light"
          initialConfig={initialMapConfig}
          showControls={true}
          customLayers={[]}
          plugins={
            <MapMarker
              position={markerPosition}
              onPositionChange={handleCoordinatesChange}
            />
          }
          onRegionClick={handleRegionClick}
          extraControls={mapControlPanel}
        />
      </MapProvider>
    </div>
  );
};

export default RegionMapSelector;
