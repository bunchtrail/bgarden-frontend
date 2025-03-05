import React, { useState } from 'react';
import { SectorType } from '../modules/specimens/types';
import Button from './Button';

interface SectorSelectorProps {
  onSelectSector: (sectorType: SectorType) => void;
  onExit: () => void;
}

const SectorSelector: React.FC<SectorSelectorProps> = ({
  onSelectSector,
  onExit,
}) => {
  const [selectedSector, setSelectedSector] = useState<SectorType | null>(null);

  const sectors = [
    { id: SectorType.Dendrology, name: 'Дендрология' },
    { id: SectorType.Flora, name: 'Флора' },
    { id: SectorType.Flowering, name: 'Цветоводство' },
  ];

  const handleSelect = () => {
    if (selectedSector !== null) {
      onSelectSector(selectedSector);
    }
  };

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
          Выберите отдел для работы
        </h2>

        <div className='space-y-2 mb-6'>
          {sectors.map((sector) => (
            <div
              key={sector.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedSector === sector.id
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-gray-100 hover:bg-blue-50'
              }`}
              onClick={() => setSelectedSector(sector.id)}
            >
              <span className='text-gray-800 font-medium'>{sector.name}</span>
            </div>
          ))}
        </div>

        <div className='flex justify-between space-x-4'>
          <Button
            variant={selectedSector !== null ? 'primary' : 'secondary'}
            onClick={handleSelect}
            disabled={selectedSector === null}
          >
            Выбрать отдел
          </Button>
          <Button variant='secondary' onClick={onExit}>
            Выход
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SectorSelector;
