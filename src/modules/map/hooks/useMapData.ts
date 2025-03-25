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
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(autoLoad);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  
  const { setAreas } = useMap();

  // Проверка, пуста ли карта (нет растений и регионов)
  const checkIfEmpty = useCallback((regionsData: RegionData[] = [], plantsData: any[] = []) => {
    const hasRegions = regionsData && Array.isArray(regionsData) && regionsData.length > 0;
    const hasPlants = plantsData && Array.isArray(plantsData) && plantsData.length > 0;
    
    return !hasRegions && !hasPlants;
  }, []);

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
      let regionsData: RegionData[] = [];
      try {
        regionsData = await getAllRegions();
        setRegions(regionsData);
      } catch (regionsError) {
        regionsData = [];
        setRegions([]);
      }
      
      // Получаем данные о растениях (пытаемся, но не блокируем выполнение)
      let plantsData: any[] = [];
      try {
        // Здесь можно добавить получение данных о растениях,
        // но не блокируем загрузку карты если API растений недоступно
        // Кодом не реализуем, т.к. это будет обрабатываться в EnhancedPlantMarkersLayer
      } catch (plantError) {
        plantsData = [];
      }
      setPlants(plantsData);
      
      // Проверяем, пуста ли карта
      const mapIsEmpty = checkIfEmpty(regionsData, plantsData);
      setIsEmpty(mapIsEmpty);
      
      // Преобразуем данные регионов для MapContext
      if (regionsData && Array.isArray(regionsData) && regionsData.length > 0) {
        const areasData = convertRegionsToAreas(regionsData);
        setAreas(areasData);
      } else {
        // Если регионов нет, устанавливаем пустой массив
        setAreas([]);
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
  }, [mapData, regions, lastUpdated, cacheResults, setAreas, onDataLoaded, onError, checkIfEmpty]);

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

  // Обновляем локальное состояние и отправляем событие при изменении данных
  useEffect(() => {
    // Обновляем значение isEmpty
    const hasNoData = !mapImageUrl || !regions || regions.length === 0;
    
    setIsEmpty(hasNoData);
    
    // Если ошибка, выход
    if (error) return;
    
    // Удалено логирование состояния данных карты
    
    // Вызываем колбэк, если передан
    if (onDataLoaded && !loading && !error) {
      onDataLoaded({
        mapData,
        regions
      });
    }
  }, [loading, error, mapData, regions, plants, mapImageUrl, onDataLoaded]);

  return {
    mapData,
    regions,
    plants,
    loading,
    error,
    mapImageUrl,
    fetchMapData,
    refreshMapData,
    lastUpdated,
    isEmpty
  };
}; 