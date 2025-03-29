import { useState, useEffect, useCallback } from 'react';
import L from 'leaflet';
import { Plant } from '@/services/regions/types';
import { MarkerClusterManager } from '../managers/MarkerClusterManager';

/**
 * Хук для управления маркерами растений на карте
 * @param map Экземпляр карты Leaflet
 * @param plants Массив растений для отображения
 * @param isVisible Флаг видимости слоя
 * @param enableClustering Флаг включения кластеризации
 * @param showPopupOnClick Флаг, указывающий, нужно ли показывать попап при клике на маркер
 * @returns Объект с функцией для очистки маркеров
 */
export const useMarkers = (
  map: L.Map | null,
  plants: Plant[],
  isVisible: boolean,
  enableClustering: boolean,
  showPopupOnClick: boolean = true
) => {
  const [manager, setManager] = useState<MarkerClusterManager | null>(null);

  // Инициализация менеджера при монтировании или изменении карты
  useEffect(() => {
    if (map) {
      setManager(new MarkerClusterManager(map, showPopupOnClick));
    }
    
    return () => {
      if (manager) {
        manager.clearAllMarkers();
      }
    };
  }, [map, showPopupOnClick]);

  // Обновляем настройку при её изменении
  useEffect(() => {
    if (manager) {
      manager.setShowPopupOnClick(showPopupOnClick);
    }
  }, [manager, showPopupOnClick]);

  // Обновление маркеров при изменении данных или настроек
  useEffect(() => {
    if (!isVisible || !manager || plants.length === 0) {
      if (manager) {
        manager.clearAllMarkers();
      }
      return;
    }

    const markers = manager.createPlantMarkers(plants);

    if (enableClustering) {
      manager.addMarkersWithClustering(markers);
    } else {
      manager.addMarkersWithoutClustering(markers);
    }

    return () => {
      if (manager) {
        manager.clearAllMarkers();
      }
    };
  }, [isVisible, plants, enableClustering, manager]);

  // Функция для ручной очистки маркеров
  const clearMarkers = useCallback(() => {
    if (manager) {
      manager.clearAllMarkers();
    }
  }, [manager]);

  return { clearMarkers };
}; 
