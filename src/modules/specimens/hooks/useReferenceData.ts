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
        
        // Загружаем справочники с разными требованиями к авторизации
        const promises = [];
        
        // Семейства и экспозиции - загружаем без требования авторизации для чтения
        promises.push(
          familyService.getAllFamilies().catch(err => {
            console.warn('Не удалось загрузить семейства:', err);
            return []; // Возвращаем пустой массив при ошибке
          })
        );
        
        promises.push(
          expositionService.getAllExpositions().catch(err => {
            console.warn('Не удалось загрузить экспозиции:', err);
            return []; // Возвращаем пустой массив при ошибке
          })
        );
        
        // Регионы обычно доступны без авторизации
        promises.push(
          getAllRegions().catch(err => {
            console.warn('Не удалось загрузить регионы:', err);
            return []; // Возвращаем пустой массив при ошибке
          })
        );
        
        const [familiesData, expositionsData, regionsData] = await Promise.all(promises);
        
        setFamilies(familiesData as FamilyDto[]);
        setExpositions(expositionsData as ExpositionDto[]);
        setRegions(regionsData as RegionData[]);
      } catch (err) {
        console.error('Ошибка при загрузке справочных данных:', err);
        setError('Некоторые справочные данные недоступны');
      } finally {
        setLoading(false);
      }
    };

    fetchReferenceData();
  }, []);

  return { families, expositions, regions, loading, error };
}; 