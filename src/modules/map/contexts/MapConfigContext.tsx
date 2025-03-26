import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { LatLngExpression, LatLngBoundsExpression, ControlPosition } from 'leaflet';

// Доступные слои карты
export const MAP_LAYERS = {
  IMAGERY: 'imagery',
  REGIONS: 'regions',
  PLANTS: 'plants',
} as const;

// Режимы взаимодействия с картой
export const MAP_MODES = {
  VIEW: 'view',
  DRAW: 'draw',
  EDIT: 'edit'
} as const;

// Имя ключа для хранения конфигурации в localStorage
const STORAGE_KEY = 'bgarden_map_config';

// Интерфейс конфигурации карты
export interface MapConfig {
  center: LatLngExpression;
  zoom: number;
  maxZoom: number;
  minZoom: number;
  maxBounds: LatLngBoundsExpression;
  maxBoundsViscosity: number;
  zoomControlPosition: ControlPosition;
  // Дополнительные настройки для облегченной версии
  lightMode: boolean;
  visibleLayers: string[];
  showTooltips: boolean;
  zoomLevel: number;
  availableLayers: string[];
  showControls: boolean;
  debug: boolean;
  enableClustering: boolean; // Включить/выключить кластеризацию маркеров
  // Настройки режима взаимодействия с картой
  interactionMode: string; // Режим взаимодействия с картой (просмотр, рисование, редактирование)
  drawingEnabled: boolean; // Включен ли режим рисования областей
  // Режим редактирования
  editMode: boolean;
  // Флаг завершения рисования полигона
  hasCompletedDrawing: boolean;
}

// Настройки по умолчанию для стандартной карты
export const DEFAULT_MAP_CONFIG: MapConfig = {
  center: [500, 500] as LatLngExpression,
  zoom: 0,
  maxZoom: 4,
  minZoom: -2,
  maxBounds: [[-1000, -1000], [2000, 2000]] as LatLngBoundsExpression,
  maxBoundsViscosity: 1.0,
  zoomControlPosition: 'bottomright' as ControlPosition,
  // Дополнительные настройки
  lightMode: false,
  visibleLayers: [MAP_LAYERS.IMAGERY, MAP_LAYERS.REGIONS, MAP_LAYERS.PLANTS],
  showTooltips: true,
  zoomLevel: 1,
  availableLayers: [MAP_LAYERS.IMAGERY, MAP_LAYERS.REGIONS, MAP_LAYERS.PLANTS],
  showControls: false,
  debug: false,
  enableClustering: true,
  // Настройки режима взаимодействия с картой
  interactionMode: MAP_MODES.VIEW,
  drawingEnabled: false,
  editMode: false,
  hasCompletedDrawing: false
};

interface MapConfigContextProps {
  mapConfig: MapConfig;
  setMapConfig: React.Dispatch<React.SetStateAction<MapConfig>>;
  updateMapConfig: (config: Partial<MapConfig>) => void;
  resetMapConfig: () => void;
  toggleLayer: (layerName: string) => void;
  saveConfigToStorage: () => void;
  loadConfigFromStorage: () => void;
}

const MapConfigContext = createContext<MapConfigContextProps | undefined>(undefined);

export const useMapConfig = (): MapConfigContextProps => {
  const context = useContext(MapConfigContext);
  if (!context) {
    throw new Error('useMapConfig must be used within a MapConfigProvider');
  }
  return context;
};

interface MapConfigProviderProps {
  children: ReactNode;
  initialConfig?: Partial<MapConfig>;
}

export const MapConfigProvider: React.FC<MapConfigProviderProps> = ({ children, initialConfig }) => {
  // Состояние для хранения конфигурации
  const [mapConfig, setMapConfig] = useState<MapConfig>({
    ...DEFAULT_MAP_CONFIG,
    ...initialConfig
  });

  // Эффект для восстановления конфигурации из localStorage при монтировании компонента
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY);
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setMapConfig(prevConfig => ({
          ...prevConfig,
          ...parsedConfig,
          ...initialConfig // Приоритет имеют props из initialConfig
        }));
      }
    } catch (error) {
      console.error('Ошибка при загрузке конфигурации карты:', error);
    }
  }, [initialConfig]);
  
  // Логирование включения режима рисования
  useEffect(() => {
    if (mapConfig.drawingEnabled) {
      console.log('[MapConfig] Режим рисования включен', {
        timestamp: new Date().toISOString(),
        interactionMode: mapConfig.interactionMode,
        drawingEnabled: mapConfig.drawingEnabled
      });
    }
  }, [mapConfig.drawingEnabled]);

  // Функция для обновления конфигурации
  const updateMapConfig = useCallback((updates: Partial<MapConfig>) => {
    setMapConfig(prevConfig => ({
      ...prevConfig,
      ...updates
    }));
  }, []);

  const saveConfigToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mapConfig));
    } catch (error) {
      console.error('Ошибка при сохранении конфигурации карты:', error);
    }
  };

  const loadConfigFromStorage = () => {
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY);
      if (savedConfig) {
        setMapConfig(JSON.parse(savedConfig));
      }
    } catch (error) {
      console.error('Ошибка при загрузке конфигурации карты:', error);
    }
  };

  const resetMapConfig = () => {
    setMapConfig(DEFAULT_MAP_CONFIG);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Ошибка при удалении сохраненной конфигурации карты:', error);
    }
  };

  const toggleLayer = (layerName: string) => {
    setMapConfig(prevConfig => {
      // Проверяем, включен ли слой в текущей конфигурации
      const isLayerActive = prevConfig.visibleLayers.includes(layerName);
      
      // Новый массив слоев
      const newLayers = isLayerActive
        ? prevConfig.visibleLayers.filter(layer => layer !== layerName) // Убираем слой
        : [...prevConfig.visibleLayers, layerName]; // Добавляем слой
      
      return {
        ...prevConfig,
        visibleLayers: newLayers
      };
    });
  };

  const value = {
    mapConfig,
    setMapConfig,
    updateMapConfig,
    resetMapConfig,
    toggleLayer,
    saveConfigToStorage,
    loadConfigFromStorage
  };

  return (
    <MapConfigContext.Provider
      value={{
        mapConfig,
        setMapConfig,
        updateMapConfig,
        resetMapConfig,
        toggleLayer,
        saveConfigToStorage,
        loadConfigFromStorage
      }}
    >
      {children}
    </MapConfigContext.Provider>
  );
};

export default MapConfigProvider; 