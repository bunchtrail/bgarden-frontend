import { useMemo, useCallback } from 'react';
import { MapLayerProps } from '../components/MapPage';

interface UseMapLayersProps {
  visibleLayers: string[];
  customLayers?: MapLayerProps[];
  mapImageUrl: string | null;
}

interface UseMapLayersReturn {
  isLayerVisible: (layerId: string) => boolean;
  sortedLayers: MapLayerProps[];
  hasMapImage: boolean;
}

/**
 * Хук для управления слоями карты
 * Предоставляет функциональность для проверки видимости слоев и их сортировки
 */
export const useMapLayers = ({
  visibleLayers,
  customLayers = [],
  mapImageUrl
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

  return {
    isLayerVisible,
    sortedLayers,
    hasMapImage
  };
};

export default useMapLayers; 