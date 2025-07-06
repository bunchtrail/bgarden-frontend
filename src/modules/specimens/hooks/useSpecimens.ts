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

  // Вспомогательная функция для получения sectorType из строки запроса
  const getSectorTypeFromSearch = (search: string): SectorType | null => {
    const params = new URLSearchParams(search);
    const sectorTypeParam = params.get('sectorType');
    return sectorTypeParam !== null ? (Number(sectorTypeParam) as SectorType) : null;
  };

  // Инициализируем фильтры и активный сектор из URL (ленивый инициализатор)
  const [filters, setFilters] = useState<SpecimenFilterParams>(() => {
    const sectorType = getSectorTypeFromSearch(location.search);
    return sectorType !== null ? { sectorType } : {};
  });

  const [searchQuery, setSearchQuery] = useState<string>('');

  const [activeSectorType, setActiveSectorType] = useState<SectorType | null>(() => {
    return getSectorTypeFromSearch(location.search);
  });

  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<keyof Specimen>('russianName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Категория поиска: где именно искать совпадения
  type SearchCategory = 'all' | 'name' | 'id' | 'family';
  const [searchCategory, setSearchCategory] = useState<SearchCategory>('all');

  // Обновляем фильтры при изменении строки запроса (например, при ручном редактировании URL)
  useEffect(() => {
    const sectorType = getSectorTypeFromSearch(location.search);

    setActiveSectorType(prev => {
      // Обновляем только при фактическом изменении, чтобы избежать лишних перерисовок
      return prev !== sectorType ? sectorType : prev;
    });

    setFilters(prev => {
      if (sectorType !== null) {
        if (prev.sectorType !== sectorType) {
          return { ...prev, sectorType };
        }
        return prev;
      }
      // Если sectorType отсутствует в URL, удаляем его из фильтров
      if (prev.sectorType !== undefined) {
        const { sectorType: _removed, ...rest } = prev;
        return rest;
      }
      return prev;
    });
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

  // Загрузка списка образцов при изменении фильтра sectorType
  useEffect(() => {
    let isActive = true;

    const fetchSpecimens = async () => {
      try {
        setLoading(true);
        let data: Specimen[] = [];

        if (filters.sectorType !== undefined) {
          data = await specimenService.getSpecimensBySectorType(filters.sectorType);
        } else {
          data = await specimenService.getAllSpecimens();
        }

        if (!Array.isArray(data)) {
          data = [data];
        }

        if (isActive) {
          setSpecimens(data);
          setError(null);
        }
      } catch (err) {
        if (isActive) {
          console.error('Ошибка при загрузке списка образцов:', err);
          if (err && typeof err === 'object' && 'status' in err && err.status === 404) {
            setSpecimens([]);
            setError(null);
          } else {
            setError('Не удалось загрузить список образцов');
            setSpecimens([]);
          }
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchSpecimens();

    return () => {
      // Отменяем обновление состояния, если эффект очистился (изменились фильтры или демонтирован компонент)
      isActive = false;
    };
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

      // В зависимости от выбранной категории ищем только в нужных полях
      switch (searchCategory) {
        case 'name':
          return (
            (specimen.russianName?.toLowerCase().includes(query) || false) ||
            (specimen.latinName?.toLowerCase().includes(query) || false)
          );
        case 'id':
          return specimen.inventoryNumber?.toLowerCase().includes(query) || false;
        case 'family':
          return specimen.familyName?.toLowerCase().includes(query) || false;
        default: // 'all'
          return (
            (specimen.russianName?.toLowerCase().includes(query) || false) ||
            (specimen.latinName?.toLowerCase().includes(query) || false) ||
            (specimen.inventoryNumber?.toLowerCase().includes(query) || false) ||
            (specimen.familyName?.toLowerCase().includes(query) || false)
          );
      }
    });

    // Сортировка образцов
    return [...filtered].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue === bValue) return 0;

      // Унифицированное направление
      const direction = sortOrder === 'asc' ? 1 : -1;

      // Строковые значения (или потенциально null/undefined)
      if (typeof aValue === 'string' || typeof bValue === 'string') {
        const aStr = (aValue ?? '').toString().toLowerCase();
        const bStr = (bValue ?? '').toString().toLowerCase();
        return aStr.localeCompare(bStr) * direction;
      }

      // Числовые значения (также обрабатываем null/undefined как Infinity)
      const aNum = aValue != null ? (aValue as number) : Number.POSITIVE_INFINITY;
      const bNum = bValue != null ? (bValue as number) : Number.POSITIVE_INFINITY;
      return (aNum - bNum) * direction;
    });
  }, [specimens, searchQuery, searchCategory, sortBy, sortOrder]);

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
    getSortIcon,
    searchCategory,
    setSearchCategory
  };
}; 