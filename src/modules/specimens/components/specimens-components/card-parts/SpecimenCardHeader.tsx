import React from 'react';
import { SectorType } from '../../../types';
import { sectorTypeColors } from '../../../styles';

interface SpecimenCardHeaderProps {
  id: number;
  russianName?: string;
  latinName?: string;
  sectorType: SectorType;
}

export interface SpecimenCardHeaderResult {
  headerClassName: string;
  title: string;
  subtitle?: string;
  headerAction: React.ReactNode;
}

export const getSpecimenCardHeader = (props: SpecimenCardHeaderProps): SpecimenCardHeaderResult => {
  const { id, russianName, latinName, sectorType } = props;
  const sectorColor = sectorTypeColors[sectorType] || sectorTypeColors[0];
  const headerClassName = `${sectorColor.bg} py-3 border-b border-gray-200`;
  const title = russianName || 'Без названия';
  
  const headerAction = (
    <span 
      className="text-xs text-[#86868B] font-medium bg-white/70 backdrop-blur-sm rounded-full 
        px-2.5 py-1.5 shadow-sm"
      aria-label={`Идентификатор образца: ${id}`}
    >
      ID: {id}
    </span>
  );
  
  return { headerClassName, title, subtitle: latinName, headerAction };
}; 