import React from 'react';
import { textClasses } from '../../../../../styles/global-styles';

interface DetailItemProps {
  label: string;
  value?: string;
  isItalic?: boolean;
  isInventory?: boolean;
}

export const DetailItem: React.FC<DetailItemProps> = ({ 
  label, 
  value, 
  isItalic = false,
  isInventory = false
}) => {
  if (!value) return null;
  
  return (
    <div className="flex items-center">
      <span className={`${textClasses.small} ${textClasses.secondary} uppercase tracking-wider w-24`}>
        {label}
      </span> 
      <span className={`${isInventory ? 'bg-[#F5F5F7] px-3 py-1.5 rounded-md shadow-sm' : 'px-3 py-1.5'} 
        ${isItalic ? 'italic' : ''} text-sm font-medium flex-1`}>
        {value}
      </span>
    </div>
  );
}; 