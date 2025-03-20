import React, { useState, useCallback, useMemo, memo, ReactNode, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import { useMapConfig, MapConfigProvider } from '../contexts/MapConfigContext';
import { MapProvider } from '../contexts/MapContext';
import { MapData, getMapImageUrl } from '../services/mapService';
import { RegionData } from '../types/mapTypes';
import { MAP_STYLES } from '../styles';
import { Card, LoadingSpinner } from '@/modules/ui';
import { 
  MapBoundsHandler,
  MapReadyHandler,
  BaseMapContainer,
  ErrorView,
  LoadingView
} from './map-components';
import MapLayersManager from './map-layers/MapLayersManager';
import MapContentStateRenderer from './map-content/MapContentStateRenderer';
import MapControlsRenderer from './map-controls/MapControlsRenderer';
import { useMapData, useControlPanel } from '../hooks';

// Интерфейс для пользовательских слоёв
export interface CustomMapLayerProps {
  isVisible: boolean;
  config?: Record<string, any>;
}

export interface MapLayerProps extends CustomMapLayerProps {
  layerId: string;
  order: number;
  component: React.ComponentType<CustomMapLayerProps>;
}

// Интерфейс для свойств основного компонента карты с поддержкой расширений
interface MapPageContentProps {
  extraControls?: ReactNode;
  customLayers?: MapLayerProps[];
  plugins?: ReactNode;
  onRegionClick?: (regionId: string) => void;
  controlPanelPosition?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  showControls?: boolean;
  onDataLoaded?: (data: { mapData: MapData | null, regions: RegionData[] }) => void;
  onError?: (error: Error) => void;
}

/**
 * Основной компонент содержимого карты 
 * Инкапсулирует логику работы с картой и предоставляет возможности расширения
 */
const MapPageContent: React.FC<MapPageContentProps & { onMapReady?: (map: L.Map) => void }> = memo(({
  extraControls,
  customLayers = [],
  plugins,
  onRegionClick,
  onMapReady,
  controlPanelPosition = 'topRight',
  showControls = true,
  onDataLoaded,
  onError
}) => {
  // Используем хук для загрузки данных карты
  const {
    mapData,
    regions,
    loading,
    error,
    mapImageUrl,
    refreshMapData
  } = useMapData({
    autoLoad: true,
    onDataLoaded,
    onError
  });

  // Используем хук для панели управления
  const {
    showControlPanel,
    toggleControlPanel,
    controlPanelStyles
  } = useControlPanel({
    controlPanelPosition
  });

  // Состояние для хранения границ изображения
  const [imageBounds, setImageBounds] = useState<L.LatLngBoundsExpression>([[0, 0], [1000, 1000]]);
  const { mapConfig } = useMapConfig();
  const [imageBoundsCalculated, setImageBoundsCalculated] = useState(false);
  
  // Обработчик обновления данных
  const handleRefresh = useCallback(() => {
    refreshMapData();
  }, [refreshMapData]);

  // Мемоизированный заголовок карты
  const mapTitle = useMemo(() => {
    return mapConfig.lightMode 
      ? "Облегченная карта" 
      : (mapData?.name || "Интерактивная карта ботанического сада");
  }, [mapConfig.lightMode, mapData?.name]);

  // Мемоизированный рендер содержимого карты Leaflet
  const mapContainerContent = useMemo(() => {
    if (!mapImageUrl) return null;
    
    return (
      <BaseMapContainer
        mapConfig={mapConfig}
        showControls={true}
      >
        {/* Обработчик события ready */}
        {onMapReady && <MapReadyHandler onMapReady={onMapReady} />}
        
        {/* Слои карты */}
        <MapLayersManager 
          visibleLayers={mapConfig.visibleLayers}
          mapImageUrl={mapImageUrl}
          imageBounds={imageBounds}
          regions={regions}
          customLayers={customLayers}
          mapConfig={mapConfig}
          onRegionClick={onRegionClick}
          highlightSelected={!mapConfig.lightMode}
        />
        
        {/* Обработчик границ карты */}
        <MapBoundsHandler imageBounds={imageBounds} />

        {/* Плагины */}
        {plugins}
      </BaseMapContainer>
    );
  }, [
    mapImageUrl, 
    mapConfig, 
    onMapReady, 
    regions, 
    customLayers, 
    onRegionClick, 
    plugins, 
    imageBounds
  ]);

  return (
    <div className={MAP_STYLES.mapContainer}>
      <Card 
        title={mapTitle}
        headerAction={loading && <LoadingSpinner size="small" message="" />}
        variant="elevated"
        contentClassName="p-0"
      >
        <div className={MAP_STYLES.mapContent}>
          {/* Компонент управления состоянием контента карты */}
          <MapContentStateRenderer 
            loading={loading} 
            error={error} 
            mapImageUrl={mapImageUrl} 
            handleRefresh={handleRefresh}
          >
            {/* Элементы управления картой */}
            <MapControlsRenderer 
              showControls={showControls}
              controlPanelStyles={controlPanelStyles}
              toggleControlPanel={toggleControlPanel}
              showControlPanel={showControlPanel}
              extraControls={extraControls}
            />

            {/* Расчет границ изображения вне MapContainer */}
            <ImageBoundsCalculator 
                mapImageUrl={mapImageUrl} 
                onBoundsCalculated={bounds => {
                    setImageBounds(bounds);
                    setImageBoundsCalculated(true);
                }}
                isCalculated={imageBoundsCalculated}
            />
            
            {/* Содержимое контейнера карты */}
            {mapContainerContent}
          </MapContentStateRenderer>
        </div>
      </Card>
    </div>
  );
});

// Интерфейс для публичного компонента карты
export interface MapPageProps extends Omit<MapPageContentProps, 'onDataLoaded' | 'onError'> {
  initialConfig?: Record<string, any>; // Начальная конфигурация для MapConfigProvider
  onMapReady?: (map: any) => void; // Колбэк при готовности карты
}

/**
 * Публичный компонент карты с провайдером конфигурации
 */
const MapPage: React.FC<MapPageProps> = ({
  initialConfig,
  onMapReady,
  ...contentProps
}) => {
  return (
    <MapConfigProvider initialConfig={initialConfig}>
      <MapProvider>
        <MapPageContent
          {...contentProps}
          onMapReady={onMapReady}
        />
      </MapProvider>
    </MapConfigProvider>
  );
};

// Компонент для расчета границ изображения
interface ImageBoundsCalculatorProps {
    mapImageUrl: string | null;
    onBoundsCalculated: (bounds: L.LatLngBoundsExpression) => void;
    isCalculated: boolean;
}

const ImageBoundsCalculator: React.FC<ImageBoundsCalculatorProps> = ({
    mapImageUrl, 
    onBoundsCalculated,
    isCalculated
}) => {
    // Расчет границ через useEffect
    useEffect(() => {
        if (!mapImageUrl || isCalculated) return;
        
        const img = new Image();
        img.onload = () => {
            const width = img.width;
            const height = img.height;
            const calculatedBounds: L.LatLngBoundsExpression = [
                [0, 0],
                [height, width]
            ];
            
            onBoundsCalculated(calculatedBounds);
        };
        
        img.src = mapImageUrl;
    }, [mapImageUrl, isCalculated, onBoundsCalculated]);
    
    return null;
};

export default MapPage; 