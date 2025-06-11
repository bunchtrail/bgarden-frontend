import { ReactNode } from 'react';

// Определяем типы режимов панели
export type PanelMode = 'full' | 'light' | 'minimal' | 'geography' | 'custom';

// Секции панели управления
export enum PanelSection {
  LAYERS = 'layers',
  MODE = 'mode',
  SETTINGS = 'settings',
  DRAWING = 'drawing',
  BUTTONS = 'buttons',
}

// Типы позиционирования панели
export type PanelPosition =
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight';

// Интерфейс для позиционирования и стилизации
export interface PanelPositioning {
  position?: PanelPosition;
  className?: string;
  style?: React.CSSProperties;
  zIndex?: number;
}

// Унифицированный интерфейс для конфигурации панели управления
export interface UnifiedPanelConfig {
  // Режим панели
  mode: PanelMode;
  // Видимые секции
  visibleSections: PanelSection[];
  // Дополнительные секции
  customSections?: ControlPanelSection[];
  // Конфигурация по секциям
  sectionConfig?: {
    [PanelSection.LAYERS]?: {
      layers?: Array<{ id: string; label: string }>;
    };
    [PanelSection.SETTINGS]?: {
      showTooltipToggle?: boolean;
      showClusteringToggle?: boolean;
      showDrawingToggle?: boolean;
      showPopupToggle?: boolean;
    };
    [PanelSection.MODE]?: {
      modes?: Array<{ id: string; label: string }>;
    };
  };
  // Позиционирование и стилизация
  positioning?: PanelPositioning;
}

// Интерфейс для секции панели управления
export interface ControlPanelSection {
  id: string;
  title: string;
  content: ReactNode;
}

// Предопределенные конфигурации для унифицированной панели
export const UNIFIED_PANEL_PRESETS: Record<string, UnifiedPanelConfig> = {
  map: {
    mode: 'full',
    visibleSections: [
      PanelSection.MODE,
      PanelSection.LAYERS,
      PanelSection.SETTINGS,
      PanelSection.BUTTONS,
    ],
    sectionConfig: {
      [PanelSection.SETTINGS]: {
        showPopupToggle: true,
        showClusteringToggle: true,
        showDrawingToggle: true,
        showTooltipToggle: true,
      },
    },
    positioning: {
      position: 'topRight',
      zIndex: 1000,
    },
  },
  sector: {
    mode: 'geography',
    visibleSections: [PanelSection.LAYERS, PanelSection.SETTINGS],
    sectionConfig: {
      [PanelSection.SETTINGS]: {
        showPopupToggle: true,
        showClusteringToggle: true,
        showDrawingToggle: false,
        showTooltipToggle: false,
      },
    },
    positioning: {
      position: 'topRight',
      zIndex: 1000,
    },
  },
  specimen: {
    mode: 'minimal',
    visibleSections: [PanelSection.LAYERS, PanelSection.SETTINGS],
    sectionConfig: {
      [PanelSection.SETTINGS]: {
        showClusteringToggle: true,
        showTooltipToggle: false,
        showDrawingToggle: false,
        showPopupToggle: false,
      },
    },
    positioning: {
      position: 'topRight',
      zIndex: 1000,
    },
  },
};

// Интерфейс для пропсов основного компонента
export interface UnifiedControlPanelProps {
  // Основные настройки
  pageType?: string;
  config?: UnifiedPanelConfig;

  // Кастомизация
  customSections?: ReactNode;
  mapTitle?: string;
  panelId?: string;

  // Позиционирование и стили
  position?: PanelPosition;
  className?: string;
  style?: React.CSSProperties;
  zIndex?: number;

  // Обработчики событий
  onClose?: () => void;
  onConfigChange?: (key: string, value: boolean | string | number) => void;

  // Дополнительные опции
  collapsible?: boolean;
  defaultExpanded?: boolean;
}
// Интерфейс для пропсов основного компонента
export interface UnifiedControlPanelProps {
  // Основные настройки
  pageType?: string;
  config?: UnifiedPanelConfig;

  // Кастомизация
  customSections?: ReactNode;
  mapTitle?: string;
  panelId?: string;

  // Позиционирование и стили
  position?: PanelPosition;
  className?: string;
  style?: React.CSSProperties;
  zIndex?: number;

  // Обработчики событий
  onClose?: () => void;
  onConfigChange?: (key: string, value: boolean | string | number) => void;

  // Дополнительные опции
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

// Утилитарные функции для работы с позиционированием
export const getPositionClasses = (
  position: PanelPosition = 'topRight'
): string => {
  const baseClasses = 'absolute';

  switch (position) {
    case 'topLeft':
      return `${baseClasses} top-4 left-4`;
    case 'topRight':
      return `${baseClasses} top-4 right-4`;
    case 'bottomLeft':
      return `${baseClasses} bottom-4 left-4`;
    case 'bottomRight':
      return `${baseClasses} bottom-4 right-4`;
    default:
      return `${baseClasses} top-4 right-4`;
  }
};
