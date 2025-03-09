# Модуль карты для Ботанического сада

Модуль предоставляет интерактивную карту для управления растениями в ботаническом саду с использованием библиотеки Leaflet.

## Возможности

- Отображение карты с растениями по секторам (дендрологический, флора, цветущие)
- Добавление новых растений на карту
- Редактирование информации о растениях
- Удаление растений с карты
- Просмотр детальной информации о растениях

## Структура модуля

```
map/
  ├── components/           # Компоненты модуля
  │   ├── forms/            # Формы для работы с растениями
  │   │   ├── PlantAddForm.tsx
  │   │   └── PlantEditForm.tsx
  │   ├── layers/           # Слои карты
  │   │   └── PlantLayer.tsx
  │   ├── markers/          # Маркеры на карте
  │   │   └── PlantMarker.tsx
  │   ├── Map.tsx           # Основной компонент карты
  │   ├── MapContainer.tsx  # Контейнер с провайдером контекста
  │   └── MapControls.tsx   # Элементы управления картой
  ├── contexts/             # Контексты для управления состоянием
  │   └── MapContext.tsx
  ├── hooks/                # Хуки для работы с картой
  │   ├── index.ts
  │   └── useMapControls.ts
  ├── services/             # Сервисы для работы с API
  │   └── mapService.ts
  ├── types/                # Типы и интерфейсы
  │   └── index.ts
  ├── utils/                # Утилиты
  ├── index.ts              # Точка входа в модуль
  └── README.md             # Документация
```

## Использование

### Базовое использование

```tsx
import { MapContainer } from '../modules/map';

const MapPage: React.FC = () => {
  return (
    <div className='map-page'>
      <h1>Карта ботанического сада</h1>
      <MapContainer mapId={1} />
    </div>
  );
};

export default MapPage;
```

### Выбор сектора

```tsx
import { MapContainer } from '../modules/map';
import { SectorType } from '../modules/specimens/types';

const FloraMapPage: React.FC = () => {
  return (
    <div className='map-page'>
      <h1>Карта сектора флоры</h1>
      <MapContainer mapId={1} sectorType={SectorType.Flora} />
    </div>
  );
};

export default FloraMapPage;
```

## Зависимости

- React 19.0.0
- Leaflet 1.9.4
- react-leaflet 5.0.0
- TypeScript 4.9.5
- Tailwind CSS 3.3.0

## API

Модуль взаимодействует с API через сервис `mapService`, который предоставляет следующие методы:

- `getMapById(id: number)` - получение карты по ID
- `getMapWithSpecimens(id: number)` - получение карты со всеми образцами растений
- `getAllMaps()` - получение списка всех карт
- `getSpecimensBySector(sectorType: SectorType)` - получение образцов растений по типу сектора
- `addSpecimen(specimen: Omit<Specimen, 'id'>)` - добавление нового образца растения
- `updateSpecimen(id: number, specimen: Specimen)` - обновление существующего образца растения
- `deleteSpecimen(id: number)` - удаление образца растения
