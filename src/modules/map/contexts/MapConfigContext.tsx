import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import L from 'leaflet';
import {
  LatLngExpression,
  LatLngBoundsExpression,
  ControlPosition,
} from 'leaflet';
import { mapLogger } from '../utils/logger';

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
  DGIS: 'dgis', // Карта 2ГИС
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
  visibleLayers: [MAP_LAYERS.GEO_TILES, MAP_LAYERS.REGIONS, MAP_LAYERS.PLANTS],
  availableLayers: [
    MAP_LAYERS.GEO_TILES,
    MAP_LAYERS.REGIONS,
    MAP_LAYERS.PLANTS,
  ],
  drawingEnabled: false,
  interactionMode: MAP_MODES.VIEW,
};

// Настройки по умолчанию для карты 2ГИС
export const DEFAULT_DGIS_CONFIG: MapConfig = {
  ...DEFAULT_SCHEMATIC_CONFIG, // Наследуем общие настройки
  mapType: MAP_TYPES.DGIS,
  center: [58.596323, 49.666755] as LatLngExpression, // Координаты ботсада
  zoom: 13,
  maxZoom: 18,
  minZoom: 8,
  maxBounds: undefined,
  maxBoundsViscosity: 1.0,
  visibleLayers: [MAP_LAYERS.GEO_TILES, MAP_LAYERS.REGIONS, MAP_LAYERS.PLANTS],
  availableLayers: [
    MAP_LAYERS.GEO_TILES,
    MAP_LAYERS.REGIONS, 
    MAP_LAYERS.PLANTS,
  ],
  drawingEnabled: false,
  interactionMode: MAP_MODES.VIEW,
};

// Глобальная конфигурация по умолчанию - теперь используем 2ГИС
export const DEFAULT_MAP_CONFIG: MapConfig = DEFAULT_DGIS_CONFIG;

interface MapConfigContextProps {
  mapConfig: MapConfig;
  setMapConfig: React.Dispatch<React.SetStateAction<MapConfig>>;
  updateMapConfig: (config: Partial<MapConfig>) => void;
  resetMapConfig: () => void;
  toggleLayer: (layerName: string) => void;
  saveConfigToStorage: () => void;
  loadConfigFromStorage: () => void;
  setMapType: (mapType: (typeof MAP_TYPES)[keyof typeof MAP_TYPES]) => void;
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

export const MapConfigProvider: React.FC<{ children: ReactNode; initialConfig?: Partial<MapConfig>; }> = ({ children, initialConfig = {} }) => {
  const [mapConfig, setMapConfig] = useState<MapConfig>({
    ...DEFAULT_DGIS_CONFIG,
    ...initialConfig,
  });

  // Обновляем состояние логгера при изменении конфигурации
  useEffect(() => {
    mapLogger.setConfig(mapConfig);
  }, [mapConfig]);

  const updateMapConfig = useCallback((updates: Partial<MapConfig>) => {
    
    setMapConfig((prevConfig) => {
      const newConfig = { ...prevConfig, ...updates };
      return newConfig;
    });
  }, []);

  const resetMapConfig = useCallback(() => {
    
    setMapConfig(DEFAULT_DGIS_CONFIG);
  }, []);

  const toggleLayer = useCallback((layerName: string) => {
    
    
    setMapConfig((prevConfig) => {
      const newVisibleLayers = prevConfig.visibleLayers.includes(layerName)
        ? prevConfig.visibleLayers.filter((layer) => layer !== layerName)
        : [...prevConfig.visibleLayers, layerName];

      // Проверка для схематической карты - должен быть активен хотя бы один базовый слой
      if (prevConfig.mapType === MAP_TYPES.SCHEMATIC) {
        // Проверяем наличие хотя бы одного базового слоя (IMAGERY или REGIONS)
        const hasImagery = newVisibleLayers.includes(MAP_LAYERS.IMAGERY);
        const hasRegions = newVisibleLayers.includes(MAP_LAYERS.REGIONS);
        
        // Если пытаемся выключить последний базовый слой, отменяем операцию
        if (!hasImagery && !hasRegions) {
          
          return prevConfig;
        }
      }

      // Проверка для карт 2ГИС и геокарт - должен быть активен базовый тайловый слой
      if (prevConfig.mapType === MAP_TYPES.DGIS || prevConfig.mapType === MAP_TYPES.GEO) {
        const hasGeoTiles = newVisibleLayers.includes(MAP_LAYERS.GEO_TILES);
        
        // Если пытаемся выключить тайловый слой на геокарте, отменяем операцию
        if (!hasGeoTiles) {
          
          return prevConfig;
        }
      }

      
      return {
        ...prevConfig,
        visibleLayers: newVisibleLayers,
      };
    });
  }, []);

  const setMapType = useCallback((newMapType: (typeof MAP_TYPES)[keyof typeof MAP_TYPES]) => {
    
    
    // Очищаем все слои перед сменой типа карты
    const mapElement = document.querySelector('.leaflet-container');
    const map = mapElement ? (mapElement as any)._leaflet_map as L.Map : null;
    
    if (map) {
      map.eachLayer((layer: L.Layer) => {
        if ((layer as any)._drawnItems) {
          (layer as any).clearLayers();
        }
        if (layer instanceof L.MarkerClusterGroup) {
          layer.clearLayers();
        }
        map.removeLayer(layer);
      });
    }

    // Устанавливаем новый тип карты с соответствующими настройками
    setMapConfig((prevConfig) => {
      let newConfig: MapConfig;
      
      switch(newMapType) {
        case MAP_TYPES.GEO:
          newConfig = {
            ...DEFAULT_GEO_CONFIG,
            debug: prevConfig.debug,
            showTooltips: prevConfig.showTooltips,
          };
          break;
        case MAP_TYPES.DGIS:
          newConfig = {
            ...DEFAULT_DGIS_CONFIG,
            debug: prevConfig.debug,
            showTooltips: prevConfig.showTooltips,
          };
          break;
        default:
          newConfig = {
            ...DEFAULT_SCHEMATIC_CONFIG,
            debug: prevConfig.debug,
            showTooltips: prevConfig.showTooltips,
          };
      }
      
      newConfig.mapType = newMapType;

      // Генерируем кастомное событие для уведомления других компонентов
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(
          new CustomEvent('mapTypeChange', { detail: newMapType })
        );
      }

      return newConfig;
    });
  }, []);

  const saveConfigToStorage = useCallback(() => {
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mapConfig));
  }, [mapConfig]);

  const loadConfigFromStorage = useCallback(() => {
    const savedConfig = localStorage.getItem(STORAGE_KEY);
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        
        setMapConfig(parsedConfig);
      } catch (error) {
        
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

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
