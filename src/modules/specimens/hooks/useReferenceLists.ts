import { useEffect, useState } from 'react';
import {
    expositionService,
    familyService,
    regionService
} from '../services';

interface ReferenceOption {
  id: number;
  name: string;
}

interface UseReferenceListsResult {
  familyOptions: ReferenceOption[];
  expositionOptions: ReferenceOption[];
  regionOptions: ReferenceOption[];
  isLoading: boolean;
  error: string | null;
  reloadAll: () => Promise<void>;
}

/**
 * Хук для загрузки и управления справочными данными (семейства, экспозиции, регионы)
 */
export const useReferenceLists = (): UseReferenceListsResult => {
  const [familyOptions, setFamilyOptions] = useState<ReferenceOption[]>([]);
  const [expositionOptions, setExpositionOptions] = useState<ReferenceOption[]>([]);
  const [regionOptions, setRegionOptions] = useState<ReferenceOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка справочных данных при первой загрузке компонента
  useEffect(() => {
    loadReferenceData();
  }, []);

  /**
   * Загружает все справочные данные
   */
  const loadReferenceData = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Загружаем все справочники параллельно для ускорения
      const [families, expositions, regions] = await Promise.all([
        familyService.getAllFamilies(),
        expositionService.getAllExpositions(),
        regionService.getAllRegions()
      ]);

      setFamilyOptions(families);
      setExpositionOptions(expositions);
      setRegionOptions(regions);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Ошибка загрузки справочных данных';
      
      setError(errorMessage);
      console.error('Ошибка загрузки справочных данных:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    familyOptions,
    expositionOptions,
    regionOptions,
    isLoading,
    error,
    reloadAll: loadReferenceData
  };
}; 