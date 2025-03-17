import React from 'react';
import { Specimen } from '../../types';
import { animationClasses } from '../../../../styles/global-styles';

interface SpecimensSortControlsProps {
  sortBy: keyof Specimen;
  getSortIcon: (key: keyof Specimen) => string;
  handleSort: (key: keyof Specimen) => void;
}

/**
 * Компонент управления сортировкой списка образцов
 */
const SpecimensSortControls: React.FC<SpecimensSortControlsProps> = ({
  sortBy,
  getSortIcon,
  handleSort
}) => {
  // Создаем конфигурацию кнопок сортировки
  const sortButtons = [
    { key: 'russianName' as keyof Specimen, label: 'Названию' },
    { key: 'familyName' as keyof Specimen, label: 'Семейству' },
    { key: 'sectorType' as keyof Specimen, label: 'Сектору' },
    { key: 'inventoryNumber' as keyof Specimen, label: 'Инв. номеру' }
  ];

  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-[#86868B]">Сортировать по:</span>
      
      {sortButtons.map(button => (
        <button 
          key={button.key}
          className={`text-sm px-4 py-2 rounded-lg ${animationClasses.transition} shadow-sm ${
            sortBy === button.key 
              ? 'bg-[#E1F0FF] text-[#0A84FF] border border-[#0A84FF]/30' 
              : 'bg-[#F5F5F7] text-[#86868B] hover:bg-[#E5E5EA] border border-[#E5E5EA]'
          }`}
          onClick={() => handleSort(button.key)}
        >
          {button.label} {getSortIcon(button.key)}
        </button>
      ))}
    </div>
  );
};

export default SpecimensSortControls; 