import React, { useState } from 'react';
import {
  activateCustomMapSchema,
  getCustomMapSchemas,
} from '../services/mapService';
import { CustomMapSchema, MapLayer } from '../types';
import { MapSchemaUploadModal } from './MapSchemaUploadModal';

// Интерфейс для фильтров карты
interface MapFilters {
  plants: boolean;
  expositions: boolean;
  facilities: boolean;
  entrances: boolean;
  sectors: boolean;
  greenhouses: boolean;
}

// Интерфейс для пропсов компонента элементов управления
interface MapControlsProps {
  filters: MapFilters;
  onFilterChange: (filterType: string) => void;
  layers: MapLayer[];
  activeLayerId: number;
  onLayerChange: (layerId: number) => void;
}

// Компонент для элементов управления картой
export const MapControls: React.FC<MapControlsProps> = ({
  filters,
  onFilterChange,
  layers,
  activeLayerId,
  onLayerChange,
}) => {
  // Состояние для открытия/закрытия панелей
  const [showFilters, setShowFilters] = useState(false);
  const [showLayers, setShowLayers] = useState(false);

  // Состояние для модального окна загрузки схемы
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  // Состояние для списка пользовательских схем
  const [customSchemas, setCustomSchemas] = useState<CustomMapSchema[]>([]);
  // Состояние для отображения выпадающего списка пользовательских схем
  const [isCustomSchemasOpen, setIsCustomSchemasOpen] = useState(false);

  // Переключение отображения панели фильтров
  const toggleFilters = () => {
    setShowFilters(!showFilters);
    if (showLayers) setShowLayers(false);
  };

  // Переключение отображения панели слоев
  const toggleLayers = () => {
    setShowLayers(!showLayers);
    if (showFilters) setShowFilters(false);
  };

  // Загрузка пользовательских схем при открытии выпадающего списка
  const handleCustomSchemasOpen = async () => {
    if (!isCustomSchemasOpen) {
      const schemas = await getCustomMapSchemas();
      setCustomSchemas(schemas);
    }
    setIsCustomSchemasOpen(!isCustomSchemasOpen);
  };

  // Активация выбранной пользовательской схемы
  const handleSchemaActivate = async (id: number) => {
    const success = await activateCustomMapSchema(id);
    if (success) {
      // Обновляем список схем
      const schemas = await getCustomMapSchemas();
      setCustomSchemas(schemas);
      // Закрываем выпадающий список
      setIsCustomSchemasOpen(false);
    }
  };

  return (
    <div className='absolute top-4 right-4 z-[1000]'>
      {/* Кнопки управления */}
      <div className='flex gap-2 mb-2'>
        <button
          className={`p-2 rounded-md shadow-md focus:outline-none ${
            showFilters
              ? 'bg-green-700 text-white'
              : 'bg-white text-green-800 hover:bg-green-50'
          }`}
          onClick={toggleFilters}
          title='Фильтры'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
            />
          </svg>
        </button>
        <button
          className={`p-2 rounded-md shadow-md focus:outline-none ${
            showLayers
              ? 'bg-green-700 text-white'
              : 'bg-white text-green-800 hover:bg-green-50'
          }`}
          onClick={toggleLayers}
          title='Слои карты'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'
            />
          </svg>
        </button>
      </div>

      {/* Панель фильтров */}
      {showFilters && (
        <div className='bg-white rounded-lg shadow-lg p-4 mb-2 w-64'>
          <h4 className='text-lg font-semibold text-green-800 border-b border-green-100 pb-2 mb-3'>
            Фильтры
          </h4>
          <div className='space-y-2'>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='filter-plants'
                className='w-4 h-4 text-green-600 rounded focus:ring-green-500'
                checked={filters.plants}
                onChange={() => onFilterChange('plants')}
              />
              <label
                htmlFor='filter-plants'
                className='ml-2 text-sm text-gray-700 cursor-pointer'
              >
                Растения
              </label>
            </div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='filter-expositions'
                className='w-4 h-4 text-green-600 rounded focus:ring-green-500'
                checked={filters.expositions}
                onChange={() => onFilterChange('expositions')}
              />
              <label
                htmlFor='filter-expositions'
                className='ml-2 text-sm text-gray-700 cursor-pointer'
              >
                Экспозиции
              </label>
            </div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='filter-facilities'
                className='w-4 h-4 text-green-600 rounded focus:ring-green-500'
                checked={filters.facilities}
                onChange={() => onFilterChange('facilities')}
              />
              <label
                htmlFor='filter-facilities'
                className='ml-2 text-sm text-gray-700 cursor-pointer'
              >
                Инфраструктура
              </label>
            </div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='filter-entrances'
                className='w-4 h-4 text-green-600 rounded focus:ring-green-500'
                checked={filters.entrances}
                onChange={() => onFilterChange('entrances')}
              />
              <label
                htmlFor='filter-entrances'
                className='ml-2 text-sm text-gray-700 cursor-pointer'
              >
                Входы
              </label>
            </div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='filter-sectors'
                className='w-4 h-4 text-green-600 rounded focus:ring-green-500'
                checked={filters.sectors}
                onChange={() => onFilterChange('sectors')}
              />
              <label
                htmlFor='filter-sectors'
                className='ml-2 text-sm text-gray-700 cursor-pointer'
              >
                Секторы
              </label>
            </div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='filter-greenhouses'
                className='w-4 h-4 text-green-600 rounded focus:ring-green-500'
                checked={filters.greenhouses}
                onChange={() => onFilterChange('greenhouses')}
              />
              <label
                htmlFor='filter-greenhouses'
                className='ml-2 text-sm text-gray-700 cursor-pointer'
              >
                Оранжереи
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Панель слоев */}
      {showLayers && (
        <div className='bg-white rounded-lg shadow-lg p-4 w-64'>
          <h4 className='text-lg font-semibold text-green-800 border-b border-green-100 pb-2 mb-3'>
            Слои карты
          </h4>
          <div className='space-y-2'>
            {layers.map((layer) => (
              <div key={layer.id} className='flex items-center'>
                <input
                  type='radio'
                  id={`layer-${layer.id}`}
                  name='map-layer'
                  className='w-4 h-4 text-green-600 focus:ring-green-500'
                  checked={layer.id === activeLayerId}
                  onChange={() => onLayerChange(layer.id)}
                />
                <label
                  htmlFor={`layer-${layer.id}`}
                  className='ml-2 text-sm text-gray-700 cursor-pointer'
                >
                  {layer.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Контрол для пользовательских схем */}
      <div className='map-custom-schemas-control'>
        <button
          className='map-control-button'
          title='Пользовательские схемы'
          onClick={handleCustomSchemasOpen}
        >
          <i className='fa fa-image'></i>
        </button>
        {isCustomSchemasOpen && (
          <div className='map-custom-schemas-dropdown'>
            <div className='map-custom-schemas-header'>
              <h4>Пользовательские схемы</h4>
              <button
                className='map-custom-schemas-upload'
                onClick={() => {
                  setIsUploadModalOpen(true);
                  setIsCustomSchemasOpen(false);
                }}
              >
                <i className='fa fa-upload'></i> Загрузить
              </button>
            </div>
            <div className='map-custom-schemas-list'>
              {customSchemas.length === 0 ? (
                <div className='map-custom-schemas-empty'>
                  Нет доступных схем
                </div>
              ) : (
                customSchemas.map((schema) => (
                  <div
                    key={schema.id}
                    className={`map-custom-schema-item ${
                      schema.isActive ? 'active' : ''
                    }`}
                    onClick={() => handleSchemaActivate(schema.id)}
                  >
                    <div className='map-custom-schema-name'>{schema.name}</div>
                    {schema.isActive && (
                      <div className='map-custom-schema-active'>Активна</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно загрузки схемы */}
      <MapSchemaUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={async () => {
          // Обновляем список схем после успешной загрузки
          const schemas = await getCustomMapSchemas();
          setCustomSchemas(schemas);
        }}
      />
    </div>
  );
};
