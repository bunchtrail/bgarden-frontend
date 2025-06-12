import { useCallback, useMemo } from 'react';
import { MapLayerProps } from '../types/mapTypes';
import { RegionData } from '@/services/regions/types';
import { MapConfig } from '../contexts/MapConfigContext';

interface UseMapLayersProps {
  visibleLayers: string[];
  customLayers?: MapLayerProps[];
  mapImageUrl?: string | null;
  regions?: RegionData[];
  config?: Partial<MapConfig>;
}

interface UseMapLayersReturn {
  isLayerVisible: (layerId: string) => boolean;
  sortedLayers: MapLayerProps[];
  hasMapImage: boolean;
  filteredRegions: RegionData[];
  shouldShowRegions: boolean;
}

/**
 * Расширенный хук для управления слоями карты
 * Предоставляет функциональность для проверки видимости слоев,
 * их сортировки и фильтрации регионов
 */
export const useMapLayers = ({
  visibleLayers,
  customLayers = [],
  mapImageUrl,
  regions = [],
  config,
}: UseMapLayersProps): UseMapLayersReturn => {
  // Проверка видимости слоя
  const isLayerVisible = useCallback(
    (layerId: string) => {
      return visibleLayers.includes(layerId);
    },
    [visibleLayers]
  );

  // Сортируем пользовательские слои по порядку
  const sortedLayers = useMemo(() => {
    return [...customLayers].sort((a, b) => a.order - b.order);
  }, [customLayers]);

  // Проверка наличия изображения карты
  const hasMapImage = !!mapImageUrl;
  // Фильтрация регионов по типу карты и другим условиям
  const filteredRegions = useMemo(() => {
    if (!config?.mapType) {
      return regions; // Если тип карты не указан, возвращаем все регионы
    }

    // Фильтруем регионы по типу карты
    return regions.filter((region) => {
      // Если у региона не указан mapType, включаем его для обратной совместимости
      if (!region.mapType) {
        return true;
      }

      // Показываем только регионы, соответствующие текущему типу карты
      return region.mapType === config.mapType;
    });
  }, [regions, config?.mapType]);

  // Определяем, нужно ли показывать регионы
  const shouldShowRegions = isLayerVisible('regions');

  return {
    isLayerVisible,
    sortedLayers,
    hasMapImage,
    filteredRegions,
    shouldShowRegions,
  };
};

export default useMapLayers;
