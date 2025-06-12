import React from 'react';
import { animationClasses } from '../../../../styles/global-styles';

export interface SwitchProps {
  label?: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Компонент переключателя в стиле Apple.
 * Отображает переключатель с более мягкими, приятными для глаз цветами.
 */
const Switch: React.FC<SwitchProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
}) => {
  return (
    <label className={`flex items-center cursor-pointer group select-none ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <div className={`
          w-11 h-6 
          rounded-full 
          transition-all duration-300 ease-out
          ${checked 
            ? 'bg-emerald-600/70' // Более мягкий, приглушенный зеленый
            : 'bg-gray-300'}     // Нейтральный серый
          ${disabled ? 'opacity-40' : ''}
          shadow-inner
        `}>
        </div>
        <div className={`
          absolute left-0.5 top-0.5 
          bg-white w-5 h-5 
          rounded-full 
          transform ${animationClasses.transition}
          shadow-[0_2px_3px_rgba(0,0,0,0.08)]
          ${checked ? 'translate-x-5' : 'translate-x-0'}
          ${disabled 
            ? 'opacity-70' 
            : `${animationClasses.transition} ${checked ? 'group-hover:shadow-[0_0_0_2px_rgba(5,150,105,0.2)]' : ''}`}
        `}>
          {checked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-600/50"></div>
            </div>
          )}
        </div>
      </div>
      {label && (
        <span className={`
          ml-3 text-sm font-medium transition-colors duration-200
          ${checked ? 'text-gray-800' : 'text-gray-500'}
          ${disabled ? 'opacity-50' : ''}
        `}>
          {label}
        </span>
      )}
    </label>
  );
};

export default Switch;
