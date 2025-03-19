import { useState, useEffect, useCallback } from 'react';
import { getActiveMap, getMapImageUrl, MapData } from '../services/mapService';
import { getAllRegions, convertRegionsToAreas } from '../services/regionService';
import { RegionData } from '../types/mapTypes';
import { useMap } from './useMap';
import { logError } from '@/utils/logger';

/**
 * Хук для загрузки и управления данными карты
 * Инкапсулирует логику получения данных карты, регионов и поддерживает кеширование для оптимизации
 */
export const useMapData = (options?: {
  autoLoad?: boolean;  // Автоматически загружать данные при монтировании
  cacheResults?: boolean; // Кешировать результаты
  onError?: (error: Error) => void; // Обработчик ошибок
  onDataLoaded?: (data: { mapData: MapData | null, regions: RegionData[] }) => void; // Колбэк после загрузки
}) => {
  const { autoLoad = true, cacheResults = true, onError, onDataLoaded } = options || {};
  
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [loading, setLoading] = useState<boolean>(autoLoad);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const { setAreas } = useMap();

  // Мемоизированная функция получения данных карты
  const fetchMapData = useCallback(async (forceUpdate = false) => {
    // Если есть кешированные данные и не требуется принудительное обновление, возвращаем их
    if (cacheResults && mapData && regions.length > 0 && !forceUpdate && lastUpdated) {
      return { mapData, regions };
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Получаем данные активной карты
      const maps = await getActiveMap();
      const currentMapData = maps && maps.length > 0 ? maps[0] : null;
      setMapData(currentMapData);
      
      // Получаем регионы карты
      const regionsData = await getAllRegions();
      setRegions(regionsData);
      
      // Преобразуем данные регионов для MapContext
      if (regionsData && regionsData.length > 0) {
        const areasData = convertRegionsToAreas(regionsData);
        setAreas(areasData);
      }
      
      setLastUpdated(new Date());
      setLoading(false);
      
      // Вызываем колбэк, если он предоставлен
      if (onDataLoaded) {
        onDataLoaded({ mapData: currentMapData, regions: regionsData });
      }
      
      return { mapData: currentMapData, regions: regionsData };
    } catch (err) {
      const errorMessage = 'Не удалось загрузить данные карты. Пожалуйста, попробуйте позже.';
      logError('Ошибка при загрузке данных карты:', err);
      setError(errorMessage);
      setLoading(false);
      
      if (onError && err instanceof Error) {
        onError(err);
      }
      
      throw err;
    }
  }, [mapData, regions, lastUpdated, cacheResults, setAreas, onDataLoaded, onError]);

  // Эффект для автоматической загрузки данных при монтировании
  useEffect(() => {
    if (autoLoad) {
      fetchMapData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Получение URL изображения карты
  const mapImageUrl = mapData ? getMapImageUrl(mapData) : null;

  // Освежение данных карты
  const refreshMapData = () => fetchMapData(true);

  return {
    mapData,
    regions,
    loading,
    error,
    mapImageUrl,
    fetchMapData,
    refreshMapData,
    lastUpdated
  };
}; 