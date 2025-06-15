import React, { useState, useCallback, useMemo } from 'react';
import { useMapConfig } from '../contexts/MapConfigContext';
import { useMapData } from '../hooks';
import MapCard from './map-card/MapCard';
import MapContentController from './map-content/MapContentController';
import { MapPageContentProps } from '../types/mapTypes';
import L from 'leaflet';

/**
 * Компонент содержимого страницы карты
 * Отвечает за управление данными и состоянием карты
 */
const MapPageContent: React.FC<MapPageContentProps> = ({
  extraControls,
  customLayers = [],
  plugins,
  onRegionClick,
  onMapReady,
  showControls,
  onDataLoaded,
  onError,
}) => {
  // Состояние для bounds
  const [imageBounds, setImageBounds] = useState<L.LatLngBoundsExpression>([
    [0, 0],
    [1000, 1000],
  ]);
  const [imageBoundsCalculated, setImageBoundsCalculated] = useState(false);

  // Хуки для данных и управления
  const {
    mapData,
    regions,
    loading,
    error,
    mapImageUrl,
    refreshMapData,
    isEmpty,
  } = useMapData({
    autoLoad: true,
    onDataLoaded,
    onError,
  });

  const { mapConfig } = useMapConfig();

  // Используем showControls из параметров, если передан, иначе из mapConfig
  const effectiveShowControls =
    showControls !== undefined ? showControls : mapConfig.showControls;

  // Заголовок карты
  const mapTitle = useMemo(() => {
    return mapConfig.lightMode
      ? 'Облегченная карта'
      : mapData?.name || 'Интерактивная карта ботанического сада';
  }, [mapConfig.lightMode, mapData?.name]);

  // Классы контейнера: в полноэкранном режиме добавляем отступ и корректируем высоту,
  // в облегченном режиме карта наследует размеры родителя без дополнительных расчётов
  const containerClasses = useMemo(
    () =>
      mapConfig.lightMode
        ? 'flex flex-col overflow-hidden'
        : 'h-screen-minus-navbar flex flex-col overflow-hidden',
    [mapConfig.lightMode]
  );

  // Настройки заголовка для полноэкранного режима
  const headerConfig = {
    hideHeader: true, // полностью скрыть заголовок - название будет в панели управления
    compactHeader: false, // true - компактный заголовок
    floatingHeader: false, // true - плавающий заголовок поверх карты (облачко)
  };

  // Обработчик обновления данных
  const handleRefresh = useCallback(() => {
    refreshMapData();
  }, [refreshMapData]);

  // Преобразование строковой ошибки в объект Error
  const errorObj = useMemo(() => {
    if (!error) return null;
    return new Error(error);
  }, [error]);

  // Не добавляем слой для рисования здесь, так как он уже добавляется в MapLayersManager
  const enhancedLayers = useMemo(() => {
    // Просто возвращаем пользовательские слои без добавления слоя рисования
    return [...customLayers];
  }, [customLayers]);

  return (
    // Контейнер карты. В полноэкранном режиме учитываем высоту навбара, в облегчённом —
    // используем гибкую вёрстку без фиксированной высоты.
    <div className={containerClasses}>
      <div className="flex-1 flex flex-col min-h-0 w-full">
        <MapCard
          title={mapTitle}
          loading={loading}
          fullscreen
          hideHeader={headerConfig.hideHeader}
          compactHeader={headerConfig.compactHeader}
          floatingHeader={headerConfig.floatingHeader}
        >
          <MapContentController
            loading={loading}
            error={errorObj}
            mapImageUrl={mapImageUrl}
            regions={regions}
            imageBounds={imageBounds}
            imageBoundsCalculated={imageBoundsCalculated}
            setImageBounds={setImageBounds}
            setImageBoundsCalculated={setImageBoundsCalculated}
            refreshMapData={handleRefresh}
            showControls={effectiveShowControls}
            extraControls={extraControls}
            customLayers={enhancedLayers}
            onRegionClick={onRegionClick}
            onMapReady={onMapReady}
            plugins={plugins}
            isEmpty={isEmpty}
            mapTitle={mapTitle}
          />
        </MapCard>
      </div>
    </div>
  );
};

export default MapPageContent;

