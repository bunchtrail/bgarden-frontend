import React, { useCallback, useState } from 'react';
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
import { useAuth } from '../../../auth/hooks';

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

  // Получаем конфигурацию панели - config является основным источником
  // DEPRECATED: pageType будет удален в будущих версиях - используйте config
  const panelConfig =
    config || UNIFIED_PANEL_PRESETS[pageType] || UNIFIED_PANEL_PRESETS.map;

  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const [isPanelVisible, setIsPanelVisible] = useState(mapConfig.showControls);
  const [hasChanges, setHasChanges] = useState(false);

  // Получаем статус аутентификации
  const { isAuthenticated } = useAuth();

  const handleToggleExpand = () => setIsExpanded((prev) => !prev);

  const handleClose = useCallback(() => {
    setIsPanelVisible(false);
    if (onClose) onClose();
  }, [onClose]);

  const handleReopenPanel = useCallback(() => {
    setIsPanelVisible(true);
  }, []);

  // Создаем динамические стили панели с улучшенным дизайном
  const panelStyles = React.useMemo(() => {
    const positionClasses = getPositionClasses(position);
    const baseStyles = `
      ${positionClasses}
      max-w-xs w-full
      overflow-hidden
      ${cardClasses.base}
      bg-white/90 backdrop-blur-xl border border-white/20
      shadow-[0_8px_32px_rgba(0,0,0,0.12)] 
      ${isExpanded ? 'opacity-100 scale-100' : 'opacity-95 scale-[0.98] hover:opacity-100 hover:scale-100'}
      ${animationClasses.transition}
      transform-gpu
      ${className}
    `;

    return {
      className: baseStyles,
      style: {
        zIndex,
        backdropFilter: 'blur(16px) saturate(180%)',
        ...style,
      },
    };
  }, [position, isExpanded, className, zIndex, style]);

  // Создаем стили для кнопки повторного открытия с улучшенным дизайном
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
    const newEnabled = !mapConfig.drawingEnabled;

    updateMapConfig({
      drawingEnabled: newEnabled,
      interactionMode: newEnabled ? MAP_MODES.DRAW : MAP_MODES.VIEW,
    });
    setHasChanges(true);
    if (onConfigChange) {
      onConfigChange('drawingEnabled', newEnabled);
    }
  }, [mapConfig.drawingEnabled, updateMapConfig, onConfigChange]);
  const handleModeChange = useCallback(
    (mode: string) => {
      updateMapConfig({
        interactionMode: mode,
        drawingEnabled: mode !== MAP_MODES.VIEW, // TRUE для DRAW и EDIT
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

  const handleSaveConfig = useCallback(() => {
    saveConfigToStorage();
    setHasChanges(false);
  }, [saveConfigToStorage]);

  const handleToggleLayer = (layerId: string) => {
    // Если слой выключен - его можно включить без проверок
    if (!mapConfig.visibleLayers.includes(layerId)) {
      toggleLayer(layerId);
      return;
    }

    // Проверяем, можно ли отключить слой (должен остаться хотя бы один видимый слой)
    if (mapConfig.visibleLayers.length > 1) {
      toggleLayer(layerId);
    }
  };

  const isSectionVisible = (section: PanelSection) => {
    return panelConfig.visibleSections.includes(section);
  };

  // Рендеринг секции переключения вида карты с улучшенным дизайном
  const renderMapTypeSection = () => {
    // Для неавторизованных пользователей скрываем выбор типа карты
    if (!isAuthenticated) return null;
    const buttonBaseClasses =
      'flex-1 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98]';
    const activeClasses = 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25';
    const inactiveClasses = 'bg-white/60 text-gray-700 hover:bg-white/80 border border-gray-200/50';

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <h4 className={`${textClasses.subheading} text-gray-800`}>Тип карты</h4>
        </div>
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-gray-100/50 rounded-2xl backdrop-blur-sm">
          <button
            onClick={() => handleMapTypeChange(MAP_TYPES.DGIS)}
            className={`${buttonBaseClasses} ${
              mapConfig.mapType === MAP_TYPES.DGIS
                ? activeClasses
                : inactiveClasses
            }`}
            title="Карты 2ГИС с детальной информацией"
          >
            2ГИС
          </button>
          <button
            onClick={() => handleMapTypeChange(MAP_TYPES.GEO)}
            className={`${buttonBaseClasses} ${
              mapConfig.mapType === MAP_TYPES.GEO
                ? activeClasses
                : inactiveClasses
            }`}
            title="OpenStreetMap - общая географическая карта"
          >
            OSM
          </button>
          <button
            onClick={() => handleMapTypeChange(MAP_TYPES.SCHEMATIC)}
            className={`${buttonBaseClasses} ${
              mapConfig.mapType === MAP_TYPES.SCHEMATIC
                ? activeClasses
                : inactiveClasses
            }`}
            title="Схематический план ботанического сада"
          >
            Схема
          </button>
        </div>
      </div>
    );
  };
  const renderModeSection = () => {
    // Для неавторизованных пользователей скрываем выбор режима карты
    if (!isAuthenticated) return null;
    if (!isSectionVisible(PanelSection.MODE)) return null;
    const modeConfig = panelConfig.sectionConfig?.[PanelSection.MODE] || {};

    // Определяем доступные режимы на основе конфигурации и типа карты
    const availableModes = [
      {
        id: MAP_MODES.VIEW,
        label: 'Просмотр',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        ),
        alwaysAvailable: true, // Режим просмотра всегда доступен
      },
      {
        id: MAP_MODES.DRAW,
        label: 'Создание областей',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        ),
        showInConfig: modeConfig.showDrawMode,
      },
      {
        id: MAP_MODES.EDIT,
        label: 'Редактирование объектов',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ),
        showInConfig: modeConfig.showEditMode,
      },
      {
        id: MAP_MODES.DELETE,
        label: 'Удаление объектов',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        ),
        showInConfig: modeConfig.showDeleteMode,
      },
    ].filter((mode) => {
      // Проверяем, разрешен ли режим в конфигурации
      if (!mode.alwaysAvailable && mode.showInConfig === false) {
        return false;
      }
      return true;
    });

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
          <h4 className={`${textClasses.subheading} text-gray-800`}>Режим карты</h4>
        </div>
        <div className="space-y-2">
          {availableModes.map((mode) => {
            const isChecked = mapConfig.interactionMode === mode.id;

            return (
              <label
                key={mode.id}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                  isChecked 
                    ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/50' 
                    : 'hover:bg-gray-50/50 border border-transparent'
                }`}
              >
                <input
                  type="radio"
                  name="mapMode"
                  value={mode.id}
                  checked={isChecked}
                  onChange={() => handleModeChange(mode.id)}
                  className="w-4 h-4 text-purple-600 bg-white border-gray-300 focus:ring-purple-500 focus:ring-2"
                />
                <div className={`${isChecked ? 'text-purple-700' : 'text-gray-600'} transition-colors`}>
                  {mode.icon}
                </div>
                <span className={`${textClasses.body} ${isChecked ? 'text-purple-800 font-medium' : 'text-gray-700'} transition-colors`}>
                  {mode.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  const renderLayersSection = () => {
    if (!isSectionVisible(PanelSection.LAYERS)) return null;
    const isGeoMap = mapConfig.mapType === MAP_TYPES.GEO;
    const isDgisMap = mapConfig.mapType === MAP_TYPES.DGIS;
    const isSchematicMap = mapConfig.mapType === MAP_TYPES.SCHEMATIC;

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h4 className={`${textClasses.subheading} text-gray-800`}>Слои карты</h4>
        </div>
        <div className="bg-gray-50/50 p-3 rounded-2xl space-y-3 backdrop-blur-sm border border-gray-200/30">
          {/* Базовые слои в зависимости от типа карты */}
          {(isGeoMap || isDgisMap) ? (
            <div className="flex items-center justify-between p-2 bg-white/70 rounded-xl border border-gray-200/50">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span className="text-sm font-medium text-gray-700">{isDgisMap ? "Карта 2ГИС" : "Гео-подложка"}</span>
              </div>
              <Switch
                checked={mapConfig.visibleLayers.includes(MAP_LAYERS.GEO_TILES)}
                onChange={() => handleToggleLayer(MAP_LAYERS.GEO_TILES)}
              />
            </div>
          ) : isSchematicMap ? (
            <>
              <div className="flex items-center justify-between p-2 bg-white/70 rounded-xl border border-gray-200/50">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Области</span>
                </div>
                <Switch
                  checked={mapConfig.visibleLayers.includes(MAP_LAYERS.REGIONS)}
                  onChange={() => handleToggleLayer(MAP_LAYERS.REGIONS)}
                />
              </div>
              <div className="flex items-center justify-between p-2 bg-white/70 rounded-xl border border-gray-200/50">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Изображение карты</span>
                </div>
                <Switch
                  checked={mapConfig.visibleLayers.includes(MAP_LAYERS.IMAGERY)}
                  onChange={() => handleToggleLayer(MAP_LAYERS.IMAGERY)}
                />
              </div>
            </>
          ) : null}
          
          {/* Общие слои для всех типов карт */}
          {(isGeoMap || isDgisMap) && (
            <div className="flex items-center justify-between p-2 bg-white/70 rounded-xl border border-gray-200/50">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Области</span>
              </div>
              <Switch
                checked={mapConfig.visibleLayers.includes(MAP_LAYERS.REGIONS)}
                onChange={() => handleToggleLayer(MAP_LAYERS.REGIONS)}
              />
            </div>
          )}
          
          <div className="flex items-center justify-between p-2 bg-white/70 rounded-xl border border-gray-200/50">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Растения</span>
            </div>
            <Switch
              checked={mapConfig.visibleLayers.includes(MAP_LAYERS.PLANTS)}
              onChange={() => handleToggleLayer(MAP_LAYERS.PLANTS)}
            />
          </div>
        </div>
      </div>
    );
  };
  const renderSettingsSection = () => {
    if (!isSectionVisible(PanelSection.SETTINGS)) return null;
    const settingsConfig =
      panelConfig.sectionConfig?.[PanelSection.SETTINGS] || {};
    const isGeoMap = mapConfig.mapType === MAP_TYPES.GEO;
    const isDgisMap = mapConfig.mapType === MAP_TYPES.DGIS;
    const isSchematicMap = mapConfig.mapType === MAP_TYPES.SCHEMATIC;

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h4 className={`${textClasses.subheading} text-gray-800`}>Настройки</h4>
        </div>
        <div className="bg-amber-50/30 p-3 rounded-2xl space-y-3 backdrop-blur-sm border border-amber-200/30">
          {settingsConfig.showClusteringToggle !== false && (
            <div className="flex items-center justify-between p-2 bg-white/70 rounded-xl border border-amber-200/30">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Кластеризация маркеров</span>
              </div>
              <Switch
                checked={mapConfig.enableClustering}
                onChange={handleToggleClustering}
              />
            </div>
          )}

          {settingsConfig.showPopupToggle !== false && (
            <div className="flex items-center justify-between p-2 bg-white/70 rounded-xl border border-amber-200/30">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Информация по клику</span>
              </div>
              <Switch
                checked={mapConfig.showPopupOnClick}
                onChange={() => {
                  updateMapConfig({
                    showPopupOnClick: !mapConfig.showPopupOnClick,
                  });
                  setHasChanges(true);
                }}
              />
            </div>
          )}

          {settingsConfig.showDrawingToggle !== false && isSchematicMap && (
            <div className="flex items-center justify-between p-2 bg-white/70 rounded-xl border border-amber-200/30">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Редактирование областей</span>
              </div>
              <Switch
                checked={mapConfig.drawingEnabled}
                onChange={handleToggleDrawing}
                disabled={!isSchematicMap}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderButtonsSection = () => {
    if (!isSectionVisible(PanelSection.BUTTONS)) return null;

    return (
      <div className="mt-4">
        <ControlButtons
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
      <button
        onClick={handleReopenPanel}
        className={`${reopenButtonStyles} p-3 rounded-xl bg-white/90 backdrop-blur-xl border border-white/20 shadow-lg hover:bg-white/95 hover:scale-105 transition-all duration-300 transform-gpu group`}
        title="Открыть панель управления"
        aria-label="Открыть панель управления"
      >
        <svg 
          className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
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
