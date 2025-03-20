import React from 'react';
import { textClasses } from '@/styles/global-styles';

interface CoordinatesInputProps {
  latitude: string | number | null;
  longitude: string | number | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CoordinatesInput: React.FC<CoordinatesInputProps> = ({
  latitude,
  longitude,
  onChange
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label htmlFor="latitude" className={`block text-sm font-medium ${textClasses.primary} mb-1`}>
        Широта
      </label>
      <input
        type="text"
        name="latitude"
        id="latitude"
        value={latitude || ''}
        onChange={onChange}
        placeholder="Например: 55.751244"
        className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
      />
    </div>
    <div>
      <label htmlFor="longitude" className={`block text-sm font-medium ${textClasses.primary} mb-1`}>
        Долгота
      </label>
      <input
        type="text"
        name="longitude"
        id="longitude"
        value={longitude || ''}
        onChange={onChange}
        placeholder="Например: 37.618423"
        className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
      />
    </div>
  </div>
);

export default CoordinatesInput; 