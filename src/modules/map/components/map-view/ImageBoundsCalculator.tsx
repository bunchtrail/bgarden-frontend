import React, { useEffect } from 'react';
import L from 'leaflet';
import { ImageBoundsCalculatorProps } from '../../types/mapTypes';

/**
 * Компонент для расчета границ изображения карты
 * Используется для определения размеров карты на основе размеров изображения
 */
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

export default ImageBoundsCalculator; 