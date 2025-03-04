import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  SxProps,
  Theme,
} from '@mui/material';
import React from 'react';
import { buttonBaseStyles } from '../styles/components';

/**
 * Интерфейс пропсов для компонента Button
 */
export interface ButtonProps extends MuiButtonProps {
  /**
   * Функция обработки клика
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /**
   * CSS стили (использует sx prop из MUI)
   */
  sx?: SxProps<Theme>;
}

/**
 * Унифицированный компонент кнопки с общими стилями приложения
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  sx = {},
  variant = 'outlined',
  color = 'primary',
  ...rest
}) => {
  // Объединяем базовые стили с переданными пропсами
  const combinedSx = {
    ...buttonBaseStyles,
    '&:hover': {
      // Обеспечиваем правильное поведение при наведении - не полное закрашивание
      backgroundColor:
        variant === 'contained'
          ? undefined // Будет использовать theme.palette.primary.dark с opacity из темы
          : 'rgba(0, 113, 227, 0.08)',
      borderColor: color === 'primary' ? 'primary.main' : undefined,
    },
    ...sx,
  };

  return (
    <MuiButton
      variant={variant}
      color={color}
      onClick={onClick}
      sx={combinedSx as SxProps<Theme>}
      {...rest}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
