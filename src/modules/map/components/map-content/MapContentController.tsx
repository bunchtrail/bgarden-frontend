import React from 'react';
import MapContentStateRenderer from './MapContentStateRenderer';
import MapControlsRenderer from '../map-controls/MapControlsRenderer';
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
  plugins
}) => {
  return (
    <MapContentStateRenderer
      loading={loading}
      error={error}
      mapImageUrl={mapImageUrl}
      handleRefresh={refreshMapData}
    >
      {/* Элементы управления картой */}
      <MapControlsRenderer
        showControls={showControls}
        controlPanelStyles={controlPanelStyles}
        toggleControlPanel={toggleControlPanel}
        showControlPanel={showControlPanel}
        extraControls={extraControls}
      />
      
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
      />
    </MapContentStateRenderer>
  );
};

export default MapContentController; 