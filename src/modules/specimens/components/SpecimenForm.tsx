import React from 'react';
import { Specimen, SpecimenFormData } from '../types';
import { SpecimenFormContainer } from './specimen-form/SpecimenFormContainer';

interface SpecimenFormProps {
  initialData?: Specimen;
  onSave: (data: SpecimenFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  // Справочные данные для выпадающих списков могут быть переданы как props
  familyOptions?: { id: number; name: string }[];
  expositionOptions?: { id: number; name: string }[];
  regionOptions?: { id: number; name: string }[];
}

export const SpecimenForm: React.FC<SpecimenFormProps> = (props) => {
  // Просто передаем все пропсы в новый контейнерный компонент
  return <SpecimenFormContainer {...props} />;
};
