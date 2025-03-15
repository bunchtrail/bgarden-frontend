// Экспорт стилей модуля карты
import { COLORS, layoutClasses } from '@/styles/global-styles';

// Импорт переопределений стилей Leaflet
import './leaflet-overrides.css';

// Экспорт готовых констант для часто используемых стилей
export const MAP_STYLES = {
  // Tailwind классы для карты
  mapContainer: 'w-full h-full flex flex-col',
  mapContent: 'w-full h-[600px] relative rounded-b-lg overflow-hidden',
  
  // Классы для элементов регионов
  regionTooltip: 'min-w-[180px] max-w-[250px] p-1',
  
  // Инфографика для регионов
  regionInfo: 'mt-1 text-sm',
  regionCount: 'font-medium',
  
  // Стили карты Leaflet (переопределение стилей библиотеки)
  leafletTooltip: 'bg-white shadow-lg rounded-md',
  lightMode: 'leaflet-light-mode filter brightness-110 saturate-50',
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