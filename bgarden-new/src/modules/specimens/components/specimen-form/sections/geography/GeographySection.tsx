import React from 'react';
import { SpecimenFormData } from '../../../../types';
import { ExpositionDto } from '../../../../services/expositionService';
import { RegionData } from '@/modules/map/types/mapTypes';

interface GeographySectionProps {
  formData: SpecimenFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  regions: RegionData[];
  expositions: ExpositionDto[];
}

export const GeographySection: React.FC<GeographySectionProps> = ({ 
  formData, 
  onChange, 
  regions, 
  expositions 
}) => {
  return (
    <fieldset className="p-4 border rounded-md">
      <legend className="text-lg font-medium px-2">Географическая информация</legend>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="regionId">
            Регион *
          </label>
          <select
            id="regionId"
            name="regionId"
            value={formData.regionId ?? 0}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value={0}>Выберите регион</option>
            {regions.map(region => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="expositionId">
            Экспозиция *
          </label>
          <select
            id="expositionId"
            name="expositionId"
            value={formData.expositionId}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value={0}>Выберите экспозицию</option>
            {expositions.map(exposition => (
              <option key={exposition.id} value={exposition.id}>
                {exposition.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="latitude">
            Широта
          </label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={onChange}
            step="0.000001"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="longitude">
            Долгота
          </label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={onChange}
            step="0.000001"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>
    </fieldset>
  );
}; 