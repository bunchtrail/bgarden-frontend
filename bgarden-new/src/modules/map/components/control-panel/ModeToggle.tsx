import React from 'react';

/**
 * Компонент переключателя режима карты
 */
const ModeToggle: React.FC<{
  lightMode: boolean;
  onToggle: () => void;
}> = ({ lightMode, onToggle }) => (
  <div className="mb-3">
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input 
          type="checkbox" 
          className="sr-only" 
          checked={lightMode}
          onChange={onToggle}
        />
        <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
        <div className={`
          dot absolute left-1 top-1 w-4 h-4 rounded-full transition 
          ${lightMode ? 'bg-green-500 transform translate-x-4' : 'bg-white'}
        `}></div>
      </div>
      <div className="ml-3 text-gray-700 text-sm">
        Облегченный режим
      </div>
    </label>
  </div>
);

export default ModeToggle; 