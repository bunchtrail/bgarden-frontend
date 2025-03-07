import { useEffect, useState } from 'react';
import { specimenService } from '../services';
import { SectorType, Specimen } from '../types';

interface UseSpecimensProps {
  sectorType: SectorType;
  onError?: (error: Error) => void;
}

interface UseSpecimensResult {
  specimens: Specimen[];
  filteredSpecimens: Specimen[];
  setFilteredSpecimens: React.Dispatch<React.SetStateAction<Specimen[]>>;
  currentSpecimen: Specimen | null;
  setCurrentSpecimen: React.Dispatch<React.SetStateAction<Specimen | null>>;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  error: string | null;
  
  // Действия с образцами
  createSpecimen: (data: Omit<Specimen, 'id'>) => Promise<Specimen>;
  updateSpecimen: (id: number, data: Specimen) => Promise<Specimen>;
  deleteSpecimen: (id: number) => Promise<boolean>;
  
  // Навигация по образцам
  navigateToFirst: () => void;
  navigateToLast: () => void;
  navigateToPrev: () => void;
  navigateToNext: () => void;
  navigateToIndex: (index: number) => void;
}

export const useSpecimens = ({ sectorType, onError }: UseSpecimensProps): UseSpecimensResult => {
  // Состояние данных
  const [specimens, setSpecimens] = useState<Specimen[]>([]);
  const [filteredSpecimens, setFilteredSpecimens] = useState<Specimen[]>([]);
  const [currentSpecimen, setCurrentSpecimen] = useState<Specimen | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка образцов при изменении сектора
  useEffect(() => {
    loadSpecimens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectorType]);

  // Установка текущего образца при изменении индекса или списка образцов
  useEffect(() => {
    if (filteredSpecimens.length > 0 && currentIndex >= 0 && currentIndex < filteredSpecimens.length) {
      setCurrentSpecimen(filteredSpecimens[currentIndex]);
    } else {
      setCurrentSpecimen(null);
    }
  }, [filteredSpecimens, currentIndex]);

  // Загрузка образцов с сервера
  const loadSpecimens = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await specimenService.getSpecimensBySectorType(sectorType);
      setSpecimens(data);
      setFilteredSpecimens(data);
      
      // Сбрасываем текущий индекс и устанавливаем первый образец как текущий
      if (data.length > 0) {
        setCurrentIndex(0);
        setCurrentSpecimen(data[0]);
      } else {
        setCurrentSpecimen(null);
      }
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки образцов';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Создание нового образца
  const createSpecimen = async (data: Omit<Specimen, 'id'>): Promise<Specimen> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const savedSpecimen = await specimenService.createSpecimen(data);
      
      // Обновляем список образцов
      setSpecimens(prev => [...prev, savedSpecimen]);
      setFilteredSpecimens(prev => [...prev, savedSpecimen]);
      
      // Устанавливаем новый образец как текущий
      setCurrentIndex(filteredSpecimens.length);
      setCurrentSpecimen(savedSpecimen);
      
      return savedSpecimen;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания образца';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Обновление существующего образца
  const updateSpecimen = async (id: number, data: Specimen): Promise<Specimen> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedSpecimen = await specimenService.updateSpecimen(id, data);
      
      // Обновляем списки образцов
      setSpecimens(prev => prev.map(s => s.id === id ? updatedSpecimen : s));
      setFilteredSpecimens(prev => prev.map(s => s.id === id ? updatedSpecimen : s));
      
      // Обновляем текущий образец, если это он
      if (currentSpecimen?.id === id) {
        setCurrentSpecimen(updatedSpecimen);
      }
      
      return updatedSpecimen;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка обновления образца';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Удаление образца
  const deleteSpecimen = async (id: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await specimenService.deleteSpecimen(id);
      
      if (success) {
        // Удаляем образец из списков
        const updatedSpecimens = specimens.filter(s => s.id !== id);
        const updatedFiltered = filteredSpecimens.filter(s => s.id !== id);
        
        setSpecimens(updatedSpecimens);
        setFilteredSpecimens(updatedFiltered);
        
        // Корректируем текущий индекс
        if (updatedFiltered.length === 0) {
          setCurrentIndex(-1);
          setCurrentSpecimen(null);
        } else if (currentIndex >= updatedFiltered.length) {
          setCurrentIndex(updatedFiltered.length - 1);
          setCurrentSpecimen(updatedFiltered[updatedFiltered.length - 1]);
        }
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка удаления образца';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Функции навигации по списку образцов
  const navigateToFirst = () => {
    if (filteredSpecimens.length > 0) {
      setCurrentIndex(0);
    }
  };

  const navigateToLast = () => {
    if (filteredSpecimens.length > 0) {
      setCurrentIndex(filteredSpecimens.length - 1);
    }
  };

  const navigateToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const navigateToNext = () => {
    if (currentIndex < filteredSpecimens.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const navigateToIndex = (index: number) => {
    if (index >= 0 && index < filteredSpecimens.length) {
      setCurrentIndex(index);
    }
  };

  return {
    specimens,
    filteredSpecimens,
    setFilteredSpecimens,
    currentSpecimen,
    setCurrentSpecimen,
    currentIndex,
    setCurrentIndex,
    isLoading,
    error,
    
    // Действия с образцами
    createSpecimen,
    updateSpecimen,
    deleteSpecimen,
    
    // Навигация
    navigateToFirst,
    navigateToLast,
    navigateToPrev,
    navigateToNext,
    navigateToIndex
  };
}; 