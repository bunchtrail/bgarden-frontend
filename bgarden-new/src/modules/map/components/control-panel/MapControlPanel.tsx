import React, { ReactNode, useState, useEffect } from 'react';
import { useMapConfig } from '../../contexts/MapConfigContext';
import { 
  LayerSelector, 
  ModeToggle, 
  ConfigCheckbox, 
  PanelHeader,
  ControlPanelSection
} from './index';
import { animationClasses } from '../../../../styles/global-styles';
import { MAP_LAYERS } from '../../contexts/MapConfigContext';

// Определяем типы режимов панели
export type PanelMode = 'full' | 'light' | 'minimal' | 'custom';

interface MapControlPanelProps {
  className?: string;
  // Режим панели управления
  panelMode?: PanelMode;
  showLayerSelector?: boolean;
  showModeToggle?: boolean;
  showTooltipToggle?: boolean;
  showLabelToggle?: boolean;
  showClusteringToggle?: boolean;
  showMarkerToggle?: boolean;
  showPlantsToggle?: boolean;
  onClose?: () => void;
  customSections?: ControlPanelSection[];
  children?: ReactNode;
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
  panelMode = 'full',
  showLayerSelector = true,
  showModeToggle = true,
  showTooltipToggle = true,
  showLabelToggle = true,
  showClusteringToggle = true,
  showMarkerToggle = false,
  showPlantsToggle = false,
  onClose,
  customSections = [],
  children,
  onConfigChange,
  header,
  footer
}) => {
  const { 
    mapConfig, 
    toggleLightMode, 
    updateMapConfig,
    resetMapConfig,
    saveConfigToStorage,
    toggleLayer
  } = useMapConfig();
  
  // Состояние для анимации
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Состояние для отслеживания изменений, чтобы показывать кнопку сброса
  const [hasChanges, setHasChanges] = useState(false);

  // Эффект для обнаружения изменений в конфигурации
  useEffect(() => {
    setHasChanges(true);
  }, [mapConfig]);

  // Настройки видимости элементов в зависимости от режима
  const getPanelConfig = () => {
    switch (panelMode) {
      case 'light':
        return {
          showLayerSelector: false,
          showModeToggle: true,
          showTooltipToggle: false,
          showLabelToggle: true,
          showClusteringToggle: true,
          showMarkerToggle: true,
          showPlantsToggle: false
        };
      case 'minimal':
        return {
          showLayerSelector: false,
          showModeToggle: false,
          showTooltipToggle: false,
          showLabelToggle: false,
          showClusteringToggle: true,
          showMarkerToggle: true,
          showPlantsToggle: false
        };
      case 'custom':
        // Для режима custom используем значения, переданные в props
        return {
          showLayerSelector,
          showModeToggle,
          showTooltipToggle,
          showLabelToggle,
          showClusteringToggle,
          showMarkerToggle,
          showPlantsToggle
        };
      case 'full':
      default:
        return {
          showLayerSelector: true,
          showModeToggle: true,
          showTooltipToggle: true,
          showLabelToggle: true,
          showClusteringToggle: true,
          showMarkerToggle: false,
          showPlantsToggle: true
        };
    }
  };

  const config = getPanelConfig();

  // Обработчик изменения конфигурации с поддержкой внешнего обработчика
  const handleConfigChange = (key: string, value: boolean | string | number) => {
    // Для всех типов настроек просто обновляем значение
    updateMapConfig({ [key]: value });
    
    if (onConfigChange) {
      onConfigChange(key, value);
    }
    
    // Отмечаем, что были внесены изменения
    setHasChanges(true);
  };

  // Проверяем, видим ли указанный слой
  const isLayerVisible = (layerId: string) => mapConfig.visibleLayers.includes(layerId);

  // Безопасное переключение слоя с проверкой
  const handleToggleLayer = (layerId: string) => {
    // Если слой уже выключен - его можно включить без проверок
    if (!isLayerVisible(layerId)) {
      toggleLayer(layerId);
      return;
    }
    
    // Если слой включен, проверяем, можно ли его выключить
    if (mapConfig.visibleLayers.length > 1) {
      toggleLayer(layerId);
    } else {
      console.log('Невозможно отключить все слои карты. Хотя бы один слой должен быть активен.');
    }
  };

  // Обработчик сброса настроек
  const handleResetConfig = () => {
    resetMapConfig();
    setHasChanges(false);
  };

  // Обработчик сохранения настроек
  const handleSaveConfig = () => {
    saveConfigToStorage();
    setHasChanges(false);
  };

  // Современная стилизация с использованием стекломорфизма
  const panelStyles = `
    backdrop-blur-md bg-white/75
    border border-white/20 
    shadow-lg
    rounded-2xl
    absolute top-4 right-4 z-[1000] 
    max-w-xs w-full
    overflow-hidden
    transition-all duration-300 ease-in-out
    ${isExpanded ? 'opacity-100' : 'opacity-90 hover:opacity-100'}
    ${animationClasses.transition}
    ${className}
  `;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Настройки для облегченного режима
  const renderLightModeSection = () => {
    if (!mapConfig.lightMode) return null;
    
    return (
      <div className="mt-4 mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Настройки облегченной карты</h4>
        <div className="bg-white/50 p-3 rounded-lg space-y-3">
          <ConfigCheckbox 
            label="Показывать растения"
            checked={isLayerVisible(MAP_LAYERS.PLANTS)}
            onChange={() => handleToggleLayer(MAP_LAYERS.PLANTS)}
          />
          
          <ConfigCheckbox 
            label="Группировать маркеры"
            checked={mapConfig.enableClustering}
            onChange={() => handleConfigChange('enableClustering', !mapConfig.enableClustering)}
          />
          
          <ConfigCheckbox 
            label="Показывать подсказки"
            checked={mapConfig.showTooltips}
            onChange={() => handleConfigChange('showTooltips', !mapConfig.showTooltips)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={panelStyles}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/50">
        <button 
          onClick={toggleExpand}
          className="mr-2 text-gray-500 hover:text-gray-700 transition-colors"
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
        <PanelHeader customHeader={header || <h3 className="text-gray-800 font-medium">Настройки карты</h3>} onClose={onClose} />
      </div>

      {isExpanded && (
        <div className="p-4">
          {config.showModeToggle && (
            <div className="mb-4">
              <ModeToggle 
                lightMode={mapConfig.lightMode} 
                onToggle={() => {
                  toggleLightMode();
                  if (onConfigChange) {
                    onConfigChange('lightMode', !mapConfig.lightMode);
                  }
                }}
              />
            </div>
          )}

          {/* Специальная секция для облегченного режима */}
          {renderLightModeSection()}

          {/* Показываем LayerSelector только в полном режиме */}
          {config.showLayerSelector && !mapConfig.lightMode && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Слои карты</h4>
              <div className="bg-white/50 p-2 rounded-lg">
                <LayerSelector />
              </div>
            </div>
          )}

          {/* Показываем основные настройки только в полном режиме */}
          {!mapConfig.lightMode && (config.showTooltipToggle || config.showLabelToggle || config.showClusteringToggle || config.showMarkerToggle) && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Настройки отображения</h4>
              <div className="bg-white/50 p-3 rounded-lg space-y-3">
                {config.showTooltipToggle && (
                  <ConfigCheckbox 
                    label="Показывать подсказки"
                    checked={mapConfig.showTooltips}
                    onChange={() => handleConfigChange('showTooltips', !mapConfig.showTooltips)}
                  />
                )}

                {config.showLabelToggle && (
                  <ConfigCheckbox 
                    label="Показывать названия"
                    checked={mapConfig.showLabels}
                    onChange={() => handleConfigChange('showLabels', !mapConfig.showLabels)}
                  />
                )}

                {config.showClusteringToggle && (
                  <ConfigCheckbox 
                    label="Группировать маркеры"
                    checked={mapConfig.enableClustering}
                    onChange={() => handleConfigChange('enableClustering', !mapConfig.enableClustering)}
                  />
                )}

                {config.showMarkerToggle && (
                  <ConfigCheckbox 
                    label="Показывать маркеры"
                    checked={mapConfig.showMarkers}
                    onChange={() => handleConfigChange('showMarkers', !mapConfig.showMarkers)}
                  />
                )}
              </div>
            </div>
          )}

          {/* Пользовательские секции */}
          {customSections.length > 0 && (
            <div className="space-y-4">
              {customSections.map(section => (
                <div key={section.id} className="mb-3">
                  {section.title && (
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{section.title}</h4>
                  )}
                  <div className="bg-white/50 p-3 rounded-lg">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Дополнительное содержимое через children */}
          {children && (
            <div className="mt-4">
              {children}
            </div>
          )}

          {/* Кнопки управления настройками */}
          <div className="mt-4 pt-3 border-t border-gray-200/50 flex justify-between">
            <button
              onClick={handleResetConfig}
              className="text-sm px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors"
              title="Сбросить все настройки к значениям по умолчанию"
            >
              Сбросить
            </button>
            
            <button
              onClick={handleSaveConfig}
              className="text-sm px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
              disabled={!hasChanges}
              title="Сохранить текущие настройки"
            >
              Сохранить
            </button>
          </div>

          {/* Нижний колонтитул панели */}
          {footer && (
            <div className="mt-4 pt-3 border-t border-gray-200/50 text-sm text-gray-500">
              {footer}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapControlPanel; 