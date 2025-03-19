# Руководство по интеграции с API для модуля образцов

## Введение

Данное руководство описывает методы и подходы для интеграции модуля образцов (specimens) с API сервера. Документация включает информацию о доступных эндпоинтах, форматах данных и рекомендации по обработке запросов.

## Конфигурация HTTP клиента

Модуль образцов использует централизованный HTTP клиент из `src/services/httpClient.ts`, который предоставляет:

- Автоматическую обработку ошибок
- Добавление авторизационных токенов
- Интерцепторы для логирования
- Типизацию запросов и ответов

```tsx
// Пример использования HTTP клиента в сервисе образцов
import { httpClient } from '../../../services/httpClient';
import { Specimen, SpecimenFormData } from '../types';

export const specimenService = {
  // Методы сервиса...
};
```

## Доступные эндпоинты API

### Получение образцов

```tsx
/**
 * Получение списка образцов с фильтрацией
 */
const getSpecimens = async (filters?: SpecimenFilterParams) => {
  const response = await httpClient.get<Specimen[]>('/api/specimens', { params: filters });
  return response.data;
};
```

| Параметр     | Тип      | Описание                            |
|--------------|----------|-------------------------------------|
| searchField  | string   | Поле для поиска                     |
| searchValue  | string   | Значение для поиска                 |
| familyId     | number   | Идентификатор семейства             |
| sectorType   | number   | Тип сектора                         |
| regionId     | number   | Идентификатор региона               |
| expositionId | number   | Идентификатор экспозиции            |

### Получение образца по ID

```tsx
/**
 * Получение образца по ID
 */
const getSpecimenById = async (id: number) => {
  const response = await httpClient.get<Specimen>(`/api/specimens/${id}`);
  return response.data;
};
```

### Создание нового образца

```tsx
/**
 * Создание нового образца
 */
const createSpecimen = async (specimenData: SpecimenFormData) => {
  const response = await httpClient.post<Specimen>('/api/specimens', specimenData);
  return response.data;
};
```

### Обновление образца

```tsx
/**
 * Обновление существующего образца
 */
const updateSpecimen = async (id: number, specimenData: SpecimenFormData) => {
  const response = await httpClient.put<Specimen>(`/api/specimens/${id}`, specimenData);
  return response.data;
};
```

### Удаление образца

```tsx
/**
 * Удаление образца
 */
const deleteSpecimen = async (id: number) => {
  await httpClient.delete(`/api/specimens/${id}`);
};
```

## Дополнительные эндпоинты

### Работа с семействами растений

```tsx
/**
 * Получение списка семейств
 */
const getFamilies = async () => {
  const response = await httpClient.get<Family[]>('/api/families');
  return response.data;
};
```

### Работа с регионами

```tsx
/**
 * Получение списка регионов
 */
const getRegions = async () => {
  const response = await httpClient.get<Region[]>('/api/regions');
  return response.data;
};
```

### Работа с экспозициями

```tsx
/**
 * Получение списка экспозиций
 */
const getExpositions = async () => {
  const response = await httpClient.get<Exposition[]>('/api/expositions');
  return response.data;
};
```

## Обработка ошибок

При работе с API важно правильно обрабатывать ошибки:

```tsx
try {
  const specimen = await specimenService.getSpecimenById(id);
  // Обработка успешного результата
} catch (error) {
  if (error.response) {
    // Серверная ошибка с ответом
    if (error.response.status === 404) {
      // Обработка "не найдено"
    } else if (error.response.status === 403) {
      // Обработка "доступ запрещен"
    }
  } else if (error.request) {
    // Ошибка сети (нет ответа)
  } else {
    // Другие ошибки
  }
}
```

## Типы данных для запросов и ответов

Для работы с API используются следующие типы данных:

- `Specimen` - тип данных образца
- `SpecimenFormData` - данные для создания/обновления образца
- `SpecimenFilterParams` - параметры фильтрации для списка образцов
- `Family` - тип данных семейства растений
- `Region` - тип данных региона
- `Exposition` - тип данных экспозиции

Все типы данных определены в `src/modules/specimens/types/index.ts`.

## Рекомендации по интеграции

### Оптимизация запросов

- Используйте кэширование данных, если они редко меняются
- Реализуйте пагинацию для больших списков
- Выполняйте запросы только при необходимости (ленивая загрузка)

### Отслеживание состояния запросов

Для каждого запроса отслеживайте состояния:

```tsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<Specimen | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await specimenService.getSpecimenById(id);
      setData(result);
    } catch (err) {
      setError('Ошибка при загрузке данных: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, [id]);
```

### Обновление данных

Для обновления данных после изменений:

```tsx
const handleUpdate = async (data: SpecimenFormData) => {
  try {
    setSubmitting(true);
    await specimenService.updateSpecimen(id, data);
    // Обновление данных в интерфейсе
    // Можно вызвать повторную загрузку или обновить локальное состояние
    setSaved(true);
  } catch (err) {
    setError('Ошибка при обновлении данных: ' + err.message);
  } finally {
    setSubmitting(false);
  }
};
```

## Примеры использования

### Загрузка списка образцов с фильтрацией

```tsx
const SpecimensList: React.FC = () => {
  const [specimens, setSpecimens] = useState<Specimen[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SpecimenFilterParams>({});
  
  useEffect(() => {
    const loadSpecimens = async () => {
      try {
        setLoading(true);
        const data = await specimenService.getSpecimens(filters);
        setSpecimens(data);
      } catch (err) {
        console.error('Failed to load specimens:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadSpecimens();
  }, [filters]);
  
  // ...остальной код компонента
};
```

### Создание нового образца

```tsx
const handleCreateSpecimen = async (data: SpecimenFormData) => {
  try {
    const newSpecimen = await specimenService.createSpecimen(data);
    // Перенаправление на страницу образца
    navigate(`/specimens/${newSpecimen.id}`);
  } catch (err) {
    setError('Ошибка при создании образца: ' + err.message);
  }
};
``` 