# Модуль карты

Модуль отвечает за отображение интерактивной карты ботанического сада с регионами и экспонатами.

## Структура

- **components/** - Компоненты для отображения карты и связанных с ней элементов
  - `MapPage.tsx` - Основной компонент страницы карты
  
- **contexts/** - Контексты для хранения и управления состоянием карты
  - `MapContext.tsx` - Контекст карты с данными областей и растений
  
- **hooks/** - Хуки для использования функциональности карты
  - `useMap.ts` - Хук для доступа к контексту карты
  
- **services/** - Сервисы для работы с API
  - `mapService.ts` - Сервисы для работы с картой
  - `regionService.ts` - Сервисы для работы с регионами карты
  - `plantService.ts` - Сервисы для работы с растениями на карте
  
- **styles/** - Стили компонентов карты
  
- **types/** - Типы для компонентов и данных карты
  - `mapTypes.ts` - Определения типов для модуля карты

## Использование

Для отображения карты используйте компонент `MapPage` внутри `MapProvider`:

```tsx
import { MapProvider } from '@/modules/map/contexts/MapContext';
import MapPage from '@/modules/map/components/MapPage';

const MapRoute = () => (
  <MapProvider>
    <MapPage />
  </MapProvider>
);
```

## Работа с контекстом

Для доступа к данным карты используйте хук `useMap`:

```tsx
import { useMap } from '@/modules/map/hooks';

const MyComponent = () => {
  const { areas, selectedAreaId, setSelectedAreaId } = useMap();
  
  return (
    // использование данных
  );
};
``` 