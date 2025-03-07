import React, { useState } from 'react';
import { Specimen, SpecimenFilterParams } from '../../types';
import { headingClasses } from '../styles';
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
}) => {
  // Состояние для пагинации
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    setPage(newPage);
  };

  // Обработчик изменения количества строк на странице
  const handleChangeRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Сбрасываем на первую страницу при изменении количества строк
  };

  // Обработчик изменения фильтров
  const handleFilterChange = (newFilterParams: SpecimenFilterParams) => {
    setFilterParams(newFilterParams);
  };

  // Обработчик поиска
  const handleSearch = (filterParams: SpecimenFilterParams) => {
    onSearch(filterParams);
    setPage(0); // Сбрасываем на первую страницу при новом поиске
  };

  return (
    <div>
      <h2 className={headingClasses.heading}>Список образцов растений</h2>

      {/* Компонент фильтрации */}
      <SpecimensFilter
        filterParams={filterParams}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        familyOptions={familyOptions}
        sectorOptions={sectorOptions}
        regionOptions={regionOptions}
      />

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
        totalCount={specimens.length}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
};
