import { useMapContext } from '../contexts/MapContext';

/**
 * Хук для использования функциональности карты
 * Предоставляет доступ к состоянию и методам контекста карты
 */
export const useMap = () => {
  return useMapContext();
}; 