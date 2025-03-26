import React from 'react';
import { textClasses } from '@/styles/global-styles';
import { LocationType } from '../../../../../types';

interface CoordinatesInputProps {
  mapX: string | number | null;
  mapY: string | number | null;
  latitude: string | number | null;
  longitude: string | number | null;
  locationType: number;
  onTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const CoordinatesInput: React.FC<CoordinatesInputProps> = ({
  mapX,
  mapY,
  latitude,
  longitude,
  locationType,
  onTypeChange,
  onChange,
  disabled = false
}) => {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label htmlFor="locationType" className={`block text-sm font-medium ${textClasses.primary} mb-1`}>
          Тип координат
        </label>
        <select
          name="locationType"
          id="locationType"
          value={locationType}
          onChange={onTypeChange}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-md ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        >
          <option value={LocationType.None}>Выберите тип координат</option>
          <option value={LocationType.Geographic}>Географические координаты</option>
          <option value={LocationType.SchematicMap}>Координаты на схеме</option>
        </select>
      </div>

      {locationType === LocationType.SchematicMap && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="mapX" className={`block text-sm font-medium ${textClasses.primary} mb-1`}>
              Координата X на схеме
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
              Координата Y на схеме
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
      )}

      {locationType === LocationType.Geographic && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="latitude" className={`block text-sm font-medium ${textClasses.primary} mb-1`}>
              Широта
            </label>
            <input
              type="number"
              name="latitude"
              id="latitude"
              value={latitude || ''}
              onChange={onChange}
              disabled={disabled}
              step="0.000001"
              className={`w-full px-3 py-2 border rounded-md ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            />
          </div>
          <div>
            <label htmlFor="longitude" className={`block text-sm font-medium ${textClasses.primary} mb-1`}>
              Долгота
            </label>
            <input
              type="number"
              name="longitude"
              id="longitude"
              value={longitude || ''}
              onChange={onChange}
              disabled={disabled}
              step="0.000001"
              className={`w-full px-3 py-2 border rounded-md ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordinatesInput; 