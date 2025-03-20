import React from 'react';
import { RegionData } from '@/modules/map/types/mapTypes';
import { textClasses } from '@/styles/global-styles';

interface RegionSelectorProps {
  regionId: string;
  regions: RegionData[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  getRegionIdString: (id: number | null | undefined) => string;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({ 
  regionId, 
  regions, 
  onChange,
  getRegionIdString 
}) => (
  <div>
    <label htmlFor="regionId" className={`block text-sm font-medium ${textClasses.primary} mb-1`}>
      Участок
    </label>
    <select
      id="regionId"
      name="regionId"
      value={regionId}
      onChange={onChange}
      className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
      required
    >
      <option value="">Выберите участок</option>
      {regions.map(region => (
        <option key={region.id} value={region.id}>
          {region.name || `Участок #${region.id}`}
        </option>
      ))}
    </select>
  </div>
);

export default RegionSelector; 