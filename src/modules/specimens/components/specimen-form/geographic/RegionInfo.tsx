import React from 'react';
import { SelectedArea } from './SimpleMap';

interface RegionInfoProps {
  selectedArea: SelectedArea | null;
}

const RegionInfo: React.FC<RegionInfoProps> = ({ selectedArea }) => {
  if (!selectedArea) return null;

  return (
    <div className='p-4 bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-md'>
      <h4 className='font-medium text-gray-700 mb-3 flex items-center'>
        <span className="mr-2">🎯</span>
        Выбранный регион
      </h4>
      <div className="flex justify-between items-start bg-gradient-to-r from-green-50/50 to-transparent p-4 rounded-lg">
        <div>
          <h3 className='font-bold text-lg text-green-800 mb-2'>{selectedArea.name}</h3>
          {selectedArea.description && (
            <p className='text-gray-600 text-sm'>{selectedArea.description}</p>
          )}
        </div>
        <span className='text-xs font-medium text-white bg-green-600 px-3 py-1.5 rounded-full shadow-sm'>
          Регион №{selectedArea.regionId}
        </span>
      </div>
    </div>
  );
};

export default RegionInfo; 