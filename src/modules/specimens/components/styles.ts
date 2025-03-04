import { SxProps, Theme } from '@mui/material';
import {
  BORDER_RADIUS,
  SPACING,
  headingStyles as baseHeadingStyles,
  buttonBaseStyles,
  ellipsisTextStyles,
  wordBreakStyles,
} from '../../../styles';

// Константы для модуля specimens
export const SPECIMEN_SPACING = {
  ...SPACING,
  FIELD_GAP: 2,
  SECTION_GAP: 3,
};

// Базовые контейнеры
export const specimenContainerStyles: SxProps<Theme> = {
  borderRadius: BORDER_RADIUS.LARGE,
  mb: SPECIMEN_SPACING.MD,
  p: { xs: SPECIMEN_SPACING.SM, sm: SPECIMEN_SPACING.MD },
  width: '100%',
  // Предотвращаем неожиданные переполнения
  maxWidth: '100%',
  overflow: 'hidden',
};

// Стили для заголовков с переопределением
export const headingStyles: SxProps<Theme> = {
  ...baseHeadingStyles,
  fontSize: { xs: '1.2rem', sm: '1.5rem' },
  lineHeight: 1.4,
};

// Стили для текстовых полей 
export const specimenTextStyles: SxProps<Theme> = {
  ...wordBreakStyles,
  mb: SPECIMEN_SPACING.SM,
  lineHeight: 1.5,
};

// Стили для полей ввода с многострочным текстом
export const multilineFieldStyles: SxProps<Theme> = {
  ...wordBreakStyles,
  whiteSpace: 'pre-line',
  lineHeight: 1.5,
};

// Стили для ячеек таблицы с фиксированной шириной
export const tableCellStyles = (maxWidth: string | object): SxProps<Theme> => ({
  maxWidth,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  padding: `${SPECIMEN_SPACING.SM}px ${SPECIMEN_SPACING.SM}px`,
});

// Стили для меток элементов
export const chipStyles: SxProps<Theme> = {
  maxWidth: '100%',
  ...ellipsisTextStyles,
  m: 0.5,
  height: 'auto',
  '& .MuiChip-label': {
    padding: '4px 8px',
    overflowWrap: 'break-word',
    whiteSpace: 'normal',
    lineHeight: 1.4,
  }
};

// Сетка и контейнеры 
export const gridContainerStyles: SxProps<Theme> = {
  spacing: SPECIMEN_SPACING.SM,
  width: '100%',
  mb: SPECIMEN_SPACING.MD,
};

// Стили для форм
export const formStyles: SxProps<Theme> = {
  '& .MuiFormControl-root': {
    mb: SPECIMEN_SPACING.SM,
    width: '100%',
  },
  '& .MuiInputBase-root': {
    borderRadius: BORDER_RADIUS.MEDIUM,
  }
};

// Стили для панели действий
export const actionsContainerStyles: SxProps<Theme> = {
  display: 'flex',
  flexWrap: { xs: 'wrap', sm: 'nowrap' },
  justifyContent: 'flex-end',
  gap: SPECIMEN_SPACING.SM,
  mt: SPECIMEN_SPACING.MD,
  width: '100%',
};

// Стили для кнопок
export const buttonStyles: SxProps<Theme> = {
  ...buttonBaseStyles,
  width: { xs: '100%', sm: 'auto' },
  borderRadius: BORDER_RADIUS.PILL,
  m: 0.5,
  textTransform: 'none',
};

// Фиксированные стили таблицы
export const tableContainerStyles: SxProps<Theme> = {
  overflow: 'auto',
  maxHeight: 'calc(100vh - 300px)',
  width: '100%',
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
};

// Стили табов для Specimen страницы
export const tabsContainerStyles: SxProps<Theme> = {
  borderBottom: 1,
  borderColor: 'divider',
  mb: SPECIMEN_SPACING.MD,
};

// Стили для подзаголовков (для обратной совместимости)
export const subheadingStyles: SxProps<Theme> = {
  mt: SPECIMEN_SPACING.MD,
  mb: SPECIMEN_SPACING.SM,
  fontSize: { xs: '1rem', sm: '1.1rem' },
};

// Стили для разделителей (для обратной совместимости)
export const dividerStyles: SxProps<Theme> = {
  my: SPECIMEN_SPACING.MD,
};

// Стили для контейнеров (для обратной совместимости)
export const containerStyles: SxProps<Theme> = specimenContainerStyles;

// Стили для кнопок в группе (для обратной совместимости)
export const buttonGroupStyles: SxProps<Theme> = {
  flexWrap: { xs: 'wrap', sm: 'nowrap' },
  mb: { xs: SPECIMEN_SPACING.SM, sm: 0 },
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

// Экспорт для обратной совместимости
export { SPACING, ellipsisTextStyles, wordBreakStyles };

