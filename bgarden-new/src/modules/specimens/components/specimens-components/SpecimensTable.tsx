import React from 'react';
import { Specimen, SectorType } from '../../types';
import { cardClasses } from '../../../../styles/global-styles';
import SpecimenRow from './SpecimenRow';

interface SpecimensTableProps {
  specimens: Specimen[];
  getSectorTypeName: (sectorType: SectorType) => string;
  onDelete: (id: number) => void;
  sortBy: keyof Specimen;
  sortOrder: 'asc' | 'desc';
  handleSort: (key: keyof Specimen) => void;
  getSortIcon: (key: keyof Specimen) => string;
}

// Расширенный тип для заголовков таблицы, чтобы включить неотсортированные колонки
type TableHeaderKey = keyof Specimen | 'actions';

interface TableHeader {
  key: TableHeaderKey;
  label: string;
  sortable?: boolean;
}

/**
 * Компонент отображения списка образцов в виде таблицы
 */
const SpecimensTable: React.FC<SpecimensTableProps> = ({
  specimens,
  getSectorTypeName,
  onDelete,
  sortBy,
  sortOrder,
  handleSort,
  getSortIcon
}) => {
  // Конфигурация заголовков таблицы
  const tableHeaders: TableHeader[] = [
    { key: 'russianName', label: 'Название' },
    { key: 'inventoryNumber', label: 'Инв. номер' },
    { key: 'familyName', label: 'Семейство' },
    { key: 'sectorType', label: 'Сектор' },
    { key: 'actions', label: 'Действия', sortable: false },
  ];

  return (
    <div className={`${cardClasses.elevated} overflow-hidden`}>
      <table className="min-w-full divide-y divide-[#E5E5EA]">
        <thead className="bg-[#F5F5F7]">
          <tr>
            {tableHeaders.map((header) => (
              <th 
                key={header.key}
                className={`px-6 py-4 text-left text-xs font-medium text-[#86868B] uppercase tracking-wider ${
                  header.key !== 'actions' ? 'cursor-pointer hover:bg-[#E5E5EA] transition-colors duration-200' : ''
                }`}
                onClick={() => header.sortable !== false && header.key !== 'actions' && handleSort(header.key as keyof Specimen)}
              >
                <div className="flex items-center">
                  {header.label} {header.sortable !== false && header.key !== 'actions' && getSortIcon(header.key as keyof Specimen)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-[#E5E5EA]">
          {specimens.map((specimen) => (
            <SpecimenRow
              key={specimen.id}
              specimen={specimen}
              getSectorTypeName={getSectorTypeName}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SpecimensTable; 