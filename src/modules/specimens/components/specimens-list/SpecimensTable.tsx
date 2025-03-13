import React, { useState } from 'react';
import { Specimen } from '../../types';
import { EditIcon, SortDownIcon, SortUpIcon, VisibilityIcon } from '../icons';
import { LoadingIndicator } from '../LoadingIndicator';
import {
  animationClasses,
  buttonClasses,
  chipClasses,
  tableCellClasses,
  tableContainerClasses,
} from '../styles';

interface SpecimensTableProps {
  specimens: Specimen[];
  onViewSpecimen: (id: number) => void;
  onEditSpecimen: (id: number) => void;
  isLoading?: boolean;
  page: number;
  rowsPerPage: number;
}

type SortField = 'inventoryNumber' | 'russianName' | 'latinName' | 'familyName' | 'regionName' | 'sectorType';
type SortDirection = 'asc' | 'desc';

export const SpecimensTable: React.FC<SpecimensTableProps> = ({
  specimens,
  onViewSpecimen,
  onEditSpecimen,
  isLoading = false,
  page,
  rowsPerPage,
}) => {
  // Состояния для сортировки
  const [sortField, setSortField] = useState<SortField>('inventoryNumber');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Обработчик изменения столбца сортировки
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // Если уже сортируем по этому полю, меняем направление сортировки
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Если сортируем по новому полю, устанавливаем его и сортируем по возрастанию
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Функция сортировки образцов
  const sortSpecimens = (specimens: Specimen[]): Specimen[] => {
    return [...specimens].sort((a, b) => {
      let valueA: string | number = '';
      let valueB: string | number = '';

      // Получаем значения для сравнения в зависимости от выбранного поля сортировки
      switch (sortField) {
        case 'inventoryNumber':
          valueA = a.inventoryNumber || '';
          valueB = b.inventoryNumber || '';
          break;
        case 'russianName':
          valueA = a.russianName || '';
          valueB = b.russianName || '';
          break;
        case 'latinName':
          valueA = a.latinName || '';
          valueB = b.latinName || '';
          break;
        case 'familyName':
          valueA = a.familyName || '';
          valueB = b.familyName || '';
          break;
        case 'regionName':
          valueA = a.regionName || '';
          valueB = b.regionName || '';
          break;
        case 'sectorType':
          valueA = a.sectorType || 0;
          valueB = b.sectorType || 0;
          break;
        default:
          valueA = a.inventoryNumber || '';
          valueB = b.inventoryNumber || '';
      }

      // Сравниваем значения с учетом направления сортировки
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB, 'ru') 
          : valueB.localeCompare(valueA, 'ru');
      } else {
        return sortDirection === 'asc' 
          ? (valueA as number) - (valueB as number)
          : (valueB as number) - (valueA as number);
      }
    });
  };

  // Рендерим иконку сортировки в зависимости от текущего поля и направления
  const renderSortIcon = (field: SortField) => {
    if (field !== sortField) {
      return null;
    }
    return sortDirection === 'asc' ? <SortUpIcon className="ml-1 w-4 h-4" /> : <SortDownIcon className="ml-1 w-4 h-4" />;
  };

  // Рассчитываем отображаемые элементы с учетом сортировки и пагинации
  const sortedSpecimens = sortSpecimens(specimens);
  const displayedSpecimens = sortedSpecimens.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (isLoading) {
    return <LoadingIndicator message='Загрузка образцов...' />;
  }

  if (specimens.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-gray-500'>
        <svg
          className='w-16 h-16 text-gray-300 mb-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          ></path>
        </svg>
        <p className='text-lg'>
          Не найдено образцов, удовлетворяющих критериям поиска.
        </p>
        <p className='text-sm mt-2'>
          Попробуйте изменить параметры фильтрации.
        </p>
      </div>
    );
  }

  return (
    <div className={tableContainerClasses.base}>
      <div className='overflow-auto'>
        <table className={`${tableContainerClasses.table} border-collapse`}>
          <thead>
            <tr className='bg-blue-50'>
              <th
                className={`${tableContainerClasses.header} text-blue-700 border-b-2 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors duration-200`}
                onClick={() => handleSort('inventoryNumber')}
              >
                <div className='flex items-center justify-center'>
                  Инв. номер {renderSortIcon('inventoryNumber')}
                </div>
              </th>
              <th
                className={`${tableContainerClasses.header} text-blue-700 border-b-2 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors duration-200`}
                onClick={() => handleSort('russianName')}
              >
                <div className='flex items-center justify-center'>
                  Название (рус.) {renderSortIcon('russianName')}
                </div>
              </th>
              <th
                className={`${tableContainerClasses.header} text-blue-700 border-b-2 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors duration-200`}
                onClick={() => handleSort('latinName')}
              >
                <div className='flex items-center justify-center'>
                  Название (лат.) {renderSortIcon('latinName')}
                </div>
              </th>
              <th
                className={`${tableContainerClasses.header} text-blue-700 border-b-2 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors duration-200`}
                onClick={() => handleSort('familyName')}
              >
                <div className='flex items-center justify-center'>
                  Семейство {renderSortIcon('familyName')}
                </div>
              </th>
              <th
                className={`${tableContainerClasses.header} text-blue-700 border-b-2 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors duration-200`}
                onClick={() => handleSort('sectorType')}
              >
                <div className='flex items-center justify-center'>
                  Сектор {renderSortIcon('sectorType')}
                </div>
              </th>
              <th
                className={`${tableContainerClasses.header} text-blue-700 border-b-2 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors duration-200`}
                onClick={() => handleSort('regionName')}
              >
                <div className='flex items-center justify-center'>
                  Регион {renderSortIcon('regionName')}
                </div>
              </th>
              <th className={`${tableContainerClasses.header} text-blue-700 border-b-2 border-blue-200`}>
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedSpecimens.map((specimen, index) => (
              <tr
                key={specimen.id}
                className={`${tableContainerClasses.row} ${animationClasses.transition} ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}
              >
                <td className={tableCellClasses('font-medium')}>
                  {specimen.inventoryNumber}
                </td>
                <td className={tableCellClasses()}>
                  {specimen.russianName}
                </td>
                <td className={tableCellClasses('italic text-gray-600')}>
                  {specimen.latinName}
                </td>
                <td className={tableCellClasses()}>
                  <span className={chipClasses.neutral}>
                    {specimen.familyName}
                  </span>
                </td>
                <td className={tableCellClasses()}>
                  {specimen.sectorType === 1 ? (
                    <span
                      className={`${chipClasses.base} bg-green-100 text-green-800`}
                    >
                      Дендрарий
                    </span>
                  ) : specimen.sectorType === 2 ? (
                    <span
                      className={`${chipClasses.base} bg-amber-100 text-amber-800`}
                    >
                      Цветоводство
                    </span>
                  ) : specimen.sectorType === 3 ? (
                    <span
                      className={`${chipClasses.base} bg-blue-100 text-blue-800`}
                    >
                      Оранжерея
                    </span>
                  ) : (
                    <span className={chipClasses.neutral}>Неизвестно</span>
                  )}
                </td>
                <td className={tableCellClasses()}>
                  <span
                    className={`${chipClasses.base} bg-gray-100 text-gray-700`}
                  >
                    {specimen.regionName}
                  </span>
                </td>
                <td className={tableCellClasses('text-center')}>
                  <button
                    className={`${buttonClasses.base} ${buttonClasses.secondary} mr-2 p-1 transition-all duration-200`}
                    onClick={() => onViewSpecimen(specimen.id)}
                    title='Просмотр'
                  >
                    <VisibilityIcon />
                  </button>
                  <button
                    className={`${buttonClasses.base} ${buttonClasses.secondary} p-1 transition-all duration-200`}
                    onClick={() => onEditSpecimen(specimen.id)}
                    title='Редактировать'
                  >
                    <EditIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
