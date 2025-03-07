import React, { useState } from 'react';

interface ControlGroupProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

// Компонент группы контролов с выпадающим меню
const ControlGroup: React.FC<ControlGroupProps> = ({
  title,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div className='bg-white rounded-md shadow-md mb-2 overflow-hidden'>
      <button
        className='w-full px-4 py-2 flex justify-between items-center bg-green-50 hover:bg-green-100 transition-colors'
        onClick={onToggle}
      >
        <span className='font-medium text-green-800'>{title}</span>
        <svg
          className={`w-5 h-5 text-green-700 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>
      {isOpen && <div className='p-3 border-t border-gray-100'>{children}</div>}
    </div>
  );
};

interface MapControlsProps {
  filters: {
    plants: boolean;
    expositions: boolean;
    facilities: boolean;
    entrances: boolean;
    sectors: boolean;
    greenhouses: boolean;
  };
  onFilterChange: (filterType: string) => void;
  layers?: { id: string; name: string }[];
  activeLayer?: string;
  onLayerChange?: (layerId: string) => void;
}

// Главный компонент с контролами карты
export const MapControls: React.FC<MapControlsProps> = ({
  filters,
  onFilterChange,
  layers = [],
  activeLayer,
  onLayerChange,
}) => {
  const [openGroups, setOpenGroups] = useState({
    markers: true,
    areas: false,
    layers: false,
  });

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName as keyof typeof prev],
    }));
  };

  return (
    <div className='map-controls absolute top-2 left-2 z-[1000] w-64 max-w-xs'>
      <ControlGroup
        title='Маркеры'
        isOpen={openGroups.markers}
        onToggle={() => toggleGroup('markers')}
      >
        <div className='flex flex-col gap-2'>
          <label className='inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              checked={filters.plants}
              onChange={() => onFilterChange('plants')}
              className='form-checkbox h-4 w-4 text-green-600 rounded'
            />
            <span className='ml-2 text-sm'>Растения</span>
          </label>
          <label className='inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              checked={filters.expositions}
              onChange={() => onFilterChange('expositions')}
              className='form-checkbox h-4 w-4 text-green-600 rounded'
            />
            <span className='ml-2 text-sm'>Экспозиции</span>
          </label>
          <label className='inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              checked={filters.facilities}
              onChange={() => onFilterChange('facilities')}
              className='form-checkbox h-4 w-4 text-green-600 rounded'
            />
            <span className='ml-2 text-sm'>Инфраструктура</span>
          </label>
          <label className='inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              checked={filters.entrances}
              onChange={() => onFilterChange('entrances')}
              className='form-checkbox h-4 w-4 text-green-600 rounded'
            />
            <span className='ml-2 text-sm'>Входы</span>
          </label>
        </div>
      </ControlGroup>

      <ControlGroup
        title='Области'
        isOpen={openGroups.areas}
        onToggle={() => toggleGroup('areas')}
      >
        <div className='flex flex-col gap-2'>
          <label className='inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              checked={filters.sectors}
              onChange={() => onFilterChange('sectors')}
              className='form-checkbox h-4 w-4 text-green-600 rounded'
            />
            <span className='ml-2 text-sm'>Секторы</span>
          </label>
          <label className='inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              checked={filters.greenhouses}
              onChange={() => onFilterChange('greenhouses')}
              className='form-checkbox h-4 w-4 text-green-600 rounded'
            />
            <span className='ml-2 text-sm'>Оранжереи</span>
          </label>
        </div>
      </ControlGroup>

      {layers.length > 1 && (
        <ControlGroup
          title='Слои карты'
          isOpen={openGroups.layers}
          onToggle={() => toggleGroup('layers')}
        >
          <div className='flex flex-col gap-2'>
            {layers.map((layer) => (
              <label
                key={layer.id}
                className='inline-flex items-center cursor-pointer'
              >
                <input
                  type='radio'
                  name='mapLayer'
                  checked={activeLayer === layer.id}
                  onChange={() => onLayerChange && onLayerChange(layer.id)}
                  className='form-radio h-4 w-4 text-green-600'
                />
                <span className='ml-2 text-sm'>{layer.name}</span>
              </label>
            ))}
          </div>
        </ControlGroup>
      )}
    </div>
  );
};
