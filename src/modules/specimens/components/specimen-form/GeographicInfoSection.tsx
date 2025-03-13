import L, { Icon } from 'leaflet';
import { getResourceUrl } from '../../../../config/apiConfig'; 
import 'leaflet/dist/leaflet.css';
import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import {
  ImageOverlay,
  MapContainer as LeafletMapContainer,
  Marker,
  Popup,
  Polygon,
  useMapEvents,
  ZoomControl,
} from 'react-leaflet';
import { gridContainerClasses } from '../styles';
import { NumberField, SelectField, TextField } from './FormFields';
import { GeographicInfoSectionProps, MapArea, MapPlant } from './types';
import { headingClasses } from '../styles';
import { NoteIcon } from '../icons';

// В начале файла добавим константу для контроля логирования
const ENABLE_DEBUG_LOGS = false;

// Функция для логирования с контролем дебага
const debugLog = (...args: any[]) => {
  if (ENABLE_DEBUG_LOGS) {
    console.log(...args);
  }
};

// Добавляем стили для полигонов
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
interface PlantMarker {
  id: string;
  name: string;
  position: [number, number];
  description?: string;
}

// Создаем интерфейс для выбранной области
interface SelectedArea {
  id: string;
  name: string;
  description?: string;
  regionId?: number; // ID соответствующего региона
}

// Определяем интерфейс свойств компонента SimpleMap
interface SimpleMapProps {
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

  // Обработчик событий карты
  const MapEvents = () => {
    useMapEvents({
      click: (e) => {
        if (!readOnly) {
          // Проверяем, был ли клик на области
          // Это исправление предотвращает повторную обработку клика на область
          if (!(e as any)._areaClick) {
            // Устанавливаем новую позицию маркера
            const position: [number, number] = [e.latlng.lat, e.latlng.lng];
            setSelectedPosition(position);
            if (onPositionSelect) {
              onPositionSelect(position);
            }
            
            // Вызываем обработчик установки флага ручной позиции
            if (onManualPositionSet) {
              onManualPositionSet();
            }
            
            // Проверяем, не был ли клик на область
            if (onAreaSelect) {
              // Клик был не на область - сбрасываем информацию о регионе
              onAreaSelect(null);
            }
          }
        }
      },
    });
    return null;
  };

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
    // Помечаем событие, что клик произошел на области
    e.originalEvent._areaClick = true;
    e._areaClick = true;
    
    // Извлекаем ID региона из ID области (формат: "region-{regionId}")
    let regionId = undefined;
    
    // Проверяем формат id области
    if (area.id && typeof area.id === 'string') {
      if (area.id.startsWith('region-')) {
        regionId = parseInt(area.id.replace('region-', ''));
        debugLog(`Извлечен ID региона из ${area.id}: ${regionId}`);
      } else if (!isNaN(parseInt(area.id))) {
        // Если id просто число, пробуем использовать его
        regionId = parseInt(area.id);
        debugLog(`Используем ID области как ID региона: ${regionId}`);
      }
    }
    
    // Устанавливаем позицию маркера на месте клика
    const position: [number, number] = [e.latlng.lat, e.latlng.lng];
    
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
    
    // Устанавливаем позицию через onPositionSelect
    if (onPositionSelect) {
      onPositionSelect(roundedPosition);
    }
    
    // Передаем выбранную область через коллбэк вместе с ID региона
    if (onAreaSelect && regionId !== undefined) {
      const selectedArea = {
        id: area.id,
        name: area.name || `Регион ${regionId}`,
        description: area.description,
        regionId: Number(regionId) // Гарантируем числовой тип
      };
      
      debugLog('Выбрана область с данными:', selectedArea);
      onAreaSelect(selectedArea);
    }
    
    // Предотвращаем всплытие события, чтобы избежать двойной обработки
    e.originalEvent.stopPropagation();
    L.DomEvent.stop(e); // Более надежный способ остановки события в Leaflet
  };

  React.useEffect(() => {
    if (processedImageUrl) {
      setIsLoading(true);
      // Предзагружаем изображение для проверки доступности
      const img = new Image();
      img.onload = handleImageLoad;
      img.onerror = handleImageError;
      img.src = processedImageUrl;
    }
  }, [processedImageUrl]);

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

              <MapEvents />

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

// Обновляем функцию преобразования данных о растениях
const mapPlantToPlantMarker = (plant: MapPlant): PlantMarker => ({
  id: plant.id || `plant-${Math.random().toString(36).substr(2, 9)}`,
  name: plant.name || 'Неизвестное растение',
  position: plant.position || [0, 0],
  description: plant.description || '',
});

// Обновляем пропсы GeographicInfoSection, чтобы принимать данные растений и областей извне
export const GeographicInfoSection: React.FC<GeographicInfoSectionProps> = ({
  formData,
  errors,
  touchedFields,
  formSubmitted,
  markFieldAsTouched,
  validateField,
  regionOptions,
  handleChange,
  handleSelectChange,
  handleNumberChange,
  mapImageUrl,
  onPositionSelected,
  mapAreas = [],
  mapPlants = [],
  onAreaSelected,
}) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showOtherPlants, setShowOtherPlants] = useState(false);
  const [selectedArea, setSelectedArea] = useState<SelectedArea | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [manualPositionSet, setManualPositionSet] = useState(false);
  // Добавляем ref для надежного хранения "реальных" координат
  const realPositionRef = React.useRef<[number, number] | null>(null);
  // Добавляем ref для предотвращения race conditions
  const positionUpdateLockRef = React.useRef<boolean>(false);

  // Исключаем лишние обновления с помощью useCallback для обработчиков
  const handleFieldTouch = useCallback((fieldName: string) => {
    markFieldAsTouched(fieldName);
  }, [markFieldAsTouched]);

  const handleFieldValidation = useCallback((fieldName: string, value: any) => {
    validateField(fieldName, value);
  }, [validateField]);

  // Создаем мемоизированную функцию для преобразования растений - уменьшает количество ненужных обработок
  const mapPlantToPlantMarker = useCallback((plant: MapPlant): PlantMarker => {
    return {
      id: plant.id || `plant-${Math.random().toString(36).substr(2, 9)}`,
      name: plant.name || 'Неизвестное растение',
      position: plant.position || [0, 0],
      description: plant.description || '',
    };
  }, []);

  // Мемоизируем список растений для предотвращения повторных пересчетов
  const allPlants: PlantMarker[] = useMemo(() => {
    return mapPlants.map(mapPlantToPlantMarker);
  }, [mapPlants, mapPlantToPlantMarker]);

  // Объединяем все растения
  const combinedPlants = useMemo(() => [...allPlants], [allPlants]);

  // Оптимизируем вызов родительских обработчиков для предотвращения множественных перерисовок
  const handlePositionSelectedStable = useCallback(
    (lat: number, lng: number) => {
      // Проверяем, отличаются ли координаты от текущих в форме и доступен ли обработчик
      if (
        formData.latitude === lat &&
        formData.longitude === lng
      ) {
        // Если координаты такие же, не вызываем обработчик
        return;
      }
      
      // Проверяем наличие обработчика перед вызовом
      if (onPositionSelected) {
        onPositionSelected(lat, lng);
      }
    },
    [formData.latitude, formData.longitude, onPositionSelected]
  );

  // Также оптимизируем обработчик выбора области
  const handleAreaSelectedStable = useCallback(
    (areaId: string, regionId: number) => {
      // Проверяем, нужно ли обновлять
      if (
        formData.regionId === regionId
      ) {
        // Если регион уже выбран, пропускаем обновление
        return;
      }
      
      // Проверяем наличие обработчика перед вызовом
      if (onAreaSelected) {
        onAreaSelected(areaId, regionId);
      }
    },
    [formData.regionId, onAreaSelected]
  );

  // Инициализация selectedArea на основе текущего regionId в formData - оптимизированная версия
  useEffect(() => {
    if (formData.regionId && !selectedArea) {
      // Находим соответствующий регион в опциях
      const currentRegion = regionOptions.find(
        region => Number(region.id) === Number(formData.regionId)
      );
      
      if (currentRegion) {
        // Находим соответствующую область на карте
        const matchingArea = mapAreas.find(
          area => area.id === `region-${currentRegion.id}`
        );
        
        if (matchingArea) {
          // Устанавливаем выбранную область
          setSelectedArea({
            id: matchingArea.id,
            name: currentRegion.name,
            description: matchingArea.description,
            regionId: currentRegion.id
          });
        }
      }
    }
  }, [formData.regionId, regionOptions, mapAreas, selectedArea]);

  // Инициализируем и обрабатываем изменения regionId в одном эффекте - оптимизированная версия
  useEffect(() => {
    if (formData.regionId) {
      // Находим соответствующий регион
      const currentRegion = regionOptions.find(
        region => Number(region.id) === Number(formData.regionId)
      );
      
      if (currentRegion) {
        // Находим область на карте
        const matchingArea = mapAreas.find(
          area => area.id === `region-${currentRegion.id}`
        );
        
        if (matchingArea && (!selectedArea || selectedArea.regionId !== currentRegion.id)) {
          // Устанавливаем выбранную область
          setSelectedArea({
            id: matchingArea.id,
            name: currentRegion.name,
            description: matchingArea.description,
            regionId: currentRegion.id
          });
        }
      }
    }
  }, [formData.regionId, regionOptions, mapAreas, selectedArea]);

  // Сохраняем ручные координаты в ref для последующего использования
  useEffect(() => {
    if (manualPositionSet && selectedPosition) {
      realPositionRef.current = selectedPosition;
    }
  }, [selectedPosition, manualPositionSet]);

  // Обработчик выбора позиции на карте
  const handlePositionSelect = useCallback(
    (position: [number, number]) => {
      // Если система в процессе обновления позиции, блокируем обработку
      if (positionUpdateLockRef.current) {
        console.log("Обновление позиции заблокировано: уже в процессе");
        return;
      }

      // Блокируем другие обновления позиции
      positionUpdateLockRef.current = true;
      
      try {
        // Округляем координаты до 6 десятичных знаков для более предсказуемого поведения
        const roundedLat = parseFloat(position[0].toFixed(6));
        const roundedLng = parseFloat(position[1].toFixed(6));
        const roundedPosition: [number, number] = [roundedLat, roundedLng];
        
        // Сохраняем "реальные" координаты в ref
        realPositionRef.current = roundedPosition;
        
        // Устанавливаем точные координаты в state
        setSelectedPosition(roundedPosition);
        
        // Отмечаем, что позиция была установлена вручную
        setManualPositionSet(true);
        
        console.log(`Позиция обновлена: [${roundedLat}, ${roundedLng}]`);
        
        // Используем стабильный обработчик
        handlePositionSelectedStable(roundedLat, roundedLng);
      } finally {
        // Снимаем блокировку через небольшую задержку
        setTimeout(() => {
          positionUpdateLockRef.current = false;
        }, 300);
      }
    },
    [handlePositionSelectedStable]
  );

  // Обработчик выбора области на карте
  const handleAreaSelect = useCallback((area: SelectedArea | null) => {
    // Если блокировка активна, пропускаем обработку полностью
    if (positionUpdateLockRef.current) {
      console.log("Пропускаем обработку выбора области: блокировка активна");
      return;
    }
    
    // Блокируем обновления
    positionUpdateLockRef.current = true;
    
    try {
      // Обновляем состояние выбранной области
      setSelectedArea(area);
      
      if (area && area.regionId) {
        // Находим соответствующий регион в опциях
        const selectedRegion = regionOptions.find(
          region => Number(region.id) === Number(area.regionId)
        );
        
        if (selectedRegion) {
          // Передаем выбранную область в родительский компонент с использованием стабильного обработчика
          handleAreaSelectedStable(area.id, Number(area.regionId));

          // Обновляем SelectField с помощью синтетического события
          const syntheticEvent = {
            target: {
              name: 'regionId',
              value: Number(selectedRegion.id),
              type: 'number'
            }
          } as unknown as React.ChangeEvent<HTMLSelectElement>;
          
          // Вызываем обработчик изменения select
          handleSelectChange(syntheticEvent);

          // Обновляем regionName в форме
          const regionNameEvent = {
            target: {
              name: 'regionName',
              value: selectedRegion.name
            }
          } as React.ChangeEvent<HTMLInputElement>;
          
          handleChange(regionNameEvent);
          
          // Отмечаем поле как затронутое и валидируем
          handleFieldTouch('regionId');
          handleFieldValidation('regionId', selectedRegion.id);
          
          // Сохраняем текущие координаты, если они были установлены вручную
          if (manualPositionSet && realPositionRef.current) {
            // Подождем, пока завершатся все обновления региона
            setTimeout(() => {
              if (realPositionRef.current) {
                handlePositionSelectedStable(realPositionRef.current[0], realPositionRef.current[1]);
              }
            }, 100);
          }
        } else {
          console.error(`Регион с ID ${area.regionId} не найден в списке доступных регионов`);
        }
      } else if (area === null) {
        // Используем стабильный обработчик - передаем '' вместо null для regionId
        handleAreaSelectedStable('', 0);
        
        // Обновляем также состояние формы напрямую для избежания null значений
        const syntheticEvent = {
          target: {
            name: 'regionId',
            value: '', // Пустая строка вместо null
            type: 'select'
          }
        } as unknown as React.ChangeEvent<HTMLSelectElement>;
        
        handleSelectChange(syntheticEvent);
      }
    } finally {
      // Снимаем блокировку
      setTimeout(() => {
        positionUpdateLockRef.current = false;
      }, 300);
    }
  }, [
    regionOptions,
    handleSelectChange,
    handleChange,
    handleFieldTouch,
    handleFieldValidation,
    manualPositionSet,
    handleAreaSelectedStable,
    handlePositionSelectedStable
  ]);

  // Восстановление координат после выбора региона - без избыточных сообщений в консоли
  useEffect(() => {
    if (manualPositionSet && realPositionRef.current && selectedArea && formData.regionId) {
      // Устанавливаем таймер для восстановления координат после изменения региона
      const timeoutId = setTimeout(() => {
        if (realPositionRef.current) {
          handlePositionSelectedStable(realPositionRef.current[0], realPositionRef.current[1]);
        }
      }, 150);
      
      return () => clearTimeout(timeoutId);
    }
  }, [formData.regionId, selectedArea, manualPositionSet, handlePositionSelectedStable]);

  // Проверяем форматы ID регионов при рендеринге компонента
  useEffect(() => {
    // Оставляем только один вывод при инициализации компонента
    if (process.env.NODE_ENV === 'development') {
      console.log("Географический компонент инициализирован");
    }
  }, []);

  return (
    <div className='mb-8 bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md'>
      <h3 className={`${headingClasses.heading} flex items-center text-xl mb-6 pb-3 border-b border-gray-200`}>
        <div className="p-2 rounded-lg bg-green-50 mr-3">
          <NoteIcon className='w-6 h-6 text-green-600' />
        </div>
        <span className="text-gray-800 font-semibold">Географическая информация</span>
      </h3>

      <div className='space-y-5'>
        <div className='bg-gradient-to-r from-green-50 to-green-50/50 p-4 rounded-lg border border-green-100 mb-4 backdrop-blur-sm'>
          <div className='flex items-center text-green-800 text-sm mb-2'>
            <span className='flex items-center justify-center w-6 h-6 rounded-full bg-green-100 mr-3'>ⓘ</span>
            <span className="font-medium">Информация о происхождении и географическом положении образца</span>
          </div>
        </div>
        
        {/* Переключатель для отображения других растений */}
        <div className="flex items-center mb-4 p-3 bg-white rounded-lg border border-gray-100 hover:border-green-200 transition-all duration-200">
          <input
            type="checkbox"
            id="showOtherPlants"
            checked={showOtherPlants}
            onChange={() => setShowOtherPlants(!showOtherPlants)}
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 transition-colors duration-200"
          />
          <label htmlFor="showOtherPlants" className="ml-3 text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer select-none">
            Показать другие растения на карте
          </label>
        </div>

        {/* Компонент карты - в карточке */}
        <div className='p-4 bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:border-green-200 focus-within:border-green-300 focus-within:ring-1 focus-within:ring-green-200'>
          <h4 className='font-medium text-gray-700 mb-3 flex items-center'>
            <span className="mr-2">📍</span>
            Расположение на карте
          </h4>
          <div className='h-96 border rounded-xl overflow-hidden shadow-inner bg-gray-50'>
            <SimpleMap
              imageUrl={mapImageUrl || null}
              readOnly={false}
              onPositionSelect={handlePositionSelect}
              onAreaSelect={handleAreaSelect}
              plants={combinedPlants}
              areas={mapAreas}
              showOtherPlants={showOtherPlants}
              currentPlantId="current"
              onManualPositionSet={() => setManualPositionSet(true)}
            />
          </div>
        </div>

        {/* Информация о выбранном регионе */}
        {selectedArea && (
          <div className='p-4 bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-md'>
            <h4 className='font-medium text-gray-700 mb-3 flex items-center'>
              <span className="mr-2">🎯</span>
              Выбранный регион
            </h4>
            <div className="flex justify-between items-start bg-gradient-to-r from-green-50/50 to-transparent p-4 rounded-lg">
              <div>
                <h3 className='font-bold text-lg text-green-800 mb-2'>{selectedArea.name}</h3>
                {selectedArea.description && (
                  <p className='text-gray-600 text-sm'>{selectedArea.description}</p>
                )}
              </div>
              <span className='text-xs font-medium text-white bg-green-600 px-3 py-1.5 rounded-full shadow-sm'>
                Регион №{selectedArea.regionId}
              </span>
            </div>
          </div>
        )}

        {/* Координаты */}
        <div className='p-4 bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:border-green-200'>
          <h4 className='font-medium text-gray-700 mb-3 flex items-center'>
            <span className="mr-2">📊</span>
            Координаты
          </h4>
          <div className={`${gridContainerClasses.responsive} gap-6`}>
            <NumberField
              label='Широта'
              name='latitude'
              formData={formData}
              errors={errors}
              touchedFields={touchedFields}
              formSubmitted={formSubmitted}
              markFieldAsTouched={handleFieldTouch}
              handleNumberChange={handleNumberChange}
            />
            <NumberField
              label='Долгота'
              name='longitude'
              formData={formData}
              errors={errors}
              touchedFields={touchedFields}
              formSubmitted={formSubmitted}
              markFieldAsTouched={handleFieldTouch}
              handleNumberChange={handleNumberChange}
            />
          </div>
        </div>

        {/* Место происхождения */}
        <div className='p-4 bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:border-green-200'>
          <h4 className='font-medium text-gray-700 mb-3 flex items-center'>
            <span className="mr-2">🌍</span>
            Место происхождения
          </h4>
          <div className="space-y-4">
            <SelectField
              label='Регион происхождения'
              name='regionId'
              formData={{
                ...formData,
                // Преобразуем null в пустую строку для избежания ошибок React
                // Используем явное приведение типа для совместимости с интерфейсом
                regionId: formData.regionId === null ? '' : formData.regionId
              } as any}
              options={regionOptions}
              errors={errors}
              touchedFields={touchedFields}
              formSubmitted={formSubmitted}
              markFieldAsTouched={handleFieldTouch}
              handleSelectChange={handleSelectChange}
              required
            />

            <TextField
              label='Страна происхождения'
              name='country'
              formData={formData}
              errors={errors}
              touchedFields={touchedFields}
              formSubmitted={formSubmitted}
              markFieldAsTouched={handleFieldTouch}
              handleChange={handleChange}
            />
          </div>
        </div>

        {/* Дополнительные поля */}
        <div className='mt-6 border-t border-gray-100 pt-6'>
          <button
            type='button'
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className='flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200'
          >
            <svg
              className={`w-5 h-5 mr-2 transition-transform duration-200 ${
                showAdvancedOptions ? 'rotate-90' : ''
              }`}
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                clipRule='evenodd'
              />
            </svg>
            {showAdvancedOptions
              ? 'Скрыть дополнительные поля'
              : 'Показать дополнительные поля'}
          </button>

          {showAdvancedOptions && (
            <div className='space-y-4 animate-fadeIn mt-4'>
              <div className='p-4 bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:border-green-200'>
                <TextField
                  label='Естественный ареал'
                  name='naturalRange'
                  multiline
                  rows={3}
                  formData={formData}
                  errors={errors}
                  touchedFields={touchedFields}
                  formSubmitted={formSubmitted}
                  markFieldAsTouched={handleFieldTouch}
                  handleChange={handleChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
