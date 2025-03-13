import React from 'react';
import { TextField } from '../FormFields';

interface AdditionalFieldsProps {
  showAdvancedOptions: boolean;
  formData: any;
  errors: any;
  touchedFields: any;
  formSubmitted: boolean;
  markFieldAsTouched: (fieldName: string) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  toggleAdvancedOptions: () => void;
}

const AdditionalFields: React.FC<AdditionalFieldsProps> = ({
  showAdvancedOptions,
  formData,
  errors,
  touchedFields,
  formSubmitted,
  markFieldAsTouched,
  handleChange,
  toggleAdvancedOptions
}) => {
  const handleFieldTouch = (fieldName: string) => {
    markFieldAsTouched(fieldName);
  };

  return (
    <div className='mt-6 border-t border-gray-100 pt-6'>
      <button
        type='button'
        onClick={toggleAdvancedOptions}
        className='flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200'
      >
        <svg
          className={`w-5 h-5 mr-2 transition-transform duration-200 ${
            showAdvancedOptions ? 'rotate-90' : ''
          }`}
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path
            fillRule='evenodd'
            d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
            clipRule='evenodd'
          />
        </svg>
        {showAdvancedOptions
          ? 'Скрыть дополнительные поля'
          : 'Показать дополнительные поля'}
      </button>

      {showAdvancedOptions && (
        <div className='space-y-4 animate-fadeIn mt-4'>
          <div className='p-4 bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:border-green-200'>
            <TextField
              label='Естественный ареал'
              name='naturalRange'
              multiline
              rows={3}
              formData={formData}
              errors={errors}
              touchedFields={touchedFields}
              formSubmitted={formSubmitted}
              markFieldAsTouched={handleFieldTouch}
              handleChange={handleChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdditionalFields; 