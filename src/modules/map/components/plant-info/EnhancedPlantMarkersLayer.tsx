import React, { memo, useEffect, useState } from 'react';
import 'leaflet.markercluster';
import { useMap } from 'react-leaflet';
import { Plant } from '../../contexts/MapContext';
import { MapConfig } from '../../contexts/MapConfigContext';
import { PlantDataService } from './services/PlantDataService';
import { useMarkers } from './hooks/useMarkers';

interface EnhancedPlantMarkersLayerProps {
  isVisible: boolean;
  mapConfig: MapConfig;
}

/**
 * Улучшенный компонент слоя маркеров растений с модульной архитектурой
 */
const EnhancedPlantMarkersLayer: React.FC<EnhancedPlantMarkersLayerProps> = memo(({ 
  isVisible, 
  mapConfig 
}) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const map = useMap();
  const { clearMarkers } = useMarkers(map, plants, isVisible, mapConfig.enableClustering);

  // Загрузка данных растений
  useEffect(() => {
    const fetchPlants = async () => {
      if (isVisible) {
        const plantsData = await PlantDataService.loadPlants();
        setPlants(plantsData);
      } else {
        setPlants([]);
        clearMarkers();
      }
    };

    fetchPlants();
  }, [isVisible, clearMarkers]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      clearMarkers();
    };
  }, [clearMarkers]);

  return null; // Компонент не возвращает видимый UI
});

export default EnhancedPlantMarkersLayer; 