import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TileLayer } from 'react-leaflet';
import { dgisMapProvider, DgisMapSettings, DgisMapProvider } from '../../services/dgisMapProvider';

interface DgisTileLayerProps {
  opacity?: number;
  zIndex?: number;
  maxZoom?: number;
  minZoom?: number;
  /**
   * Позволяет передать кастомные настройки для 2ГИС провайдера
   */
  customSettings?: Partial<DgisMapSettings>;
  /**
   * URL резервного тайлового слоя (по умолчанию OSM).
   */
  fallbackUrl?: string;
  /**
   * Количество ошибок тайлов подряд, после которых происходит переключение
   * на резервный слой.
   * По умолчанию = 6 (специфично для среднего размера вьюпорта, чтобы не
   * переключаться из-за одной/двух случайных ошибок).
   */
  maxSequentialErrors?: number;
}

/**
 * Компонент тайлового слоя для карты 2ГИС
 * Использует официальный тайловый сервис 2ГИС через провайдер
 */
const DEFAULT_FALLBACK_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

const DgisTileLayer: React.FC<DgisTileLayerProps> = ({
  opacity = 1,
  zIndex = 1,
  maxZoom,
  minZoom,
  customSettings,
  fallbackUrl = DEFAULT_FALLBACK_URL,
  maxSequentialErrors = 6,
}) => {
  // Локальный провайдер, позволяющий подменить глобальные настройки для конкретного слоя
  const provider = React.useMemo<DgisMapProvider>(() => {
    if (customSettings) {
      return new DgisMapProvider(customSettings);
    }
    return dgisMapProvider;
  }, [customSettings]);

  // Основная конфигурация 2ГИС
  const config = provider.getLeafletConfig();

  const finalMaxZoom = maxZoom ?? config.options.maxZoom;
  const finalMinZoom = minZoom ?? config.options.minZoom;

  // Счётчик ошибок загружаемых тайлов
  const sequentialErrorCount = useRef(0);

  const [useFallback, setUseFallback] = useState(false);

  // Колбэк обработки ошибок тайлов
  const handleTileError = useCallback(() => {
    sequentialErrorCount.current += 1;

    // Если ошибок накопилось достаточно – переключаемся на резервный тайловый слой.
    if (sequentialErrorCount.current >= maxSequentialErrors) {
      console.warn(`2ГИС: Переключение на fallback слой после ${maxSequentialErrors} ошибок`);
      setUseFallback(true);
    }
  }, [maxSequentialErrors]);

  // Сбрасываем счётчик когда тайл успешно загрузился – это значит, что сервис доступен
  const handleTileLoad = useCallback(() => {
    sequentialErrorCount.current = 0;
    // Если мы были в fallback режиме и тайлы начали загружаться, можно попробовать вернуться
    if (useFallback) {
      setUseFallback(false);
    }
  }, [useFallback]);

  // Проверяем доступность сервиса 2ГИС сразу при маунте, чтобы не ждать ошибок
  useEffect(() => {
    let isMounted = true;
    
    // Логируем попытку подключения
    console.log('2ГИС: Проверка доступности сервиса тайлов...');
    
    provider.checkAvailability().then((available: boolean) => {
      if (!available && isMounted) {
        console.warn('2ГИС: Сервис недоступен, переключение на fallback');
        setUseFallback(true);
      } else if (available) {
        console.log('2ГИС: Сервис доступен');
        
        // Дополнительно тестируем высокий зум для диагностики
        if (finalMaxZoom >= 16) {
          provider.testTile(131072, 87381, 18).then((highZoomAvailable) => {
            if (!highZoomAvailable) {
              console.warn('2ГИС: Проблемы с высоким зумом (18), рекомендуется ограничить maxZoom до 17');
            } else {
              console.log('2ГИС: Высокий зум (18) доступен');
            }
          });
        }
      }
    });
    
    return () => {
      isMounted = false;
    };
  }, [provider, finalMaxZoom]);

  // Если активирован fallback – показываем альтернативный слой
  if (useFallback) {
    return (
      <TileLayer
        key="fallback-tile-layer"
        url={fallbackUrl}
        attribution="© OpenStreetMap contributors"
        maxNativeZoom={18}
        maxZoom={finalMaxZoom}
        minZoom={finalMinZoom}
        opacity={opacity}
        zIndex={zIndex}
        tileSize={256}
        crossOrigin={false}
      />
    );
  }

  // Базовый слой 2ГИС со слушателями ошибок
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
      tileSize={config.options.tileSize}
      eventHandlers={{
        tileerror: handleTileError,
        tileload: handleTileLoad,
        tileabort: handleTileError, // Обрабатываем отмененные запросы как ошибки
      }}
    />
  );
};

export default DgisTileLayer; 