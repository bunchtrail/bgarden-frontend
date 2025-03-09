Это пример страницы карты, которая используется в корневой директории. здесь всего лишь описание того, как она выглядит.

# Структура проекта

- src\pages/
  - MapPage.tsx

# Содержимое файлов

---

## src\pages/

<!-- FILE_START:
file_name: MapPage.tsx
relative_path: src\pages/
file_extension: tsx
-->

```tsx
import React, { useState } from 'react';
import {
  AreaType,
  GardenMap,
  MapAreas,
  MarkerCluster,
  MarkerType,
  useMap,
} from '../modules/map';
import {
  containerClasses,
  layoutClasses,
  textClasses,
} from '../styles/global-styles';

/**
 * Страница с интерактивной картой ботанического сада
 * Доступна для всех пользователей, включая Клиентов
 */
const MapPage: React.FC = () => {
  // Состояние для фильтров
  const [activeFilters, setActiveFilters] = useState({
    plants: true,
    expositions: true,
    facilities: false,
    entrances: true,
    sectors: true,
    greenhouses: false,
  });

  // Использование хука для получения данных карты с фильтрацией по типам
  const {
    markers,
    areas,
    layers,
    loading,
    error,
    options,
    setMarkerTypeFilter,
    setAreaTypeFilter,
  } = useMap(
    { center: [55.75, 37.61], zoom: 14 }, // Координаты ботанического сада
    [MarkerType.PLANT, MarkerType.EXPOSITION, MarkerType.ENTRANCE], // Типы маркеров по умолчанию
    [AreaType.EXPOSITION, AreaType.SECTOR] // Типы областей по умолчанию
  );

  // Обработчик изменения фильтров
  const handleFilterChange = (filterType: string) => {
    const newFilters = {
      ...activeFilters,
      [filterType]: !activeFilters[filterType as keyof typeof activeFilters],
    };
    setActiveFilters(newFilters);

    // Формирование массива активных фильтров для маркеров
    const markerFilters: MarkerType[] = [];
    if (newFilters.plants) markerFilters.push(MarkerType.PLANT);
    if (newFilters.expositions) markerFilters.push(MarkerType.EXPOSITION);
    if (newFilters.facilities) markerFilters.push(MarkerType.FACILITY);
    if (newFilters.entrances) markerFilters.push(MarkerType.ENTRANCE);

    setMarkerTypeFilter(markerFilters.length > 0 ? markerFilters : null);

    // Формирование массива активных фильтров для областей
    const areaFilters: AreaType[] = [];
    if (newFilters.expositions) areaFilters.push(AreaType.EXPOSITION);
    if (newFilters.sectors) areaFilters.push(AreaType.SECTOR);
    if (newFilters.greenhouses) areaFilters.push(AreaType.GREENHOUSE);

    setAreaTypeFilter(areaFilters.length > 0 ? areaFilters : null);
  };

  return (
    <div className='max-w-6xl mx-auto px-4 py-6'>
      <h1 className='text-3xl font-bold text-green-800 mb-6'>
        Интерактивная карта ботанического сада
      </h1>

      <div className='mb-6 bg-green-50 rounded-lg p-4 shadow-sm'>
        <p className='text-gray-700'>
          Используйте интерактивную карту для навигации по ботаническому саду.
          Вы можете просматривать различные зоны и экспозиции, узнавать о
          растениях и планировать маршрут посещения.
        </p>
      </div>

      {/* Контейнер для карты */}
      <div className='relative mb-8'>
        {loading ? (
          <div className='h-[700px] flex items-center justify-center bg-gray-50 rounded-xl'>
            <div className='flex flex-col items-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-700'></div>
              <p className='mt-4 text-gray-600'>Загрузка карты...</p>
            </div>
          </div>
        ) : error ? (
          <div className='h-[700px] flex items-center justify-center bg-red-50 rounded-xl'>
            <div className='text-center text-red-600 p-6'>
              <h3 className='text-xl font-bold mb-2'>Ошибка загрузки карты</h3>
              <p>{error}</p>
              <p className='mt-4'>
                Пожалуйста, попробуйте обновить страницу или свяжитесь с
                администратором.
              </p>
            </div>
          </div>
        ) : (
          <GardenMap
            markers={markers}
            options={options ?? undefined}
            availableLayers={layers}
            initialFilters={activeFilters}
            onFilterChange={handleFilterChange}
          >
            <MapAreas
              areas={areas}
              visibleTypes={[
                ...(activeFilters.expositions ? [AreaType.EXPOSITION] : []),
                ...(activeFilters.sectors ? [AreaType.SECTOR] : []),
                ...(activeFilters.greenhouses ? [AreaType.GREENHOUSE] : []),
              ]}
            />
            <MarkerCluster
              markers={markers}
              clusterOptions={{
                maxClusterRadius: 60,
                disableClusteringAtZoom: 16,
              }}
            />
          </GardenMap>
        )}
      </div>

      <div className='bg-white rounded-lg shadow-md p-6 mt-6'>
        <h2 className='text-xl font-semibold text-green-700 mb-4'>
          Условные обозначения
        </h2>
        <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-4'>
          <div className='flex items-center p-3 bg-gray-50 rounded-md'>
            <div className='w-8 h-8 flex items-center justify-center bg-green-100 border-2 border-green-600 rounded-full mr-3'></div>
            <span className='text-gray-700'>Растения</span>
          </div>
          <div className='flex items-center p-3 bg-gray-50 rounded-md'>
            <div className='w-8 h-8 flex items-center justify-center bg-blue-100 border-2 border-blue-600 rounded-full mr-3'></div>
            <span className='text-gray-700'>Экспозиции</span>
          </div>
          <div className='flex items-center p-3 bg-gray-50 rounded-md'>
            <div className='w-8 h-8 flex items-center justify-center bg-gray-100 border-2 border-gray-600 rounded-full mr-3'></div>
            <span className='text-gray-700'>Инфраструктура</span>
          </div>
          <div className='flex items-center p-3 bg-gray-50 rounded-md'>
            <div className='w-8 h-8 flex items-center justify-center bg-red-100 border-2 border-red-600 rounded-full mr-3'></div>
            <span className='text-gray-700'>Входы</span>
          </div>
          <div className='flex items-center p-3 bg-gray-50 rounded-md'>
            <div className='w-8 h-8 flex items-center justify-center bg-blue-100 border-2 border-blue-600 mr-3'></div>
            <span className='text-gray-700'>Секторы</span>
          </div>
          <div className='flex items-center p-3 bg-gray-50 rounded-md'>
            <div className='w-8 h-8 flex items-center justify-center bg-amber-100 border-2 border-amber-600 mr-3'></div>
            <span className='text-gray-700'>Оранжереи</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
```

<!-- FILE_END -->

---
