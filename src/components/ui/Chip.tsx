import React from 'react';
import { chipClasses } from '../../styles/global-styles';

interface ChipProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  onDelete?: () => void;
  className?: string;
}

const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'primary',
  onDelete,
  className = '',
}) => {
  return (
    <span
      className={`${chipClasses.base} ${chipClasses[variant]} ${className}`}
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
