/**
 * Экспорт всех стилей из единой точки входа
 */

// Экспорт всех компонентов стилей
export * from './components';

// Дополнительные константы и утилиты для стилей
export const BREAKPOINTS = {
  XS: 0,
  SM: 600,
  MD: 900,
  LG: 1200,
  XL: 1536,
};

export const COLORS = {
  PRIMARY: '#0071e3',
  PRIMARY_HOVER: '#0077ed',
  SECONDARY: '#86868b',
  BACKGROUND: '#fbfbfd',
  BACKGROUND_DARK: '#000000',
  TEXT_PRIMARY: '#1d1d1f',
  TEXT_SECONDARY: '#86868b',
  ERROR: '#ff3b30',
  WARNING: '#ffcc00',
  INFO: '#007aff',
  SUCCESS: '#34c759',
};

// Утилиты для работы со стилями
export const createResponsiveStyles = (
  property: string,
  values: Record<string, string | number>
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  
  Object.entries(values).forEach(([breakpoint, value]) => {
    if (breakpoint === 'xs') {
      result[property] = value;
    } else {
      result[`@media (min-width: ${BREAKPOINTS[breakpoint.toUpperCase() as keyof typeof BREAKPOINTS]}px)`] = {
        [property]: value,
      };
    }
  });
  
  return result;
}; 