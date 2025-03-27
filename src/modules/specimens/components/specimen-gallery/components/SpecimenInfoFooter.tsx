import React from 'react';

interface SpecimenInfoFooterProps {
  russianName: string;
  latinName: string;
}

const SpecimenInfoFooter: React.FC<SpecimenInfoFooterProps> = ({ 
  russianName, 
  latinName 
}) => {
  return (
    <div className="w-full text-center mt-3 px-3">
      <p className="text-sm font-medium text-gray-700 mb-1">
        {russianName}
      </p>
      <p className="text-xs italic text-gray-500">
        {latinName}
      </p>
    </div>
  );
};

export default SpecimenInfoFooter; 