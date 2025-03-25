import React, { useState, useCallback, useMemo } from 'react';
import { useMapConfig } from '../contexts/MapConfigContext';
import { useMapData, useMapControlPanel } from '../hooks';
import MapCard from './map-card/MapCard';
import MapContentController from './map-content/MapContentController';
import { MapPageContentProps, MapLayerProps } from '../types/mapTypes';
import L from 'leaflet';
import MapDrawingLayer from './map-layers/MapDrawingLayer';

/**
 * Компонент содержимого страницы карты
 * Отвечает за управление данными и состоянием карты
 */
const MapPageContent: React.FC<MapPageContentProps> = ({
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
  // Состояние для bounds
  const [imageBounds, setImageBounds] = useState<L.LatLngBoundsExpression>([[0, 0], [1000, 1000]]);
  const [imageBoundsCalculated, setImageBoundsCalculated] = useState(false);
  
  // Хуки для данных и управления
  const { mapData, regions, loading, error, mapImageUrl, refreshMapData, isEmpty } = useMapData({
    autoLoad: true, 
    onDataLoaded, 
    onError
  });
  
  const { showControlPanel, toggleControlPanel, controlPanelStyles } = useMapControlPanel({
    controlPanelPosition
  });
  
  const { mapConfig } = useMapConfig();
  
  // Заголовок карты
  const mapTitle = useMemo(() => {
    return mapConfig.lightMode 
      ? "Облегченная карта" 
      : (mapData?.name || "Интерактивная карта ботанического сада");
  }, [mapConfig.lightMode, mapData?.name]);
    
  // Обработчик обновления данных
  const handleRefresh = useCallback(() => {
    refreshMapData();
  }, [refreshMapData]);
  
  // Преобразование строковой ошибки в объект Error
  const errorObj = useMemo(() => {
    if (!error) return null;
    return new Error(error);
  }, [error]);
  
  // Добавляем слой для рисования областей
  const enhancedLayers = useMemo(() => {
    // Если включен режим рисования, добавляем слой для рисования
    const drawingLayer: MapLayerProps = {
      layerId: 'drawing-layer',
      order: 1000, // Высокий приоритет, чтобы рисовать поверх других слоев
      isVisible: mapConfig.drawingEnabled,
      component: MapDrawingLayer,
      config: {
        color: '#3B82F6',
        fillColor: '#60A5FA',
        fillOpacity: 0.3,
        weight: 2
      }
    };
    
    return [...customLayers, drawingLayer];
  }, [customLayers, mapConfig.drawingEnabled]);
    
  return (
    <div className="w-full h-full">
      <MapCard 
        title={mapTitle}
        loading={loading}
      >
        <MapContentController
          loading={loading}
          error={errorObj}
          mapImageUrl={mapImageUrl}
          regions={regions}
          imageBounds={imageBounds}
          imageBoundsCalculated={imageBoundsCalculated}
          setImageBounds={setImageBounds}
          setImageBoundsCalculated={setImageBoundsCalculated}
          refreshMapData={handleRefresh}
          showControls={showControls}
          controlPanelStyles={controlPanelStyles}
          toggleControlPanel={toggleControlPanel}
          showControlPanel={showControlPanel}
          extraControls={extraControls}
          customLayers={enhancedLayers}
          onRegionClick={onRegionClick}
          onMapReady={onMapReady}
          plugins={plugins}
          isEmpty={isEmpty}
        />
      </MapCard>
    </div>
  );
};

export default MapPageContent; 