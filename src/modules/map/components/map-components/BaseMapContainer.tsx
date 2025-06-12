import React, { ReactNode, Suspense } from 'react';
import { MapContainer, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapConfig } from '../../contexts/MapConfigContext';
import { MAP_STYLES } from '../../styles';
import { useMapConfig } from '../../contexts/MapConfigContext';
import LoadingView from './LoadingView';

export interface BaseMapContainerProps {
  mapConfig: MapConfig;
  children: ReactNode;
  showControls?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Базовый компонент контейнера карты, который теперь динамически
 * настраивает систему координат (CRS) в зависимости от типа карты.
 */
const BaseMapContainer: React.FC<BaseMapContainerProps> = ({
  mapConfig,
  children,
  showControls = true,
  style = { height: '100%', width: '100%' },
  className = '',
}) => {
  const { mapConfig: contextMapConfig } = useMapConfig();
  
  return (
    <Suspense fallback={<LoadingView />}>
      <MapContainer
        key={contextMapConfig.mapType}
        center={contextMapConfig.center}
        zoom={contextMapConfig.zoom}
        maxZoom={contextMapConfig.maxZoom}
        minZoom={contextMapConfig.minZoom}
        style={style}
        zoomControl={false}
        crs={contextMapConfig.mapType === 'geo' ? L.CRS.EPSG3857 : L.CRS.Simple}
        maxBounds={contextMapConfig.maxBounds}
        maxBoundsViscosity={contextMapConfig.maxBoundsViscosity}
        attributionControl={false}
        className={`${
          contextMapConfig.lightMode ? MAP_STYLES.lightMode : ''
        } ${className}`}
        scrollWheelZoom={showControls}
        dragging={showControls}
        keyboard={false}
      >
        {showControls && <ZoomControl position={contextMapConfig.zoomControlPosition} />}
        {children}
      </MapContainer>
    </Suspense>
  );
};

export default BaseMapContainer;
