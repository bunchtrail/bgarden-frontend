import L, { Icon } from 'leaflet';
import { getResourceUrl } from '../../../../../config/apiConfig'; 
import 'leaflet/dist/leaflet.css';
import React, { useState, useEffect } from 'react';
import {
  ImageOverlay,
  MapContainer as LeafletMapContainer,
  Marker,
  Popup,
  Polygon,
  useMapEvents,
  ZoomControl,
} from 'react-leaflet';
import { MapArea, MapPlant } from '../types';

// Функция для логирования с контролем дебага
const ENABLE_DEBUG_LOGS = true;

const debugLog = (...args: any[]) => {
  if (ENABLE_DEBUG_LOGS) {
    console.log(...args);
  }
};

// Стили для полигонов
const polygonStyle = {
  weight: 2,
  opacity: 0.8,
  dashArray: '3',
};

// Функция для проверки правильности цветов
const validateColor = (color: any): string => {
  // Проверяем, является ли цвет валидным
  if (typeof color === 'string' && (color.startsWith('#') || color.startsWith('rgb'))) {
    return color;
  }
  // Возвращаем цвет по умолчанию
  return color === 'stroke' ? '#FF5733' : '#FFD700';
};

// Определяем интерфейс для растения на карте
export interface PlantMarker {
  id: string;
  name: string;
  position: [number, number];
  description?: string;
}

// Создаем интерфейс для выбранной области
export interface SelectedArea {
  id: string | number;
  name: string;
  description?: string;
  regionId?: number; // ID соответствующего региона
  latitude?: number;
  longitude?: number;
}

// Определяем интерфейс свойств компонента SimpleMap
export interface SimpleMapProps {
  imageUrl: string | null;
  readOnly?: boolean;
  onPositionSelect?: (position: [number, number]) => void;
  onAreaSelect?: (area: SelectedArea | null) => void;
  plants?: PlantMarker[];
  areas?: MapArea[];
  showOtherPlants?: boolean;
  currentPlantId?: string;
  onManualPositionSet?: () => void; // Добавляем обработчик для установки флага
}

// Компонент для обработки событий карты
const MapEvents: React.FC<{
  readOnly: boolean;
  onPositionSelect?: (position: [number, number]) => void;
  onAreaSelect?: (area: SelectedArea | null) => void;
  onManualPositionSet?: () => void;
}> = ({ readOnly, onPositionSelect, onAreaSelect, onManualPositionSet }) => {
  useMapEvents({
    click: (e) => {
      if (!readOnly) {
        // Проверяем, был ли клик на области
        // Это исправление предотвращает повторную обработку клика на область
        if (!(e as any)._areaClick) {
          // Устанавливаем новую позицию маркера
          const position: [number, number] = [e.latlng.lat, e.latlng.lng];
          
          if (onPositionSelect) {
            onPositionSelect(position);
          }
          
          // Вызываем обработчик установки флага ручной позиции
          if (onManualPositionSet) {
            onManualPositionSet();
          }
          
          // ВАЖНОЕ ИЗМЕНЕНИЕ: Не сбрасываем выбранный регион при клике на пустую область
          // Комментируем следующие строки, чтобы сохранить выбранный регион
          // if (onAreaSelect) {
          //   // Клик был не на область - сбрасываем информацию о регионе
          //   onAreaSelect(null);
          // }
        }
      }
    },
  });
  return null;
};

// Простая карта без зависимости от MapContext
const SimpleMap: React.FC<SimpleMapProps> = ({
  imageUrl,
  readOnly = false,
  onPositionSelect,
  onAreaSelect,
  plants = [],
  areas = [],
  showOtherPlants = false,
  currentPlantId,
  onManualPositionSet,
}) => {
  const [selectedPosition, setSelectedPosition] = useState<
    [number, number] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Обрабатываем URL изображения через getResourceUrl
  const processedImageUrl = imageUrl 
    ? (imageUrl.startsWith('http') ? imageUrl : getResourceUrl(imageUrl))
    : null;
  
  // Фильтруем растения - исключаем "текущее" растение, если есть выбранная позиция
  const filteredPlants = showOtherPlants 
    ? plants.filter(plant => plant.id !== 'current') 
    : plants.filter(plant => (plant.id === currentPlantId) && plant.id !== 'current');

  // Создаем кастомную иконку для существующих растений
  const plantIcon = new Icon({
    iconUrl:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyLDJhMTAsMTAgMCAwLDAgMCwyMGExMCwxMCAwIDAsMCAwLC0yMHoiIGZpbGw9IiMwMDgwMDAiIC8+PC9zdmc+',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });

  // Единая иконка для выбранной позиции - используем один стиль для всех случаев
  const selectedPositionIcon = new L.Icon({
    iconUrl:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTIiIGZpbGw9IiMwNTk2NjkiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIyIiAvPjwvc3ZnPg==',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  // Размеры карты
  const imageDimensions = { width: 1000, height: 1000 };
  const bounds = L.latLngBounds(
    [0, 0],
    [imageDimensions.height, imageDimensions.width]
  );

  // Обработчик ошибки загрузки изображения
  const handleImageError = () => {
    setError('Ошибка загрузки изображения карты');
    console.error('Ошибка загрузки изображения карты:', processedImageUrl);
  };

  // Обработчик загрузки изображения
  const handleImageLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  // Обновим обработчик клика на область в SimpleMap компоненте
  const handleAreaClick = (area: MapArea, e: any) => {
    // Важно: пометить событие, что клик произошел на области для избежания повторной обработки
    e.originalEvent._areaClick = true;
    e._areaClick = true;
    
    // Получаем ID области для использования в качестве ID региона
    let regionId = undefined;
    
    debugLog('Данные области:', area);
    
    // Проверяем наличие id области
    if (area.id !== undefined) {
      if (typeof area.id === 'string') {
        if (area.id.startsWith('region-')) {
          regionId = parseInt(area.id.replace('region-', ''));
          debugLog(`Извлечен ID региона из ${area.id}: ${regionId}`);
        } else if (!isNaN(parseInt(area.id))) {
          // Если id - строка, но может быть преобразована в число
          regionId = parseInt(area.id);
          debugLog(`Используем строковый ID области как ID региона: ${regionId}`);
        }
      } else if (typeof area.id === 'number') {
        // Если id области уже является числом, используем его напрямую
        regionId = area.id;
        debugLog(`Используем числовой ID области как ID региона: ${regionId}`);
      }
    }
    
    // Если regionId все еще не определен, пробуем использовать числовое представление id
    if (regionId === undefined && area.id !== undefined) {
      // Последняя попытка - преобразуем любой тип к строке и пробуем получить число
      const idStr = String(area.id);
      if (!isNaN(Number(idStr))) {
        regionId = Number(idStr);
        debugLog(`Использован ID области после преобразования: ${regionId}`);
      }
    }
    
    // Проверяем, есть ли у области свои координаты
    let areaPosition: [number, number] | null = null;
    const hasExplicitCoordinates = area.latitude !== undefined && 
                                 area.longitude !== undefined &&
                                 area.latitude !== null && 
                                 area.longitude !== null;
    
    if (hasExplicitCoordinates) {
      // Используем координаты из области, если они доступны и не null
      areaPosition = [
        parseFloat(area.latitude!.toString()), 
        parseFloat(area.longitude!.toString())
      ];
      debugLog(`Используем координаты из области: [${areaPosition[0]}, ${areaPosition[1]}]`);
    } else {
      debugLog('У области нет явных координат, используем координаты клика');
    }
    
    // Определяем позицию: либо координаты из области, либо координаты клика
    const position: [number, number] = areaPosition || [e.latlng.lat, e.latlng.lng];
    
    // Округляем координаты для более предсказуемого поведения
    const roundedLat = parseFloat(position[0].toFixed(6));
    const roundedLng = parseFloat(position[1].toFixed(6));
    const roundedPosition: [number, number] = [roundedLat, roundedLng];
    
    setSelectedPosition(roundedPosition);
    
    // Вызываем обработчик установки флага ручной позиции
    if (onManualPositionSet) {
      onManualPositionSet();
    }
    
    debugLog(`Позиция установлена при клике на область: [${roundedLat}, ${roundedLng}]`);
    
    // Сначала устанавливаем область, чтобы гарантировать правильный выбор региона
    if (onAreaSelect && regionId !== undefined) {
      const selectedArea = {
        id: area.id,
        name: area.name || `Регион ${regionId}`,
        description: area.description,
        regionId: Number(regionId), // Гарантируем числовой тип
        latitude: roundedLat,
        longitude: roundedLng
      };
      
      debugLog('Выбрана область с данными:', selectedArea);
      
      // УДАЛЯЕМ ПРЯМУЮ МАНИПУЛЯЦИЮ DOM И ПОЛАГАЕМСЯ ТОЛЬКО НА REACT-ОБРАБОТЧИК
      // Вызываем обработчик, который должен обновить состояние React
      onAreaSelect(selectedArea);
    } else {
      debugLog('Не удалось определить regionId или onAreaSelect не предоставлен');
      debugLog('area.id:', area.id, 'тип:', typeof area.id);
      debugLog('regionId:', regionId, 'тип:', typeof regionId);
    }
    
    // Теперь устанавливаем позицию через onPositionSelect
    if (onPositionSelect) {
      onPositionSelect(roundedPosition);
    }
  };

  // Предзагрузка изображения
  useEffect(() => {
    if (processedImageUrl) {
      setIsLoading(true);
      // Предзагружаем изображение для проверки доступности
      const img = new Image();
      img.onload = handleImageLoad;
      img.onerror = handleImageError;
      img.src = processedImageUrl;
    }
  }, [processedImageUrl]);

  // Обработчик выбора позиции
  const handlePositionSelection = (position: [number, number]) => {
    setSelectedPosition(position);
    if (onPositionSelect) {
      onPositionSelect(position);
    }
  };

  return (
    <div className="relative">
      {!readOnly && (
        <div className="absolute top-2 left-2 z-[400] bg-white/90 px-3 py-2 rounded-md shadow-md text-xs max-w-xs pointer-events-none">
          <p className="font-medium">Кликните в любом месте карты (включая области) для выбора позиции растения</p>
        </div>
      )}
      
      <div className='w-full h-full cursor-crosshair'>
        {isLoading ? (
          <div className='w-full h-full flex items-center justify-center bg-gray-100'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-700'></div>
            <span className='ml-2'>Загрузка карты...</span>
          </div>
        ) : error ? (
          <div className='w-full h-full flex items-center justify-center bg-gray-100 border border-dashed border-red-300'>
            <div className="text-center">
              <p className='text-red-500'>{error}</p>
              <p className='text-gray-500 text-sm mt-2'>Проверьте наличие файла карты или соединение с сервером</p>
            </div>
          </div>
        ) : processedImageUrl ? (
          <div className="w-full h-full" style={{ minHeight: '384px' }}>
            <LeafletMapContainer
              center={[imageDimensions.height / 2, imageDimensions.width / 2]}
              zoom={0}
              minZoom={-2}
              maxZoom={2}
              crs={L.CRS.Simple}
              style={{ height: '100%', width: '100%', minHeight: '384px' }}
              zoomControl={false}
              attributionControl={false}
            >
              <ZoomControl position='bottomright' />
              <ImageOverlay 
                bounds={bounds} 
                url={processedImageUrl}
                attribution="Ботанический сад" 
              />

              <MapEvents 
                readOnly={readOnly} 
                onPositionSelect={handlePositionSelection}
                onAreaSelect={onAreaSelect}
                onManualPositionSet={onManualPositionSet}
              />

              {/* Отрисовка областей (полигонов) */}
              {areas.length > 0 && areas.map((area) => {
                // Проверяем и нормализуем цвета
                const strokeColor = validateColor(area.strokeColor || '#FF5733');
                const fillColor = validateColor(area.fillColor || '#FFD700');
                const fillOpacity = typeof area.fillOpacity === 'number' ? area.fillOpacity : 0.3;
                
                return (
                  <Polygon
                    key={area.id}
                    positions={area.points}
                    pathOptions={{
                      color: strokeColor,
                      fillColor: fillColor,
                      fillOpacity: fillOpacity,
                      bubblingMouseEvents: false,
                      ...polygonStyle
                    }}
                    eventHandlers={{
                      click: (e) => handleAreaClick(area, e),
                      mouseover: (e) => {
                        const layer = e.target;
                        layer.setStyle({
                          weight: 3,
                          opacity: 1,
                          fillOpacity: fillOpacity + 0.2
                        });
                      },
                      mouseout: (e) => {
                        const layer = e.target;
                        layer.setStyle({
                          weight: polygonStyle.weight,
                          opacity: polygonStyle.opacity,
                          fillOpacity: fillOpacity
                        });
                      }
                    }}
                  />
                );
              })}

              {/* Маркеры растений (кроме текущего) */}
              {filteredPlants.length > 0 && filteredPlants.map((plant) => (
                <Marker key={plant.id} position={plant.position} icon={plantIcon}>
                  <Popup>
                    <div>
                      <h3 className='font-bold'>{plant.name}</h3>
                      {plant.description && <p>{plant.description}</p>}
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Маркер выбранной позиции - основной маркер, который показывает текущую выбранную позицию */}
              {selectedPosition && (
                <Marker 
                  position={selectedPosition} 
                  icon={selectedPositionIcon}
                />
              )}
            </LeafletMapContainer>
          </div>
        ) : (
          <div className='w-full h-full flex items-center justify-center bg-gray-100 border border-dashed border-gray-300'>
            <p className='text-gray-500'>Карта не загружена</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleMap; 