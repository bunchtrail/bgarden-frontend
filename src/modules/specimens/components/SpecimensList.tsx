import React from 'react';
import { Specimen, SpecimenFilterParams } from '../types';
import { SpecimensListContainer } from './specimens-list';

interface SpecimensListProps {
  specimens: Specimen[];
  onViewSpecimen: (id: number) => void;
  onEditSpecimen: (id: number) => void;
  onSearch: (filterParams: SpecimenFilterParams) => void;
  isLoading?: boolean;
  // Справочные данные для фильтров
  familyOptions?: { id: number; name: string }[];
  sectorOptions?: { id: number; name: string }[];
  regionOptions?: { id: number; name: string }[];
}

export const SpecimensList: React.FC<SpecimensListProps> = (props) => {
  // Просто передаем все пропсы в контейнерный компонент
  return <SpecimensListContainer {...props} />;
};
