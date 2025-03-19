# Документация по сервисам

## Общие принципы

Все сервисы в проекте должны использовать единый HTTP-клиент (`httpClient`) для взаимодействия с API. Это обеспечивает:

1. Единообразие обработки ошибок
2. Централизованную настройку заголовков
3. Автоматическую обработку авторизации
4. Единый подход к отображению уведомлений
5. Унифицированную обработку ответов сервера

## Структура сервисов

Сервисы следует организовывать по модульному принципу:

```
src/
  modules/
    module-name/
      services/
        specificService.ts
```

## HttpClient

Основной клиент для взаимодействия с API находится в `src/services/httpClient.ts`.

### Основные методы

```typescript
// GET запрос
httpClient.get<T>(endpoint: string, options?: RequestOptions): Promise<T>

// POST запрос с телом
httpClient.post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T>

// PUT запрос с телом
httpClient.put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T>

// PATCH запрос с телом
httpClient.patch<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T>

// DELETE запрос
httpClient.delete<T>(endpoint: string, options?: RequestOptions): Promise<T>
```

### Параметры

Параметр `options` может содержать следующие поля:

```typescript
type RequestOptions = {
  headers?: Record<string, string>;    // Дополнительные заголовки
  params?: Record<string, string>;     // Параметры URL строки
  requiresAuth?: boolean;              // Требуется ли авторизация (по умолчанию true)
  body?: any;                          // Тело запроса (для не-GET методов)
  signal?: AbortSignal;                // Сигнал для отмены запроса
  timeout?: number;                    // Таймаут в миллисекундах
};
```

## Примеры использования

### Получение данных

```typescript
// В сервисе
export const getItems = async (): Promise<Item[]> => {
  try {
    return await httpClient.get<Item[]>('/items');
  } catch (error) {
    logError('Ошибка при получении элементов:', error);
    throw error;
  }
};
```

### Отправка данных

```typescript
// В сервисе
export const createItem = async (itemData: ItemData): Promise<Item> => {
  try {
    return await httpClient.post<Item>('/items', itemData);
  } catch (error) {
    logError('Ошибка при создании элемента:', error);
    throw error;
  }
};
```

### Обновление данных

```typescript
// В сервисе
export const updateItem = async (id: number, itemData: Partial<ItemData>): Promise<Item> => {
  try {
    return await httpClient.put<Item>(`/items/${id}`, itemData);
  } catch (error) {
    logError('Ошибка при обновлении элемента:', error);
    throw error;
  }
};
```

### Удаление данных

```typescript
// В сервисе
export const deleteItem = async (id: number): Promise<boolean> => {
  try {
    await httpClient.delete<void>(`/items/${id}`);
    return true;
  } catch (error) {
    logError('Ошибка при удалении элемента:', error);
    throw error;
  }
};
```

## Обработка ошибок

Все сервисы должны соблюдать единый подход к обработке ошибок:

1. Использовать блок try-catch
2. Логировать ошибки с помощью утилиты `logError`
3. Перебрасывать ошибки дальше для обработки на уровне компонентов

## Типизация

Все сервисы должны использовать типизацию TypeScript для обеспечения безопасности типов:

1. Определять интерфейсы для входных и выходных данных
2. Использовать дженерики при вызове методов httpClient
3. Экспортировать типы и интерфейсы, которые используются вне сервиса 