import React, { useState } from 'react';
import { SectorType, Specimen, SpecimenFilterParams } from '../types';
import { EditIcon, FilterListIcon, SearchIcon, VisibilityIcon } from './icons';
import styles from './specimens.module.css';
import {
  buttonClasses,
  formClasses,
  headingClasses,
  specimenContainerClasses,
  tableCellClasses,
  tableContainerClasses,
} from './styles';

interface SpecimensListProps {
  specimens: Specimen[];
  onViewSpecimen: (id: number) => void;
  onEditSpecimen: (id: number) => void;
  onSearch: (filterParams: SpecimenFilterParams) => void;
  isLoading?: boolean;
  // Справочные данные для фильтров
  familyOptions?: { id: number; name: string }[];
  sectorOptions?: { id: number; name: string }[];
}

export const SpecimensList: React.FC<SpecimensListProps> = ({
  specimens,
  onViewSpecimen,
  onEditSpecimen,
  onSearch,
  isLoading = false,
  familyOptions = [],
  sectorOptions = [],
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
  });

  // Обработчики пагинации
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Обработчики фильтров
  const handleSearchFieldChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilterParams({
      ...filterParams,
      searchField: event.target.value as keyof Specimen,
    });
  };

  const handleSearchValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterParams({
      ...filterParams,
      searchValue: event.target.value,
    });
  };

  const handleFamilyFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilterParams({
      ...filterParams,
      familyId: event.target.value
        ? parseInt(event.target.value, 10)
        : undefined,
    });
  };

  const handleSectorFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilterParams({
      ...filterParams,
      sectorType: event.target.value
        ? (parseInt(event.target.value, 10) as SectorType)
        : undefined,
    });
  };

  const handleSearch = () => {
    onSearch(filterParams);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Данные для отображения в таблице
  const displayedSpecimens = specimens.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div
      className={`${specimenContainerClasses.detail} ${styles.fadeIn} p-6 bg-white rounded-lg shadow-sm`}
    >
      {/* Заголовок и фильтры */}
      <div className='mb-6'>
        <h2
          className={`${headingClasses.page} text-center border-b border-gray-200 pb-3 mb-6`}
        >
          Список образцов
        </h2>

        <div className='bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm mb-6'>
          <h3
            className={`${headingClasses.heading} flex items-center mb-4 pb-2 border-b border-gray-300`}
          >
            <FilterListIcon className='w-5 h-5 mr-2 text-blue-600' />
            Параметры фильтрации
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-4'>
            <div>
              <label
                className={`${formClasses.label} block mb-2 text-sm font-medium text-gray-700`}
              >
                Поле для поиска
              </label>
              <select
                className={`${formClasses.select} w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                value={filterParams.searchField as string}
                onChange={handleSearchFieldChange}
                disabled={isLoading}
              >
                <option value='inventoryNumber'>Инвентарный номер</option>
                <option value='russianName'>Русское название</option>
                <option value='latinName'>Латинское название</option>
                <option value='familyName'>Семейство</option>
                <option value='genus'>Род</option>
                <option value='species'>Вид</option>
              </select>
            </div>

            <div>
              <label
                className={`${formClasses.label} block mb-2 text-sm font-medium text-gray-700`}
              >
                Значение для поиска
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400'>
                  <SearchIcon className='w-5 h-5' />
                </div>
                <input
                  type='text'
                  className={`${formClasses.input} w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                  placeholder='Поиск...'
                  value={filterParams.searchValue}
                  onChange={handleSearchValueChange}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label
                className={`${formClasses.label} block mb-2 text-sm font-medium text-gray-700`}
              >
                Семейство
              </label>
              <select
                className={`${formClasses.select} w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                value={filterParams.familyId || ''}
                onChange={handleFamilyFilterChange}
                disabled={isLoading}
              >
                <option value=''>Все семейства</option>
                {familyOptions.map((family) => (
                  <option key={family.id} value={family.id}>
                    {family.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className={`${formClasses.label} block mb-2 text-sm font-medium text-gray-700`}
              >
                Сектор
              </label>
              <select
                className={`${formClasses.select} w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                value={
                  filterParams.sectorType !== undefined
                    ? filterParams.sectorType
                    : ''
                }
                onChange={handleSectorFilterChange}
                disabled={isLoading}
              >
                <option value=''>Все секторы</option>
                {sectorOptions.map((sector) => (
                  <option key={sector.id} value={sector.id}>
                    {sector.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='flex justify-center'>
            <button
              className={`${buttonClasses.base} ${buttonClasses.primary} flex items-center px-6 py-2`}
              onClick={handleSearch}
              disabled={isLoading}
            >
              <SearchIcon className='w-5 h-5 mr-2' />
              Найти
            </button>
          </div>
        </div>

        {/* Таблица результатов */}
        <div
          className={`${tableContainerClasses.base} overflow-hidden rounded-lg shadow-sm border border-gray-200`}
        >
          <table className={`${tableContainerClasses.table} w-full`}>
            <thead className={`${tableContainerClasses.header} bg-gray-50`}>
              <tr>
                <th
                  className={`${tableCellClasses()} px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider`}
                >
                  Инв. номер
                </th>
                <th
                  className={`${tableCellClasses()} px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider`}
                >
                  Русское название
                </th>
                <th
                  className={`${tableCellClasses()} px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider`}
                >
                  Латинское название
                </th>
                <th
                  className={`${tableCellClasses()} px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider`}
                >
                  Семейство
                </th>
                <th
                  className={`${tableCellClasses()} px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider`}
                >
                  Год посадки
                </th>
                <th
                  className={`${tableCellClasses()} px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider`}
                >
                  Экспозиция
                </th>
                <th
                  className={`${tableCellClasses()} px-4 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider`}
                >
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {displayedSpecimens.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className='px-4 py-4 text-center text-gray-500 italic'
                  >
                    {isLoading
                      ? 'Загрузка данных...'
                      : 'Нет данных для отображения'}
                  </td>
                </tr>
              ) : (
                displayedSpecimens.map((specimen, index) => (
                  <tr
                    key={specimen.id}
                    className={`${tableContainerClasses.row} hover:bg-blue-50 transition-colors duration-150`}
                  >
                    <td
                      className={`${tableCellClasses()} px-4 py-3 text-sm text-gray-700`}
                    >
                      {specimen.inventoryNumber}
                    </td>
                    <td
                      className={`${tableCellClasses()} px-4 py-3 text-sm text-gray-700`}
                    >
                      {specimen.russianName}
                    </td>
                    <td
                      className={`${tableCellClasses(
                        'italic'
                      )} px-4 py-3 text-sm text-gray-700`}
                    >
                      {specimen.latinName}
                    </td>
                    <td
                      className={`${tableCellClasses()} px-4 py-3 text-sm text-gray-700`}
                    >
                      {specimen.familyName}
                    </td>
                    <td
                      className={`${tableCellClasses()} px-4 py-3 text-sm text-gray-700`}
                    >
                      {specimen.plantingYear}
                    </td>
                    <td
                      className={`${tableCellClasses()} px-4 py-3 text-sm text-gray-700`}
                    >
                      {specimen.expositionName}
                    </td>
                    <td
                      className={`${styles.actionButtonsContainer} px-4 py-3 text-center`}
                    >
                      <button
                        onClick={() => onViewSpecimen(specimen.id)}
                        className='bg-blue-50 hover:bg-blue-100 p-2 rounded-full text-blue-700 transition-colors duration-150 mr-2'
                        title='Просмотр'
                      >
                        <VisibilityIcon className='w-5 h-5' />
                      </button>
                      <button
                        onClick={() => onEditSpecimen(specimen.id)}
                        className='bg-green-50 hover:bg-green-100 p-2 rounded-full text-green-700 transition-colors duration-150'
                        title='Редактировать'
                      >
                        <EditIcon className='w-5 h-5' />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Пагинация */}
        <div className='flex items-center justify-between px-5 py-4 mt-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm'>
          <div className='flex items-center'>
            <label className='mr-2 text-sm font-medium text-gray-700'>
              Записей на странице:
            </label>
            <select
              className='border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1 px-2'
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className='flex items-center space-x-2'>
            <button
              onClick={() => handleChangePage(null, 0)}
              disabled={page === 0}
              className={`px-3 py-1.5 rounded-md border ${
                page === 0
                  ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'text-blue-600 border-blue-200 hover:bg-blue-50'
              }`}
            >
              Первая
            </button>
            <button
              onClick={() => handleChangePage(null, page - 1)}
              disabled={page === 0}
              className={`px-3 py-1.5 rounded-md border ${
                page === 0
                  ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'text-blue-600 border-blue-200 hover:bg-blue-50'
              }`}
            >
              Пред.
            </button>
            <span className='px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md'>
              Страница {page + 1} из{' '}
              {Math.max(1, Math.ceil(specimens.length / rowsPerPage))}
            </span>
            <button
              onClick={() => handleChangePage(null, page + 1)}
              disabled={page >= Math.ceil(specimens.length / rowsPerPage) - 1}
              className={`px-3 py-1.5 rounded-md border ${
                page >= Math.ceil(specimens.length / rowsPerPage) - 1
                  ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'text-blue-600 border-blue-200 hover:bg-blue-50'
              }`}
            >
              След.
            </button>
            <button
              onClick={() =>
                handleChangePage(
                  null,
                  Math.max(0, Math.ceil(specimens.length / rowsPerPage) - 1)
                )
              }
              disabled={page >= Math.ceil(specimens.length / rowsPerPage) - 1}
              className={`px-3 py-1.5 rounded-md border ${
                page >= Math.ceil(specimens.length / rowsPerPage) - 1
                  ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'text-blue-600 border-blue-200 hover:bg-blue-50'
              }`}
            >
              Последняя
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
