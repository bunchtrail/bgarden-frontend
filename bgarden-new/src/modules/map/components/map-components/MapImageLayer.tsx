import React, { useEffect } from 'react';
import { ImageOverlay } from 'react-leaflet';
import L from 'leaflet';

interface MapImageLayerProps {
  imageUrl: string;
  bounds?: L.LatLngBoundsExpression;
  setImageBounds?: (bounds: L.LatLngBoundsExpression) => void;
  opacity?: number;
  zIndex?: number;
}

// Компонент для обработки размеров изображения и расчета границ
const MapImageLayer: React.FC<MapImageLayerProps> = ({ 
  imageUrl, 
  bounds, 
  setImageBounds,
  opacity = 1,
  zIndex = 10
}) => {
  
  // Если нужно рассчитать границы изображения
  useEffect(() => {
    if (!setImageBounds || !imageUrl) return;
    
    // Создаем новый объект изображения для получения размеров
    const img = new Image();
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      console.log(`Загружено изображение: ${width}x${height}`);
      
      // Создаем ограничения карты на основе размеров изображения
      // Используем систему координат, где [0,0] - верхний левый угол
      const calculatedBounds: L.LatLngBoundsExpression = [
        [0, 0],    // верхний левый угол
        [height, width]  // нижний правый угол
      ];
      
      setImageBounds(calculatedBounds);
    };
    
    img.src = imageUrl;
  }, [imageUrl, setImageBounds]);
  
  // Если нужно отобразить изображение на карте
  if (bounds && imageUrl) {
    return (
      <ImageOverlay
        url={imageUrl}
        bounds={bounds}
        opacity={opacity}
        zIndex={zIndex}
      />
    );
  }
  
  return null;
};

export default MapImageLayer; 