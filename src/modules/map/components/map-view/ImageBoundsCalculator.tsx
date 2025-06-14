import React, { useEffect } from 'react';
import L from 'leaflet';
import { ImageBoundsCalculatorProps } from '../../types/mapTypes';
import { useMapConfig } from '../../contexts/MapConfigContext';
import { MAP_TYPES } from '../../contexts/MapConfigContext';

/**
 * Компонент для расчета границ изображения карты
 * Используется для определения размеров карты на основе размеров изображения
 * Пропускает расчет для географического режима карты
 */
const ImageBoundsCalculator: React.FC<ImageBoundsCalculatorProps> = ({
  mapImageUrl, 
  onBoundsCalculated,
  isCalculated
}) => {
  const { mapConfig } = useMapConfig();

  // Расчет границ через useEffect
  useEffect(() => {
    // Пропускаем расчет для географического режима
    if (!mapImageUrl || isCalculated || mapConfig.mapType === MAP_TYPES.GEO) return;
    
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
  }, [mapImageUrl, isCalculated, onBoundsCalculated, mapConfig.mapType]);
  
  return null;
};

export default ImageBoundsCalculator; 