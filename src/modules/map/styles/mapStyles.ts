export const mapColors = {
  primary: '#3B82F6', // Более современный синий цвет 
  success: '#10B981', // Более современный зеленый цвет
  warning: '#F59E0B', // Желтый для предупреждений без изменений
  danger: '#EF4444', // Более современный красный цвет
  neutral: '#6B7280', // Серый для нейтральных элементов без изменений
  background: '#F9FAFB', // Фон страницы без изменений
  cardBackground: '#FFFFFF', // Фон карточек без изменений
  border: '#E5E7EB', // Цвет границ без изменений
  // Новые цвета
  lightBg: '#F3F4F6', // Светлый фоновый цвет
  darkText: '#1F2937', // Темный текст
  mediumText: '#4B5563', // Средний текст
  lightText: '#9CA3AF', // Светлый текст
  accentLight: '#DBEAFE', // Светлый акцентный цвет
  secondary: '#8B5CF6', // Вторичный цвет (фиолетовый)
  tertiary: '#EC4899', // Третичный цвет (розовый)
  mapBackground: '#EFF6FF', // Фон для карты
  mapBorder: '#BFDBFE', // Границы для карты
};

export const mapSpacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
};

export const mapShadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // Новая тень
  mapContainer: '0 4px 12px rgba(15, 23, 42, 0.08)', // Специальная тень для карты
  control: '0 2px 6px rgba(0, 0, 0, 0.15)', // Тень для элементов управления
};

export const mapRadius = {
  sm: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  full: '9999px', // Полностью круглый
};

export const mapFontSizes = {
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  md: '1rem', // 16px
  lg: '1.125rem', // 18px
  xl: '1.25rem', // 20px
  xxl: '1.5rem', // 24px
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
};

export const mapZIndices = {
  base: 0,
  overlay: 10,
  modal: 20,
  tooltip: 30,
};

// Новые константы для стилей карты
export const mapSpecific = {
  // Стили для контейнера карты
  container: {
    borderRadius: '8px',
    background: '#f8fafc',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
  // Стили для элементов управления на карте
  controls: {
    zoom: {
      background: '#ffffff',
      color: '#333333',
      hoverColor: '#3B82F6',
      buttonSize: '32px',
    },
    attribution: {
      background: 'rgba(255, 255, 255, 0.8)',
      textColor: '#666666',
      linkColor: '#3B82F6',
    }
  },
  // Стили для маркеров
  markers: {
    default: {
      shadow: '0 2px 3px rgba(0, 0, 0, 0.2)',
      size: '32px',
    },
    plant: {
      color: '#10B981',
      selectedColor: '#059669',
    },
    area: {
      color: '#3B82F6',
      selectedColor: '#2563EB',
    }
  },
  // Стили для всплывающих окон
  popup: {
    background: '#ffffff',
    textColor: '#333333',
    borderRadius: '8px',
    padding: '12px 16px',
    minWidth: '200px',
    shadow: '0 3px 14px rgba(0, 0, 0, 0.2)',
  }
}; 