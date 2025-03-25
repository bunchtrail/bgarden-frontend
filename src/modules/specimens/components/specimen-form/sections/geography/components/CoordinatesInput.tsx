import React from 'react';
import { textClasses } from '@/styles/global-styles';

interface CoordinatesInputProps {
  mapX: string | number | null;
  mapY: string | number | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const CoordinatesInput: React.FC<CoordinatesInputProps> = ({
  mapX,
  mapY,
  onChange,
  disabled = false
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="mapX" className={`block text-sm font-medium ${textClasses.primary} mb-1`}>
          Координата X
        </label>
        <input
          type="number"
          name="mapX"
          id="mapX"
          value={mapX || ''}
          onChange={onChange}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-md ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        />
      </div>
      <div>
        <label htmlFor="mapY" className={`block text-sm font-medium ${textClasses.primary} mb-1`}>
          Координата Y
        </label>
        <input
          type="number"
          name="mapY"
          id="mapY"
          value={mapY || ''}
          onChange={onChange}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-md ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        />
      </div>
    </div>
  );
};

export default CoordinatesInput; 