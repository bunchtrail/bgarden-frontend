import { useCallback, useEffect, useState } from 'react';
import { Specimen } from '../types';

interface UseSpecimenFiltersProps {
  specimens: Specimen[];
  onFilterChange?: (filteredData: Specimen[]) => void;
}

interface UseSpecimenFiltersResult {
  // Параметры фильтрации
  searchQuery: string;
  expositionFilter: string | number;
  statusFilter: string;
  familyFilter: number | null;
  regionFilter: number | null;
  
  // Отфильтрованные данные
  filteredSpecimens: Specimen[];
  
  // Методы установки фильтров
  setSearchQuery: (query: string) => void;
  setExpositionFilter: (value: string | number) => void;
  setStatusFilter: (value: string) => void;
  setFamilyFilter: (value: number | null) => void;
  setRegionFilter: (value: number | null) => void;
  
  // Метод для установки фильтра по типу
  handleFilterChange: (filterType: string, value: string | number) => void;
  
  // Сброс всех фильтров
  resetFilters: () => void;
}

/**
 * Хук для управления фильтрацией образцов
 */
export const useSpecimenFilters = ({
  specimens,
  onFilterChange
}: UseSpecimenFiltersProps): UseSpecimenFiltersResult => {
  // Состояние фильтров
  const [searchQuery, setSearchQuery] = useState('');
  const [expositionFilter, setExpositionFilter] = useState<string | number>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [familyFilter, setFamilyFilter] = useState<number | null>(null);
  const [regionFilter, setRegionFilter] = useState<number | null>(null);
  
  // Отфильтрованные данные
  const [filteredSpecimens, setFilteredSpecimens] = useState<Specimen[]>(specimens);
  
  /**
   * Обработчик изменения фильтра по типу
   */
  const handleFilterChange = useCallback((filterType: string, value: string | number) => {
    switch (filterType) {
      case 'search':
        setSearchQuery(value as string);
        break;
      case 'exposition':
        setExpositionFilter(value);
        break;
      case 'status':
        setStatusFilter(value as string);
        break;
      case 'family':
        setFamilyFilter(value as number);
        break;
      case 'region':
        setRegionFilter(value as number);
        break;
      default:
        console.warn(`Неизвестный тип фильтра: ${filterType}`);
    }
  }, []);
  
  /**
   * Сброс всех фильтров
   */
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setExpositionFilter('all');
    setStatusFilter('all');
    setFamilyFilter(null);
    setRegionFilter(null);
  }, []);
  
  /**
   * Применение фильтров при изменении любого из них или исходных данных
   */
  useEffect(() => {
    // Клонируем исходный массив
    let filtered = [...specimens];
    
    // Применяем фильтр по поиску
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (specimen) =>
          specimen.russianName.toLowerCase().includes(lowerQuery) ||
          specimen.latinName.toLowerCase().includes(lowerQuery) ||
          specimen.inventoryNumber.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Применяем фильтр по экспозиции
    if (expositionFilter !== 'all') {
      const expositionId = typeof expositionFilter === 'string' 
        ? parseInt(expositionFilter, 10)
        : expositionFilter;
      
      if (!isNaN(expositionId)) {
        filtered = filtered.filter(
          (specimen) => specimen.expositionId === expositionId
        );
      } else {
        filtered = filtered.filter(
          (specimen) => specimen.expositionName === expositionFilter
        );
      }
    }
    
    // Применяем фильтр по статусу
    if (statusFilter !== 'all') {
      filtered = filtered.filter((specimen) => {
        if (statusFilter === 'active') return specimen.hasHerbarium;
        if (statusFilter === 'inactive') return !specimen.hasHerbarium;
        return true;
      });
    }
    
    // Применяем фильтр по семейству
    if (familyFilter !== null) {
      filtered = filtered.filter(
        (specimen) => specimen.familyId === familyFilter
      );
    }
    
    // Применяем фильтр по региону
    if (regionFilter !== null) {
      filtered = filtered.filter(
        (specimen) => specimen.regionId === regionFilter
      );
    }
    
    // Устанавливаем отфильтрованные данные
    setFilteredSpecimens(filtered);
    
    // Вызываем обратный вызов при изменении фильтрованных данных
    if (onFilterChange) {
      onFilterChange(filtered);
    }
  }, [specimens, searchQuery, expositionFilter, statusFilter, familyFilter, regionFilter, onFilterChange]);
  
  return {
    // Параметры фильтрации
    searchQuery,
    expositionFilter,
    statusFilter,
    familyFilter,
    regionFilter,
    
    // Отфильтрованные данные
    filteredSpecimens,
    
    // Методы установки фильтров
    setSearchQuery,
    setExpositionFilter,
    setStatusFilter,
    setFamilyFilter,
    setRegionFilter,
    
    // Метод для установки фильтра по типу
    handleFilterChange,
    
    // Сброс всех фильтров
    resetFilters
  };
}; 