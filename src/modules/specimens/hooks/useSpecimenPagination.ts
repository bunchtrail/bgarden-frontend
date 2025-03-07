import { useCallback, useMemo, useState } from 'react';
import { Specimen } from '../types';

interface UseSpecimenPaginationProps {
  specimens: Specimen[];
  defaultPageSize?: number;
}

interface UseSpecimenPaginationResult {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  paginatedData: Specimen[];
  
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  
  goToFirstPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
  
  canGoToPreviousPage: boolean;
  canGoToNextPage: boolean;
}

/**
 * Хук для управления пагинацией образцов
 */
export const useSpecimenPagination = ({
  specimens,
  defaultPageSize = 10
}: UseSpecimenPaginationProps): UseSpecimenPaginationResult => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  
  // Вычисляемое значение общего количества страниц
  const totalCount = specimens.length;
  const totalPages = useMemo(() => 
    Math.ceil(totalCount / pageSize), 
    [totalCount, pageSize]
  );
  
  // Вычисляемый массив отфильтрованных данных для текущей страницы
  const paginatedData = useMemo(() => {
    const startIndex = page * pageSize;
    return specimens.slice(startIndex, startIndex + pageSize);
  }, [specimens, page, pageSize]);
  
  // Возможность перемещения по страницам
  const canGoToPreviousPage = page > 0;
  const canGoToNextPage = page < totalPages - 1;
  
  // Обработчики навигации по страницам
  const goToFirstPage = useCallback(() => setPage(0), []);
  
  const goToPreviousPage = useCallback(() => {
    if (canGoToPreviousPage) {
      setPage(page - 1);
    }
  }, [page, canGoToPreviousPage]);
  
  const goToNextPage = useCallback(() => {
    if (canGoToNextPage) {
      setPage(page + 1);
    }
  }, [page, canGoToNextPage]);
  
  const goToLastPage = useCallback(() => {
    if (totalPages > 0) {
      setPage(totalPages - 1);
    }
  }, [totalPages]);
  
  // Обработчик изменения размера страницы с сохранением текущей позиции
  const handleSetPageSize = useCallback((newPageSize: number) => {
    const currentFirstItemIndex = page * pageSize;
    const newPage = Math.floor(currentFirstItemIndex / newPageSize);
    
    setPageSize(newPageSize);
    setPage(newPage);
  }, [page, pageSize]);
  
  return {
    page,
    pageSize,
    totalCount,
    totalPages,
    paginatedData,
    
    setPage,
    setPageSize: handleSetPageSize,
    
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    
    canGoToPreviousPage,
    canGoToNextPage
  };
}; 