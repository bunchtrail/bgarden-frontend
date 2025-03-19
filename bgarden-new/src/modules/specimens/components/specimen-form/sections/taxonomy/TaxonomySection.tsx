import React from 'react';
import { SpecimenFormData } from '../../../../types';
import { FamilyDto } from '../../../../services/familyService';

interface TaxonomySectionProps {
  formData: SpecimenFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  families: FamilyDto[];
}

export const TaxonomySection: React.FC<TaxonomySectionProps> = ({ formData, onChange, families }) => {
  return (
    <fieldset className="p-4 border rounded-md">
      <legend className="text-lg font-medium px-2">Таксономическая информация</legend>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="familyId">
            Семейство *
          </label>
          <select
            id="familyId"
            name="familyId"
            value={formData.familyId}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value={0}>Выберите семейство</option>
            {families.map(family => (
              <option key={family.id} value={family.id}>
                {family.name} {family.latinName ? `(${family.latinName})` : ''}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="species">
            Вид
          </label>
          <input
            type="text"
            id="species"
            name="species"
            value={formData.species}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="synonyms">
            Синонимы
          </label>
          <input
            type="text"
            id="synonyms"
            name="synonyms"
            value={formData.synonyms ?? ''}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>
    </fieldset>
  );
}; 