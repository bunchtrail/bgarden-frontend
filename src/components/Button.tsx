import React from 'react';
import { buttonClasses } from '../styles/global-styles';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'warning' | 'danger' | 'success';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  onClick,
  disabled = false,
  className = '',
  fullWidth = false,
  type = 'button',
}) => {
  const getButtonClasses = () => {
    let classes = `${buttonClasses.base} ${buttonClasses[variant]}`;

    if (disabled) {
      classes += ` ${buttonClasses.disabled}`;
    }

    if (!fullWidth) {
      classes += ' sm:w-auto';
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
      {children}
    </button>
  );
};

export default Button;
