import { useState, useEffect } from 'react';
import { familyService, FamilyDto } from '../services/familyService';
import { expositionService, ExpositionDto } from '../services/expositionService';
import { getAllRegions } from '@/services/regions';
import { RegionData } from '../../map/types/mapTypes';

/**
 * Хук для загрузки справочных данных для форм работы с образцами
 */
export const useReferenceData = () => {
  const [families, setFamilies] = useState<FamilyDto[]>([]);
  const [expositions, setExpositions] = useState<ExpositionDto[]>([]);
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        setLoading(true);
        
        // Параллельная загрузка всех справочников
        const [familiesData, expositionsData, regionsData] = await Promise.all([
          familyService.getAllFamilies(),
          expositionService.getAllExpositions(),
          getAllRegions()
        ]);
        
        setFamilies(familiesData);
        setExpositions(expositionsData);
        setRegions(regionsData);
      } catch (err) {
        console.error('Ошибка при загрузке справочных данных:', err);
        setError('Не удалось загрузить справочные данные');
      } finally {
        setLoading(false);
      }
    };

    fetchReferenceData();
  }, []);

  return { families, expositions, regions, loading, error };
}; 