import { ReactNode } from 'react';

// Определяем типы режимов панели
export type PanelMode = 'full' | 'light' | 'minimal' | 'geography' | 'custom';

// Интерфейс для пресета настроек панели управления
export interface PanelConfigPreset {
  showLayerSelector: boolean;
  showModeToggle: boolean;
  showTooltipToggle: boolean;
  showLabelToggle: boolean;
  showClusteringToggle: boolean;
  showMarkerToggle: boolean;
  showDrawingControls: boolean;
  sections?: ControlPanelSection[];
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
  },
  'light': {
    showLayerSelector: false,
    showModeToggle: false,
    showTooltipToggle: false,
    showLabelToggle: false,
    showClusteringToggle: true,
    showMarkerToggle: false,
    showDrawingControls: false,
  },
  'minimal': {
    showLayerSelector: false,
    showModeToggle: false,
    showTooltipToggle: false,
    showLabelToggle: false,
    showClusteringToggle: false,
    showMarkerToggle: false,
    showDrawingControls: false,
  },
  'geography': {
    showLayerSelector: false,
    showModeToggle: true,
    showTooltipToggle: false,
    showLabelToggle: false,
    showClusteringToggle: true,
    showMarkerToggle: false,
    showDrawingControls: true,
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
  onClose?: () => void;
  customSections?: ControlPanelSection[];
  children?: ReactNode;
  onConfigChange?: (key: string, value: boolean | string | number) => void;
  header?: ReactNode;
  footer?: ReactNode;
  // Возможность передать полный пресет конфигурации
  configPreset?: PanelConfigPreset;
} 