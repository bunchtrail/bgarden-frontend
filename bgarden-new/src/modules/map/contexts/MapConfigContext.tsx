import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LatLngExpression, LatLngBoundsExpression, ControlPosition } from 'leaflet';

// Доступные слои карты
export const MAP_LAYERS = {
  IMAGERY: 'imagery',
  REGIONS: 'regions',
  PLANTS: 'plants',
  LABELS: 'labels'
} as const;

// Имя ключа для хранения конфигурации в localStorage
const STORAGE_KEY = 'bgarden_map_config';

// Имя ключа для хранения конфигурации облегченного режима
const LIGHT_MODE_STORAGE_KEY = 'bgarden_map_light_config';

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
  showLabels: true,
  showMarkers: true, // По умолчанию маркеры отображаются
  zoomLevel: 1,
  availableLayers: [MAP_LAYERS.IMAGERY, MAP_LAYERS.REGIONS, MAP_LAYERS.PLANTS, MAP_LAYERS.LABELS],
  showControls: true,
  debug: false,
  enableClustering: true, // По умолчанию кластеризация включена
};

// Настройки по умолчанию для облегченной карты
export const DEFAULT_LIGHT_MAP_CONFIG: Partial<MapConfig> = {
  lightMode: true,
  visibleLayers: [MAP_LAYERS.IMAGERY, MAP_LAYERS.REGIONS],
  showTooltips: false,
  showLabels: false, 
  zoomLevel: 0,
  enableClustering: false, // По умолчанию кластеризация выключена в облегченном режиме
};

interface MapConfigContextProps {
  mapConfig: MapConfig;
  setMapConfig: React.Dispatch<React.SetStateAction<MapConfig>>;
  updateMapConfig: (config: Partial<MapConfig>) => void;
  resetMapConfig: () => void;
  toggleLightMode: () => void;
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

// Функция для загрузки конфигурации из localStorage
const loadSavedConfig = (): Partial<MapConfig> => {
  try {
    const savedConfig = localStorage.getItem(STORAGE_KEY);
    if (savedConfig) {
      return JSON.parse(savedConfig);
    }
  } catch (error) {
    console.error('Ошибка при загрузке конфигурации карты:', error);
  }
  return {};
};

// Функция для загрузки конфигурации облегченного режима
const loadLightModeConfig = (): Partial<MapConfig> => {
  try {
    const savedConfig = localStorage.getItem(LIGHT_MODE_STORAGE_KEY);
    if (savedConfig) {
      return JSON.parse(savedConfig);
    }
  } catch (error) {
    console.error('Ошибка при загрузке конфигурации облегченной карты:', error);
  }
  return DEFAULT_LIGHT_MAP_CONFIG;
};

export const MapConfigProvider: React.FC<MapConfigProviderProps> = ({ 
  children, 
  initialConfig 
}) => {
  // Загружаем конфигурацию при инициализации
  const savedConfig = loadSavedConfig();
  
  const [mapConfig, setMapConfig] = useState<MapConfig>({
    ...DEFAULT_MAP_CONFIG,
    ...savedConfig, // Сначала применяем сохраненные настройки
    ...initialConfig // Затем применяем переданные в компонент (они имеют приоритет)
  });

  // Храним состояние последней обычной конфигурации перед переключением в облегченный режим
  const [lastNormalConfig, setLastNormalConfig] = useState<Partial<MapConfig>>({});
  
  // Храним состояние последней облегченной конфигурации
  const [lastLightConfig, setLastLightConfig] = useState<Partial<MapConfig>>(loadLightModeConfig());

  // Синхронизация между параметром showLabels и слоем labels
  useEffect(() => {
    const hasLabelsLayer = mapConfig.visibleLayers.includes(MAP_LAYERS.LABELS);
    
    // Если параметр showLabels включен, а слой labels отсутствует - добавляем его
    if (mapConfig.showLabels && !hasLabelsLayer) {
      setMapConfig(prev => ({
        ...prev,
        visibleLayers: [...prev.visibleLayers, MAP_LAYERS.LABELS]
      }));
    } 
    // Если параметр showLabels выключен, а слой labels присутствует - удаляем его
    else if (!mapConfig.showLabels && hasLabelsLayer) {
      setMapConfig(prev => ({
        ...prev,
        visibleLayers: prev.visibleLayers.filter(layer => layer !== MAP_LAYERS.LABELS)
      }));
    }
  }, [mapConfig.showLabels]);

  // Функция для сохранения конфигурации в localStorage
  const saveConfigToStorage = () => {
    try {
      if (mapConfig.lightMode) {
        // Сохраняем конфигурацию облегченного режима
        localStorage.setItem(LIGHT_MODE_STORAGE_KEY, JSON.stringify({
          visibleLayers: mapConfig.visibleLayers,
          showTooltips: mapConfig.showTooltips,
          enableClustering: mapConfig.enableClustering
        }));
      } else {
        // Сохраняем обычную конфигурацию
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mapConfig));
      }
    } catch (error) {
      console.error('Ошибка при сохранении конфигурации карты:', error);
    }
  };

  // Функция для загрузки конфигурации из localStorage
  const loadConfigFromStorage = () => {
    const savedConfig = loadSavedConfig();
    if (Object.keys(savedConfig).length > 0) {
      setMapConfig(prev => ({
        ...prev,
        ...savedConfig
      }));
    }
  };

  const updateMapConfig = (config: Partial<MapConfig>) => {
    setMapConfig(prevConfig => {
      const newConfig = {
        ...prevConfig,
        ...config
      };
      
      // Автосохранение конфигурации при каждом обновлении
      try {
        if (newConfig.lightMode) {
          // В режиме облегченной карты сохраняем только специфичные настройки
          localStorage.setItem(LIGHT_MODE_STORAGE_KEY, JSON.stringify({
            visibleLayers: newConfig.visibleLayers,
            showTooltips: newConfig.showTooltips,
            enableClustering: newConfig.enableClustering
          }));
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
        }
      } catch (error) {
        console.error('Ошибка при автосохранении конфигурации карты:', error);
      }
      
      return newConfig;
    });
  };

  const resetMapConfig = () => {
    // Сбрасываем в зависимости от текущего режима
    if (mapConfig.lightMode) {
      setMapConfig(prev => ({
        ...prev,
        ...DEFAULT_LIGHT_MAP_CONFIG
      }));
      try {
        localStorage.removeItem(LIGHT_MODE_STORAGE_KEY);
      } catch (error) {
        console.error('Ошибка при удалении сохраненной конфигурации облегченной карты:', error);
      }
    } else {
      setMapConfig(DEFAULT_MAP_CONFIG);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error('Ошибка при удалении сохраненной конфигурации карты:', error);
      }
    }
  };

  const toggleLightMode = () => {
    setMapConfig(prevConfig => {
      // Если переключаемся в облегченный режим
      if (!prevConfig.lightMode) {
        // Сохраняем текущую конфигурацию обычного режима
        setLastNormalConfig({
          visibleLayers: prevConfig.visibleLayers,
          showTooltips: prevConfig.showTooltips,
          showLabels: prevConfig.showLabels,
          enableClustering: prevConfig.enableClustering
        });
        
        // Применяем настройки облегченного режима
        return {
          ...prevConfig,
          ...lastLightConfig,
          lightMode: true
        };
      } 
      // Если переключаемся из облегченного режима в обычный
      else {
        // Сохраняем текущую конфигурацию облегченного режима
        setLastLightConfig({
          visibleLayers: prevConfig.visibleLayers,
          showTooltips: prevConfig.showTooltips,
          enableClustering: prevConfig.enableClustering
        });
        
        // Возвращаем настройки обычного режима
        return {
          ...prevConfig,
          ...lastNormalConfig,
          lightMode: false
        };
      }
    });
  };

  const toggleLayer = (layerName: string) => {
    setMapConfig(prevConfig => {
      const newVisibleLayers = [...prevConfig.visibleLayers];
      
      // Обработка синхронизации слоя labels с параметром showLabels
      if (layerName === MAP_LAYERS.LABELS) {
        const hasLabels = newVisibleLayers.includes(layerName);
        // Если переключаем слой labels, также переключаем параметр showLabels
        return {
          ...prevConfig,
          visibleLayers: hasLabels 
            ? newVisibleLayers.filter(name => name !== layerName)
            : [...newVisibleLayers, layerName],
          showLabels: !hasLabels // Синхронизируем параметр showLabels со слоем
        };
      }
      
      // Обычное переключение для других слоев
      if (newVisibleLayers.includes(layerName)) {
        return {
          ...prevConfig,
          visibleLayers: newVisibleLayers.filter(name => name !== layerName)
        };
      } else {
        return {
          ...prevConfig,
          visibleLayers: [...newVisibleLayers, layerName]
        };
      }
    });
  };

  const value = {
    mapConfig,
    setMapConfig,
    updateMapConfig,
    resetMapConfig,
    toggleLightMode,
    toggleLayer,
    saveConfigToStorage,
    loadConfigFromStorage
  };

  return (
    <MapConfigContext.Provider value={value}>
      {children}
    </MapConfigContext.Provider>
  );
};

export default MapConfigProvider; 