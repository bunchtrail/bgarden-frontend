export { default as LayerSelector } from './LayerSelector';
export { default as ModeToggle } from './ModeToggle';
export { default as ConfigCheckbox } from './ConfigCheckbox';
export { default as PanelHeader } from './PanelHeader';

// Экспорт интерфейса для секции настроек
export interface ControlPanelSection {
  id: string;
  title?: string;
  content: React.ReactNode;
} 