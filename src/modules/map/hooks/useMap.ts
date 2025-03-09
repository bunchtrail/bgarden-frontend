import { useEffect, useState } from 'react';
import { getMapAreas, getAreasByType } from '../services/map/areaService';
import { getMapMarkers, getMarkersByType, getNearbyMarkers } from '../services/map/markerService';
import { getMapLayers } from '../services/map/optionsService';
import { getDefaultMapOptions } from '../services/map/optionsService';
import { AreaType, MapArea, MapLayer, MapMarker, MapOptions, MarkerType } from '../types';

interface UseMapResult {
  markers: MapMarker[];
  areas: MapArea[];
  layers: MapLayer[];
  options: MapOptions | null;
  loading: boolean;
  error: string | null;
  setMarkerTypeFilter: (types: MarkerType[] | null) => void;
  setAreaTypeFilter: (types: AreaType[] | null) => void;
  nearbyMarkers: MapMarker[];
  findNearbyMarkers: (lat: number, lng: number, radius?: number) => Promise<void>;
}

/**
 * Хук для работы с картой
 * @param initialOptions - Начальные опции карты (если не указаны, будут запрошены с сервера)
 * @param defaultMarkerTypes - Типы маркеров, которые нужно загрузить по умолчанию (все, если не указано)
 * @param defaultAreaTypes - Типы областей, которые нужно загрузить по умолчанию (все, если не указано)
 * @returns UseMapResult - Данные карты и функции для управления фильтрами
 */
export const useMap = (
  initialOptions?: Partial<MapOptions>,
  defaultMarkerTypes: MarkerType[] | null = null,
  defaultAreaTypes: AreaType[] | null = null
): UseMapResult => {
  // Состояние
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [areas, setAreas] = useState<MapArea[]>([]);
  const [layers, setLayers] = useState<MapLayer[]>([]);
  const [options, setOptions] = useState<MapOptions | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [markerTypeFilter, setMarkerTypeFilter] = useState<MarkerType[] | null>(defaultMarkerTypes);
  const [areaTypeFilter, setAreaTypeFilter] = useState<AreaType[] | null>(defaultAreaTypes);
  const [nearbyMarkers, setNearbyMarkers] = useState<MapMarker[]>([]);

  // Опции карты по умолчанию, если не удалось загрузить с сервера
  const defaultMapOptions: MapOptions = {
    center: [55.75, 37.61], // Москва (или координаты вашего ботанического сада)
    zoom: 14,
    minZoom: 12,
    maxZoom: 19,
  };

  // Загрузка данных с сервера
  const fetchData = async () => {
    setLoading(true);
    try {
      // Загрузка опций карты
      let mapOptions: MapOptions | null = null;
      try {
        mapOptions = await getDefaultMapOptions();
      } catch (optionsError) {
        console.error('Ошибка загрузки опций карты:', optionsError);
      }

      // Если опции не получены с сервера, используем переданные или стандартные
      if (!mapOptions) {
        mapOptions = initialOptions ? { ...defaultMapOptions, ...initialOptions } : defaultMapOptions;
      }
      setOptions(mapOptions);

      // Загрузка слоев карты
      const mapLayers = await getMapLayers();
      setLayers(mapLayers);

      // Загрузка маркеров
      let mapMarkers: MapMarker[] = [];
      if (markerTypeFilter && markerTypeFilter.length > 0) {
        // Загружаем маркеры по типам
        const markersPromises = markerTypeFilter.map(type => getMarkersByType(type));
        const markersArrays = await Promise.all(markersPromises);
        // Объединяем все массивы маркеров
        mapMarkers = markersArrays.flat();
      } else {
        // Загружаем все маркеры
        mapMarkers = await getMapMarkers();
      }
      setMarkers(mapMarkers);

      // Загрузка областей
      let mapAreas: MapArea[] = [];
      if (areaTypeFilter && areaTypeFilter.length > 0) {
        // Загружаем области по типам
        const areasPromises = areaTypeFilter.map(type => getAreasByType(type));
        const areasArrays = await Promise.all(areasPromises);
        // Объединяем все массивы областей
        mapAreas = areasArrays.flat();
      } else {
        // Загружаем все области
        mapAreas = await getMapAreas();
      }
      setAreas(mapAreas);

      setError(null);
    } catch (err) {
      console.error('Ошибка загрузки данных карты:', err);
      setError('Не удалось загрузить данные карты');
    } finally {
      setLoading(false);
    }
  };

  // Выполнение поиска близлежащих маркеров
  const findNearby = async (lat: number, lng: number, radius: number = 100) => {
    try {
      const nearby = await getNearbyMarkers(lat, lng, radius);
      setNearbyMarkers(nearby);
    } catch (err) {
      console.error('Ошибка поиска ближайших маркеров:', err);
    }
  };

  // Загрузка данных при изменении фильтров
  useEffect(() => {
    fetchData();
  }, [markerTypeFilter, areaTypeFilter]);

  return {
    markers,
    areas,
    layers,
    options,
    loading,
    error,
    setMarkerTypeFilter,
    setAreaTypeFilter,
    nearbyMarkers,
    findNearbyMarkers: findNearby
  };
}; 