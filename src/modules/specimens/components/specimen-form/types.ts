import { SpecimenFormData } from '../../types';

// Перечисление для вкладок формы
export enum SpecimenFormTab {
  MainInfo = 0,  // Объединение BasicInfo и GeographicInfo
  AdditionalInfo = 1  // Объединение ExpositionInfo и AdditionalInfo
}

// Общие пропсы для всех компонентов формы
export interface BaseFormSectionProps {
  formData: SpecimenFormData;
  errors: Record<string, string>;
  touchedFields: Record<string, boolean>;
  formSubmitted: boolean;
  markFieldAsTouched: (name: string) => void;
  validateField: (name: string, value: any) => boolean;
}

// Пропсы для секции основной информации
export interface BasicInfoSectionProps extends BaseFormSectionProps {
  familyOptions: { id: number; name: string }[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

// Пропсы для секции географической информации
export interface GeographicInfoSectionProps extends BaseFormSectionProps {
  regionOptions: { id: number; name: string }[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Пропсы для секции экспозиционной информации
export interface ExpositionInfoSectionProps extends BaseFormSectionProps {
  expositionOptions: { id: number; name: string }[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Пропсы для секции дополнительной информации
export interface AdditionalInfoSectionProps extends BaseFormSectionProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Пропсы для компонента табов
export interface TabsProps {
  activeTab: SpecimenFormTab;
  setActiveTab: (tab: SpecimenFormTab) => void;
  errors: Record<string, string>;
}

// Пропсы для полей формы
export interface FormFieldProps {
  label: string;
  name: keyof SpecimenFormData;
  required?: boolean;
  formData: SpecimenFormData;
  errors: Record<string, string>;
  touchedFields: Record<string, boolean>;
  formSubmitted: boolean;
  markFieldAsTouched: (name: string) => void;
}

export interface TextFieldProps extends FormFieldProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multiline?: boolean;
  rows?: number;
}

export interface NumberFieldProps extends FormFieldProps {
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
}

export interface SelectFieldProps extends FormFieldProps {
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { id: number; name: string }[];
}

export interface CheckboxFieldProps extends FormFieldProps {
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
} 