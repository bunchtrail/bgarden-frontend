import React, { ReactNode, useCallback, useRef, useEffect } from 'react';
import { 
  useMapConfig, 
  MAP_LAYERS, 
  MAP_MODES, 
  DEFAULT_MAP_CONFIG 
} from '../../contexts/MapConfigContext';
import { 
  PanelSection, 
  UnifiedPanelConfig, 
  UNIFIED_PANEL_PRESETS 
} from './types';
import { Switch } from '../../../ui/components/Form';
import { 
  animationClasses, 
  cardClasses,
  buttonClasses
} from '../../../../styles/global-styles';

// Глобальный реестр отрисованных панелей
const renderedPanels = new Set<string>();

interface UnifiedControlPanelProps {
  className?: string;
  pageType?: string; // Тип страницы для использования предопределенного пресета
  config?: UnifiedPanelConfig; // Пользовательская конфигурация
  onClose?: () => void;
  customSections?: ReactNode;
  panelId?: string; // Добавлен уникальный идентификатор панели
}

/**
 * Унифицированная панель управления картой
 * Позволяет гибко настраивать отображаемые секции и элементы управления
 */
const UnifiedControlPanel: React.FC<UnifiedControlPanelProps> = ({
  className = '',
  pageType = 'map',
  config,
  onClose,
  customSections,
  panelId = 'default'
}) => {
  // Создаем ссылку на экземпляр панели для отслеживания дублирования
  const instanceRef = useRef<string>(panelId);
  const { mapConfig, toggleLayer, updateMapConfig, resetMapConfig } = useMapConfig();
  
  // Проверяем и регистрируем панель при монтировании
  useEffect(() => {
    // Если панель с таким ID уже отрисована, выводим предупреждение только один раз
    if (renderedPanels.has(panelId) && process.env.NODE_ENV === 'development') {
      // Удалено логирование предупреждения о дублировании
    } else {
      // Добавляем ID в реестр отрисованных панелей
      renderedPanels.add(panelId);
    }
    
    // Очищаем реестр при размонтировании компонента
    return () => {
      renderedPanels.delete(panelId);
    };
  }, [panelId]);
  
  // Используем либо пользовательскую конфигурацию, либо предопределенный пресет
  const panelConfig = config || UNIFIED_PANEL_PRESETS[pageType] || UNIFIED_PANEL_PRESETS.map;
  
  // Состояние для отслеживания развернутости панели
  const [isExpanded, setIsExpanded] = React.useState(true);
  
  // Обработчики событий
  const handleToggleExpand = () => setIsExpanded(prev => !prev);
  
  const handleToggleClustering = useCallback(() => {
    updateMapConfig({ enableClustering: !mapConfig.enableClustering });
  }, [mapConfig.enableClustering, updateMapConfig]);
  
  const handleToggleDrawing = useCallback(() => {
    updateMapConfig({ drawingEnabled: !mapConfig.drawingEnabled });
  }, [mapConfig.drawingEnabled, updateMapConfig]);
  
  const handleModeChange = useCallback((mode: string) => {
    updateMapConfig({ 
      interactionMode: mode,
      drawingEnabled: mode === MAP_MODES.DRAW
    });
  }, [updateMapConfig]);
  
  const handleResetConfig = useCallback(() => {
    resetMapConfig();
  }, [resetMapConfig]);
  
  // Проверяем, должна ли отображаться секция
  const isSectionVisible = (section: PanelSection) => {
    return panelConfig.visibleSections.includes(section);
  };
  
  // Не отображаем компонент, если это второй экземпляр панели
  // и первый уже зарегистрирован, и это не текущий экземпляр
  const isFirstInRegistry = renderedPanels.has(panelId) && 
    renderedPanels.size === 1 || instanceRef.current === Array.from(renderedPanels)[0];
  
  if (!isFirstInRegistry) {
    return null;
  }
  
  // Стили панели
  const panelStyles = `
    ${cardClasses.elevated}
    absolute top-4 right-4 z-[1000] 
    max-w-xs w-full
    overflow-hidden
    ${isExpanded ? 'opacity-100' : 'opacity-90 hover:opacity-100'}
    ${animationClasses.transition}
    ${className}
  `;
  
  // Рендеринг секции режима карты
  const renderModeSection = () => {
    if (!isSectionVisible(PanelSection.MODE)) return null;
    
    return (
      <div className="border-b pb-2">
        <h4 className="text-sm font-medium mb-2">Режим карты</h4>
        <div className="bg-white/50 p-2 rounded-lg flex flex-col space-y-1">
          <label className="flex items-center p-1 cursor-pointer hover:bg-white/30 rounded transition-colors">
            <input
              type="radio"
              name="mapMode"
              value={MAP_MODES.VIEW}
              checked={mapConfig.interactionMode === MAP_MODES.VIEW}
              onChange={() => handleModeChange(MAP_MODES.VIEW)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Просмотр</span>
          </label>
          
          <label className="flex items-center p-1 cursor-pointer hover:bg-white/30 rounded transition-colors">
            <input
              type="radio"
              name="mapMode"
              value={MAP_MODES.DRAW}
              checked={mapConfig.interactionMode === MAP_MODES.DRAW}
              onChange={() => handleModeChange(MAP_MODES.DRAW)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Создание областей</span>
          </label>
          
          <label className="flex items-center p-1 cursor-pointer hover:bg-white/30 rounded transition-colors">
            <input
              type="radio"
              name="mapMode"
              value={MAP_MODES.EDIT}
              checked={mapConfig.interactionMode === MAP_MODES.EDIT}
              onChange={() => handleModeChange(MAP_MODES.EDIT)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Редактирование областей</span>
          </label>
        </div>
      </div>
    );
  };
  
  // Рендеринг секции слоев карты
  const renderLayersSection = () => {
    if (!isSectionVisible(PanelSection.LAYERS)) return null;
    
    return (
      <div className="border-b pb-2">
        <h4 className="text-sm font-medium mb-2">Слои</h4>
        <div className="space-y-2">
          <Switch 
            label="Области"
            checked={mapConfig.visibleLayers.includes(MAP_LAYERS.REGIONS)}
            onChange={() => toggleLayer(MAP_LAYERS.REGIONS)}
          />
          <Switch 
            label="Растения"
            checked={mapConfig.visibleLayers.includes(MAP_LAYERS.PLANTS)}
            onChange={() => toggleLayer(MAP_LAYERS.PLANTS)}
          />
          <Switch 
            label="Изображение карты"
            checked={mapConfig.visibleLayers.includes(MAP_LAYERS.IMAGERY)}
            onChange={() => toggleLayer(MAP_LAYERS.IMAGERY)}
          />
        </div>
      </div>
    );
  };
  
  // Рендеринг секции настроек
  const renderSettingsSection = () => {
    if (!isSectionVisible(PanelSection.SETTINGS)) return null;
    
    return (
      <div className="border-b pb-2">
        <h4 className="text-sm font-medium mb-2">Настройки</h4>
        <div className="space-y-2">
          <Switch 
            label="Кластеризация маркеров"
            checked={mapConfig.enableClustering}
            onChange={handleToggleClustering}
          />
          <Switch 
            label="Создание областей"
            checked={mapConfig.drawingEnabled}
            onChange={handleToggleDrawing}
          />
        </div>
      </div>
    );
  };
  
  // Рендеринг секции кнопок
  const renderButtonsSection = () => {
    if (!isSectionVisible(PanelSection.BUTTONS)) return null;
    
    return (
      <button 
        className={`w-full px-3 py-1.5 ${buttonClasses.success} text-sm`}
        onClick={handleResetConfig}
      >
        Сбросить настройки
      </button>
    );
  };
  
  return (
    <div className={panelStyles} data-panel-id={panelId}>
      <div className={`flex items-center justify-between px-4 py-3 ${cardClasses.footer}`}>
        <button 
          onClick={handleToggleExpand}
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
        <h3 className="text-base font-medium flex-1 text-center">Управление картой</h3>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Закрыть панель"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      {isExpanded && (
        <div className="p-3">
          <div className="space-y-3">
            {renderModeSection()}
            {renderLayersSection()}
            {renderSettingsSection()}
            {customSections}
            {renderButtonsSection()}
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedControlPanel; 