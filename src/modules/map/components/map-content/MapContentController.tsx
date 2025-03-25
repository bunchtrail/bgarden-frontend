import React, { useState, useCallback } from 'react';
import MapContentStateRenderer from './MapContentStateRenderer';
import { UnifiedControlPanel, PanelSection } from '../../components/control-panel';
import MapViewContainer from '../map-view/MapViewContainer';
import ImageBoundsCalculator from '../map-view/ImageBoundsCalculator';
import { MapContentControllerProps } from '../../types/mapTypes';

/**
 * Компонент контроллера содержимого карты
 * Отвечает за координацию отображения состояния содержимого, 
 * элементов управления и вида карты
 */
const MapContentController: React.FC<MapContentControllerProps> = ({
  loading,
  error,
  mapImageUrl,
  regions,
  imageBounds,
  imageBoundsCalculated,
  setImageBounds,
  setImageBoundsCalculated,
  refreshMapData,
  showControls,
  controlPanelStyles,
  toggleControlPanel,
  showControlPanel,
  extraControls,
  customLayers,
  onRegionClick,
  onMapReady,
  plugins,
  isEmpty = false
}) => {
  // Локальное состояние пустоты данных, которое может обновляться из детей
  const [localIsEmpty, setLocalIsEmpty] = useState<boolean>(isEmpty);
  
  // Обновляем состояние пустоты данных
  const handleDataStateChange = useCallback((state: { 
    hasPlants: boolean; 
    hasRegions: boolean; 
    isEmpty: boolean; 
  }) => {
    setLocalIsEmpty(state.isEmpty);
  }, []);

  // Используем значение пустоты данных, либо переданное извне, либо локальное
  const effectiveIsEmpty = isEmpty || localIsEmpty;
  
  return (
    <MapContentStateRenderer
      loading={loading}
      error={error}
      mapImageUrl={mapImageUrl}
      handleRefresh={refreshMapData}
      isEmpty={effectiveIsEmpty}
    >
      {/* Элементы управления картой - теперь внутренняя логика видимости панели */}
      {showControls && (
        <UnifiedControlPanel
          pageType="map"
          className={controlPanelStyles?.container}
          onClose={toggleControlPanel}
          customSections={extraControls}
          panelId="main-map-control-panel"
          config={{
            mode: 'full',
            visibleSections: [
              PanelSection.LAYERS,
              PanelSection.MODE,
              PanelSection.SETTINGS
            ]
          }}
        />
      )}
      
      {/* Компонент для расчета границ */}
      <ImageBoundsCalculator
        mapImageUrl={mapImageUrl}
        onBoundsCalculated={(bounds) => {
          setImageBounds(bounds);
          setImageBoundsCalculated(true);
        }}
        isCalculated={imageBoundsCalculated}
      />
      
      {/* Контейнер вида карты */}
      <MapViewContainer
        mapImageUrl={mapImageUrl}
        imageBounds={imageBounds}
        regions={regions}
        customLayers={customLayers}
        onRegionClick={onRegionClick}
        onMapReady={onMapReady}
        plugins={plugins}
        onDataStateChange={handleDataStateChange}
      />
    </MapContentStateRenderer>
  );
};

export default MapContentController; 