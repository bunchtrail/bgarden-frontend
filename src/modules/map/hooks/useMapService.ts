import { useCallback, useState } from 'react';
import { SectorType, Specimen } from '../../specimens/types';
import { debouncedMapService, mapService } from '../services/mapService';
import { specimenService } from '../services/specimenService';
import { MapData, MapError } from '../types';

/**
 * Хук, предоставляющий доступ ко всем методам API сервиса карты
 * с поддержкой дебаунсинга и кеширования часто вызываемых методов
 */
export const useMapService = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<MapError | null>(null);

  // Получение карты по ID - используем дебаунсированный метод
  const getMapById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const result = await debouncedMapService.getMapById(id);
      setError(null);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Не удалось получить данные карты';
      setError({ message: errorMessage });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Получение карты со всеми образцами растений - используем дебаунсированный метод
  const getMapWithSpecimens = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const result = await debouncedMapService.getMapWithSpecimens(id);
      setError(null);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Не удалось получить данные карты с образцами';
      setError({ message: errorMessage });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Получение списка всех карт - используем дебаунсированный метод
  const getAllMaps = useCallback(async () => {
    try {
      setLoading(true);
      const result = await debouncedMapService.getAllMaps();
      setError(null);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Не удалось получить список карт';
      setError({ message: errorMessage });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Получение активной карты - используем дебаунсированный метод
  const getActiveMap = useCallback(async () => {
    try {
      setLoading(true);
      const result = await debouncedMapService.getActiveMap();
      setError(null);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Не удалось получить активную карту';
      setError({ message: errorMessage });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Получение образцов растений по типу сектора
  const getSpecimensBySector = useCallback(async (sectorType: SectorType) => {
    try {
      setLoading(true);
      const result = await specimenService.getSpecimensBySectorType(sectorType);
      setError(null);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || `Не удалось получить образцы для сектора ${sectorType}`;
      setError({ message: errorMessage });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Получение всех образцов растений
  const getAllSpecimens = useCallback(async () => {
    try {
      setLoading(true);
      console.log('useMapService: Запрашиваю все образцы растений...');
      const result = await specimenService.getAllSpecimens();
      console.log(`useMapService: Получено ${result ? result.length : 0} образцов растений`);
      setError(null);
      return result;
    } catch (err: any) {
      console.error('useMapService: Ошибка при получении всех образцов растений:', err);
      const errorMessage = err.message || 'Не удалось получить все образцы растений';
      setError({ message: errorMessage });

      // Попробуем альтернативный метод, если основной не работает
      try {
        console.log('useMapService: Попытка получить образцы через альтернативный метод...');
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:7254/api';
        const response = await fetch(`${API_URL}/Specimen/all`, {
          headers: {
            'Accept': 'text/plain'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`useMapService: Альтернативным методом получено ${data ? data.length : 0} образцов`);
          return data;
        } else {
          console.error(`useMapService: Альтернативный метод тоже не сработал. Статус: ${response.status}`);
        }
      } catch (fetchErr) {
        console.error('useMapService: Ошибка при альтернативном получении образцов:', fetchErr);
      }
      
      return [];
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading]);

  // Получение отфильтрованных образцов растений
  const getFilteredSpecimens = useCallback(async (name?: string, familyId?: number, regionId?: number) => {
    try {
      setLoading(true);
      const result = await mapService.getFilteredSpecimens(name, familyId, regionId);
      setError(null);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Не удалось получить отфильтрованные образцы';
      setError({ message: errorMessage });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Получение образца растения по ID
  const getSpecimenById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const result = await mapService.getSpecimenById(id);
      setError(null);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || `Не удалось получить образец с ID ${id}`;
      setError({ message: errorMessage });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Добавление нового образца растения
  const addSpecimen = useCallback(async (specimen: Omit<Specimen, 'id'>) => {
    try {
      setLoading(true);
      const result = await specimenService.createSpecimen(specimen);
      setError(null);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Не удалось добавить новый образец';
      setError({ message: errorMessage });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Обновление существующего образца растения
  const updateSpecimen = useCallback(async (id: number, specimen: Specimen) => {
    try {
      setLoading(true);
      const result = await specimenService.updateSpecimen(id, specimen);
      setError(null);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || `Не удалось обновить образец с ID ${id}`;
      setError({ message: errorMessage });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Удаление образца растения
  const deleteSpecimen = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const result = await specimenService.deleteSpecimen(id);
      setError(null);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || `Не удалось удалить образец с ID ${id}`;
      setError({ message: errorMessage });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Загрузка пользовательского изображения карты
  const uploadMapImage = useCallback(async (mapId: number, file: File) => {
    try {
      setLoading(true);
      const result = await mapService.uploadMapImage(mapId, file);
      setError(null);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || `Не удалось загрузить изображение карты`;
      setError({ message: errorMessage });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Получение полного URL для изображения карты
  const getMapImageUrl = useCallback((filePath: string) => {
    return mapService.getMapImageUrl(filePath);
  }, []);

  // Переключение активного статуса карты
  const toggleMapActive = useCallback(async (mapId: number, isActive: boolean) => {
    try {
      setLoading(true);
      const result = await mapService.toggleMapActive(mapId, isActive);
      setError(null);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || `Не удалось изменить статус карты`;
      setError({ message: errorMessage });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Создание новой карты
  const createMap = useCallback(async (mapData: Omit<MapData, 'id' | 'filePath' | 'contentType' | 'fileSize' | 'uploadDate' | 'lastUpdated' | 'specimensCount'>) => {
    try {
      setLoading(true);
      const result = await mapService.createMap(mapData);
      setError(null);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Не удалось создать новую карту';
      setError({ message: errorMessage });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Обновление информации о карте
  const updateMap = useCallback(async (id: number, mapData: Partial<MapData>) => {
    try {
      setLoading(true);
      const result = await mapService.updateMap(id, mapData);
      setError(null);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || `Не удалось обновить информацию о карте`;
      setError({ message: errorMessage });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Удаление карты
  const deleteMap = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const result = await mapService.deleteMap(id);
      setError(null);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || `Не удалось удалить карту с ID ${id}`;
      setError({ message: errorMessage });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    // Методы для работы с картами
    getMapById,
    getMapWithSpecimens,
    getAllMaps,
    getActiveMap,
    createMap,
    updateMap,
    deleteMap,
    uploadMapImage,
    getMapImageUrl,
    toggleMapActive,
    // Методы для работы с образцами
    getSpecimensBySector,
    getAllSpecimens,
    getFilteredSpecimens,
    getSpecimenById,
    addSpecimen,
    updateSpecimen,
    deleteSpecimen
  };
};

export default useMapService; 