export const mapColors = {
  primary: '#4F46E5', // Обновленный основной цвет (индиго)
  success: '#10B981', // Зеленый цвет без изменений
  warning: '#F59E0B', // Желтый для предупреждений без изменений
  danger: '#EF4444', // Красный цвет без изменений
  neutral: '#6B7280', // Серый для нейтральных элементов без изменений
  background: '#F8FAFC', // Более светлый фон страницы
  cardBackground: '#FFFFFF', // Фон карточек без изменений
  border: '#E2E8F0', // Немного более светлый цвет границ
  // Обновленные и новые цвета
  lightBg: '#F1F5F9', // Светлый фоновый цвет
  darkText: '#0F172A', // Более темный текст для контраста
  mediumText: '#334155', // Обновленный средний текст
  lightText: '#64748B', // Более насыщенный светлый текст
  accentLight: '#E0E7FF', // Светлый акцентный цвет (индиго)
  secondary: '#8B5CF6', // Вторичный цвет (фиолетовый)
  tertiary: '#EC4899', // Третичный цвет (розовый)
  mapBackground: '#EFF6FF', // Фон для карты
  mapBorder: '#BFDBFE', // Границы для карты
  mapOverlay: 'rgba(248, 250, 252, 0.85)', // Полупрозрачный фон для оверлеев
  mapControl: '#F8FAFC', // Цвет фона для элементов управления
  plantMarker: '#059669', // Цвет для маркеров растений
  areaStroke: '#4F46E5', // Цвет для обводки области (индиго)
  areaFill: 'rgba(79, 70, 229, 0.15)', // Цвет заливки области (полупрозрачный индиго)
};

export const mapSpacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  xxl: '2.5rem', // 40px
};

export const mapShadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
  xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
  mapContainer: '0 8px 20px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(148, 163, 184, 0.1)', // Улучшенная тень для карты
  control: '0 2px 8px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.03)', // Улучшенная тень для элементов управления
  marker: '0 3px 8px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.02)', // Тень для маркеров
  popup: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.03)', // Тень для всплывающих окон
};

export const mapRadius = {
  xs: '0.125rem', // 2px
  sm: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  xxl: '1rem', // 16px
  full: '9999px', // Полностью круглый
};

export const mapFontSizes = {
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  md: '1rem', // 16px
  lg: '1.125rem', // 18px
  xl: '1.25rem', // 20px
  xxl: '1.5rem', // 24px
  xxxl: '1.875rem', // 30px
};

export const mapFontWeights = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const mapTransitions = {
  default: 'all 0.2s ease-in-out',
  fast: 'all 0.1s ease-in-out',
  slow: 'all 0.3s ease-in-out',
  bounce: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Добавлена анимация отскока
  smooth: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', // Плавная анимация
};

export const mapZIndices = {
  base: 0,
  above: 5, 
  overlay: 10,
  modal: 20,
  tooltip: 30,
  top: 50,
};

// Константы для стилей карты
export const mapSpecific = {
  // Стили для контейнера карты
  container: {
    borderRadius: mapRadius.lg,
    background: mapColors.mapBackground,
    boxShadow: mapShadows.mapContainer,
    border: `1px solid ${mapColors.mapBorder}`,
  },
  // Стили для элементов управления на карте
  controls: {
    zoom: {
      background: mapColors.mapControl,
      color: mapColors.darkText,
      hoverColor: mapColors.primary,
      buttonSize: '36px',
      boxShadow: mapShadows.control,
      borderRadius: mapRadius.sm,
    },
    attribution: {
      background: 'rgba(255, 255, 255, 0.9)',
      textColor: mapColors.mediumText,
      linkColor: mapColors.primary,
      fontSize: mapFontSizes.xs,
      padding: `${mapSpacing.xs} ${mapSpacing.sm}`,
      backdropFilter: 'blur(4px)',
    }
  },
  // Стили для маркеров
  markers: {
    default: {
      shadow: mapShadows.marker,
      size: '36px',
      transition: mapTransitions.bounce,
    },
    plant: {
      color: mapColors.plantMarker,
      selectedColor: '#047857', // Более темный вариант зеленого
      hoverScale: '1.05',
      activeScale: '1.1',
    },
    area: {
      color: mapColors.areaStroke,
      fillColor: mapColors.areaFill,
      selectedColor: '#4338CA', // Более темный вариант индиго
      selectedFillColor: 'rgba(67, 56, 202, 0.2)',
      strokeWidth: '2px',
      dashArray: '5, 5',
    }
  },
  // Стили для всплывающих окон
  popup: {
    background: mapColors.cardBackground,
    textColor: mapColors.darkText,
    titleColor: mapColors.primary,
    borderRadius: mapRadius.md,
    padding: `${mapSpacing.md} ${mapSpacing.lg}`,
    minWidth: '250px',
    boxShadow: mapShadows.popup,
    border: `1px solid ${mapColors.border}`,
    animation: 'fadeIn 0.3s ease-out',
  },
  // Стили для формы
  form: {
    background: mapColors.cardBackground,
    borderRadius: mapRadius.md,
    boxShadow: mapShadows.xl,
    padding: mapSpacing.lg,
    border: `1px solid ${mapColors.border}`,
    maxWidth: '400px',
    inputBorder: `1px solid ${mapColors.border}`,
    inputBorderRadius: mapRadius.sm,
    inputFocusBorder: mapColors.primary,
    inputPadding: `${mapSpacing.sm} ${mapSpacing.md}`,
    buttonBorderRadius: mapRadius.md,
  },
  // Анимации
  animations: {
    fadeIn: `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `,
    pulse: `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    `,
    dash: `
      @keyframes dash {
        to { stroke-dashoffset: 1000; }
      }
    `,
  }
}; 