/**
 * Модульная система стилей компонентов
 * Унифицированные стили для Material-UI компонентов
 */
import { SxProps, Theme } from '@mui/material';

// Константы для отступов
export const SPACING = {
  XS: 1,
  SM: 2,
  MD: 3,
  LG: 4,
  XL: 5,
};

// Константы для размеров
export const SIZES = {
  XS: '0.75rem',
  SM: '0.875rem',
  MD: '1rem',
  LG: '1.25rem',
  XL: '1.5rem',
};

// Константы для радиусов скругления
export const BORDER_RADIUS = {
  SMALL: '8px',
  MEDIUM: '12px',
  LARGE: '16px',
  PILL: '980px',
};

// Базовые стили для контейнеров
export const containerStyles: SxProps<Theme> = {
  mb: SPACING.MD,
  p: { xs: SPACING.SM, sm: SPACING.MD },
  width: '100%',
};

// Стили для заголовков
export const headingStyles: SxProps<Theme> = {
  mb: SPACING.SM,
  fontWeight: 500,
};

// Стили для подзаголовков
export const subheadingStyles: SxProps<Theme> = {
  mt: SPACING.MD,
  mb: SPACING.SM,
};

// Стили для разделителей
export const dividerStyles: SxProps<Theme> = {
  my: SPACING.MD,
};

// Базовые стили для кнопок
export const buttonBaseStyles: SxProps<Theme> = {
  borderRadius: BORDER_RADIUS.PILL,
  padding: '8px 16px',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  '&:active': {
    transform: 'scale(0.98)',
  },
  '&:hover': {
    backgroundColor: 'rgba(0, 113, 227, 0.01) !important', // Ослабляем эффект
    borderColor: 'primary.main',
  },
};

// Стили для обычных кнопок
export const buttonStyles: SxProps<Theme> = {
  ...buttonBaseStyles,
  width: { xs: '100%', sm: 'auto' },
  '&:hover': {
    backgroundColor: 'rgba(0, 113, 227, 0.08)',
    borderColor: 'primary.main',
  }
};

// Стили для кнопок с иконками
export const iconButtonStyles: SxProps<Theme> = {
  ...buttonBaseStyles,
  minWidth: 'auto',
  width: 40,
  height: 40,
  p: 0,
  borderRadius: '50%',
};

// Стили для кнопок в группе
export const buttonGroupStyles: SxProps<Theme> = {
  flexWrap: { xs: 'wrap', sm: 'nowrap' },
  mb: { xs: SPACING.SM, sm: 0 },
  '& .MuiButton-root': {
    flexGrow: { xs: 1, sm: 0 },
    minWidth: { xs: '45%', sm: 'auto' },
    mb: { xs: 1, sm: 0 },
    '&:hover': {
      backgroundColor: 'rgba(0, 113, 227, 0.01)',
      borderColor: 'primary.main',
    }
  },
};

// Стили для текстовых полей с ограничением длины текста
export const ellipsisTextStyles: SxProps<Theme> = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

// Стили для текста с переносом слов
export const wordBreakStyles: SxProps<Theme> = {
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  hyphens: 'auto',
};

// Стили для ячеек таблицы с ограничением по ширине
export const tableCellStyles = (maxWidth: string | object): SxProps<Theme> => ({
  maxWidth,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

// Стили для Grid контейнеров
export const gridContainerStyles: SxProps<Theme> = {
  spacing: SPACING.SM,
};

// Стили для меток
export const chipStyles: SxProps<Theme> = {
  maxWidth: '100%',
  ...ellipsisTextStyles,
};

// Стили для форм
export const formStyles: SxProps<Theme> = {
  '& .MuiFormControl-root': {
    mb: SPACING.SM,
  },
};

// Стили для полей ввода с многострочным текстом
export const multilineFieldStyles: SxProps<Theme> = {
  ...wordBreakStyles,
  whiteSpace: 'pre-line',
};

// Стили для панели действий
export const actionsContainerStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: SPACING.SM,
  mt: SPACING.MD,
};

// Стили для карточек
export const cardStyles: SxProps<Theme> = {
  borderRadius: BORDER_RADIUS.LARGE,
  boxShadow: 'var(--shadow-medium)',
  overflow: 'hidden',
};

// Стили для списков
export const listItemStyles: SxProps<Theme> = {
  borderRadius: BORDER_RADIUS.MEDIUM,
  mb: SPACING.XS,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}; 