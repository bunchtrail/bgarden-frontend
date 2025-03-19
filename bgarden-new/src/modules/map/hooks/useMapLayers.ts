import { useCallback, useMemo } from 'react';
import { MapLayerProps } from '../components/MapPage';
import { RegionData } from '../types/mapTypes';
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
  shouldShowLabels: boolean;
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
  config
}: UseMapLayersProps): UseMapLayersReturn => {
  // Проверка видимости слоя
  const isLayerVisible = useCallback((layerId: string) => {
    return visibleLayers.includes(layerId);
  }, [visibleLayers]);

  // Сортируем пользовательские слои по порядку
  const sortedLayers = useMemo(() => {
    return [...customLayers].sort((a, b) => a.order - b.order);
  }, [customLayers]);

  // Проверка наличия изображения карты
  const hasMapImage = !!mapImageUrl;
  
  // Фильтрация регионов (может быть расширена дополнительной логикой)
  const filteredRegions = useMemo(() => {
    return regions;
  }, [regions]);
  
  // Определяем, нужно ли показывать регионы и метки
  const shouldShowRegions = isLayerVisible('regions');
  const shouldShowLabels = config?.showLabels !== undefined 
    ? config.showLabels 
    : isLayerVisible('labels');

  return {
    isLayerVisible,
    sortedLayers,
    hasMapImage,
    filteredRegions,
    shouldShowRegions,
    shouldShowLabels
  };
};

export default useMapLayers; 