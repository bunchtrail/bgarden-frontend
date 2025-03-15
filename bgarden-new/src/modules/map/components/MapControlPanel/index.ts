import DraggablePanel from './DraggablePanel';
import PanelBody from './PanelBody';
import PanelHeader from './PanelHeader';

/**
 * Модуль контрольной панели карты
 * Экспортирует компоненты для создания панели управления на карте
 */

export {
  DraggablePanel,
  PanelBody,
  PanelHeader
};

// Композиция для удобного использования
const MapControlPanel = {
  Panel: DraggablePanel,
  Header: PanelHeader,
  Body: PanelBody
};

export default MapControlPanel; 