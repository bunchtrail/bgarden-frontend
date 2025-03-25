import { useState, useEffect } from 'react';
import { specimenService } from '../services/specimenService';
import { Specimen } from '../types';

/**
 * Хук для загрузки данных образца по ID
 */
export const useSpecimenData = (id: string | undefined) => {
  const [specimen, setSpecimen] = useState<Specimen | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSpecimen = async () => {
      try {
        setLoading(true);
        
        // Обрабатываем случай нового образца: id может быть 'new' или undefined на маршруте /specimens/new
        if (id && id !== 'new') {
          const specimenData = await specimenService.getSpecimenById(Number(id));
          setSpecimen(specimenData);
        } else {
          // Для нового образца устанавливаем null
          setSpecimen(null);
        }
      } catch (err) {
        setError('Не удалось загрузить данные образца');
        console.error('Ошибка при загрузке образца:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecimen();
  }, [id]);

  return { specimen, loading, error, setSpecimen };
}; 