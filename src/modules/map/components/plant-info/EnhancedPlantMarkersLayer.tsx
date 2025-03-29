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

// Глобальное кэширование данных за пределами компонента
let cachedPlantsData: Plant[] | null = null;
let lastFetchTime = 0;
const CACHE_TIME = 60000; // 1 минута

/**
 * Улучшенный компонент слоя маркеров растений с модульной архитектурой
 */
const EnhancedPlantMarkersLayer: React.FC<EnhancedPlantMarkersLayerProps> = memo(({ 
  isVisible, 
  mapConfig,
  onPlantsLoaded
}) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const map = useMap();
  const { clearMarkers } = useMarkers(
    map, 
    plants, 
    isVisible, 
    mapConfig.enableClustering,
    mapConfig.showPopupOnClick
  );
  const { warning } = useNotification();
  
  // Используем ref для отслеживания изменений isVisible, чтобы избежать повторных запросов
  const isFirstRender = useRef(true);
  const requestInProgress = useRef(false);

  // Загрузка данных растений
  useEffect(() => {
    const fetchPlants = async () => {
      // Проверяем, есть ли данные в кэше и не истекло ли время кэширования
      const now = Date.now();
      const cacheExpired = now - lastFetchTime > CACHE_TIME;
      
      // Используем кэшированные данные, если они есть и не истекли
      if (cachedPlantsData && !cacheExpired && !isFirstRender.current) {
        setPlants(cachedPlantsData);
        if (onPlantsLoaded) {
          onPlantsLoaded(cachedPlantsData);
        }
        return;
      }
      
      // Предотвращение параллельных запросов
      if (requestInProgress.current) {
        return;
      }
      
      if (isVisible) {
        isFirstRender.current = false;
        setLoading(true);
        setError(null);
        requestInProgress.current = true;
        
        try {
          const plantsData = await PlantDataService.loadPlants();
          
          // Обновляем кэш и время последнего обновления
          cachedPlantsData = plantsData;
          lastFetchTime = Date.now();
          
          setPlants(plantsData);
          
          // Обратная связь с родительским компонентом о загруженных данных
          if (onPlantsLoaded) {
            onPlantsLoaded(plantsData);
          }
          
          // Если планты загрузились, но их массив пуст, не показываем ошибку - просто пустой слой
          if (plantsData.length === 0) {
            // Удалено логирование
          }
        } catch (err) {
          // Удалено логирование ошибки
          setError(err instanceof Error ? err : new Error('Не удалось загрузить данные растений'));
          
          // Обратная связь с родительским компонентом о пустых данных
          if (onPlantsLoaded) {
            onPlantsLoaded([]);
          }
          
          // Уведомляем пользователя об ошибке, но не блокируем карту
          // Показываем уведомление только при первой ошибке
          if (isFirstRender.current) {
            warning('Не удалось загрузить данные растений. Карта будет отображена без растений.', {
              title: 'Внимание'
            });
          }
        } finally {
          setLoading(false);
          requestInProgress.current = false;
        }
      } else {
        setPlants([]);
        clearMarkers();
        
        // Если слой скрыт, передаем пустые данные
        if (onPlantsLoaded) {
          onPlantsLoaded([]);
        }
      }
    };

    fetchPlants();
  }, [isVisible, clearMarkers, warning, onPlantsLoaded]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      clearMarkers();
    };
  }, [clearMarkers]);

  return null; // Компонент не возвращает видимый UI
});

export default EnhancedPlantMarkersLayer; 
