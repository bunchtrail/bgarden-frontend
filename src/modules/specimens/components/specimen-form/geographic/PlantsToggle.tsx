import React from 'react';

interface PlantsToggleProps {
  showOtherPlants: boolean;
  setShowOtherPlants: (show: boolean) => void;
}

const PlantsToggle: React.FC<PlantsToggleProps> = ({ 
  showOtherPlants, 
  setShowOtherPlants 
}) => {
  return (
    <div className="flex items-center mb-4 p-3 bg-white rounded-lg border border-gray-100 hover:border-green-200 transition-all duration-200">
      <input
        type="checkbox"
        id="showOtherPlants"
        checked={showOtherPlants}
        onChange={() => setShowOtherPlants(!showOtherPlants)}
        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 transition-colors duration-200"
      />
      <label 
        htmlFor="showOtherPlants" 
        className="ml-3 text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer select-none"
      >
        Показать другие растения на карте
      </label>
    </div>
  );
};

export default PlantsToggle; 