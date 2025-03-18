import React from 'react';
import { TextField, CheckboxField, Textarea } from '@/modules/ui';
import { SpecimenFormData } from '../../../../types';

interface AdditionalInfoSectionProps {
  formData: SpecimenFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({ formData, onChange }) => {
  return (
    <fieldset className="p-4 border rounded-md">
      <legend className="text-lg font-medium px-2">Дополнительная информация</legend>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="plantingYear">
            Год посадки
          </label>
          <input
            type="number"
            id="plantingYear"
            name="plantingYear"
            value={formData.plantingYear}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <div>
          <TextField
            id="sampleOrigin"
            name="sampleOrigin"
            label="Происхождение образца"
            value={formData.sampleOrigin ?? ''}
            onChange={onChange}
            fullWidth
          />
        </div>
        
        <div>
          <TextField
            id="naturalRange"
            name="naturalRange"
            label="Естественный ареал"
            value={formData.naturalRange ?? ''}
            onChange={onChange}
            fullWidth
          />
        </div>
        
        <div>
          <CheckboxField
            id="hasHerbarium"
            name="hasHerbarium"
            label="Есть гербарий"
            checked={formData.hasHerbarium}
            onChange={onChange}
          />
        </div>
        
        <div className="md:col-span-2">
          <Textarea
            id="notes"
            name="notes"
            label="Примечания"
            value={formData.notes ?? ''}
            onChange={onChange}
            rows={3}
            fullWidth
          />
        </div>
      </div>
    </fieldset>
  );
}; 