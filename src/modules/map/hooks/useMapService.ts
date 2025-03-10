import { useCallback, useState } from 'react';
import { SectorType, Specimen } from '../../specimens/types';
import { mapService } from '../services/mapService';
import { MapData, MapError } from '../types';

/**
 * Хук, предоставляющий доступ ко всем методам API сервиса карты
 */
export const useMapService = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<MapError | null>(null);

  // Получение карты по ID
  const getMapById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const result = await mapService.getMapById(id);
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

  // Получение карты со всеми образцами растений
  const getMapWithSpecimens = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const result = await mapService.getMapWithSpecimens(id);
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

  // Получение списка всех карт
  const getAllMaps = useCallback(async () => {
    try {
      setLoading(true);
      const result = await mapService.getAllMaps();
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

  // Получение активной карты
  const getActiveMap = useCallback(async () => {
    try {
      setLoading(true);
      const result = await mapService.getActiveMap();
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
      const result = await mapService.getSpecimensBySector(sectorType);
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
      const result = await mapService.getAllSpecimens();
      setError(null);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Не удалось получить все образцы растений';
      setError({ message: errorMessage });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

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
      const result = await mapService.addSpecimen(specimen);
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
      const result = await mapService.updateSpecimen(id, specimen);
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
      const result = await mapService.deleteSpecimen(id);
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