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
  const [notFound, setNotFound] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchSpecimen = async () => {
      try {
        setLoading(true);
        setError(null);
        setNotFound(false);
        
        // Обрабатываем случай нового образца: id может быть 'new' или undefined на маршруте /specimens/new
        if (id && id !== 'new') {
          // Проверяем, что ID является числом
          const numericId = Number(id);
          if (isNaN(numericId) || numericId <= 0) {
            setNotFound(true);
            setError('Некорректный ID образца');
            return;
          }

          const specimenData = await specimenService.getSpecimenById(numericId);
          setSpecimen(specimenData);
        } else {
          // Для нового образца устанавливаем null
          setSpecimen(null);
        }
      } catch (err: any) {
        // Не логируем 404 ошибки в консоль, так как они ожидаемы и обрабатываются
        if (err?.status !== 404) {
          console.error('Ошибка при загрузке образца:', err);
        }
        
        // Проверяем тип ошибки
        if (err?.status === 404) {
          setNotFound(true);
          setError('Образец не найден');
        } else if (err?.status === 400) {
          setNotFound(true);
          setError('Некорректный запрос');
        } else if (err?.status >= 500) {
          setError('Ошибка сервера. Попробуйте позже');
        } else {
          setError('Не удалось загрузить данные образца');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSpecimen();
  }, [id]);

  return { specimen, loading, error, notFound, setSpecimen };
}; 