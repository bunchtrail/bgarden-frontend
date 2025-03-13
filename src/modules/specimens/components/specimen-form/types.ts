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

// Интерфейс для растения на карте (для передачи в пропсах)
export interface MapPlant {
  id?: string;
  name?: string;
  position?: [number, number];
  description?: string;
}

// Интерфейс для области на карте (для передачи в пропсах)
export interface MapArea {
  id: string | number;
  name: string;
  points: [number, number][];
  description?: string;
  strokeColor?: string;
  fillColor?: string;
  fillOpacity?: number;
  latitude?: number;  // Координата широты центра области
  longitude?: number; // Координата долготы центра области
}

// Пропсы для секции географической информации
export interface GeographicInfoSectionProps extends BaseFormSectionProps {
  regionOptions: { id: number; name: string }[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mapImageUrl?: string | null; // URL изображения карты
  onPositionSelected?: (latitude: number, longitude: number) => void; // Обработчик выбора позиции на карте
  mapAreas?: MapArea[]; // Области для отображения на карте
  mapPlants?: MapPlant[]; // Растения для отображения на карте
  onAreaSelected?: (areaId: string, regionId: number) => void; // Обработчик выбора области
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
export interface FormFieldProps<T = any> {
  label: string;
  name: keyof T;
  required?: boolean;
  formData: Partial<T>;
  errors: Record<string, string>;
  touchedFields: Record<string, boolean>;
  formSubmitted: boolean;
  markFieldAsTouched: (name: string) => void;
}

export interface TextFieldProps extends FormFieldProps<SpecimenFormData> {
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multiline?: boolean;
  rows?: number;
}

export interface NumberFieldProps extends FormFieldProps<SpecimenFormData> {
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
}

export interface SelectFieldProps extends FormFieldProps<SpecimenFormData> {
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ id: number; name: string }>;
}

export interface CheckboxFieldProps extends FormFieldProps<SpecimenFormData> {
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
} 