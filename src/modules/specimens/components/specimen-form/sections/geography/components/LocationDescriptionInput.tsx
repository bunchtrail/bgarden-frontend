import React from 'react';
import { textClasses } from '@/styles/global-styles';

interface LocationDescriptionInputProps {
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const LocationDescriptionInput: React.FC<LocationDescriptionInputProps> = ({
  value,
  onChange
}) => (
  <div>
    <label htmlFor="locationDescription" className={`block text-sm font-medium ${textClasses.primary} mb-1`}>
      Описание местоположения
    </label>
    <textarea
      id="locationDescription"
      name="locationDescription"
      rows={3}
      value={value || ''}
      onChange={onChange}
      placeholder="Дополнительное описание местоположения..."
      className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
    />
  </div>
);

export default LocationDescriptionInput; 