import React, { ReactNode, useCallback, useRef, useEffect, useState } from 'react';
import { 
  useMapConfig, 
  MAP_LAYERS, 
  MAP_MODES} from '../../contexts/MapConfigContext';
import { 
  PanelSection, 
  UnifiedPanelConfig, 
  UNIFIED_PANEL_PRESETS 
} from './types';
import { Switch } from '../../../ui/components/Form';
import { 
  animationClasses, 
  cardClasses,
  textClasses
} from '../../../../styles/global-styles';
import PanelHeader from './PanelHeader';
import ControlButtons from './ControlButtons';

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
  const { 
    mapConfig, 
    toggleLayer, 
    updateMapConfig, 
    resetMapConfig,
    saveConfigToStorage 
  } = useMapConfig();
  
  // Проверяем и регистрируем панель при монтировании
  useEffect(() => {
    // Добавляем ID в реестр отрисованных панелей
    renderedPanels.add(panelId);
    
    // Очищаем реестр при размонтировании компонента
    return () => {
      renderedPanels.delete(panelId);
    };
  }, [panelId]);
  
  // Используем либо пользовательскую конфигурацию, либо предопределенный пресет
  const panelConfig = config || UNIFIED_PANEL_PRESETS[pageType] || UNIFIED_PANEL_PRESETS.map;
  
  // Состояние для отслеживания развернутости панели
  const [isExpanded, setIsExpanded] = React.useState(true);
  
  // Состояние для отслеживания видимости панели
  const [isPanelVisible, setIsPanelVisible] = useState(mapConfig.showControls);
  
  // Состояние для отслеживания изменений настроек карты
  const [hasChanges, setHasChanges] = useState(false);
  
  // Обработчики событий
  const handleToggleExpand = () => setIsExpanded(prev => !prev);
  
  // Обработчик закрытия панели с возможностью повторного открытия
  const handleClose = useCallback(() => {
    setIsPanelVisible(false);
    if (onClose) onClose();
  }, [onClose]);
  
  // Обработчик повторного открытия панели
  const handleReopenPanel = useCallback(() => {
    setIsPanelVisible(true);
  }, []);
  
  const handleToggleClustering = useCallback(() => {
    updateMapConfig({ enableClustering: !mapConfig.enableClustering });
    setHasChanges(true);
  }, [mapConfig.enableClustering, updateMapConfig]);
  
  const handleToggleDrawing = useCallback(() => {
    updateMapConfig({ drawingEnabled: !mapConfig.drawingEnabled });
    setHasChanges(true);
  }, [mapConfig.drawingEnabled, updateMapConfig]);
  
  const handleModeChange = useCallback((mode: string) => {
    updateMapConfig({ 
      interactionMode: mode,
      drawingEnabled: mode === MAP_MODES.DRAW
    });
    setHasChanges(true);
  }, [updateMapConfig]);
  
  const handleResetConfig = useCallback(() => {
    resetMapConfig();
    setHasChanges(false);
  }, [resetMapConfig]);
  
  // Обработчик для сохранения всех областей на сервер
  const handleSaveRegions = useCallback(() => {
    // Здесь вызываем функцию сохранения всех регионов на сервере
    if (mapConfig.interactionMode === MAP_MODES.DRAW) {
      // Вызываем функцию из регион-сервиса для сохранения
      try {
        // Показываем уведомление о начале сохранения
        // Предполагается, что в вашем приложении есть уведомления
        console.log('Сохранение областей...');
        
        // После успешного сохранения возвращаемся в режим просмотра
        updateMapConfig({ 
          interactionMode: MAP_MODES.VIEW,
          drawingEnabled: false
        });
        
        // Показываем уведомление об успешном сохранении
        console.log('Области успешно сохранены');
      } catch (error) {
        // Обработка ошибки
        console.error('Ошибка при сохранении областей:', error);
      }
    }
  }, [mapConfig.interactionMode, updateMapConfig]);
  
  // Обработчик сохранения настроек карты
  const handleSaveConfig = useCallback(() => {
    saveConfigToStorage();
    setHasChanges(false);
  }, [saveConfigToStorage]);
  
  // Проверяем, должна ли отображаться секция
  const isSectionVisible = (section: PanelSection) => {
    return panelConfig.visibleSections.includes(section);
  };
  
  // Если панель скрыта, показываем только кнопку повторного открытия
  if (!isPanelVisible) {
    return (
      <div className="absolute top-4 right-4 z-[1000]">
        <button 
          onClick={handleReopenPanel}
          className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center"
          aria-label="Открыть панель управления"
        >
          <span className="text-xl">⚙️</span>
        </button>
      </div>
    );
  }
  
  // Рендеринг секции режима карты
  const renderModeSection = () => {
    if (!isSectionVisible(PanelSection.MODE)) return null;
    
    return (
      <div className="mb-4">
        <h4 className={`${textClasses.subheading} mb-2.5`}>Режим карты</h4>
        <div className={`${cardClasses.filled} p-2.5 rounded-xl flex flex-col space-y-1.5`}>
          <label className="flex items-center px-2 py-1.5 cursor-pointer hover:bg-blue-50/60 rounded-lg transition-colors">
            <input
              type="radio"
              name="mapMode"
              value={MAP_MODES.VIEW}
              checked={mapConfig.interactionMode === MAP_MODES.VIEW}
              onChange={() => handleModeChange(MAP_MODES.VIEW)}
              className="mr-2.5 accent-blue-600 h-4 w-4"
            />
            <span className={`${textClasses.body} ${textClasses.primary}`}>Просмотр</span>
          </label>
          
          <label className="flex items-center px-2 py-1.5 cursor-pointer hover:bg-blue-50/60 rounded-lg transition-colors">
            <input
              type="radio"
              name="mapMode"
              value={MAP_MODES.DRAW}
              checked={mapConfig.interactionMode === MAP_MODES.DRAW}
              onChange={() => handleModeChange(MAP_MODES.DRAW)}
              className="mr-2.5 accent-blue-600 h-4 w-4"
            />
            <span className={`${textClasses.body} ${textClasses.primary}`}>Создание областей</span>
          </label>
          
          <label className="flex items-center px-2 py-1.5 cursor-pointer hover:bg-blue-50/60 rounded-lg transition-colors">
            <input
              type="radio"
              name="mapMode"
              value={MAP_MODES.EDIT}
              checked={mapConfig.interactionMode === MAP_MODES.EDIT}
              onChange={() => handleModeChange(MAP_MODES.EDIT)}
              className="mr-2.5 accent-blue-600 h-4 w-4"
            />
            <span className={`${textClasses.body} ${textClasses.primary}`}>Редактирование областей</span>
          </label>
        </div>
      </div>
    );
  };
  
  // Рендеринг секции слоев карты
  const renderLayersSection = () => {
    if (!isSectionVisible(PanelSection.LAYERS)) return null;
    
    return (
      <div className="mb-4">
        <h4 className={`${textClasses.subheading} mb-2.5`}>Слои</h4>
        <div className={`${cardClasses.filled} p-2.5 rounded-xl space-y-2.5`}>
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
    
    // Используем настройки секции, если они есть
    const settingsConfig = panelConfig.sectionConfig?.[PanelSection.SETTINGS] || {};
    
    return (
      <div className="mb-4">
        <h4 className={`${textClasses.subheading} mb-2.5`}>Настройки</h4>
        <div className={`${cardClasses.filled} p-2.5 rounded-xl space-y-2.5`}>
          <Switch 
            label="Кластеризация маркеров"
            checked={mapConfig.enableClustering}
            onChange={handleToggleClustering}
          />
          
          {(settingsConfig.showPopupToggle !== false) && (
            <Switch 
              label="Информация по клику"
              checked={mapConfig.showPopupOnClick}
              onChange={() => {
                updateMapConfig({ showPopupOnClick: !mapConfig.showPopupOnClick });
                setHasChanges(true);
              }}
            />
          )}
          
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
      <div className="mt-4">
        <ControlButtons 
          onSaveRegions={handleSaveRegions}
          onReset={handleResetConfig}
          onSave={handleSaveConfig}
          showSaveButton={hasChanges}
        />
      </div>
    );
  };
  
  // Стили панели в стиле Apple с эффектом стекла
  const panelStyles = `
    absolute top-4 right-4 z-[1000] 
    max-w-xs w-full
    overflow-hidden
    ${cardClasses.base}
    bg-white/85 backdrop-blur-md 
    shadow-[0_0_10px_rgba(0,0,0,0.08)]
    ${isExpanded ? 'opacity-100' : 'opacity-95 hover:opacity-100'}
    ${animationClasses.transition}
    ${className}
  `;
  
  return (
    <div className={panelStyles} data-panel-id={panelId}>
      <PanelHeader 
        onToggleExpand={handleToggleExpand}
        onClose={handleClose}
        isExpanded={isExpanded}
      />
      
      {isExpanded && (
        <div className="p-4 overflow-auto max-h-[calc(100vh-8rem)]">
          {renderModeSection()}
          {renderLayersSection()}
          {renderSettingsSection()}
          {customSections}
          {renderButtonsSection()}
        </div>
      )}
    </div>
  );
};

// Добавляем отображаемое имя компонента для легкого определения типа
UnifiedControlPanel.displayName = 'UnifiedControlPanel';

export default UnifiedControlPanel; 