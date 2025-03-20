import React from 'react';
import { RegionData } from '@/modules/map/types/mapTypes';
import MapPage from '@/modules/map/components/MapPage';
import { useMapData } from '../hooks/useMapData';
import { MapMarker } from './MapMarker';

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

  return (
    <div className="relative">
      <MapPage 
        mode="light"
        initialConfig={{
          showControls: true,
          controlPanelMode: 'geography',
          aspectRatio: 'landscape'
        }}
        customLayers={[]}
        plugins={
          <MapMarker 
            position={markerPosition}
            onPositionChange={onCoordinatesChange}
          />
        }
        onRegionClick={onRegionClick}
      />
      <small className="block mt-2 text-gray-500">
        Выберите участок сада, нажав на него на карте. Для установки точного местоположения растения кликните на карту или перетащите маркер.
      </small>
    </div>
  );
};

export default RegionMapSelector; 