import React from 'react';
import { TextField, Select } from '@/modules/ui';
import { SpecimenFormData } from '../../../../types';

interface BasicInfoSectionProps {
  formData: SpecimenFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  errors?: Record<string, string>;
  touchedFields?: Record<string, boolean>;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ 
  formData, 
  onChange, 
  errors = {}, 
  touchedFields = {} 
}) => {
  // Функция для определения ошибки поля
  const getFieldError = (fieldName: string) => {
    return touchedFields[fieldName] ? errors[fieldName] : '';
  };

  return (
    <div className="animate__animated animate__fadeIn">
      <h3 className="text-xl font-semibold mb-4 text-green-700 border-b pb-2">Основная информация</h3>
      
      <div className="mb-6">
        <p className="text-gray-600 text-sm mb-4">
          Заполните базовую информацию об образце растения. Поля, отмеченные звездочкой (*), являются обязательными для заполнения.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <TextField
            id="inventoryNumber"
            name="inventoryNumber"
            label="Инвентарный номер *"
            value={formData.inventoryNumber}
            onChange={onChange}
            fullWidth
            startIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            helperText="Уникальный идентификатор образца"
            error={getFieldError('inventoryNumber')}
          />
          
          <TextField
            id="russianName"
            name="russianName"
            label="Название на русском *"
            value={formData.russianName ?? ''}
            onChange={onChange}
            fullWidth
            startIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            }
            error={getFieldError('russianName')}
          />
          
          <TextField
            id="latinName"
            name="latinName"
            label="Латинское название *"
            value={formData.latinName ?? ''}
            onChange={onChange}
            fullWidth
            startIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            }
            helperText="Научное название растения на латыни"
            error={getFieldError('latinName')}
          />
        </div>
        
        <div className="space-y-4">
          <Select
            id="sectorType"
            name="sectorType"
            label="Тип сектора *"
            value={String(formData.sectorType)}
            onChange={(e) => {
              const numericValue = Number(e.target.value);
              onChange({
                ...e,
                target: {
                  ...e.target,
                  name: 'sectorType',
                  value: numericValue.toString()
                }
              } as React.ChangeEvent<HTMLSelectElement>);
            }}
            options={[
              { value: '0', label: 'Дендрологический' },
              { value: '1', label: 'Флора' },
              { value: '2', label: 'Цветущий' }
            ]}
            fullWidth
            helperText="Категория размещения образца"
            startIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            }
          />
          
          <TextField
            id="genus"
            name="genus"
            label="Род *"
            value={formData.genus ?? ''}
            onChange={onChange}
            fullWidth
            startIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            }
            error={getFieldError('genus')}
          />
          
          <TextField
            id="species"
            name="species"
            label="Вид *"
            value={formData.species ?? ''}
            onChange={onChange}
            fullWidth
            startIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            }
            error={getFieldError('species')}
          />
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-700">Подсказка</h3>
            <div className="mt-2 text-sm text-blue-600">
              <p>
                Заполните все поля в этом разделе перед переходом к таксономической информации.
                Полный инвентарный номер поможет автоматически идентифицировать ваш образец.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 