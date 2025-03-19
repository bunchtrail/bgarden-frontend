import React, { useEffect, useState } from 'react';
import { Specimen, SectorType } from '../../types';
import { cardClasses, animationClasses } from '../../../../styles/global-styles';
import SpecimenRow from './SpecimenRow';

interface TableHeader {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

interface SpecimensTableProps {
  specimens: Specimen[];
  getSectorTypeName: (sectorType: SectorType) => string;
  onDelete: (id: number) => void;
  sortBy: keyof Specimen;
  sortOrder: 'asc' | 'desc';
  handleSort: (key: keyof Specimen) => void;
  getSortIcon: (key: keyof Specimen) => string;
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
  const [specimensWithFamilies, setSpecimensWithFamilies] = useState<Specimen[]>([]);

  useEffect(() => {
    const fetchFamilyNames = async () => {
      const updatedSpecimens = await Promise.all(
        specimens.map(async (specimen) => {
          if (specimen.familyId && !specimen.familyName) {
            try {
              const response = await fetch(`http://localhost:7254/api/Family/${specimen.familyId}`);
              if (response.ok) {
                const familyData = await response.json();
                return {
                  ...specimen,
                  familyName: familyData.name
                };
              }
            } catch (error) {
              console.error(`Ошибка при загрузке информации о семействе ${specimen.familyId}:`, error);
            }
          }
          return specimen;
        })
      );
      setSpecimensWithFamilies(updatedSpecimens);
    };

    fetchFamilyNames();
  }, [specimens]);

  // Конфигурация заголовков таблицы
  const tableHeaders: TableHeader[] = [
    { key: 'russianName', label: 'Название', width: 'w-1/4' },
    { key: 'inventoryNumber', label: 'Инв. номер', width: 'w-1/6' },
    { key: 'familyName', label: 'Семейство', width: 'w-1/6' },
    { key: 'sectorType', label: 'Сектор', width: 'w-1/6' },
    { key: 'actions', label: 'Действия', sortable: false, width: 'w-1/6' },
  ];

  return (
    <div className={`${cardClasses.elevated} backdrop-blur-lg overflow-hidden rounded-xl border border-[#E5E5EA]/80 ${animationClasses.transition}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#E5E5EA]">
          <thead className="bg-[#F5F5F7]/80 backdrop-filter backdrop-blur-sm">
            <tr>
              {tableHeaders.map((header) => (
                <th 
                  key={header.key}
                  className={`px-6 py-4 text-left text-xs font-medium text-[#86868B] uppercase tracking-wider ${
                    header.key !== 'actions' ? 'cursor-pointer hover:bg-[#E5E5EA]/70 transition-colors duration-200' : ''
                  } ${header.width || ''}`}
                  onClick={() => header.sortable !== false && header.key !== 'actions' && handleSort(header.key as keyof Specimen)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{header.label}</span> 
                    {header.sortable !== false && header.key !== 'actions' && (
                      <span className={`inline-block ${header.key === sortBy ? 'text-[#0A84FF]' : 'text-[#AEAEB2]'}`}>
                        {getSortIcon(header.key as keyof Specimen)}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white/80 backdrop-filter backdrop-blur-sm divide-y divide-[#E5E5EA]">
            {specimensWithFamilies.length > 0 ? (
              specimensWithFamilies.map((specimen) => (
                <SpecimenRow
                  key={specimen.id}
                  specimen={specimen}
                  getSectorTypeName={getSectorTypeName}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan={tableHeaders.length} className="px-6 py-8 text-center text-[#86868B]">
                  Нет доступных записей
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpecimensTable; 