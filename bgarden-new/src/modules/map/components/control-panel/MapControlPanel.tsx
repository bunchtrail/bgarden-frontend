import React, { ReactNode } from 'react';
import { useMapConfig } from '../../contexts/MapConfigContext';
import { 
  LayerSelector, 
  ModeToggle, 
  ConfigCheckbox, 
  PanelHeader,
  ControlPanelSection,
  MapLayerConfig 
} from './index';

interface MapControlPanelProps {
  className?: string;
  showLayerSelector?: boolean;
  showModeToggle?: boolean;
  showTooltipToggle?: boolean;
  showLabelToggle?: boolean;
  onClose?: () => void;
  layers?: MapLayerConfig[];
  customSections?: ControlPanelSection[];
  children?: ReactNode;
  onLayerToggle?: (layerId: string, isVisible: boolean) => void;
  onConfigChange?: (key: string, value: boolean | string | number) => void;
  header?: ReactNode;
  footer?: ReactNode;
}

/**
 * Компонент панели управления картой
 * Использует модульные компоненты для отображения различных секций настроек
 */
const MapControlPanel: React.FC<MapControlPanelProps> = ({
  className = '',
  showLayerSelector = true,
  showModeToggle = true,
  showTooltipToggle = true,
  showLabelToggle = true,
  onClose,
  layers,
  customSections = [],
  children,
  onLayerToggle,
  onConfigChange,
  header,
  footer
}) => {
  const { 
    mapConfig, 
    toggleLayer, 
    toggleLightMode, 
    updateMapConfig 
  } = useMapConfig();

  // Обработчик изменения слоя с поддержкой внешнего обработчика
  const handleLayerToggle = (layerId: string) => {
    toggleLayer(layerId);
    if (onLayerToggle) {
      const isVisible = !mapConfig.visibleLayers.includes(layerId);
      onLayerToggle(layerId, isVisible);
    }
  };

  // Обработчик изменения конфигурации с поддержкой внешнего обработчика
  const handleConfigChange = (key: string, value: boolean | string | number) => {
    updateMapConfig({ [key]: value });
    if (onConfigChange) {
      onConfigChange(key, value);
    }
  };

  // Слои по умолчанию, если не переданы извне
  const defaultLayers: MapLayerConfig[] = [
    { id: 'imagery', label: 'Изображение карты' },
    { id: 'regions', label: 'Регионы' },
    { id: 'labels', label: 'Метки' }
  ];

  // Используем переданные слои или слои по умолчанию
  const mapLayers = layers || defaultLayers;

  const panelStyles = `
    bg-white bg-opacity-90 rounded-lg shadow-lg 
    p-4 absolute top-4 right-4 z-[1000] 
    max-w-xs w-full border border-gray-200
    ${className}
  `;

  return (
    <div className={panelStyles}>
      <PanelHeader customHeader={header} onClose={onClose} />

      {showModeToggle && (
        <ModeToggle 
          lightMode={mapConfig.lightMode} 
          onToggle={() => {
            toggleLightMode();
            if (onConfigChange) {
              onConfigChange('lightMode', !mapConfig.lightMode);
            }
          }}
        />
      )}

      {showLayerSelector && (
        <LayerSelector 
          layers={mapLayers}
          visibleLayers={mapConfig.visibleLayers}
          onLayerToggle={handleLayerToggle}
        />
      )}

      {showTooltipToggle && (
        <ConfigCheckbox 
          label="Показывать подсказки"
          checked={mapConfig.showTooltips}
          onChange={() => handleConfigChange('showTooltips', !mapConfig.showTooltips)}
        />
      )}

      {showLabelToggle && (
        <ConfigCheckbox 
          label="Показывать названия"
          checked={mapConfig.showLabels}
          onChange={() => handleConfigChange('showLabels', !mapConfig.showLabels)}
        />
      )}

      {/* Пользовательские секции */}
      {customSections.map(section => (
        <div key={section.id} className="mb-3">
          {section.title && <p className="text-sm text-gray-700 mb-2">{section.title}</p>}
          {section.content}
        </div>
      ))}

      {/* Дополнительное содержимое через children */}
      {children}

      {/* Нижний колонтитул панели */}
      {footer && <div className="mt-3 pt-2 border-t border-gray-200">{footer}</div>}
    </div>
  );
};

export default MapControlPanel; 