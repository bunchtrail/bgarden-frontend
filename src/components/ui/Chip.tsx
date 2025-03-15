import React from 'react';
import { chipClasses } from '../../styles/global-styles';

interface ChipProps {
  label: string;
  variant?: 'success' | 'warning' | 'danger' | 'neutral';
  onDelete?: () => void;
  className?: string;
}

const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'neutral',
  onDelete,
  className = '',
}) => {
  // Получаем класс варианта напрямую, так как primary отсутствует в chipClasses
  const getVariantClass = () => {
    switch(variant) {
      case 'success': return chipClasses.success;
      case 'warning': return chipClasses.warning;
      case 'danger': return chipClasses.danger;
      case 'neutral': 
      default: return chipClasses.neutral;
    }
  };

  return (
    <span
      className={`${chipClasses.base} ${getVariantClass()} ${className}`}
    >
      {label}
      {onDelete && (
        <button
          type='button'
          className='ml-1 text-sm leading-none hover:bg-gray-200 hover:text-gray-900 rounded-full w-4 h-4 inline-flex justify-center items-center'
          onClick={onDelete}
        >
          &times;
        </button>
      )}
    </span>
  );
};

export default Chip;
