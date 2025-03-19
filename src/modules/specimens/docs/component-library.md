# Библиотека компонентов модуля образцов

## Обзор

В этом документе представлены все компоненты, разработанные и используемые в модуле образцов (specimens). Документация включает описание компонентов, их API, примеры использования и рекомендации по применению.

## Общая структура компонентов

Компоненты модуля образцов разделены на следующие категории:

1. **Компоненты карточек образцов** - для отображения краткой информации об образце
2. **Компоненты форм** - для добавления и редактирования образцов
3. **Компоненты действий** - кнопки и элементы управления для взаимодействия с образцами
4. **Компоненты таксономии** - для работы с таксономическими данными
5. **Компоненты галереи** - для отображения изображений образцов
6. **Компоненты списков** - для отображения коллекций образцов

## Компоненты карточек образцов

### SpecimenCard

Компонент для отображения краткой информации об образце в виде карточки.

**Пропсы:**
```tsx
interface SpecimenCardProps {
  specimen: Specimen;              // Данные образца
  onClick?: (id: number) => void;  // Обработчик клика по карточке
  className?: string;              // Дополнительные классы стилей
  showActions?: boolean;           // Показывать ли кнопки действий
  compact?: boolean;               // Компактный режим отображения
}
```

**Пример использования:**
```tsx
import { SpecimenCard } from '../components/specimen-card';

<SpecimenCard 
  specimen={specimenData} 
  onClick={(id) => navigate(`/specimens/${id}`)}
  showActions={true}
/>
```

**Рекомендации:**
- Используйте для отображения в списках и сетках
- Для компактного отображения установите `compact={true}`
- Для интерактивных карточек передайте обработчик `onClick`

### SpecimenDetails

Компонент для отображения полной информации об образце.

**Пропсы:**
```tsx
interface SpecimenDetailsProps {
  specimen: Specimen;                 // Данные образца
  onEdit?: () => void;                // Обработчик редактирования
  onDelete?: () => void;              // Обработчик удаления
  showTaxonomy?: boolean;             // Показывать таксономические данные
  showGeographic?: boolean;           // Показывать географические данные
  showGallery?: boolean;              // Показывать галерею изображений
}
```

**Пример использования:**
```tsx
import { SpecimenDetails } from '../components/specimen-details';

<SpecimenDetails 
  specimen={specimenData} 
  onEdit={() => setEditMode(true)}
  showTaxonomy={true}
  showGeographic={true}
  showGallery={true}
/>
```

## Компоненты форм

### SpecimenForm

Основной компонент формы для создания и редактирования образцов.

**Пропсы:**
```tsx
interface SpecimenFormProps {
  specimen?: Specimen;                      // Данные образца (при редактировании)
  onSubmit: (data: SpecimenFormData) => void; // Обработчик отправки формы
  onCancel: () => void;                     // Обработчик отмены
  isLoading?: boolean;                      // Состояние загрузки
  error?: string;                           // Сообщение об ошибке
}
```

**Пример использования:**
```tsx
import { SpecimenForm } from '../../specimens';

<SpecimenForm 
  specimen={specimenToEdit}
  onSubmit={handleSubmitForm}
  onCancel={() => navigate('/specimens')}
  isLoading={isSubmitting}
  error={formError}
/>
```

**Рекомендации:**
- Используйте для создания новых и редактирования существующих образцов
- При редактировании передавайте существующий объект `specimen`
- Обрабатывайте состояние загрузки через `isLoading`
- Отображайте ошибки валидации и отправки через `error`

### GeographicFieldset

Компонент для ввода географических данных образца.

**Пропсы:**
```tsx
interface GeographicFieldsetProps {
  formData: SpecimenFormData;              // Данные формы
  onChange: (name: string, value: any) => void; // Обработчик изменений
  regions: Region[];                        // Список регионов
  expositions: Exposition[];                // Список экспозиций
}
```

**Пример использования:**
```tsx
import { GeographicFieldset } from '../components/specimen-form/geographic';

<GeographicFieldset 
  formData={formState}
  onChange={handleFieldChange}
  regions={availableRegions}
  expositions={availableExpositions}
/>
```

## Компоненты действий

### SpecimenActions

Компонент с кнопками действий для образца.

**Пропсы:**
```tsx
interface SpecimenActionsProps {
  onEdit?: () => void;     // Обработчик редактирования
  onDelete?: () => void;   // Обработчик удаления
  onView?: () => void;     // Обработчик просмотра
  disabled?: boolean;      // Отключение кнопок
  vertical?: boolean;      // Вертикальное расположение кнопок
}
```

**Пример использования:**
```tsx
import { SpecimenActions } from '../components/specimen-actions';

<SpecimenActions 
  onEdit={() => navigate(`/specimens/${id}/edit`)}
  onDelete={() => handleDelete(id)}
  onView={() => navigate(`/specimens/${id}`)}
/>
```

## Компоненты таксономии

### TaxonomyViewer

Компонент для отображения таксономической информации об образце.

**Пропсы:**
```tsx
interface TaxonomyViewerProps {
  specimen: Specimen;        // Данные образца
  compact?: boolean;         // Компактный режим отображения
  className?: string;        // Дополнительные классы стилей
}
```

**Пример использования:**
```tsx
import { TaxonomyViewer } from '../components/specimen-taxonomy';

<TaxonomyViewer specimen={specimenData} />
```

## Компоненты галереи

### SpecimenGallery

Компонент для отображения галереи изображений образца.

**Пропсы:**
```tsx
interface SpecimenGalleryProps {
  specimenId: number;          // ID образца
  images?: string[];           // Массив URL изображений (опционально)
  onImageUpload?: (file: File) => Promise<void>; // Обработчик загрузки изображения
  editable?: boolean;          // Возможность редактирования
}
```

**Пример использования:**
```tsx
import { SpecimenGallery } from '../components/specimen-gallery';

<SpecimenGallery 
  specimenId={specimen.id}
  editable={isEditable}
  onImageUpload={handleImageUpload}
/>
```

## Компоненты списков

### SpecimensList

Компонент для отображения списка образцов с фильтрацией и пагинацией.

**Пропсы:**
```tsx
interface SpecimensListProps {
  specimens: Specimen[];                    // Массив образцов
  loading?: boolean;                        // Состояние загрузки
  error?: string;                           // Сообщение об ошибке
  filters?: SpecimenFilterParams;           // Параметры фильтрации
  onFilterChange?: (filters: SpecimenFilterParams) => void; // Обработчик изменения фильтров
  onSpecimenClick?: (id: number) => void;   // Обработчик клика по образцу
  viewMode?: 'grid' | 'table';              // Режим отображения
  onViewModeChange?: (mode: 'grid' | 'table') => void; // Обработчик изменения режима
}
```

**Пример использования:**
```tsx
import { SpecimensList } from '../components/specimens-list';

<SpecimensList 
  specimens={specimensData}
  loading={isLoading}
  filters={currentFilters}
  onFilterChange={handleFilterChange}
  onSpecimenClick={(id) => navigate(`/specimens/${id}`)}
  viewMode={currentViewMode}
  onViewModeChange={setViewMode}
/>
```

**Рекомендации:**
- Используйте для отображения коллекций образцов
- Поддерживает два режима отображения: сетка (`grid`) и таблица (`table`)
- Интегрирует компоненты фильтрации и пагинации

### FilterPanel

Компонент для фильтрации списка образцов.

**Пропсы:**
```tsx
interface FilterPanelProps {
  filters: SpecimenFilterParams;              // Текущие фильтры
  onFilterChange: (filters: SpecimenFilterParams) => void; // Обработчик изменения фильтров
  families?: Family[];                         // Список семейств для фильтрации
  regions?: Region[];                          // Список регионов для фильтрации
  expositions?: Exposition[];                  // Список экспозиций для фильтрации
  className?: string;                          // Дополнительные классы стилей
}
```

**Пример использования:**
```tsx
import { FilterPanel } from '../components/specimens-list';

<FilterPanel 
  filters={currentFilters}
  onFilterChange={setFilters}
  families={availableFamilies}
  regions={availableRegions}
  expositions={availableExpositions}
/>
```

## Интеграция компонентов

Компоненты модуля образцов разработаны для совместной работы. Ниже приведены примеры типичных сценариев использования:

### Страница списка образцов

```tsx
import { SpecimensList } from '../../specimens/components/specimens-list';
import { useSpecimens } from '../../specimens/hooks';

const SpecimensListPage: React.FC = () => {
  const { specimens, loading, error, filters, setFilters } = useSpecimens();
  const navigate = useNavigate();
  
  return (
    <div className="specimens-page">
      <h1>Образцы растений</h1>
      
      <SpecimensList 
        specimens={specimens}
        loading={loading}
        error={error}
        filters={filters}
        onFilterChange={setFilters}
        onSpecimenClick={(id) => navigate(`/specimens/${id}`)}
      />
    </div>
  );
};
```

### Страница редактирования образца

```tsx
import { SpecimenForm } from '../../specimens/components/specimen-form';
import { useSpecimen } from '../../specimens/hooks';
import { specimenService } from '../../specimens/services';

const EditSpecimenPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { specimen, loading, error } = useSpecimen(Number(id));
  const navigate = useNavigate();
  
  const handleSubmit = async (data) => {
    try {
      await specimenService.updateSpecimen(Number(id), data);
      navigate(`/specimens/${id}`);
    } catch (err) {
      console.error(err);
    }
  };
  
  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  
  return (
    <SpecimenForm 
      specimen={specimen}
      onSubmit={handleSubmit}
      onCancel={() => navigate(`/specimens/${id}`)}
    />
  );
};
``` 