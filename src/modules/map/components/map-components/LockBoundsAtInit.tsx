import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface LockBoundsAtInitProps {
  onBoundsSet?: (bounds: L.LatLngBounds) => void;
}

/**
 * Компонент для фиксации границ карты при инициализации.
 * Устанавливает maxBounds равным текущим границам видимой области
 * и делает эти границы непреодолимыми.
 */
const LockBoundsAtInit: React.FC<LockBoundsAtInitProps> = ({ onBoundsSet }) => {
  const map = useMap();

  useEffect(() => {
    // Получаем текущие границы видимой области
    const bounds = map.getBounds();
    
    // Устанавливаем жесткие границы перемещения
    map.setMaxBounds(bounds);
    
    // Делаем границы абсолютно непреодолимыми
    map.options.maxBoundsViscosity = 1.0;

    // Уведомляем родительский компонент о новых границах
    if (onBoundsSet) {
      onBoundsSet(bounds);
    }

    
  }, [map, onBoundsSet]);

  return null;
};

export default LockBoundsAtInit; 