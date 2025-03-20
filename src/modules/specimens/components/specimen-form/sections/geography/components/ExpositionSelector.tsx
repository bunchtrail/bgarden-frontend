import React from 'react';
import { ExpositionDto } from '@/modules/specimens/services/expositionService';
import { textClasses } from '@/styles/global-styles';

interface ExpositionSelectorProps {
  expositionId: string | number | null;
  expositions: ExpositionDto[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const ExpositionSelector: React.FC<ExpositionSelectorProps> = ({
  expositionId,
  expositions,
  onChange
}) => (
  <div>
    <label htmlFor="expositionId" className={`block text-sm font-medium ${textClasses.primary} mb-1`}>
      Экспозиция
    </label>
    <select
      id="expositionId"
      name="expositionId"
      value={expositionId || ''}
      onChange={onChange}
      className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
    >
      <option value="">Выберите экспозицию</option>
      {expositions.map(exposition => (
        <option key={exposition.id} value={exposition.id}>
          {exposition.name}
        </option>
      ))}
    </select>
  </div>
);

export default ExpositionSelector; 