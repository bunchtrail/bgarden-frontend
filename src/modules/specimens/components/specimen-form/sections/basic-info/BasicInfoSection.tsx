import React from 'react';
import { SpecimenFormData } from '../../../../types';
import { animationClasses } from '@/styles/global-styles';
import { 
  SectionHeader, 
  BasicInfoForm,
  InfoBlock 
} from './components';

interface BasicInfoSectionProps {
  formData: SpecimenFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  errors?: Record<string, string>;
  touchedFields?: Record<string, boolean>;
}

/**
 * Секция базовой информации об образце растения
 * Включает в себя поля: инвентарный номер, названия на русском и латыни, тип сектора, род и вид
 */
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
    <div className={`${animationClasses.fadeIn} space-y-8`}>
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Основная информация</h2>
        <p className="text-gray-600">
          Заполните базовую информацию об образце растения. Поля, отмеченные звездочкой (*), являются обязательными для заполнения.
        </p>
      </div>
      
      <BasicInfoForm 
        formData={formData}
        onChange={onChange}
        getFieldError={getFieldError}
      />
      
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">Подсказка</h4>
            <p className="text-sm text-blue-800">
              Заполните все поля в этом разделе перед переходом к таксономической информации. Полный инвентарный номер поможет автоматически идентифицировать ваш образец.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 