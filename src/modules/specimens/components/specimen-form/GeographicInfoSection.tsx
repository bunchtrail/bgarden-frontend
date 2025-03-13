import L, { Icon } from 'leaflet';
import { getResourceUrl } from '../../../../config/apiConfig'; 
import 'leaflet/dist/leaflet.css';
import React, { useCallback, useState } from 'react';
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

// Добавляем стили для полигонов
const polygonStyle = {
  cursor: 'crosshair'
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
  
  // Фильтруем другие растения, если showOtherPlants = true
  const filteredPlants = showOtherPlants 
    ? plants 
    : plants.filter(plant => plant.id === currentPlantId || plant.id === 'current');

  // Создаем кастомную иконку для маркера
  const plantIcon = new Icon({
    iconUrl:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyLDJhMTAsMTAgMCAwLDAgMCwyMGExMCwxMCAwIDAsMCAwLC0yMHoiIGZpbGw9IiMwMDgwMDAiIC8+PC9zdmc+',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });

  // Иконка для выбранной позиции
  const selectedPositionIcon = new L.Icon({
    iconUrl:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTIiIGZpbGw9IiNmZjVhODciIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIzIiAvPjwvc3ZnPg==',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  // Обработчик событий карты
  const MapEvents = () => {
    useMapEvents({
      click: (e) => {
        if (!readOnly) {
          // Устанавливаем новую позицию маркера
          const position: [number, number] = [e.latlng.lat, e.latlng.lng];
          setSelectedPosition(position);
          if (onPositionSelect) {
            onPositionSelect(position);
          }
          
          // Проверяем, не был ли клик на область
          // isAreaClick устанавливается в handleAreaClick
          if (onAreaSelect && !(e as any).isAreaClick) {
            // Клик был не на область - сбрасываем информацию о регионе
            onAreaSelect(null);
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

  // Обработчик клика на область
  const handleAreaClick = (area: MapArea, e: any) => {
    // Помечаем событие, что клик произошел на области
    e.isAreaClick = true;
    
    // Передаем выбранную область через коллбэк
    if (onAreaSelect) {
      onAreaSelect({
        id: area.id,
        name: area.name,
        description: area.description
      });
    }
    
    // Устанавливаем позицию маркера непосредственно здесь
    const position: [number, number] = [e.latlng.lat, e.latlng.lng];
    setSelectedPosition(position);
    if (onPositionSelect) {
      onPositionSelect(position);
    }
    
    // Предотвращаем двойную обработку события
    L.DomEvent.stopPropagation(e);
    e.originalEvent.preventDefault();
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
              {areas.length > 0 && areas.map((area) => (
                <Polygon
                  key={area.id}
                  positions={area.points}
                  pathOptions={{
                    color: area.strokeColor || '#FF5733',
                    fillColor: area.fillColor || '#FFD700',
                    fillOpacity: area.fillOpacity || 0.3,
                    bubblingMouseEvents: true, // Позволяет событиям "пузыриться" наверх к карте
                    ...polygonStyle
                  }}
                  eventHandlers={{
                    click: (e) => handleAreaClick(area, e)
                  }}
                />
              ))}

              {/* Маркеры растений */}
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

              {/* Маркер выбранной позиции */}
              {selectedPosition && (
                <Marker 
                  position={selectedPosition} 
                  icon={selectedPositionIcon}
                  eventHandlers={{
                    add: (e) => {
                      // Анимация появления маркера
                      const marker = e.target;
                      const domIcon = marker.getElement();
                      if (domIcon) {
                        domIcon.style.transition = 'transform 0.3s ease-out';
                        domIcon.style.transform = 'scale(0)';
                        setTimeout(() => {
                          domIcon.style.transform = 'scale(1)';
                        }, 10);
                      }
                    }
                  }}
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
  mapAreas = [], // Области берутся из пропсов, а не из контекста
  mapPlants = [], // Растения берутся из пропсов, а не из контекста
}) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showOtherPlants, setShowOtherPlants] = useState(false);
  const [selectedArea, setSelectedArea] = useState<SelectedArea | null>(null);

  // Преобразуем данные о растениях в формат PlantMarker
  const allPlants: PlantMarker[] = mapPlants.map(mapPlantToPlantMarker);

  // Если у текущего растения есть позиция, добавляем его в список
  const currentPlant: PlantMarker[] = formData.latitude && formData.longitude
    ? [{
        id: 'current',
        name: formData.russianName || 'Текущее растение',
        position: [formData.latitude, formData.longitude],
        description: formData.naturalRange,
      }]
    : [];

  // Объединяем текущее растение и все остальные
  const combinedPlants = [...currentPlant, ...allPlants];

  // Обработчик выбора позиции на карте
  const handlePositionSelect = useCallback(
    (position: [number, number]) => {
      if (onPositionSelected) {
        onPositionSelected(position[0], position[1]);
      }
    },
    [onPositionSelected]
  );

  // Обработчик выбора области
  const handleAreaSelect = useCallback((area: SelectedArea | null) => {
    setSelectedArea(area);
  }, []);

  return (
    <div className='space-y-6'>
      {/* Переключатель для отображения других растений */}
      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          id="showOtherPlants"
          checked={showOtherPlants}
          onChange={() => setShowOtherPlants(!showOtherPlants)}
          className="mr-2"
        />
        <label htmlFor="showOtherPlants" className="text-sm font-medium">
          Показать другие растения на карте
        </label>
      </div>

      {/* Компонент карты - перемещен в верхнюю часть */}
      <div className='mb-4 h-96 border rounded-lg overflow-hidden'>
        <SimpleMap
          imageUrl={mapImageUrl || null}
          readOnly={false}
          onPositionSelect={handlePositionSelect}
          onAreaSelect={handleAreaSelect}
          plants={combinedPlants}
          areas={mapAreas}
          showOtherPlants={showOtherPlants}
          currentPlantId="current"
        />
      </div>

      {/* Информация о выбранном регионе - теперь отображается под картой */}
      {selectedArea && (
        <div className='mb-6 bg-white p-4 rounded-lg shadow-sm border border-green-100 animate-fadeIn'>
          <div className="flex justify-between items-start">
            <div>
              <h3 className='font-bold text-lg text-green-800 mb-2'>{selectedArea.name}</h3>
              {selectedArea.description && (
                <p className='text-gray-700 text-sm'>{selectedArea.description}</p>
              )}
            </div>
            <span className='text-xs text-white bg-green-600 px-2 py-1 rounded-full'>
              Регион №{selectedArea.id}
            </span>
          </div>
        </div>
      )}

      {/* Основные поля */}
      <div className='space-y-4'>
        <div className={gridContainerClasses.responsive}>
          <NumberField
            label='Широта'
            name='latitude'
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            handleNumberChange={handleNumberChange}
          />
          <NumberField
            label='Долгота'
            name='longitude'
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            formSubmitted={formSubmitted}
            markFieldAsTouched={markFieldAsTouched}
            handleNumberChange={handleNumberChange}
          />
        </div>

        <SelectField
          label='Регион происхождения'
          name='regionId'
          options={regionOptions}
          formData={formData}
          errors={errors}
          touchedFields={touchedFields}
          formSubmitted={formSubmitted}
          markFieldAsTouched={markFieldAsTouched}
          handleSelectChange={handleSelectChange}
        />

        <TextField
          label='Страна происхождения'
          name='country'
          formData={formData}
          errors={errors}
          touchedFields={touchedFields}
          formSubmitted={formSubmitted}
          markFieldAsTouched={markFieldAsTouched}
          handleChange={handleChange}
        />
      </div>

      {/* Дополнительные поля */}
      <div className='mt-4 border-t border-gray-200 pt-4'>
        <button
          type='button'
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          className='flex items-center text-blue-600 hover:text-blue-800 mb-4'
        >
          <svg
            className={`w-5 h-5 mr-1 transition-transform ${
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
          <div className='space-y-4 animate-fadeIn'>
            <TextField
              label='Естественный ареал'
              name='naturalRange'
              multiline
              rows={3}
              formData={formData}
              errors={errors}
              touchedFields={touchedFields}
              formSubmitted={formSubmitted}
              markFieldAsTouched={markFieldAsTouched}
              handleChange={handleChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};
