import React, { ReactNode, useState, useEffect } from 'react';
import { useMapConfig } from '../../contexts/MapConfigContext';
import { 
  LayerSelector, 
  ConfigCheckbox, 
  PanelHeader,
  ControlPanelSection,
  ModeToggle
} from './index';
import { animationClasses } from '../../../../styles/global-styles';
import { MAP_LAYERS } from '../../contexts/MapConfigContext';

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
  const { 
    mapConfig, 
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

  // Получаем конфигурацию панели управления в зависимости от режима
  const getPanelConfig = (): PanelConfigPreset => {
    // Если передан пресет, используем его
    if (configPreset) {
      return configPreset;
    }

    // Для режима custom используем значения из пропсов
    if (panelMode === 'custom') {
      return {
        showLayerSelector: showLayerSelector ?? false,
        showModeToggle: showModeToggle ?? false,
        showTooltipToggle: showTooltipToggle ?? false,
        showLabelToggle: showLabelToggle ?? false,
        showClusteringToggle: showClusteringToggle ?? false,
        showMarkerToggle: showMarkerToggle ?? false,
        showDrawingControls: showDrawingControls ?? false,
        sections: customSections
      };
    }

    // В остальных случаях используем предопределенный пресет
    const preset = PANEL_PRESETS[panelMode];
    
    // Добавляем пользовательские секции, если они есть
    return {
      ...preset,
      sections: customSections.length ? customSections : preset.sections
    };
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

  // Создаем панель управления в соответствии с конфигурацией
  const renderConfigPanelContent = () => {
    return (
      <div className="space-y-4">
        {/* Секция слоев */}
        {config.showLayerSelector && (
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
        {config.showModeToggle && (
          <ModeToggle />
        )}

        {/* Основные настройки карты */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Настройки карты</h4>
          <div className="bg-white/50 p-3 rounded-lg space-y-3">
            {/* Настройки отображения */}
            {config.showTooltipToggle && (
              <ConfigCheckbox 
                label="Показывать подсказки"
                checked={mapConfig.showTooltips}
                onChange={() => handleConfigChange('showTooltips', !mapConfig.showTooltips)}
              />
            )}

            {/* Настройки для облегченной версии */}
            {config.showClusteringToggle && (
              <ConfigCheckbox 
                label="Группировать маркеры"
                checked={mapConfig.enableClustering}
                onChange={() => handleConfigChange('enableClustering', !mapConfig.enableClustering)}
              />
            )}
          </div>
        </div>

        {/* Пользовательские секции */}
        {config.sections && config.sections.length > 0 && (
          <div className="space-y-4 mt-4">
            {config.sections.map(section => (
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

        {/* Дополнительный контент (если есть) */}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}

        {/* Кнопки управления настройками */}
        {hasChanges && panelMode === 'full' && (
          <div className="flex justify-between mt-4">
            <button 
              onClick={handleResetConfig} 
              className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              Сбросить
            </button>
            <button 
              onClick={handleSaveConfig} 
              className="text-xs px-2 py-1 rounded bg-green-100 hover:bg-green-200 transition-colors"
            >
              Сохранить
            </button>
          </div>
        )}

        {/* Футер панели */}
        {footer && (
          <div className="mt-4 pt-3 border-t border-gray-200/50">
            {footer}
          </div>
        )}
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
          {renderConfigPanelContent()}
        </div>
      )}
    </div>
  );
};

export default MapControlPanel; 