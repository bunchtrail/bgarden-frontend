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
    <div className={`${animationClasses.fadeIn}`}>
      <SectionHeader 
        title="Основная информация"
        description="Заполните базовую информацию об образце растения. Поля, отмеченные звездочкой (*), являются обязательными для заполнения."
      />
      
      <BasicInfoForm 
        formData={formData}
        onChange={onChange}
        getFieldError={getFieldError}
      />
      
      <InfoBlock
        title="Подсказка"
        content="Заполните все поля в этом разделе перед переходом к таксономической информации. Полный инвентарный номер поможет автоматически идентифицировать ваш образец."
        type="info"
      />
    </div>
  );
}; 