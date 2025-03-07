import React from 'react';
import { NoteIcon } from '../icons';
import { headingClasses } from '../styles';
import { NumberField, TextField } from './FormFields';
import { AdditionalInfoSectionProps } from './types';

export const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  formData,
  errors,
  touchedFields,
  formSubmitted,
  markFieldAsTouched,
  validateField,
  handleChange,
  handleNumberChange,
}) => {
  return (
    <div className='mb-6 bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md animate-slideInRight'>
      <h3
        className={`${headingClasses.heading} flex items-center text-xl mb-4 pb-2 border-b border-gray-300`}
      >
        <NoteIcon className='w-5 h-5 mr-2 text-purple-600' />
        Дополнительная информация
      </h3>

      <div className='space-y-4'>
        <div className='bg-purple-50 p-3 rounded-md border border-purple-100 mb-4'>
          <div className='flex items-center text-purple-800 text-sm mb-2'>
            <span className='mr-2'>ⓘ</span>
            <span>
              Здесь вы можете указать дополнительные сведения об образце
            </span>
          </div>
        </div>

        <div className='p-3 bg-white rounded-md border border-gray-200 transition-all duration-200 hover:border-purple-300'>
          <h4 className='font-medium text-gray-700 mb-2'>
            Таксономические сведения
          </h4>
          <TextField
            label='Синонимы'
            name='synonyms'
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            handleChange={handleChange}
          />

          <TextField
            label='Определил'
            name='determinedBy'
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            handleChange={handleChange}
          />
        </div>

        <div className='p-3 bg-white rounded-md border border-gray-200 transition-all duration-200 hover:border-purple-300'>
          <h4 className='font-medium text-gray-700 mb-2'>
            Биологические сведения
          </h4>
          <TextField
            label='Происхождение образца'
            name='sampleOrigin'
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            handleChange={handleChange}
          />

          <TextField
            label='Экология и биология'
            name='ecologyAndBiology'
            multiline={true}
            rows={3}
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            handleChange={handleChange}
          />

          <TextField
            label='Хозяйственное значение'
            name='economicUse'
            multiline={true}
            rows={3}
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            handleChange={handleChange}
          />

          <TextField
            label='Статус охраны'
            name='conservationStatus'
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            handleChange={handleChange}
          />
        </div>

        <div className='p-3 bg-white rounded-md border border-gray-200 transition-all duration-200 hover:border-purple-300'>
          <h4 className='font-medium text-gray-700 mb-2'>
            Селекционные сведения
          </h4>
          <TextField
            label='Оригинальный селекционер'
            name='originalBreeder'
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            handleChange={handleChange}
          />

          <NumberField
            label='Год селекции'
            name='originalYear'
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            handleNumberChange={handleNumberChange}
          />
        </div>

        <div className='p-3 bg-white rounded-md border border-gray-200 transition-all duration-200 hover:border-purple-300'>
          <h4 className='font-medium text-gray-700 mb-2'>
            Служебная информация
          </h4>
          <TextField
            label='Примечания'
            name='notes'
            multiline={true}
            rows={3}
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            handleChange={handleChange}
          />

          <TextField
            label='Заполнил'
            name='filledBy'
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            handleChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};
