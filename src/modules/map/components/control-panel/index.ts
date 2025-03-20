export { default as LayerSelector } from './LayerSelector';
export { default as PanelHeader } from './PanelHeader';
export { default as ModeToggle } from './ModeToggle';

// Для использования компонента Switch из ui/components/Form
// вместо ConfigCheckbox, импортируйте его следующим образом:
// import { Switch } from '../../../ui/components/Form';

// Интерфейс для секции панели управления
export interface ControlPanelSection {
  id: string;
  title: string;
  content: React.ReactNode;
} 