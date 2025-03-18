import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LatLngExpression, LatLngBoundsExpression, ControlPosition } from 'leaflet';

// Доступные слои карты
export const MAP_LAYERS = {
  IMAGERY: 'imagery',
  REGIONS: 'regions',
  PLANTS: 'plants',
  LABELS: 'labels'
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
  showLabels: boolean;
  showMarkers: boolean; // Показывать/скрывать маркеры на карте
  zoomLevel: number;
  availableLayers: string[];
  showControls: boolean;
  debug: boolean;
  enableClustering: boolean; // Включить/выключить кластеризацию маркеров
  // Настройки режима взаимодействия с картой
  interactionMode: string; // Режим взаимодействия с картой (просмотр, рисование, редактирование)
  drawingEnabled: boolean; // Включен ли режим рисования областей
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
  lightMode: true,
  visibleLayers: [MAP_LAYERS.IMAGERY, MAP_LAYERS.REGIONS, MAP_LAYERS.PLANTS],
  showTooltips: false,
  showLabels: false,
  showMarkers: true,
  zoomLevel: 1,
  availableLayers: [MAP_LAYERS.IMAGERY, MAP_LAYERS.REGIONS, MAP_LAYERS.PLANTS, MAP_LAYERS.LABELS],
  showControls: true,
  debug: false,
  enableClustering: true,
  // Настройки режима взаимодействия с картой
  interactionMode: MAP_MODES.VIEW,
  drawingEnabled: false,
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

export const MapConfigProvider: React.FC<MapConfigProviderProps> = ({ 
  children, 
  initialConfig 
}) => {
  const [mapConfig, setMapConfig] = useState<MapConfig>({
    ...DEFAULT_MAP_CONFIG,
    ...initialConfig
  });
  
  // Состояние для отслеживания изменений
  const [hasChanges, setHasChanges] = useState(false);
  
  // Синхронизация между параметром showLabels и слоем labels
  useEffect(() => {
    // Если включены метки, добавляем слой labels если его нет
    if (mapConfig.showLabels && !mapConfig.visibleLayers.includes(MAP_LAYERS.LABELS)) {
      updateMapConfig({
        visibleLayers: [...mapConfig.visibleLayers, MAP_LAYERS.LABELS]
      });
    } 
    // Если выключены метки, убираем слой labels если он есть
    else if (!mapConfig.showLabels && mapConfig.visibleLayers.includes(MAP_LAYERS.LABELS)) {
      updateMapConfig({
        visibleLayers: mapConfig.visibleLayers.filter(l => l !== MAP_LAYERS.LABELS)
      });
    }
  }, [mapConfig.showLabels]);

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

  const updateMapConfig = (config: Partial<MapConfig>) => {
    setMapConfig(prevConfig => {
      const newConfig = { ...prevConfig, ...config };
      
      // Автосохранение конфигурации при каждом обновлении
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
      } catch (error) {
        console.error('Ошибка при автосохранении конфигурации карты:', error);
      }
      
      return newConfig;
    });
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