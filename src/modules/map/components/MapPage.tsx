import React from 'react';
import 'leaflet/dist/leaflet.css';
import { MapConfigProvider } from '../contexts/MapConfigContext';
import { MapProvider } from '../contexts/MapContext';
import MapPageContent from './MapPageContent';
import { MapPageProps } from '../types/mapTypes';

// Конфигурация для облегченной версии карты
const LIGHT_CONFIG = {
  lightMode: true,
  showTooltips: false,
  visibleLayers: ['imagery', 'regions'],
  maxZoom: 2,
  minZoom: -1
};

/**
 * Основной компонент карты
 * Предоставляет контекст конфигурации и карты для дочерних компонентов
 * 
 * @param initialConfig - Начальная конфигурация карты
 * @param onMapReady - Функция, вызываемая когда карта готова к использованию
 * @param mode - Режим отображения карты: 'full' (полный) или 'light' (облегченный)
 * @param contentProps - Дополнительные свойства для передачи в MapPageContent
 */
const MapPage: React.FC<MapPageProps & { mode?: 'full' | 'light' }> = ({
  initialConfig = {},
  onMapReady,
  mode = 'full',
  ...contentProps
}) => {
  // Выбираем конфигурацию в зависимости от режима
  const config = mode === 'light' 
    ? { ...LIGHT_CONFIG, ...initialConfig }
    : initialConfig;

  return (
    <MapConfigProvider initialConfig={config}>
      <MapProvider>
        <MapPageContent
          {...contentProps}
          onMapReady={onMapReady}
        />
      </MapProvider>
    </MapConfigProvider>
  );
};

export default MapPage; 