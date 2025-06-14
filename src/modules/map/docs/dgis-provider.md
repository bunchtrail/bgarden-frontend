# Провайдер карты 2ГИС

Интеграция с картографическим сервисом 2ГИС для отображения детальных карт городов России.

## Обзор

Провайдер карты 2ГИС предоставляет:
- Высококачественные карты городов России
- Актуальную геопространственную информацию
- Оптимизированную загрузку тайлов
- Автоматическую проверку доступности сервиса

## Основные компоненты

### 1. DgisMapProvider (Сервис)

Класс для управления настройками и взаимодействия с API 2ГИС.

```typescript
import { dgisMapProvider, createDgisMapProvider } from '@/modules/map';

// Использование глобального провайдера
const settings = dgisMapProvider.getSettings();

// Создание кастомного провайдера
const customProvider = createDgisMapProvider({
  zoom: 15,
  center: [55.7558, 37.6176] // Москва
});
```

### 2. DgisTileLayer (Компонент)

React-компонент для отображения тайлового слоя 2ГИС.

```tsx
import { DgisTileLayer } from '@/modules/map';

<DgisTileLayer
  opacity={1}
  maxZoom={18}
  minZoom={8}
/>
```

### 3. useDgisMap (Хук)

Хук для удобной работы с провайдером 2ГИС.

```tsx
import { useDgisMap } from '@/modules/map';

const MyComponent = () => {
  const { 
    isAvailable, 
    isDgisMapActive,
    switchToDgisMap,
    settings 
  } = useDgisMap();

  return (
    <div>
      {isAvailable && (
        <button onClick={switchToDgisMap}>
          Переключить на 2ГИС
        </button>
      )}
    </div>
  );
};
```

## Конфигурация

### Настройки по умолчанию

```typescript
export const DEFAULT_DGIS_SETTINGS = {
  zoom: 13,
  tile_url: "https://tile{s}.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=1",
  subdomains: ["0", "1", "2", "3"],
  attribution: "&copy; 2ГИС",
  maxZoom: 18,
  minZoom: 8,
  center: [58.596323, 49.666755], // Координаты ботанического сада в Кирове
};
```

### Кастомная конфигурация

```typescript
const customSettings = {
  zoom: 15,
  center: [55.7558, 37.6176], // Москва
  maxZoom: 20,
  minZoom: 10,
};

const provider = createDgisMapProvider(customSettings);
```

## API Reference

### DgisMapProvider

#### Методы

- `getSettings()` - Получить текущие настройки
- `updateSettings(newSettings)` - Обновить настройки
- `getTileUrl()` - Получить URL тайлов
- `getSubdomains()` - Получить список поддоменов
- `getAttribution()` - Получить атрибуцию
- `checkAvailability()` - Проверить доступность сервиса
- `getLeafletConfig()` - Получить конфигурацию для Leaflet

### useDgisMap Hook

#### Параметры

```typescript
interface UseDgisMapOptions {
  autoCheckAvailability?: boolean; // Автоматическая проверка доступности
  customSettings?: Partial<DgisMapSettings>; // Кастомные настройки
}
```

#### Возвращаемые значения

```typescript
interface UseDgisMapReturn {
  provider: DgisMapProvider; // Экземпляр провайдера
  isAvailable: boolean | null; // Доступность сервиса
  isLoading: boolean; // Состояние загрузки
  settings: DgisMapSettings; // Текущие настройки
  isDgisMapActive: boolean; // Активна ли карта 2ГИС
  checkAvailability: () => Promise<boolean>; // Проверить доступность
  updateSettings: (settings) => void; // Обновить настройки
  switchToDgisMap: () => void; // Переключиться на 2ГИС
}
```

## Интеграция с системой карт

### Переключение типов карт

```tsx
import { MAP_TYPES, useMapConfig } from '@/modules/map';

const MapControls = () => {
  const { setMapType } = useMapConfig();

  return (
    <div>
      <button onClick={() => setMapType(MAP_TYPES.SCHEMATIC)}>
        Схематическая
      </button>
      <button onClick={() => setMapType(MAP_TYPES.GEO)}>
        OpenStreetMap
      </button>
      <button onClick={() => setMapType(MAP_TYPES.DGIS)}>
        2ГИС
      </button>
    </div>
  );
};
```

### Использование в MapPage

```tsx
import { MapPage, MAP_TYPES, MapConfigProvider } from '@/modules/map';

const App = () => {
  const initialConfig = {
    mapType: MAP_TYPES.DGIS,
    center: [58.596323, 49.666755],
    zoom: 13,
  };

  return (
    <MapConfigProvider initialConfig={initialConfig}>
      <MapPage />
    </MapConfigProvider>
  );
};
```

## Особенности и ограничения

### Доступность сервиса

- Сервис 2ГИС может быть недоступен в некоторых регионах
- Рекомендуется проверка доступности перед использованием
- Предусмотрен fallback на другие типы карт

### Производительность

- Тайлы кешируются браузером
- Используется несколько поддоменов для параллельной загрузки
- Оптимизированы настройки для быстрой отрисовки

### CORS и безопасность

- Сервис поддерживает CORS
- Используется HTTPS для безопасности
- Настроены правильные заголовки для кроссдоменных запросов

## Примеры использования

### Простое переключение карт

```tsx
import { useDgisMap, MAP_TYPES } from '@/modules/map';

const MapSwitcher = () => {
  const { isAvailable, switchToDgisMap } = useDgisMap();

  if (!isAvailable) {
    return <div>2ГИС недоступен в вашем регионе</div>;
  }

  return (
    <button onClick={switchToDgisMap}>
      Использовать карты 2ГИС
    </button>
  );
};
```

### Проверка статуса и обработка ошибок

```tsx
import { useDgisMap } from '@/modules/map';

const MapStatus = () => {
  const { 
    isAvailable, 
    isLoading, 
    checkAvailability 
  } = useDgisMap({ autoCheckAvailability: false });

  const handleCheck = async () => {
    const available = await checkAvailability();
    if (!available) {
      console.error('2ГИС сервис недоступен');
    }
  };

  return (
    <div>
      {isLoading && <div>Проверка доступности...</div>}
      <button onClick={handleCheck}>Проверить 2ГИС</button>
    </div>
  );
};
```

## Troubleshooting

### Проблемы с загрузкой тайлов

1. Проверьте интернет-соединение
2. Убедитесь, что сервис доступен в вашем регионе
3. Проверьте настройки CORS в браузере

### Медленная загрузка

1. Используйте appropriate zoom levels (8-18)
2. Настройте `keepBuffer` для предзагрузки
3. Проверьте количество одновременных запросов

### Проблемы с отображением

1. Убедитесь, что координаты центра корректны
2. Проверьте границы масштабирования
3. Используйте правильную проекцию координат (WGS84) 