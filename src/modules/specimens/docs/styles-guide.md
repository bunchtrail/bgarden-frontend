# Руководство по стилям для модуля образцов растений (specimens)

## Общие принципы

- Модуль specimens использует Tailwind CSS v3.3.0 для основной стилизации.
- Для специфических стилей компонентов используется CSS-модуль `specimens.module.css`.
- Используйте глобальные стили из `src/styles/global-styles.ts` и компоненты из `src/components/ui`.
- Специфические стили для компонентов модуля находятся в файле `styles.ts`.

## Файлы стилей модуля

- `specimens.module.css`: CSS-модуль для уникальных стилей компонентов
- `styles.ts`: JavaScript-объекты с предопределенными Tailwind-классами
- `specimens.module.css.d.ts`: Типы для CSS-модуля

## Подробное руководство по стилизации компонентов

### Карточка образца (SpecimenCard)

- Используйте стили из `styles.ts` и глобальные стили:

```jsx
import { specimenCardStyles } from '../styles';
import { chipClasses, textClasses, buttonClasses } from '../../../styles/global-styles';

<div className={specimenCardStyles.card}>
  <div className={specimenCardStyles.header}>
    <h3 className={specimenCardStyles.title}>{name}</h3>
    <span className={`${chipClasses.base} ${chipClasses.primary}`}>
      {status}
    </span>
  </div>
  <div className={specimenCardStyles.content}>
    <div className={specimenCardStyles.section}>
      <span className={textClasses.secondary}>Научное название:</span>
      <p className={textClasses.body}>{latinName}</p>
    </div>
    <div className={specimenCardStyles.section}>
      <span className={textClasses.secondary}>Семейство:</span>
      <p className={textClasses.body}>{family}</p>
    </div>
    <div className={specimenCardStyles.section}>
      <span className={textClasses.secondary}>Местоположение:</span>
      <p className={textClasses.body}>{location}</p>
    </div>
  </div>
  <div className={specimenCardStyles.footer}>
    <button className={`${buttonClasses.base} ${buttonClasses.primary}`}>
      Подробнее
    </button>
    <button className={`${buttonClasses.base} ${buttonClasses.secondary}`}>
      Редактировать
    </button>
  </div>
</div>

// Стили, доступные в specimenCardStyles:
// card - основной контейнер карточки
// header - заголовок карточки
// title - стиль для названия образца
// content - основное содержимое карточки
// section - секция с данными
// footer - нижняя часть карточки с действиями
// image - стиль для изображения образца
```

### Форма образца (SpecimenForm)

- Используйте комбинацию глобальных стилей и стилей из `styles.ts`:

```jsx
import { specimenFormStyles } from '../styles';
import { formClasses, buttonClasses, textClasses } from '../../../styles/global-styles';

<form className={specimenFormStyles.container}>
  <div className={specimenFormStyles.tabs}>
    <button 
      type="button"
      className={`${specimenFormStyles.tab} ${activeTab === 'basic' ? specimenFormStyles.activeTab : ''}`}
      onClick={() => setActiveTab('basic')}
    >
      Основная информация
    </button>
    <button 
      type="button"
      className={`${specimenFormStyles.tab} ${activeTab === 'additional' ? specimenFormStyles.activeTab : ''}`}
      onClick={() => setActiveTab('additional')}
    >
      Дополнительно
    </button>
    <button 
      type="button"
      className={`${specimenFormStyles.tab} ${activeTab === 'geographic' ? specimenFormStyles.activeTab : ''}`}
      onClick={() => setActiveTab('geographic')}
    >
      Географические данные
    </button>
  </div>
  
  {activeTab === 'basic' && (
    <div className={specimenFormStyles.section}>
      <h3 className={textClasses.subheading}>Основная информация</h3>
      
      <div className={formClasses.control}>
        <label className={formClasses.label}>Название *</label>
        <input className={formClasses.input} type="text" name="name" required />
      </div>
      
      <div className={formClasses.control}>
        <label className={formClasses.label}>Научное название (латинское) *</label>
        <input className={formClasses.input} type="text" name="latinName" required />
      </div>
      
      <div className={formClasses.control}>
        <label className={formClasses.label}>Семейство</label>
        <select className={formClasses.select} name="family">
          <option value="">Выберите семейство</option>
          {families.map(family => (
            <option key={family.id} value={family.id}>{family.name}</option>
          ))}
        </select>
      </div>
    </div>
  )}
  
  <div className={specimenFormStyles.actions}>
    <button 
      type="submit" 
      className={`${buttonClasses.base} ${buttonClasses.primary}`}
    >
      Сохранить
    </button>
    <button 
      type="button" 
      className={`${buttonClasses.base} ${buttonClasses.secondary}`}
      onClick={onCancel}
    >
      Отмена
    </button>
  </div>
</form>

// Стили, доступные в specimenFormStyles:
// container - контейнер всей формы
// section - секция формы (вкладка)
// tabs - контейнер для вкладок
// tab - стиль кнопки вкладки
// activeTab - стиль активной вкладки
// actions - контейнер кнопок действий
// formGroup - группа связанных полей
// column - колонка в многоколоночном макете
// fieldset - группа с рамкой
// legend - заголовок группы с рамкой
```

### Список образцов (SpecimensList)

- Используйте стили таблиц из глобальных стилей и специфические стили из `styles.ts`:

```jsx
import { tableClasses, buttonClasses } from '../../../styles/global-styles';
import { specimenListStyles } from '../styles';

<div className={specimenListStyles.container}>
  <div className={specimenListStyles.filters}>
    <div className={specimenListStyles.filterGroup}>
      <input 
        type="text" 
        placeholder="Поиск по названию" 
        className={specimenListStyles.searchInput} 
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      <button 
        className={specimenListStyles.filterButton}
        onClick={() => applyFilters()}
      >
        Поиск
      </button>
    </div>
    
    <div className={specimenListStyles.filterGroup}>
      <select 
        className={specimenListStyles.filterSelect}
        value={statusFilter}
        onChange={e => setStatusFilter(e.target.value)}
      >
        <option value="">Все статусы</option>
        <option value="active">Активные</option>
        <option value="archived">Архивные</option>
      </select>
      
      <select 
        className={specimenListStyles.filterSelect}
        value={familyFilter}
        onChange={e => setFamilyFilter(e.target.value)}
      >
        <option value="">Все семейства</option>
        {families.map(family => (
          <option key={family.id} value={family.id}>{family.name}</option>
        ))}
      </select>
    </div>
  </div>
  
  <div className={tableClasses.container}>
    <table className={tableClasses.table}>
      <thead>
        <tr>
          <th className={tableClasses.header}>ID</th>
          <th className={tableClasses.header}>Название</th>
          <th className={tableClasses.header}>Научное название</th>
          <th className={tableClasses.header}>Семейство</th>
          <th className={tableClasses.header}>Статус</th>
          <th className={tableClasses.header}>Действия</th>
        </tr>
      </thead>
      <tbody>
        {specimens.map(specimen => (
          <tr key={specimen.id} className={tableClasses.row}>
            <td className={tableClasses.cell}>{specimen.id}</td>
            <td className={tableClasses.cell}>{specimen.name}</td>
            <td className={tableClasses.cell}>{specimen.latinName}</td>
            <td className={tableClasses.cell}>{specimen.family}</td>
            <td className={tableClasses.cell}>
              <span className={getStatusChipClass(specimen.status)}>
                {specimen.status}
              </span>
            </td>
            <td className={tableClasses.actionCell}>
              <button 
                onClick={() => viewSpecimen(specimen.id)}
                className={specimenListStyles.actionButton}
              >
                <ViewIcon />
              </button>
              <button 
                onClick={() => editSpecimen(specimen.id)}
                className={specimenListStyles.actionButton}
              >
                <EditIcon />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
  <div className={specimenListStyles.pagination}>
    <button 
      className={specimenListStyles.pageButton}
      disabled={currentPage === 1}
      onClick={() => goToPage(currentPage - 1)}
    >
      Назад
    </button>
    
    {pageNumbers.map(pageNumber => (
      <button 
        key={pageNumber}
        className={`${specimenListStyles.pageButton} ${currentPage === pageNumber ? specimenListStyles.activePage : ''}`}
        onClick={() => goToPage(pageNumber)}
      >
        {pageNumber}
      </button>
    ))}
    
    <button 
      className={specimenListStyles.pageButton}
      disabled={currentPage === totalPages}
      onClick={() => goToPage(currentPage + 1)}
    >
      Далее
    </button>
  </div>
  
  <button 
    className={`${buttonClasses.base} ${buttonClasses.primary} ${specimenListStyles.addButton}`}
    onClick={() => addNewSpecimen()}
  >
    Добавить образец
  </button>
</div>

// Стили, доступные в specimenListStyles:
// container - контейнер всего списка
// filters - контейнер блока фильтров
// filterGroup - группа фильтров
// searchInput - поле поиска
// filterButton - кнопка применения фильтра
// filterSelect - выпадающий список фильтра
// pagination - контейнер пагинации
// pageButton - кнопка страницы
// activePage - активная страница
// actionButton - кнопка действия в таблице
// addButton - кнопка добавления нового образца
```

### Функция для стилей чипов статусов

```jsx
import { chipClasses } from '../../../styles/global-styles';

const getStatusChipClass = (status) => {
  let variantClass = chipClasses.neutral;
  
  switch (status) {
    case 'active':
      variantClass = chipClasses.success;
      break;
    case 'pending':
      variantClass = chipClasses.warning;
      break;
    case 'deleted':
      variantClass = chipClasses.danger;
      break;
    case 'rare':
      variantClass = chipClasses.primary;
      break;
    default:
      variantClass = chipClasses.neutral;
  }
  
  return `${chipClasses.base} ${variantClass}`;
};
```

## Цветовая палитра

- Используйте цвета из `COLORS` в `global-styles.ts`:

```jsx
import { COLORS } from '../../../styles/global-styles';

// Основные цвета для модуля specimens:
const specimenStatusColors = {
  active: COLORS.SUCCESS,
  inactive: COLORS.WARNING,
  deleted: COLORS.DANGER,
  rare: COLORS.PRIMARY,
  default: COLORS.TEXT_SECONDARY,
};

export const getStatusColor = (status) => {
  return specimenStatusColors[status] || specimenStatusColors.default;
};
```

## Работа с иконками

- Используйте иконки из компонента `icons/index.tsx`:

```jsx
import { EditIcon, DeleteIcon, ViewIcon, AddIcon } from '../components/icons';
import { COLORS } from '../../../styles/global-styles';

<button className={actionStyles.button}>
  <EditIcon color={COLORS.PRIMARY} size={18} />
  Редактировать
</button>

<button className={actionStyles.button}>
  <DeleteIcon color={COLORS.DANGER} size={18} />
  Удалить
</button>

<button className={actionStyles.button}>
  <ViewIcon color={COLORS.TEXT_SECONDARY} size={18} />
  Просмотр
</button>

<button className={actionStyles.button}>
  <AddIcon color={COLORS.SUCCESS} size={20} />
  Добавить
</button>
```

## Адаптивный дизайн

- Для адаптивного дизайна используйте Tailwind-префиксы и медиа запросы в `specimens.module.css`:

```jsx
// В JSX с Tailwind
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Карточки образцов */}
</div>

// Пример медиа-запроса в CSS-модуле
/*
@media (max-width: 768px) {
  .specimenHeader {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filterGroup {
    flex-direction: column;
    width: 100%;
  }
  
  .searchInput, .filterSelect {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}
*/

// Контрольные точки адаптивного дизайна:
// sm: 640px - малые устройства
// md: 768px - средние устройства
// lg: 1024px - большие устройства
// xl: 1280px - очень большие устройства
```

## Важные замечания

- При внесении изменений всегда обновляйте соответствующие файлы типов для CSS-модулей.
- Соблюдайте стилистическую консистентность с остальными модулями.
- Проверяйте отображение компонентов на разных размерах экранов.
- При добавлении новых стилей в `styles.ts` добавляйте их также в общий экспорт в конце файла.
- Все компоненты должны следовать дизайну в стиле Apple - минималистичному и элегантному.
- Перед коммитом проверяйте стили на совместимость с дизайн-системой проекта.
