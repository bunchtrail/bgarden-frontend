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
 * @param interactionMode Режим взаимодействия с маркерами
 * @returns Объект с функцией для очистки маркеров
 */
export const useMarkers = (
  map: L.Map | null,
  plants: Plant[],
  isVisible: boolean,
  enableClustering: boolean,
  showPopupOnClick: boolean = true,
  interactionMode: string = 'view'
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
      const newManager = new MarkerClusterManager(
        map,
        showPopupOnClick,
        interactionMode
      );
      setManager(newManager);

      return () => {
        newManager.clearAllMarkers(true); // Полная очистка при размонтировании компонента
      };
    }
  }, [map, showPopupOnClick, interactionMode]);

  useEffect(() => {
    if (manager) {
      manager.setShowPopupOnClick(showPopupOnClick);
    }
  }, [manager, showPopupOnClick]);

  // Обновляем режим взаимодействия при его изменении
  useEffect(() => {
    if (manager) {
      manager.setInteractionMode(interactionMode);
    }
  }, [manager, interactionMode]);

  useEffect(() => {
    if (!isVisible || !manager) {
      if (manager) manager.clearAllMarkers(false); // Сохраняем кэш при скрытии
      return;
    }

    if (plants.length === 0) {
      manager.clearAllMarkers(false); // Сохраняем кэш при отсутствии растений
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
      manager.clearAllMarkers(true); // Полная очистка включая кэш только при явном вызове
      isInitialMarkersLoad.current = true;
    }
  }, [manager]);

  return { clearMarkers };
};
