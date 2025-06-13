import React from 'react';
import { SpecimenFormData } from '../../../../../types';
import { FormField } from './FormField';
import { layoutClasses } from '@/styles/global-styles';

interface BasicInfoFormProps {
  formData: SpecimenFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  getFieldError: (fieldName: string) => string;
}

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ formData, onChange, getFieldError }) => {
  return (
    <div className={`${layoutClasses.grid2} gap-8`}>
      <div className="space-y-5">
        <FormField
          type="text"
          id="inventoryNumber"
          name="inventoryNumber"
          label="Инвентарный номер *"
          value={formData.inventoryNumber}
          onChange={onChange}
          iconType="document"
          helperText="Уникальный идентификатор образца"
          error={getFieldError('inventoryNumber')}
        />
        
        <FormField
          type="text"
          id="russianName"
          name="russianName"
          label="Название на русском *"
          value={formData.russianName ?? ''}
          onChange={onChange}
          iconType="language"
          error={getFieldError('russianName')}
        />
        
        <FormField
          type="text"
          id="latinName"
          name="latinName"
          label="Латинское название *"
          value={formData.latinName ?? ''}
          onChange={onChange}
          iconType="language"
          helperText="Научное название растения на латыни"
          error={getFieldError('latinName')}
        />
      </div>
      
      <div className="space-y-5">
        <FormField
          type="select"
          id="sectorType"
          name="sectorType"
          label="Тип сектора *"
          value={String(formData.sectorType)}
          onChange={onChange}
          iconType="sector"
          options={[
            { value: '0', label: 'Дендрологический' },
            { value: '1', label: 'Флора' },
            { value: '2', label: 'Цветущий' }
          ]}
          helperText="Категория размещения образца"
        />
        
        <FormField
          type="text"
          id="genus"
          name="genus"
          label="Род"
          value={formData.genus ?? ''}
          onChange={onChange}
          iconType="classification"
          error={getFieldError('genus')}
        />
        
        <FormField
          type="text"
          id="species"
          name="species"
          label="Вид"
          value={formData.species ?? ''}
          onChange={onChange}
          iconType="classification"
          error={getFieldError('species')}
        />
      </div>
    </div>
  );
}; 