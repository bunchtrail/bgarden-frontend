import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { specimenService } from '../services/specimenService';
import { Specimen, SpecimenFilterParams, SectorType } from '../types';

/**
 * Хук для работы со списком образцов растений
 */
export const useSpecimens = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [specimens, setSpecimens] = useState<Specimen[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SpecimenFilterParams>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSectorType, setActiveSectorType] = useState<SectorType | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<keyof Specimen>('russianName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Получение параметров фильтрации из URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sectorTypeParam = params.get('sectorType');
    
    if (sectorTypeParam) {
      const sectorType = Number(sectorTypeParam) as SectorType;
      setActiveSectorType(sectorType);
      setFilters(prev => ({ ...prev, sectorType }));
    }
  }, [location.search]);

  // Функция для отображения типа сектора в виде текста
  const getSectorTypeName = (sectorType: SectorType): string => {
    switch (sectorType) {
      case SectorType.Dendrology:
        return 'Дендрология';
      case SectorType.Flora:
        return 'Флора';
      case SectorType.Flowering:
        return 'Цветоводство';
      default:
        return 'Все секторы';
    }
  };

  // Загрузка списка образцов
  useEffect(() => {
    const fetchSpecimens = async () => {
      try {
        setLoading(true);
        let data: Specimen[] = [];

        // Если указан тип сектора, то загружаем только образцы этого сектора
        if (filters.sectorType !== undefined) {
          console.log(`Загрузка образцов для сектора типа: ${filters.sectorType}`);
          data = await specimenService.getSpecimensBySectorType(filters.sectorType);
        } else {
          // Загружаем все образцы
          console.log('Загрузка всех образцов');
          data = await specimenService.getAllSpecimens();
        }
        
        // Обеспечиваем, что data всегда массив
        if (!Array.isArray(data)) {
          data = [data];
        }
        
        setSpecimens(data);
      } catch (err) {
        console.error('Ошибка при загрузке списка образцов:', err);
        setError('Не удалось загрузить список образцов');
      } finally {
        setLoading(false);
      }
    };

    fetchSpecimens();
  }, [filters.sectorType]);

  // Обработчик удаления образца
  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await specimenService.deleteSpecimen(id);
      // Обновляем локальный список без перезагрузки с сервера
      setSpecimens(specimens.filter(specimen => specimen.id !== id));
    } catch (err) {
      setError('Ошибка при удалении образца');
      console.error('Ошибка при удалении образца:', err);
    } finally {
      setLoading(false);
    }
  };

  // Сброс фильтра по типу сектора
  const handleResetSectorFilter = () => {
    setActiveSectorType(null);
    setFilters(prev => {
      const { sectorType, ...rest } = prev;
      return rest;
    });
    
    // Удаляем параметр из URL без перезагрузки страницы
    const params = new URLSearchParams(location.search);
    params.delete('sectorType');
    navigate({ search: params.toString() }, { replace: true });
  };

  // Переключение вида отображения (сетка/список)
  const toggleView = () => {
    setView(prev => prev === 'grid' ? 'list' : 'grid');
  };

  // Сортировка образцов
  const handleSort = (key: keyof Specimen) => {
    if (sortBy === key) {
      // Если уже сортируем по этому полю, меняем порядок
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Иначе устанавливаем новое поле и сортируем по возрастанию
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  // Фильтрация и сортировка образцов
  const sortedAndFilteredSpecimens = useMemo(() => {
    // Фильтрация образцов на основе searchQuery
    const filtered = specimens.filter(specimen => {
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        (specimen.russianName?.toLowerCase().includes(query) || false) ||
        (specimen.latinName?.toLowerCase().includes(query) || false) ||
        (specimen.inventoryNumber?.toLowerCase().includes(query) || false) ||
        (specimen.familyName?.toLowerCase().includes(query) || false)
      );
    });

    // Сортировка образцов
    return [...filtered].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (aValue === bValue) return 0;
      
      // Сортировка строк
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      // Сортировка чисел
      return sortOrder === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [specimens, searchQuery, sortBy, sortOrder]);

  // Получение символа для сортировки
  const getSortIcon = (key: keyof Specimen): string => {
    if (sortBy !== key) return '';
    return sortOrder === 'asc' ? '▲' : '▼';
  };

  return {
    specimens,
    loading,
    error,
    filters,
    searchQuery,
    setSearchQuery,
    activeSectorType,
    setActiveSectorType,
    view,
    sortBy,
    sortOrder,
    sortedAndFilteredSpecimens,
    getSectorTypeName,
    handleDelete,
    handleResetSectorFilter,
    toggleView,
    handleSort,
    getSortIcon
  };
}; 