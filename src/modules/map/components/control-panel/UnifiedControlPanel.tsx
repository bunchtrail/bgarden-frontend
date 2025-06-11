import React, { useCallback, useEffect, useState } from 'react';
import {
  useMapConfig,
  MAP_LAYERS,
  MAP_MODES,
  MAP_TYPES,
} from '../../contexts/MapConfigContext';
import {
  PanelSection,
  UNIFIED_PANEL_PRESETS,
  UnifiedControlPanelProps,
  getPositionClasses,
} from './types';
import { Switch } from '../../../ui/components/Form';
import {
  animationClasses,
  cardClasses,
  textClasses,
} from '../../../../styles/global-styles';
import PanelHeader from './PanelHeader';
import ControlButtons from './ControlButtons';

const renderedPanels = new Set<string>();

const UnifiedControlPanel: React.FC<UnifiedControlPanelProps> = ({
  pageType = 'map',
  config,
  customSections,
  mapTitle,
  panelId = 'default',
  position = 'topRight',
  className = '',
  style,
  zIndex = 1000,
  onClose,
  onConfigChange,
  collapsible = true,
  defaultExpanded = true,
}) => {
  const {
    mapConfig,
    toggleLayer,
    updateMapConfig,
    resetMapConfig,
    saveConfigToStorage,
    setMapType, // Получаем новую функцию из контекста
  } = useMapConfig();

  useEffect(() => {
    renderedPanels.add(panelId);
    return () => {
      renderedPanels.delete(panelId);
    };
  }, [panelId]);
  const panelConfig =
    config || UNIFIED_PANEL_PRESETS[pageType] || UNIFIED_PANEL_PRESETS.map;

  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const [isPanelVisible, setIsPanelVisible] = useState(mapConfig.showControls);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggleExpand = () => setIsExpanded((prev) => !prev);

  const handleClose = useCallback(() => {
    setIsPanelVisible(false);
    if (onClose) onClose();
  }, [onClose]);

  const handleReopenPanel = useCallback(() => {
    setIsPanelVisible(true);
  }, []);

  // Создаем динамические стили панели
  const panelStyles = React.useMemo(() => {
    const positionClasses = getPositionClasses(position);
    const baseStyles = `
      ${positionClasses}
      max-w-xs w-full
      overflow-hidden
      ${cardClasses.base}
      bg-white/85 backdrop-blur-md 
      shadow-[0_0_10px_rgba(0,0,0,0.08)]
      ${isExpanded ? 'opacity-100' : 'opacity-95 hover:opacity-100'}
      ${animationClasses.transition}
      ${className}
    `;

    return {
      className: baseStyles,
      style: {
        zIndex,
        ...style,
      },
    };
  }, [position, isExpanded, className, zIndex, style]);

  // Создаем стили для кнопки повторного открытия
  const reopenButtonStyles = React.useMemo(() => {
    const positionClasses = getPositionClasses(position);
    return `${positionClasses} z-[1000]`;
  }, [position]);
  const handleToggleClustering = useCallback(() => {
    updateMapConfig({ enableClustering: !mapConfig.enableClustering });
    setHasChanges(true);
    if (onConfigChange) {
      onConfigChange('enableClustering', !mapConfig.enableClustering);
    }
  }, [mapConfig.enableClustering, updateMapConfig, onConfigChange]);

  const handleToggleDrawing = useCallback(() => {
    updateMapConfig({ drawingEnabled: !mapConfig.drawingEnabled });
    setHasChanges(true);
    if (onConfigChange) {
      onConfigChange('drawingEnabled', !mapConfig.drawingEnabled);
    }
  }, [mapConfig.drawingEnabled, updateMapConfig, onConfigChange]);

  const handleModeChange = useCallback(
    (mode: string) => {
      updateMapConfig({
        interactionMode: mode,
        drawingEnabled: mode === MAP_MODES.DRAW,
      });
      setHasChanges(true);
      if (onConfigChange) {
        onConfigChange('interactionMode', mode);
      }
    },
    [updateMapConfig, onConfigChange]
  );

  const handleMapTypeChange = useCallback(
    (type: (typeof MAP_TYPES)[keyof typeof MAP_TYPES]) => {
      setMapType(type);
      setHasChanges(true);
      if (onConfigChange) {
        onConfigChange('mapType', type);
      }
    },
    [setMapType, onConfigChange]
  );

  const handleResetConfig = useCallback(() => {
    resetMapConfig();
    setHasChanges(false);
  }, [resetMapConfig]);

  const handleSaveRegions = useCallback(() => {
    if (mapConfig.interactionMode === MAP_MODES.DRAW) {
      try {
        console.log('Сохранение областей...');
        updateMapConfig({
          interactionMode: MAP_MODES.VIEW,
          drawingEnabled: false,
        });
        console.log('Области успешно сохранены');
      } catch (error) {
        console.error('Ошибка при сохранении областей:', error);
      }
    }
  }, [mapConfig.interactionMode, updateMapConfig]);

  const handleSaveConfig = useCallback(() => {
    saveConfigToStorage();
    setHasChanges(false);
  }, [saveConfigToStorage]);

  const isSectionVisible = (section: PanelSection) => {
    return panelConfig.visibleSections.includes(section);
  };

  // Рендеринг секции переключения вида карты
  const renderMapTypeSection = () => {
    const buttonBaseClasses =
      'flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2';
    const activeClasses = 'bg-white shadow-sm text-blue-700';
    const inactiveClasses = 'bg-transparent text-gray-600 hover:bg-white/60';

    return (
      <div className="mb-4">
        <h4 className={`${textClasses.subheading} mb-2.5`}>Вид карты</h4>
        <div className="flex p-1 space-x-1 bg-gray-200/80 rounded-xl">
          <button
            onClick={() => handleMapTypeChange(MAP_TYPES.SCHEMATIC)}
            className={`${buttonBaseClasses} ${
              mapConfig.mapType === MAP_TYPES.SCHEMATIC
                ? activeClasses
                : inactiveClasses
            }`}
          >
            Схема
          </button>
          <button
            onClick={() => handleMapTypeChange(MAP_TYPES.GEO)}
            className={`${buttonBaseClasses} ${
              mapConfig.mapType === MAP_TYPES.GEO
                ? activeClasses
                : inactiveClasses
            }`}
          >
            Карта
          </button>
        </div>
      </div>
    );
  };

  const renderModeSection = () => {
    if (!isSectionVisible(PanelSection.MODE)) return null;
    const isGeoMap = mapConfig.mapType === MAP_TYPES.GEO;

    return (
      <div className="mb-4">
        <h4 className={`${textClasses.subheading} mb-2.5`}>Режим карты</h4>
        <div
          className={`${cardClasses.filled} p-2.5 rounded-xl flex flex-col space-y-1.5`}
        >
          <label className="flex items-center px-2 py-1.5 cursor-pointer hover:bg-blue-50/60 rounded-lg transition-colors">
            <input
              type="radio"
              name="mapMode"
              value={MAP_MODES.VIEW}
              checked={mapConfig.interactionMode === MAP_MODES.VIEW}
              onChange={() => handleModeChange(MAP_MODES.VIEW)}
              className="mr-2.5 accent-blue-600 h-4 w-4"
            />
            <span className={`${textClasses.body} ${textClasses.primary}`}>
              Просмотр
            </span>
          </label>

          <label
            className={`flex items-center px-2 py-1.5 rounded-lg transition-colors ${
              isGeoMap
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer hover:bg-blue-50/60'
            }`}
          >
            <input
              type="radio"
              name="mapMode"
              value={MAP_MODES.DRAW}
              checked={
                !isGeoMap && mapConfig.interactionMode === MAP_MODES.DRAW
              }
              onChange={() => handleModeChange(MAP_MODES.DRAW)}
              className="mr-2.5 accent-blue-600 h-4 w-4"
              disabled={isGeoMap}
            />
            <span className={`${textClasses.body} ${textClasses.primary}`}>
              Создание областей
            </span>
          </label>

          <label
            className={`flex items-center px-2 py-1.5 rounded-lg transition-colors ${
              isGeoMap
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer hover:bg-blue-50/60'
            }`}
          >
            <input
              type="radio"
              name="mapMode"
              value={MAP_MODES.EDIT}
              checked={
                !isGeoMap && mapConfig.interactionMode === MAP_MODES.EDIT
              }
              onChange={() => handleModeChange(MAP_MODES.EDIT)}
              className="mr-2.5 accent-blue-600 h-4 w-4"
              disabled={isGeoMap}
            />
            <span className={`${textClasses.body} ${textClasses.primary}`}>
              Редактирование областей
            </span>
          </label>
        </div>
      </div>
    );
  };

  const renderLayersSection = () => {
    if (!isSectionVisible(PanelSection.LAYERS)) return null;
    const isGeoMap = mapConfig.mapType === MAP_TYPES.GEO;

    return (
      <div className="mb-4">
        <h4 className={`${textClasses.subheading} mb-2.5`}>Слои</h4>
        <div className={`${cardClasses.filled} p-2.5 rounded-xl space-y-2.5`}>
          {isGeoMap ? (
            <Switch
              label="Гео-подложка"
              checked={mapConfig.visibleLayers.includes(MAP_LAYERS.GEO_TILES)}
              onChange={() => toggleLayer(MAP_LAYERS.GEO_TILES)}
            />
          ) : (
            <>
              <Switch
                label="Области"
                checked={mapConfig.visibleLayers.includes(MAP_LAYERS.REGIONS)}
                onChange={() => toggleLayer(MAP_LAYERS.REGIONS)}
              />
              <Switch
                label="Изображение карты"
                checked={mapConfig.visibleLayers.includes(MAP_LAYERS.IMAGERY)}
                onChange={() => toggleLayer(MAP_LAYERS.IMAGERY)}
              />
            </>
          )}
          <Switch
            label="Растения"
            checked={mapConfig.visibleLayers.includes(MAP_LAYERS.PLANTS)}
            onChange={() => toggleLayer(MAP_LAYERS.PLANTS)}
          />
        </div>
      </div>
    );
  };

  const renderSettingsSection = () => {
    if (!isSectionVisible(PanelSection.SETTINGS)) return null;
    const settingsConfig =
      panelConfig.sectionConfig?.[PanelSection.SETTINGS] || {};
    const isGeoMap = mapConfig.mapType === MAP_TYPES.GEO;

    return (
      <div className="mb-4">
        <h4 className={`${textClasses.subheading} mb-2.5`}>Настройки</h4>
        <div className={`${cardClasses.filled} p-2.5 rounded-xl space-y-2.5`}>
          <Switch
            label="Кластеризация маркеров"
            checked={mapConfig.enableClustering}
            onChange={handleToggleClustering}
          />

          {settingsConfig.showPopupToggle !== false && (
            <Switch
              label="Информация по клику"
              checked={mapConfig.showPopupOnClick}
              onChange={() => {
                updateMapConfig({
                  showPopupOnClick: !mapConfig.showPopupOnClick,
                });
                setHasChanges(true);
              }}
            />
          )}

          <Switch
            label="Создание областей"
            checked={!isGeoMap && mapConfig.drawingEnabled}
            onChange={handleToggleDrawing}
            disabled={isGeoMap}
          />
        </div>
      </div>
    );
  };

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

  // Создаем красивый заголовок с названием карты
  const renderCustomHeader = () => {
    if (!mapTitle) {
      return null;
    }

    return (
      <div className="flex flex-col items-center gap-1">
        {/* Название карты */}
        <div className="flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="text-emerald-600 flex-shrink-0"
          >
            <path
              d="M20.5 3L20.34 3.03L15 5.1L9 3L3.36 4.9C3.15 4.97 3 5.15 3 5.38V20.5C3 20.78 3.22 21 3.5 21L3.66 20.97L9 18.9L15 21L20.64 19.1C20.85 19.03 21 18.85 21 18.62V3.5C21 3.22 20.78 3 20.5 3ZM15 19L9 17.1V5L15 6.9V19Z"
              fill="currentColor"
            />
          </svg>
          <h3 className="text-sm font-semibold text-gray-800 bg-gradient-to-r from-emerald-700 via-blue-600 to-emerald-700 bg-clip-text text-transparent leading-tight">
            {mapTitle}
          </h3>
        </div>

        {/* Подзаголовок */}
        <div className="text-xs text-gray-500 font-medium">
          Управление картой
        </div>
      </div>
    );
  };
  if (!isPanelVisible) {
    return (
      <div className={reopenButtonStyles}>
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

  return (
    <div
      className={panelStyles.className}
      style={panelStyles.style}
      data-panel-id={panelId}
    >
      <PanelHeader
        customHeader={renderCustomHeader()}
        onToggleExpand={collapsible ? handleToggleExpand : undefined}
        onClose={handleClose}
        isExpanded={isExpanded}
      />
      {isExpanded && (
        <div className="p-4 overflow-auto max-h-[calc(100vh-8rem)]">
          {renderCustomHeader()}
          {renderMapTypeSection()}
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

UnifiedControlPanel.displayName = 'UnifiedControlPanel';

export default UnifiedControlPanel;
