import React from 'react';
import { DetailItem } from './DetailItem';

interface SpecimenDetailsProps {
  inventoryNumber: string;
  latinName?: string;
  familyName?: string;
  regionName?: string;
  expositionName?: string;
}

export const SpecimenDetails: React.FC<SpecimenDetailsProps> = ({
  inventoryNumber,
  latinName,
  familyName,
  regionName,
  expositionName
}) => {
  return (
    <div className="space-y-3 mb-4">
      <DetailItem 
        label="Инв. номер" 
        value={inventoryNumber} 
        isInventory={true} 
      />
      
      <DetailItem 
        label="Лат. название" 
        value={latinName} 
        isItalic={true} 
      />
      
      <DetailItem 
        label="Семейство" 
        value={familyName} 
      />
      
      <DetailItem 
        label="Регион" 
        value={regionName} 
      />
      
      <DetailItem 
        label="Экспозиция" 
        value={expositionName} 
      />
    </div>
  );
}; 