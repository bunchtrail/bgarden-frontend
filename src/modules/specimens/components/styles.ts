import { SxProps, Theme } from '@mui/material';
import {
  containerStyles as baseContainerStyles,
  dividerStyles as baseDividerStyles,
  BORDER_RADIUS,
  buttonBaseStyles,
  ellipsisTextStyles,
  headingStyles,
  SPACING,
  wordBreakStyles,
} from '../../../styles';

// Расширенные стили для контейнеров
export const containerStyles: SxProps<Theme> = {
  ...baseContainerStyles,
  borderRadius: BORDER_RADIUS.LARGE,
};

// Стили для заголовков (реэкспорт)
export { headingStyles };

// Ре-экспорт стилей из общей системы
  export { ellipsisTextStyles, wordBreakStyles };

// Стили для подзаголовков
export const subheadingStyles: SxProps<Theme> = {
  mt: SPACING.MD,
  mb: SPACING.SM,
};

// Расширенные стили для разделителей
export const dividerStyles: SxProps<Theme> = {
  ...baseDividerStyles,
};

// Стили для кнопок
export const buttonStyles: SxProps<Theme> = {
  ...buttonBaseStyles,
  width: { xs: '100%', sm: 'auto' },
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.04)',
    borderColor: 'primary.main',
  }
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
      backgroundColor: 'rgba(25, 118, 210, 0.04)',
      borderColor: 'primary.main',
    }
  },
};

// Экспорт константы SPACING
export { SPACING };

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