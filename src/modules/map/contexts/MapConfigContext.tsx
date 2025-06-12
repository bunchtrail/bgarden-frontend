import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import {
  LatLngExpression,
  LatLngBoundsExpression,
  ControlPosition,
} from 'leaflet';

// Доступные слои карты
export const MAP_LAYERS = {
  IMAGERY: 'imagery',
  REGIONS: 'regions',
  PLANTS: 'plants',
  GEO_TILES: 'geo_tiles', // Слой для гео-подложки
} as const;

// Типы карт
export const MAP_TYPES = {
  SCHEMATIC: 'schematic',
  GEO: 'geo',
} as const;

// Режимы взаимодействия с картой
export const MAP_MODES = {
  VIEW: 'view',
  DRAW: 'draw',
  EDIT: 'edit',
  DELETE: 'delete', // Режим удаления объектов
} as const;

// Имя ключа для хранения конфигурации в localStorage
const STORAGE_KEY = 'bgarden_map_config';

// Интерфейс конфигурации карты
export interface MapConfig {
  mapType: (typeof MAP_TYPES)[keyof typeof MAP_TYPES]; // Тип карты: 'schematic' или 'geo'
  center: LatLngExpression;
  zoom: number;
  maxZoom: number;
  minZoom: number;
  maxBounds?: LatLngBoundsExpression;
  maxBoundsViscosity: number;
  zoomControlPosition: ControlPosition;
  lightMode: boolean;
  visibleLayers: string[];
  showTooltips: boolean;
  zoomLevel: number;
  availableLayers: string[];
  showControls: boolean;
  debug: boolean;
  enableClustering: boolean;
  showPopupOnClick: boolean;
  interactionMode: string;
  drawingEnabled: boolean;
  editMode: boolean;
  hasCompletedDrawing: boolean;
}

// Настройки по умолчанию для схематической карты
export const DEFAULT_SCHEMATIC_CONFIG: MapConfig = {
  mapType: MAP_TYPES.SCHEMATIC,
  center: [500, 500] as LatLngExpression,
  zoom: 0,
  maxZoom: 4,
  minZoom: -2,
  maxBounds: [
    [-1000, -1000],
    [2000, 2000],
  ] as LatLngBoundsExpression,
  maxBoundsViscosity: 1.0,
  zoomControlPosition: 'bottomright' as ControlPosition,
  lightMode: false,
  visibleLayers: [MAP_LAYERS.IMAGERY, MAP_LAYERS.REGIONS, MAP_LAYERS.PLANTS],
  showTooltips: true,
  zoomLevel: 1,
  availableLayers: [MAP_LAYERS.IMAGERY, MAP_LAYERS.REGIONS, MAP_LAYERS.PLANTS],
  showControls: false,
  debug: false,
  enableClustering: true,
  showPopupOnClick: true,
  interactionMode: MAP_MODES.VIEW,
  drawingEnabled: false,
  editMode: false,
  hasCompletedDrawing: false,
};

// Настройки по умолчанию для гео-карты
export const DEFAULT_GEO_CONFIG: MapConfig = {
  ...DEFAULT_SCHEMATIC_CONFIG, // Наследуем общие настройки
  mapType: MAP_TYPES.GEO,
  center: [58.596323, 49.666755] as LatLngExpression,
  zoom: 18,
  maxZoom: 20,
  minZoom: 18,
  maxBounds: undefined,
  maxBoundsViscosity: 1.0,
  visibleLayers: [MAP_LAYERS.GEO_TILES, MAP_LAYERS.PLANTS],
  drawingEnabled: false,
  interactionMode: MAP_MODES.VIEW,
};

// Глобальная конфигурация по умолчанию
export const DEFAULT_MAP_CONFIG: MapConfig = DEFAULT_SCHEMATIC_CONFIG;

interface MapConfigContextProps {
  mapConfig: MapConfig;
  setMapConfig: React.Dispatch<React.SetStateAction<MapConfig>>;
  updateMapConfig: (config: Partial<MapConfig>) => void;
  resetMapConfig: () => void;
  toggleLayer: (layerName: string) => void;
  saveConfigToStorage: () => void;
  loadConfigFromStorage: () => void;
  setMapType: (mapType: (typeof MAP_TYPES)[keyof typeof MAP_TYPES]) => void; // Новая функция
}

const MapConfigContext = createContext<MapConfigContextProps | undefined>(
  undefined
);

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

// Утилита для безопасного доступа к localStorage
const isClient = typeof window !== 'undefined';

const getStoredConfig = () => {
  if (!isClient) return null;
  try {
    const savedConfig = localStorage.getItem(STORAGE_KEY);
    return savedConfig ? JSON.parse(savedConfig) : null;
  } catch (error) {
    console.error('Ошибка при чтении конфигурации карты:', error);
    return null;
  }
};

const setStoredConfig = (config: MapConfig) => {
  if (!isClient) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Ошибка при сохранении конфигурации карты:', error);
  }
};

export const MapConfigProvider: React.FC<MapConfigProviderProps> = ({
  children,
  initialConfig,
}) => {
  const initialConfigRef = React.useRef(initialConfig);
  const [mapConfig, setMapConfig] = useState<MapConfig>({
    ...DEFAULT_MAP_CONFIG,
    ...initialConfigRef.current,
  });

  useEffect(() => {
    const savedConfig = getStoredConfig();
    if (savedConfig) {
      console.log(
        '[MapConfig] Загружена конфигурация из localStorage:',
        savedConfig
      );
      setMapConfig((prevConfig) => ({
        ...prevConfig,
        ...savedConfig,
        ...initialConfigRef.current,
      }));
    } else {
      console.log(
        '[MapConfig] Конфигурация в localStorage не найдена, используется по умолчанию.'
      );
    }
  }, []);

  useEffect(() => {
    if (mapConfig.drawingEnabled) {
      console.log('[MapConfig] Режим рисования включен', {
        timestamp: new Date().toISOString(),
        interactionMode: mapConfig.interactionMode,
        drawingEnabled: mapConfig.drawingEnabled,
      });
    }
  }, [mapConfig.drawingEnabled, mapConfig.interactionMode]);

  const updateMapConfig = useCallback((updates: Partial<MapConfig>) => {
    console.log('[MapConfig] Обновление конфигурации:', updates);
    setMapConfig((prevConfig) => {
      const newConfig = {
        ...prevConfig,
        ...updates,
      };
      console.log('[MapConfig] Новое состояние после обновления:', newConfig);
      return newConfig;
    });
  }, []);

  const saveConfigToStorage = () => {
    console.log(
      '[MapConfig] Сохранение конфигурации в localStorage:',
      mapConfig
    );
    setStoredConfig(mapConfig);
  };

  const loadConfigFromStorage = () => {
    const savedConfig = getStoredConfig();
    if (savedConfig) {
      console.log(
        '[MapConfig] Загружена конфигурация из localStorage (принудительно):',
        savedConfig
      );
      setMapConfig(savedConfig);
    }
  };

  const resetMapConfig = () => {
    const currentMapType = mapConfig.mapType;
    console.log(
      `[MapConfig] Сброс конфигурации для типа карты: ${currentMapType}`
    );
    const defaultConfig =
      currentMapType === MAP_TYPES.GEO
        ? DEFAULT_GEO_CONFIG
        : DEFAULT_SCHEMATIC_CONFIG;
    setMapConfig(defaultConfig);
    if (isClient) {
      try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('[MapConfig] Конфигурация из localStorage удалена.');
      } catch (error) {
        console.error(
          'Ошибка при удалении сохраненной конфигурации карты:',
          error
        );
      }
    }
  };

  const toggleLayer = (layerName: string) => {
    console.log(`[MapConfig] Переключение слоя: ${layerName}`);
    setMapConfig((prevConfig) => {
      const isLayerActive = prevConfig.visibleLayers.includes(layerName);
      const newLayers = isLayerActive
        ? prevConfig.visibleLayers.filter((layer) => layer !== layerName)
        : [...prevConfig.visibleLayers, layerName];
      console.log(`[MapConfig] Новые видимые слои:`, newLayers);
      return { ...prevConfig, visibleLayers: newLayers };
    });
  };

  // Новая функция для смены типа карты
  const setMapType = useCallback(
    (mapType: (typeof MAP_TYPES)[keyof typeof MAP_TYPES]) => {
      if (mapType === mapConfig.mapType) return; // Не меняем, если тип тот же

      console.log(`[MapConfig] Смена типа карты на: ${mapType}`);
      // Используем функциональную форму setMapConfig для доступа к предыдущему состоянию
      setMapConfig((prevConfig) => {
        console.log('[MapConfig] Предыдущее состояние:', prevConfig);
        // Выбираем конфиг по умолчанию для НОВОГО типа карты
        const defaultConfig =
          mapType === MAP_TYPES.GEO
            ? DEFAULT_GEO_CONFIG
            : DEFAULT_SCHEMATIC_CONFIG;

        console.log(
          '[MapConfig] Конфигурация по умолчанию для нового типа:',
          defaultConfig
        );

        // Явно создаем НОВЫЙ объект состояния.
        // Начинаем с чистого конфига по умолчанию и добавляем только те настройки,
        // которые нужно сохранить из предыдущего состояния.
        const newConfig = {
          ...defaultConfig, // Полностью берем новый конфиг (с правильным центром, зумом и т.д.)

          // Сохраняем пользовательские UI-настройки из предыдущего конфига
          showTooltips: prevConfig.showTooltips,
          showControls: prevConfig.showControls,
          debug: prevConfig.debug,
          enableClustering: prevConfig.enableClustering,
          showPopupOnClick: prevConfig.showPopupOnClick,
        };

        console.log('[MapConfig] Новое состояние после смены типа:', newConfig);
        return newConfig;
      });
    },
    [mapConfig.mapType]
  ); // Зависимость теперь только от mapConfig.mapType, что более корректно

  const value = {
    mapConfig,
    setMapConfig,
    updateMapConfig,
    resetMapConfig,
    toggleLayer,
    saveConfigToStorage,
    loadConfigFromStorage,
    setMapType,
  };

  return (
    <MapConfigContext.Provider value={value}>
      {children}
    </MapConfigContext.Provider>
  );
};

export default MapConfigProvider;
