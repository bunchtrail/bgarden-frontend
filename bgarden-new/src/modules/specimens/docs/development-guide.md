# Руководство по разработке модуля образцов (specimens)

## Введение

Данное руководство содержит рекомендации и правила для разработки компонентов и функциональности модуля образцов. Следование этим рекомендациям обеспечит единообразие кодовой базы и упростит её дальнейшую поддержку.

## Архитектурные принципы

### Модульная структура

- Каждый логический блок функциональности должен быть выделен в отдельный компонент или группу компонентов.
- Для сложных компонентов создавайте вложенные директории внутри `components/`.
- Используйте подход "снизу вверх" при проектировании: сначала создавайте маленькие переиспользуемые компоненты, затем объединяйте их.

### Разделение ответственности

- Компоненты отвечают только за отображение и взаимодействие с пользователем.
- Бизнес-логика должна быть вынесена в хуки и сервисы.
- Работа с API осуществляется только через сервисы.
- Управление состоянием для сложных компонентов выносится в контексты (React Context).

## Шаблоны компонентов

### Функциональный компонент с TypeScript

```tsx
import React from 'react';
import { Specimen } from '../../types';

interface SpecimenDetailsProps {
  specimen: Specimen;
  onEdit?: () => void;
  onDelete?: () => void;
}

/**
 * Компонент для отображения детальной информации о образце растения
 */
export const SpecimenDetails: React.FC<SpecimenDetailsProps> = ({
  specimen,
  onEdit,
  onDelete
}) => {
  return (
    <div className="specimen-details">
      <h2>{specimen.russianName}</h2>
      <p className="latin-name">{specimen.latinName}</p>
      
      {/* Основная информация */}
      <div className="info-section">
        {/* ... */}
      </div>
      
      {/* Кнопки действий */}
      {(onEdit || onDelete) && (
        <div className="actions">
          {onEdit && <button onClick={onEdit}>Редактировать</button>}
          {onDelete && <button onClick={onDelete}>Удалить</button>}
        </div>
      )}
    </div>
  );
};

export default SpecimenDetails;
```

### Хук для работы с данными

```tsx
import { useState, useEffect } from 'react';
import { Specimen } from '../../types';
import { specimenService } from '../../services/specimenService';

/**
 * Хук для загрузки и управления образцом
 */
export const useSpecimen = (specimenId: number) => {
  const [specimen, setSpecimen] = useState<Specimen | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpecimen = async () => {
      try {
        setLoading(true);
        const data = await specimenService.getSpecimenById(specimenId);
        setSpecimen(data);
        setError(null);
      } catch (err) {
        setError('Не удалось загрузить данные образца');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecimen();
  }, [specimenId]);

  return { specimen, loading, error };
};
```

## Правила наименования

### Компоненты

- Используйте PascalCase для имен компонентов: `SpecimenCard.tsx`, `SpecimenForm.tsx`
- Для подпапок используйте kebab-case: `specimen-card/`, `specimen-form/`
- Для индексных файлов используйте `index.ts` для реэкспорта компонентов

### Хуки

- Начинайте имена хуков с `use`: `useSpecimens.ts`, `useSpecimenForm.ts`
- Размещайте хуки в директории `hooks/`

### Типы и интерфейсы

- Используйте PascalCase для типов и интерфейсов: `Specimen`, `SpecimenFormData`
- Для пропсов компонентов добавляйте суффикс `Props`: `SpecimenCardProps`

## Работа с API

- Все API запросы должны выполняться через сервисы из директории `services/`
- Используйте асинхронные функции и try/catch для обработки ошибок
- Обрабатывайте состояния загрузки и ошибок в компонентах

```tsx
// services/specimenService.ts
export const specimenService = {
  getSpecimens: async () => {
    const response = await httpClient.get<Specimen[]>('/api/specimens');
    return response.data;
  },
  
  getSpecimenById: async (id: number) => {
    const response = await httpClient.get<Specimen>(`/api/specimens/${id}`);
    return response.data;
  },
  
  // ...другие методы
};
```

## Обработка ошибок

- Используйте компонент `ErrorBoundary` для обработки ошибок на уровне компонентов
- Всегда обрабатывайте ошибки API в блоках try/catch
- Отображайте понятные пользователю сообщения об ошибках
- Логируйте технические детали ошибок через `console.error` или сервис логирования

## Оптимизация производительности

- Используйте `React.memo` для предотвращения лишних ререндеров
- Применяйте `useMemo` и `useCallback` для кэширования вычислений и функций
- Разбивайте большие списки на страницы с пагинацией
- Отложенно загружайте данные, которые не нужны сразу (ленивая загрузка)

## Тестирование

- Пишите юнит-тесты для хуков и сервисов
- Создавайте компонентные тесты для проверки рендеринга и взаимодействия
- Используйте end-to-end тесты для проверки полных сценариев работы

## Документирование кода

- Добавляйте JSDoc комментарии ко всем компонентам, функциям и интерфейсам
- Описывайте назначение параметров и возвращаемых значений
- Документируйте сложную логику внутри функций
- Используйте `@example` для демонстрации использования компонентов 