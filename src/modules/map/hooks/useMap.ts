import { useEffect, useState } from 'react';
import * as mapService from '../services/mapService';
import { AreaType, MapArea, MapLayer, MapMarker, MapOptions, MarkerType } from '../types';

interface UseMapResult {
  markers: MapMarker[];
  areas: MapArea[];
  layers: MapLayer[];
  loading: boolean;
  error: string | null;
  options: MapOptions;
  setMarkerTypeFilter: (types: MarkerType[] | null) => void;
  setAreaTypeFilter: (types: AreaType[] | null) => void;
}

/**
 * Хук для работы с картой
 * @param initialOptions - Начальные опции карты
 * @param defaultMarkerTypes - Типы маркеров, которые нужно загрузить по умолчанию (все, если не указано)
 * @param defaultAreaTypes - Типы областей, которые нужно загрузить по умолчанию (все, если не указано)
 * @returns UseMapResult - Данные карты и функции для управления фильтрами
 */
export const useMap = (
  initialOptions: Partial<MapOptions> = {},
  defaultMarkerTypes: MarkerType[] | null = null,
  defaultAreaTypes: AreaType[] | null = null
): UseMapResult => {
  // Состояние
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [areas, setAreas] = useState<MapArea[]>([]);
  const [layers, setLayers] = useState<MapLayer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [markerTypeFilter, setMarkerTypeFilter] = useState<MarkerType[] | null>(defaultMarkerTypes);
  const [areaTypeFilter, setAreaTypeFilter] = useState<AreaType[] | null>(defaultAreaTypes);

  // Опции карты по умолчанию
  const defaultOptions: MapOptions = {
    center: [55.75, 37.61], // Москва (или координаты вашего ботанического сада)
    zoom: 14,
    minZoom: 12,
    maxZoom: 19,
  };

  // Объединяем опции по умолчанию с переданными
  const options: MapOptions = { ...defaultOptions, ...initialOptions };

  // Загрузка данных при изменении фильтров
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Загрузка слоев карты
        const mapLayers = await mapService.getMapLayers();
        setLayers(mapLayers);

        // Загрузка маркеров
        let mapMarkers: MapMarker[] = [];
        if (markerTypeFilter && markerTypeFilter.length > 0) {
          // Загружаем маркеры по типам
          const markersPromises = markerTypeFilter.map(type => mapService.getMarkersByType(type));
          const markersArrays = await Promise.all(markersPromises);
          // Объединяем все массивы маркеров
          mapMarkers = markersArrays.flat();
        } else {
          // Загружаем все маркеры
          mapMarkers = await mapService.getMapMarkers();
        }
        setMarkers(mapMarkers);

        // Загрузка областей
        let mapAreas: MapArea[] = [];
        if (areaTypeFilter && areaTypeFilter.length > 0) {
          // Загружаем области по типам
          const areasPromises = areaTypeFilter.map(type => mapService.getAreasByType(type));
          const areasArrays = await Promise.all(areasPromises);
          // Объединяем все массивы областей
          mapAreas = areasArrays.flat();
        } else {
          // Загружаем все области
          mapAreas = await mapService.getMapAreas();
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

    fetchData();
  }, [markerTypeFilter, areaTypeFilter]);

  return {
    markers,
    areas,
    layers,
    loading,
    error,
    options,
    setMarkerTypeFilter,
    setAreaTypeFilter,
  };
}; 