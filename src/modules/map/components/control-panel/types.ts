import { ReactNode } from 'react';

// Определяем типы режимов панели
export type PanelMode = 'full' | 'light' | 'minimal' | 'geography' | 'custom';

// Секции панели управления
export enum PanelSection {
  LAYERS = 'layers',
  MODE = 'mode',
  SETTINGS = 'settings',
  DRAWING = 'drawing',
  BUTTONS = 'buttons'
}

// Интерфейс для пресета настроек панели управления
export interface PanelConfigPreset {
  showLayerSelector: boolean;
  showModeToggle: boolean;
  showTooltipToggle: boolean;
  showLabelToggle: boolean;
  showClusteringToggle: boolean;
  showMarkerToggle: boolean;
  showDrawingControls: boolean;
  showDrawingToggle?: boolean;
  sections?: ControlPanelSection[];
}

// Новый интерфейс для унифицированной панели управления
export interface UnifiedPanelConfig {
  // Режим панели
  mode: PanelMode;
  // Видимые секции (массив или объект с настройками)
  visibleSections: PanelSection[];
  // Дополнительные секции
  customSections?: ControlPanelSection[];
  // Конфигурация по секциям
  sectionConfig?: {
    [PanelSection.LAYERS]?: {
      layers: Array<{ id: string, label: string }>;
    };
    [PanelSection.SETTINGS]?: {
      showTooltipToggle?: boolean;
      showClusteringToggle?: boolean;
      showDrawingToggle?: boolean;
    };
    [PanelSection.MODE]?: {
      modes: Array<{ id: string, label: string }>;
    };
  };
}

// Интерфейс для секции панели управления
export interface ControlPanelSection {
  id: string;
  title: string;
  content: ReactNode;
}

// Предопределенные пресеты для разных режимов панели
export const PANEL_PRESETS: Record<Exclude<PanelMode, 'custom'>, PanelConfigPreset> = {
  'full': {
    showLayerSelector: true,
    showModeToggle: true,
    showTooltipToggle: true,
    showLabelToggle: false,
    showClusteringToggle: true,
    showMarkerToggle: false,
    showDrawingControls: true,
    showDrawingToggle: true,
  },
  'light': {
    showLayerSelector: false,
    showModeToggle: false,
    showTooltipToggle: false,
    showLabelToggle: false,
    showClusteringToggle: true,
    showMarkerToggle: false,
    showDrawingControls: false,
    showDrawingToggle: false,
  },
  'minimal': {
    showLayerSelector: false,
    showModeToggle: false,
    showTooltipToggle: false,
    showLabelToggle: false,
    showClusteringToggle: false,
    showMarkerToggle: false,
    showDrawingControls: false,
    showDrawingToggle: false,
  },
  'geography': {
    showLayerSelector: false,
    showModeToggle: true,
    showTooltipToggle: false,
    showLabelToggle: false,
    showClusteringToggle: true,
    showMarkerToggle: false,
    showDrawingControls: true,
    showDrawingToggle: true,
  }
};

// Предопределенные конфигурации для унифицированной панели
export const UNIFIED_PANEL_PRESETS: Record<string, UnifiedPanelConfig> = {
  'map': {
    mode: 'full',
    visibleSections: [
      PanelSection.MODE,
      PanelSection.LAYERS,
      PanelSection.SETTINGS,
      PanelSection.BUTTONS
    ]
  },
  'sector': {
    mode: 'geography',
    visibleSections: [
      PanelSection.LAYERS,
      PanelSection.SETTINGS
    ]
  },
  'specimen': {
    mode: 'minimal',
    visibleSections: [
      PanelSection.LAYERS
    ]
  }
};

// Интерфейс для пропсов основного компонента
export interface MapControlPanelProps {
  className?: string;
  // Режим панели управления
  panelMode?: PanelMode;
  showLayerSelector?: boolean;
  showModeToggle?: boolean;
  showTooltipToggle?: boolean;
  showLabelToggle?: boolean;
  showClusteringToggle?: boolean;
  showMarkerToggle?: boolean;
  showDrawingControls?: boolean;
  showDrawingToggle?: boolean;
  onClose?: () => void;
  customSections?: ControlPanelSection[];
  children?: ReactNode;
  onConfigChange?: (key: string, value: boolean | string | number) => void;
  header?: ReactNode;
  footer?: ReactNode;
  // Возможность передать полный пресет конфигурации
  configPreset?: PanelConfigPreset;
  // Для унифицированной панели
  unifiedConfig?: UnifiedPanelConfig;
} 