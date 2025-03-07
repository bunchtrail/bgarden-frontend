import React, { useState } from 'react';
import { Specimen, SpecimenFilterParams } from '../../types';
import { containerClasses, headingClasses } from '../styles';
import { SpecimensFilter } from './SpecimensFilter';
import { SpecimensPagination } from './SpecimensPagination';
import { SpecimensTable } from './SpecimensTable';

interface SpecimensListContainerProps {
  specimens: Specimen[];
  onViewSpecimen: (id: number) => void;
  onEditSpecimen: (id: number) => void;
  onSearch: (filterParams: SpecimenFilterParams) => void;
  isLoading?: boolean;
  // Справочные данные для фильтров
  familyOptions?: { id: number; name: string }[];
  sectorOptions?: { id: number; name: string }[];
  regionOptions?: { id: number; name: string }[];
  expositionOptions?: { id: number; name: string }[];
  // Параметры пагинации
  page?: number;
  pageSize?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  // Обработчик фильтрации
  onFilterChange?: (filterType: string, value: string | number) => void;
}

export const SpecimensListContainer: React.FC<SpecimensListContainerProps> = ({
  specimens,
  onViewSpecimen,
  onEditSpecimen,
  onSearch,
  isLoading = false,
  familyOptions = [],
  sectorOptions = [],
  regionOptions = [],
  expositionOptions = [],
  page: externalPage,
  pageSize: externalPageSize,
  totalCount: externalTotalCount,
  onPageChange,
  onPageSizeChange,
  onFilterChange,
}) => {
  // Состояние для локальной пагинации, если не предоставлены внешние обработчики
  const [localPage, setLocalPage] = useState(0);
  const [localRowsPerPage, setLocalRowsPerPage] = useState(10);

  // Используем внешнее состояние пагинации, если оно предоставлено, иначе локальное
  const page = externalPage !== undefined ? externalPage : localPage;
  const rowsPerPage =
    externalPageSize !== undefined ? externalPageSize : localRowsPerPage;
  const totalCount =
    externalTotalCount !== undefined ? externalTotalCount : specimens.length;

  // Состояние для фильтров
  const [filterParams, setFilterParams] = useState<SpecimenFilterParams>({
    searchField: 'inventoryNumber',
    searchValue: '',
    familyId: undefined,
    sectorType: undefined,
    regionId: undefined,
  });

  // Обработчик изменения страницы
  const handleChangePage = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      setLocalPage(newPage);
    }
  };

  // Обработчик изменения количества строк на странице
  const handleChangeRowsPerPage = (newRowsPerPage: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(newRowsPerPage);
    } else {
      setLocalRowsPerPage(newRowsPerPage);
      setLocalPage(0); // Сбрасываем на первую страницу при изменении количества строк
    }
  };

  // Обработчик изменения фильтров
  const handleFilterChange = (newFilterParams: SpecimenFilterParams) => {
    setFilterParams(newFilterParams);

    // Вызываем внешний обработчик фильтрации, если он предоставлен
    if (onFilterChange) {
      if (newFilterParams.familyId !== undefined) {
        onFilterChange('family', newFilterParams.familyId);
      }
      if (newFilterParams.regionId !== undefined) {
        onFilterChange('region', newFilterParams.regionId);
      }
      if (newFilterParams.sectorType !== undefined) {
        onFilterChange('sector', newFilterParams.sectorType);
      }
    }
  };

  // Обработчик поиска
  const handleSearch = (filterParams: SpecimenFilterParams) => {
    onSearch(filterParams);

    // Сбрасываем на первую страницу при новом поиске
    if (onPageChange) {
      onPageChange(0);
    } else {
      setLocalPage(0);
    }
  };

  return (
    <div className={containerClasses.page}>
      <h2 className={headingClasses.page}>Список образцов растений</h2>

      <div className={`${containerClasses.base} mb-6 animate-fadeIn`}>
        {/* Компонент фильтрации */}
        <SpecimensFilter
          filterParams={filterParams}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          familyOptions={familyOptions}
          sectorOptions={sectorOptions}
          regionOptions={regionOptions}
          expositionOptions={expositionOptions}
        />
      </div>

      <div className={`${containerClasses.base} animate-fadeIn`}>
        {/* Компонент таблицы */}
        <SpecimensTable
          specimens={specimens}
          onViewSpecimen={onViewSpecimen}
          onEditSpecimen={onEditSpecimen}
          isLoading={isLoading}
          page={page}
          rowsPerPage={rowsPerPage}
        />

        {/* Компонент пагинации */}
        <SpecimensPagination
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={totalCount}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};
