import React from 'react';
import { ImageOverlay } from 'react-leaflet';
import L from 'leaflet';

interface MapImageLayerProps {
  imageUrl: string;
  bounds: L.LatLngBoundsExpression;
  opacity?: number;
  zIndex?: number;
}

/**
 * Компонент для отображения карты как изображения в Leaflet
 * Должен использоваться только внутри MapContainer
 */
const MapImageLayer: React.FC<MapImageLayerProps> = ({ 
  imageUrl, 
  bounds, 
  opacity = 1,
  zIndex = 10
}) => {
  if (!bounds || !imageUrl) {
    console.warn('MapImageLayer: missing required props bounds or imageUrl');
    return null;
  }
  
  return (
    <ImageOverlay
      url={imageUrl}
      bounds={bounds}
      opacity={opacity}
      zIndex={zIndex}
    />
  );
};

export default MapImageLayer; 