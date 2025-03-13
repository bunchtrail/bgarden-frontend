import React from 'react';
import { SelectField, TextField } from '../FormFields';

interface OriginSectionProps {
  formData: any;
  errors: any;
  touchedFields: any;
  formSubmitted: boolean;
  markFieldAsTouched: (fieldName: string) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  regionOptions: Array<{ id: number; name: string }>;
}

const OriginSection: React.FC<OriginSectionProps> = ({
  formData,
  errors,
  touchedFields,
  formSubmitted,
  markFieldAsTouched,
  handleChange,
  handleSelectChange,
  regionOptions
}) => {
  const handleFieldTouch = (fieldName: string) => {
    markFieldAsTouched(fieldName);
  };

  return (
    <div className='p-4 bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:border-green-200'>
      <h4 className='font-medium text-gray-700 mb-3 flex items-center'>
        <span className="mr-2">🌍</span>
        Место происхождения
      </h4>
      <div className="space-y-4">
        <SelectField
          label='Регион происхождения'
          name='regionId'
          formData={{
            ...formData,
            // Преобразуем null в пустую строку для избежания ошибок React
            // Используем явное приведение типа для совместимости с интерфейсом
            regionId: formData.regionId === null ? '' : formData.regionId
          } as any}
          options={regionOptions}
          errors={errors}
          touchedFields={touchedFields}
          formSubmitted={formSubmitted}
          markFieldAsTouched={handleFieldTouch}
          handleSelectChange={handleSelectChange}
          required
        />

        <TextField
          label='Страна происхождения'
          name='country'
          formData={formData}
          errors={errors}
          touchedFields={touchedFields}
          formSubmitted={formSubmitted}
          markFieldAsTouched={handleFieldTouch}
          handleChange={handleChange}
        />
      </div>
    </div>
  );
};

export default OriginSection; 