import React from 'react';

interface ConfigCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

/**
 * Компонент чекбокса для настроек с современным дизайном
 */
const ConfigCheckbox: React.FC<ConfigCheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false
}) => {
  return (
    <label className="flex items-center cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <div className={`
          w-10 h-5 
          rounded-full 
          transition-colors duration-300 ease-in-out
          ${checked 
            ? 'bg-gradient-to-r from-blue-400 to-blue-500 shadow-inner' 
            : 'bg-gray-300'}
          ${disabled ? 'opacity-50' : ''}
        `}>
        </div>
        <div className={`
          absolute left-0 top-0 
          bg-white w-5 h-5 
          rounded-full 
          transform transition-transform duration-300 ease-in-out
          shadow-md border border-gray-100
          ${checked ? 'translate-x-5' : 'translate-x-0'}
          ${disabled ? 'opacity-80' : 'group-hover:scale-110'}
        `}>
        </div>
      </div>
      <span className={`
        ml-3 text-sm transition-colors duration-200
        ${checked ? 'text-gray-800 font-medium' : 'text-gray-600'}
        ${disabled ? 'opacity-50' : ''}
      `}>
        {label}
      </span>
    </label>
  );
};

export default ConfigCheckbox; 