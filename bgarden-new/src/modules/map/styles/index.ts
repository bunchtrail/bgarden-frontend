// Экспорт стилей модуля карты
import { COLORS, layoutClasses } from '../../../styles/global-styles';

// Импорт переопределений стилей Leaflet
import './leaflet-overrides.css';

// Экспорт готовых констант для часто используемых стилей
export const MAP_STYLES = {
  // Tailwind классы для карты
  mapContainer: layoutClasses.container,
  mapContent: 'w-full h-[80vh]',
  
  // Классы для элементов регионов
  regionTooltip: 'tooltip-content',
  
  // Инфографика для регионов
  regionInfo: 'inline-flex items-center gap-2',
  regionCount: 'font-semibold',
  
  // Стили карты Leaflet (переопределение стилей библиотеки)
  leafletTooltip: 'leaflet-tooltip',
};

// Для обеспечения обратной совместимости - перенаправление на глобальные цвета
export const MAP_COLORS = {
  primary: COLORS.primary.main,
  primaryDark: COLORS.primary.dark,
  secondary: COLORS.text.secondary,
  text: {
    primary: COLORS.text.primary,
    secondary: COLORS.text.secondary,
  },
  background: {
    light: COLORS.neutral.light,
    gray: COLORS.neutral.main,
  },
  border: COLORS.neutral.dark
}; 