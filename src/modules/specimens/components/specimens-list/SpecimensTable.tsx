import React from 'react';
import { Specimen } from '../../types';
import { EditIcon, VisibilityIcon } from '../icons';
import { 
  buttonClasses, 
  tableCellClasses, 
  tableContainerClasses 
} from '../styles';
import { LoadingIndicator } from '../LoadingIndicator';

interface SpecimensTableProps {
  specimens: Specimen[];
  onViewSpecimen: (id: number) => void;
  onEditSpecimen: (id: number) => void;
  isLoading?: boolean;
  page: number;
  rowsPerPage: number;
}

export const SpecimensTable: React.FC<SpecimensTableProps> = ({
  specimens,
  onViewSpecimen,
  onEditSpecimen,
  isLoading = false,
  page,
  rowsPerPage,
}) => {
  // Рассчитываем отображаемые элементы с учетом пагинации
  const displayedSpecimens = specimens.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (isLoading) {
    return <LoadingIndicator message="Загрузка образцов..." />;
  }

  if (specimens.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Не найдено образцов, удовлетворяющих критериям поиска.</p>
      </div>
    );
  }

  return (
    <div className={tableContainerClasses.base}>
      <div className="overflow-auto">
        <table className={tableContainerClasses.table}>
          <thead>
            <tr>
              <th className={tableContainerClasses.header}>Инв. номер</th>
              <th className={tableContainerClasses.header}>Название (рус.)</th>
              <th className={tableContainerClasses.header}>Название (лат.)</th>
              <th className={tableContainerClasses.header}>Семейство</th>
              <th className={tableContainerClasses.header}>Сектор</th>
              <th className={tableContainerClasses.header}>Регион</th>
              <th className={tableContainerClasses.header}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {displayedSpecimens.map((specimen) => (
              <tr key={specimen.id} className={tableContainerClasses.row}>
                <td className={tableCellClasses()}>
                  {specimen.inventoryNumber}
                </td>
                <td className={tableCellClasses()}>
                  {specimen.russianName}
                </td>
                <td className={tableCellClasses('italic')}>
                  {specimen.latinName}
                </td>
                <td className={tableCellClasses()}>{specimen.familyName}</td>
                <td className={tableCellClasses()}>
                  {specimen.sectorType === 1
                    ? 'Дендрарий'
                    : specimen.sectorType === 2
                    ? 'Цветоводство'
                    : specimen.sectorType === 3
                    ? 'Оранжерея'
                    : 'Неизвестно'}
                </td>
                <td className={tableCellClasses()}>{specimen.regionName}</td>
                <td className={tableCellClasses('text-center')}>
                  <button
                    className={`${buttonClasses.base} ${buttonClasses.secondary} mr-2`}
                    onClick={() => onViewSpecimen(specimen.id)}
                    title="Просмотр"
                  >
                    <VisibilityIcon />
                  </button>
                  <button
                    className={`${buttonClasses.base} ${buttonClasses.secondary}`}
                    onClick={() => onEditSpecimen(specimen.id)}
                    title="Редактировать"
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
