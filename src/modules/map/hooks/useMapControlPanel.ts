import { useState, useEffect, useCallback, useMemo } from 'react';
import { useMapConfig } from '../contexts/MapConfigContext';
import { PanelConfigPreset, PanelMode, PANEL_PRESETS } from '../components/control-panel/types';

interface UseMapControlPanelProps {
  panelMode?: PanelMode;
  customConfig?: Partial<PanelConfigPreset>;
  onConfigChange?: (key: string, value: boolean | string | number) => void;
  configPreset?: PanelConfigPreset;
  controlPanelPosition?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
}

interface UseMapControlPanelReturn {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  toggleExpand: () => void;
  hasChanges: boolean;
  setHasChanges: (value: boolean) => void;
  panelConfig: PanelConfigPreset;
  handleConfigChange: (key: string, value: boolean | string | number) => void;
  handleResetConfig: () => void;
  handleSaveConfig: () => void;
  isLayerVisible: (layerId: string) => boolean;
  handleToggleLayer: (layerId: string) => void;
  // Для совместимости
  showControlPanel: boolean;
  toggleControlPanel: () => void;
  controlPanelStyles: Record<string, string>;
}

/**
 * Хук для управления логикой панели управления картой
 */
export const useMapControlPanel = ({
  panelMode = 'full',
  customConfig = {},
  onConfigChange,
  configPreset,
  controlPanelPosition = 'topRight'
}: UseMapControlPanelProps): UseMapControlPanelReturn => {
  const { 
    mapConfig, 
    updateMapConfig, 
    resetMapConfig, 
    saveConfigToStorage,
    toggleLayer
  } = useMapConfig();
  
  // Состояние для анимации и отслеживания изменений
  const [isExpanded, setIsExpanded] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Для совместимости с существующим кодом
  const [showControlPanel, setShowControlPanel] = useState<boolean>(true);
  
  const toggleControlPanel = useCallback(() => {
    setShowControlPanel(prev => !prev);
  }, []);

  // Расчет стилей панели для совместимости
  const controlPanelStyles = useMemo(() => {
    const baseStyles = 'absolute z-[999]';
    const containerStyle = (() => {
      switch(controlPanelPosition) {
        case 'topLeft': return `${baseStyles} top-4 left-4`;
        case 'bottomLeft': return `${baseStyles} bottom-4 left-4`;
        case 'bottomRight': return `${baseStyles} bottom-4 right-4`;
        case 'topRight': 
        default: return `${baseStyles} top-4 right-4`;
      }
    })();
    
    return {
      container: containerStyle,
      panel: 'bg-white rounded-lg shadow-lg p-4 mt-2'
    };
  }, [controlPanelPosition]);

  // Эффект для обнаружения изменений в конфигурации
  useEffect(() => {
    setHasChanges(true);
  }, [mapConfig]);

  // Получаем конфигурацию панели управления в зависимости от режима
  const getPanelConfig = useCallback((): PanelConfigPreset => {
    // Если передан пресет, используем его
    if (configPreset) {
      return configPreset;
    }

    // Для режима custom используем пользовательские настройки
    if (panelMode === 'custom') {
      return {
        showLayerSelector: customConfig.showLayerSelector ?? false,
        showModeToggle: customConfig.showModeToggle ?? false,
        showTooltipToggle: customConfig.showTooltipToggle ?? false,
        showLabelToggle: customConfig.showLabelToggle ?? false,
        showClusteringToggle: customConfig.showClusteringToggle ?? false,
        showMarkerToggle: customConfig.showMarkerToggle ?? false,
        showDrawingControls: customConfig.showDrawingControls ?? false,
        showDrawingToggle: customConfig.showDrawingToggle ?? false,
        sections: customConfig.sections
      };
    }

    // В остальных случаях используем предопределенный пресет
    const preset = PANEL_PRESETS[panelMode];
    
    // Добавляем пользовательские секции, если они есть
    return {
      ...preset,
      sections: customConfig.sections || preset.sections
    };
  }, [panelMode, customConfig, configPreset]);

  const panelConfig = getPanelConfig();

  // Обработчик изменения конфигурации с поддержкой внешнего обработчика
  const handleConfigChange = useCallback((key: string, value: boolean | string | number) => {
    updateMapConfig({ [key]: value });
    
    if (onConfigChange) {
      onConfigChange(key, value);
    }
    
    setHasChanges(true);
  }, [updateMapConfig, onConfigChange]);

  // Проверяем, видим ли указанный слой
  const isLayerVisible = useCallback((layerId: string) => 
    mapConfig.visibleLayers.includes(layerId), [mapConfig.visibleLayers]);

  // Безопасное переключение слоя с проверкой
  const handleToggleLayer = useCallback((layerId: string) => {
    // Если слой уже выключен - его можно включить без проверок
    if (!isLayerVisible(layerId)) {
      toggleLayer(layerId);
      return;
    }
    
    // Если слой включен, проверяем, можно ли его выключить
    if (mapConfig.visibleLayers.length > 1) {
      toggleLayer(layerId);
    }
  }, [isLayerVisible, toggleLayer, mapConfig.visibleLayers]);

  // Обработчик сброса настроек
  const handleResetConfig = useCallback(() => {
    resetMapConfig();
    setHasChanges(false);
  }, [resetMapConfig]);

  // Обработчик сохранения настроек
  const handleSaveConfig = useCallback(() => {
    saveConfigToStorage();
    setHasChanges(false);
  }, [saveConfigToStorage]);

  // Переключение состояния развернутости панели
  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return {
    isExpanded,
    setIsExpanded,
    toggleExpand,
    hasChanges,
    setHasChanges,
    panelConfig,
    handleConfigChange,
    handleResetConfig,
    handleSaveConfig,
    isLayerVisible,
    handleToggleLayer,
    // Для совместимости
    showControlPanel,
    toggleControlPanel,
    controlPanelStyles
  };
};

export default useMapControlPanel; 