import React from 'react';
import { appStyles } from '../styles/global-styles';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'warning' | 'danger' | 'success';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  onClick,
  disabled = false,
  className = '',
  fullWidth = false,
  type = 'button',
  size = 'medium',
  icon,
}) => {
  const getButtonClasses = () => {
    let classes = `${appStyles.button.base} ${appStyles.button[variant]}`;

    if (disabled) {
      classes += ` ${appStyles.button.disabled}`;
    }

    if (!fullWidth) {
      classes += ' sm:w-auto';
    }

    // Размеры кнопок
    if (size === 'small') {
      classes += ' text-xs px-3 py-1.5';
    } else if (size === 'large') {
      classes += ' text-base px-6 py-3';
    }

    // Если есть иконка, добавляем отступ
    if (icon) {
      classes += ' inline-flex items-center';
    }

    return classes;
  };

  return (
    <button
      className={`${getButtonClasses()} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
