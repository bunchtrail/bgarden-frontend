import React from 'react';

/**
 * Компонент чекбокса настроек
 */
const ConfigCheckbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: () => void;
}> = ({ label, checked, onChange }) => (
  <div className="mb-3">
    <label className="flex items-center">
      <input 
        type="checkbox" 
        className="form-checkbox h-4 w-4 text-blue-600"
        checked={checked}
        onChange={onChange}
      />
      <span className="ml-2 text-sm text-gray-700">{label}</span>
    </label>
  </div>
);

export default ConfigCheckbox; 