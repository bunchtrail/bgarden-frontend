// src/modules/map/components/plant-info/EnhancedPlantMarkersLayer.tsx

import React, { memo, useEffect, useState, useRef } from 'react';
import 'leaflet.markercluster';
import { useMap } from 'react-leaflet';
import { Plant } from '@/services/regions/types';
import { MapConfig } from '../../contexts/MapConfigContext';
import { PlantDataService } from './services/PlantDataService';
import { useMarkers } from './hooks/useMarkers';
import useNotification from '@/modules/notifications/hooks/useNotification';

interface EnhancedPlantMarkersLayerProps {
  isVisible: boolean;
  mapConfig: MapConfig;
  onPlantsLoaded?: (plantsData: Plant[]) => void;
}

const EnhancedPlantMarkersLayer: React.FC<EnhancedPlantMarkersLayerProps> =
  memo(({ isVisible, mapConfig, onPlantsLoaded }) => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const map = useMap();
    const { clearMarkers } = useMarkers(
      map,
      plants,
      isVisible,
      mapConfig.enableClustering,
      mapConfig.showPopupOnClick,
      mapConfig.interactionMode
    );
    const { warning } = useNotification();

    const isFirstRender = useRef(true);
    const requestInProgress = useRef(false);

    useEffect(() => {
      const fetchPlants = async () => {
        if (requestInProgress.current) return;

        if (isVisible) {
          setLoading(true);
          setError(null);
          requestInProgress.current = true;

          try {
            // **ИСПРАВЛЕНИЕ:** Передаем `mapConfig.mapType` в сервис.
            const plantsData = await PlantDataService.loadPlants(
              mapConfig.mapType
            );

            setPlants(plantsData);

            if (onPlantsLoaded) {
              onPlantsLoaded(plantsData);
            }
          } catch (err) {
            setError(
              err instanceof Error
                ? err
                : new Error('Не удалось загрузить данные растений')
            );
            if (onPlantsLoaded) {
              onPlantsLoaded([]);
            }

            if (isFirstRender.current) {
              warning(
                'Не удалось загрузить данные растений. Карта будет отображена без растений.',
                {
                  title: 'Внимание',
                }
              );
            }
          } finally {
            setLoading(false);
            requestInProgress.current = false;
            isFirstRender.current = false;
          }
        } else {
          setPlants([]);
          clearMarkers();
          if (onPlantsLoaded) {
            onPlantsLoaded([]);
          }
        }
      };

      fetchPlants();
      // Добавляем mapConfig.mapType в зависимости, чтобы перезагружать данные при смене карты
    }, [isVisible, mapConfig.mapType, clearMarkers, warning, onPlantsLoaded]);

    useEffect(() => {
      return () => {
        clearMarkers();
      };
    }, [clearMarkers]);

    return null;
  });

export default EnhancedPlantMarkersLayer;
