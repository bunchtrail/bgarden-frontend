import React, { useState } from 'react';
import { MapData } from '../../types';
import MapContainer from '../MapContainer';
import MapList from '../MapList';

const MapManagementPage: React.FC = () => {
  const [selectedMap, setSelectedMap] = useState<MapData | null>(null);

  // Обработчик выбора карты
  const handleSelectMap = (map: MapData) => {
    setSelectedMap(map);
  };

  return (
    <div className='map-management-page container mx-auto py-6 px-4'>
      <h1 className='text-3xl font-bold mb-8'>Управление картами</h1>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
        {/* Левая колонка с выбранной картой */}
        <div className='lg:col-span-7 order-2 lg:order-1'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-2xl font-bold mb-4'>
              {selectedMap ? selectedMap.name : 'Выберите карту'}
            </h2>

            {selectedMap ? (
              <MapContainer mapId={selectedMap.id} />
            ) : (
              <div className='flex flex-col items-center justify-center h-80 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-16 w-16 text-gray-400 mb-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1}
                    d='M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'
                  />
                </svg>
                <p className='text-gray-500 text-lg'>
                  Выберите карту из списка справа
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Правая колонка со списком карт */}
        <div className='lg:col-span-5 order-1 lg:order-2'>
          <MapList
            onSelectMap={handleSelectMap}
            selectedMapId={selectedMap?.id}
          />
        </div>
      </div>
    </div>
  );
};

export default MapManagementPage;
