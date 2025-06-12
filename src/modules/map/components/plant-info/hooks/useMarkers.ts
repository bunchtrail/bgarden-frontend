import { useState, useEffect, useCallback, useRef } from 'react';
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
  const isInitialMarkersLoad = useRef(true);

  // Сбрасываем флаг, если видимость слоя выключается
  useEffect(() => {
    if (!isVisible) {
      isInitialMarkersLoad.current = true;
    }
  }, [isVisible]);

  useEffect(() => {
    if (map) {
      const newManager = new MarkerClusterManager(map, showPopupOnClick);
      setManager(newManager);

      return () => {
        newManager.clearAllMarkers();
      };
    }
  }, [map, showPopupOnClick]);

  useEffect(() => {
    if (manager) {
      manager.setShowPopupOnClick(showPopupOnClick);
    }
  }, [manager, showPopupOnClick]);

  useEffect(() => {
    if (!isVisible || !manager) {
      if (manager) manager.clearAllMarkers();
      return;
    }

    if (plants.length === 0) {
      manager.clearAllMarkers();
      return;
    }

    const markers = manager.createPlantMarkers(plants);

    if (enableClustering) {
      manager.addMarkersWithClustering(markers, {
        fitBounds: !isInitialMarkersLoad.current,
      });
    } else {
      manager.addMarkersWithoutClustering(markers);
    }

    if (isInitialMarkersLoad.current) {
      isInitialMarkersLoad.current = false;
    }

    // ВНИМАНИЕ: Очистка маркеров при размонтировании эффекта здесь может быть избыточной
    // и приводить к мерцанию. `clearAllMarkers` уже вызывается при изменении isVisible.
    // Если будут проблемы, эту часть можно удалить.
    // return () => {
    //   if (manager) {
    //     manager.clearAllMarkers();
    //   }
    // };
  }, [isVisible, plants, enableClustering, manager]);

  const clearMarkers = useCallback(() => {
    if (manager) {
      manager.clearAllMarkers();
      isInitialMarkersLoad.current = true;
    }
  }, [manager]);

  return { clearMarkers };
};
