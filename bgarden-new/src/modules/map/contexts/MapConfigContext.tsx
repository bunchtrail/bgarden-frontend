import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LatLngExpression, LatLngBoundsExpression, ControlPosition } from 'leaflet';

// Доступные слои карты
export const MAP_LAYERS = {
  IMAGERY: 'imagery',
  REGIONS: 'regions',
  PLANTS: 'plants',
  LABELS: 'labels'
} as const;

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

// Настройки карты по умолчанию
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

interface MapConfigContextProps {
  mapConfig: MapConfig;
  setMapConfig: React.Dispatch<React.SetStateAction<MapConfig>>;
  updateMapConfig: (config: Partial<MapConfig>) => void;
  resetMapConfig: () => void;
  toggleLightMode: () => void;
  toggleLayer: (layerName: string) => void;
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

  const updateMapConfig = (config: Partial<MapConfig>) => {
    setMapConfig(prevConfig => ({
      ...prevConfig,
      ...config
    }));
  };

  const resetMapConfig = () => {
    setMapConfig(DEFAULT_MAP_CONFIG);
  };

  const toggleLightMode = () => {
    setMapConfig(prevConfig => ({
      ...prevConfig,
      lightMode: !prevConfig.lightMode
    }));
  };

  const toggleLayer = (layerName: string) => {
    setMapConfig(prevConfig => {
      const newVisibleLayers = [...prevConfig.visibleLayers];
      
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
    toggleLayer
  };

  return (
    <MapConfigContext.Provider value={value}>
      {children}
    </MapConfigContext.Provider>
  );
};

export default MapConfigProvider; 