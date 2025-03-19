import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapBoundsHandlerProps {
  imageBounds: L.LatLngBoundsExpression;
  fitBoundsOptions?: L.FitBoundsOptions;
}

// Компонент для корректной установки границ изображения на карте
const MapBoundsHandler: React.FC<MapBoundsHandlerProps> = ({ 
  imageBounds, 
  fitBoundsOptions 
}) => {
  const map = useMap();
  
  useEffect(() => {
    if (imageBounds) {
      map.fitBounds(imageBounds, fitBoundsOptions);
    }
  }, [map, imageBounds, fitBoundsOptions]);
  
  return null;
};

export default MapBoundsHandler; 