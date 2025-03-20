import React, { ReactNode } from 'react';
import { 
  LayerSelector, 
  PanelHeader,
  ModeToggle,
  MapSettingsSection,
  ControlButtons,
  CustomSections,
  MapControlPanelProps
} from './index';
import { 
  animationClasses, 
  cardClasses
} from '../../../../styles/global-styles';
import { MAP_LAYERS } from '../../contexts/MapConfigContext';
import { useMapControlPanel } from '../../hooks/useMapControlPanel';
import { useMapConfig } from '../../contexts/MapConfigContext';

/**
 * Компонент панели управления картой
 * Использует модульные компоненты для отображения различных секций настроек
 */
const MapControlPanel: React.FC<MapControlPanelProps> = ({
  className = '',
  panelMode = 'full',
  showLayerSelector,
  showModeToggle,
  showTooltipToggle,
  showLabelToggle,
  showClusteringToggle,
  showMarkerToggle,
  showDrawingControls,
  onClose,
  customSections = [],
  children,
  onConfigChange,
  header,
  footer,
  configPreset
}) => {
  // Получаем доступ к контексту конфигурации карты
  const { mapConfig } = useMapConfig();
  
  // Используем хук для управления логикой панели
  const {
    isExpanded,
    toggleExpand,
    hasChanges,
    panelConfig,
    handleConfigChange,
    handleResetConfig,
    handleSaveConfig,
    isLayerVisible,
    handleToggleLayer
  } = useMapControlPanel({
    panelMode,
    customConfig: {
      showLayerSelector,
      showModeToggle,
      showTooltipToggle,
      showLabelToggle,
      showClusteringToggle,
      showMarkerToggle,
      showDrawingControls,
      sections: customSections
    },
    onConfigChange,
    configPreset
  });

  // Современная стилизация с использованием стекломорфизма и глобальных стилей
  const panelStyles = `
    ${cardClasses.elevated}
    absolute top-4 right-4 z-[1000] 
    max-w-xs w-full
    overflow-hidden
    ${isExpanded ? 'opacity-100' : 'opacity-90 hover:opacity-100'}
    ${animationClasses.transition}
    ${className}
  `;

  return (
    <div className={panelStyles}>
      <div className={`flex items-center justify-between px-4 py-3 ${cardClasses.footer}`}>
        <button 
          onClick={toggleExpand}
          className={`mr-2 text-gray-500 hover:text-gray-700 ${animationClasses.transition}`}
          aria-label={isExpanded ? "Свернуть панель" : "Развернуть панель"}
        >
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        <PanelHeader 
          customHeader={header} 
          onClose={onClose} 
        />
      </div>

      {isExpanded && (
        <div className={cardClasses.content}>
          <div className="space-y-4">
            {/* Секция слоев */}
            {panelConfig.showLayerSelector && (
              <LayerSelector 
                layers={[
                  { id: MAP_LAYERS.REGIONS, label: 'Участки' },
                  { id: MAP_LAYERS.PLANTS, label: 'Растения' }
                ]}
                visibleLayers={mapConfig.visibleLayers}
                onToggleLayer={handleToggleLayer}
              />
            )}

            {/* Режим взаимодействия с картой */}
            {panelConfig.showModeToggle && (
              <ModeToggle />
            )}

            {/* Основные настройки карты */}
            <MapSettingsSection 
              showTooltipToggle={panelConfig.showTooltipToggle}
              showClusteringToggle={panelConfig.showClusteringToggle}
              onConfigChange={handleConfigChange}
            />

            {/* Пользовательские секции */}
            <CustomSections sections={panelConfig.sections} />

            {/* Дополнительный контент (если есть) */}
            {children && (
              <div className="mt-4">
                {children}
              </div>
            )}

            {/* Кнопки управления настройками */}
            {panelMode === 'full' && (
              <ControlButtons 
                hasChanges={hasChanges}
                onReset={handleResetConfig}
                onSave={handleSaveConfig}
              />
            )}

            {/* Футер панели */}
            {footer && (
              <div className="mt-4 pt-3 border-t border-gray-200/50">
                {footer}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapControlPanel; 