import { SxProps, Theme } from '@mui/material';

// Константы для отступов и размеров
export const SPACING = {
  XS: 1,
  SM: 2,
  MD: 3,
  LG: 4,
  XL: 5,
};

// Константы для цветов
export const COLORS = {
  PRIMARY: 'primary.main',
  SECONDARY: 'secondary.main',
  SUCCESS: 'success.main',
  WARNING: 'warning.main',
  ERROR: 'error.main',
  INFO: 'info.main',
  TEXT_PRIMARY: 'text.primary',
  TEXT_SECONDARY: 'text.secondary',
  BACKGROUND_DEFAULT: 'background.default',
  BACKGROUND_PAPER: 'background.paper',
};

// Общие стили для контейнеров
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

// Стили для кнопок
export const buttonStyles: SxProps<Theme> = {
  width: { xs: '100%', sm: 'auto' },
};

// Стили для кнопок в группе
export const buttonGroupStyles: SxProps<Theme> = {
  flexWrap: { xs: 'wrap', sm: 'nowrap' },
  mb: { xs: SPACING.SM, sm: 0 },
  '& .MuiButton-root': {
    flexGrow: { xs: 1, sm: 0 },
    minWidth: { xs: '45%', sm: 'auto' },
    mb: { xs: 1, sm: 0 },
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