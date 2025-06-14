import React from 'react';
import { TileLayer } from 'react-leaflet';
import { dgisMapProvider, DgisMapSettings } from '../../services/dgisMapProvider';

interface DgisTileLayerProps {
  opacity?: number;
  zIndex?: number;
  maxZoom?: number;
  minZoom?: number;
  customSettings?: Partial<DgisMapSettings>;
}

/**
 * Компонент тайлового слоя для карты 2ГИС
 * Использует официальный тайловый сервис 2ГИС через провайдер
 */
const DgisTileLayer: React.FC<DgisTileLayerProps> = ({
  opacity = 1,
  zIndex = 1,
  maxZoom,
  minZoom,
  customSettings,
}) => {
  // Получаем конфигурацию от провайдера
  const config = dgisMapProvider.getLeafletConfig();
  
  // Применяем кастомные настройки если они переданы
  const finalMaxZoom = maxZoom ?? config.options.maxZoom;
  const finalMinZoom = minZoom ?? config.options.minZoom;

  return (
    <TileLayer
      key="dgis-tile-layer"
      attribution={config.options.attribution}
      url={config.url}
      subdomains={config.options.subdomains}
      maxNativeZoom={config.options.maxNativeZoom}
      maxZoom={finalMaxZoom}
      minZoom={finalMinZoom}
      opacity={opacity}
      zIndex={zIndex}
      // Дополнительные опции для оптимизации
      updateWhenIdle={config.options.updateWhenIdle}
      updateWhenZooming={config.options.updateWhenZooming}
      keepBuffer={config.options.keepBuffer}
      // Настройки загрузки тайлов
      detectRetina={config.options.detectRetina}
      crossOrigin={config.options.crossOrigin}
    />
  );
};

export default DgisTileLayer; 