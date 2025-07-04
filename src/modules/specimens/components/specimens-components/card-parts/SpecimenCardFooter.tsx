import React from 'react';
import ActionButtons from '../../specimens-controls/ActionButtons';

interface SpecimenCardFooterProps {
  specimenId: number;
  onDelete: (id: number) => void;
}

export const SpecimenCardFooter: React.FC<SpecimenCardFooterProps> = ({ 
  specimenId, 
  onDelete 
}) => {
  return (
    <div className="flex justify-center items-center flex-wrap gap-2 w-full opacity-90 hover:opacity-100 transition-opacity">
      <ActionButtons specimenId={specimenId} onDelete={onDelete} variant="card" />
    </div>
  );
};
