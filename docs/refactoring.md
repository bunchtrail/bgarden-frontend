Ниже приведён пример файла документации (в формате Markdown), в котором описывается, как будет создаваться (или реорганизовываться) проект и что нужно учитывать при переносе старых модулей и файлов в новую структуру.

---

# Документация по реорганизации структуры проекта

Данный документ описывает процесс создания нового проекта и переноса в него существующего кода из старой структуры.  
Цель — обеспечить более упорядоченную, понятную и единообразную структуру директорий и облегчить дальнейшую поддержку приложения.

## 1. Общая идея реорганизации

1. **Максимальная логичность и единообразие**:  
   - Каждый модуль приложения (`auth`, `expositions`, `map`, `navigation`, `notifications`, `specimens`, `utils` и т.д.) хранит **собственные** `components`, `contexts`, `docs`, `hooks`, `services`, `styles`, `types`.  
   - Если модуль небольшой, можно объединять отдельные подпапки, но принцип лучше сохранить — чтобы любой разработчик видел знакомую структуру.

2. **Чёткое разделение папок для каждого слоя**:  
   - На верхнем уровне (`bgarden-frontend`) лежат настройки проекта, такие как конфигурационные файлы (`package.json`, `tsconfig.json`, `tailwind.config.js` и т.д.), а также папки `.cursor`, `public`, `src`.  
   - Внутри `src` — основной код приложения (компоненты, модули, стили, сервисы и проч.).

3. **Выделенный уровень для страниц**:  
   - Папка `src/pages` содержит страницы (роуты) верхнего уровня (например, `LoginPage`, `ProfilePage`, `ExpositionsPage`, и т.д.).  
   - При этом внутренняя логика страниц (такая как компоненты и хуки) живёт в соответствующем модуле (например, «логика аутентификации» — в `modules/auth`).

4. **Упрощение и сокращение избыточной вложенности**:  
   - Если в старом проекте встречалась глубокая структура вида `map/src/modules/map/map/styles` или похожие, теперь всё аккуратно лежит внутри `modules/map`:  
     ```
     modules/map
       ┣ components
       ┣ contexts
       ┣ docs
       ┣ hooks
       ┣ services
       ┣ styles
       ┗ types
     ```  
   - Если нужно разделять компоненты внутри одного модуля, можно заводить подпапки **только** в `components`, например, `components/MapControlPanel`, `components/MapLegend` и т.д.

## 2. Схема конечной структуры директорий

Ниже приведена итоговая (упрощённая) структура директорий **без файлов**. Если какой-либо подпапки нет, а вы хотите её создать (например, `docs` или `styles`), вы можете добавить её. Если в каком-то модуле она не нужна, можно не создавать.

```
bgarden-frontend
 ┣ .cursor
 ┃ ┗ rules
 ┣ public
 ┃ ┗ images
 ┃   ┣ backgrounds
 ┃   ┣ features
 ┃   ┣ maps
 ┃   ┗ sectors
 ┣ src
 ┃ ┣ components
 ┃ ┃ ┣ home
 ┃ ┃ ┣ icons
 ┃ ┃ ┗ ui
 ┃ ┣ config
 ┃ ┣ docs
 ┃ ┣ examples
 ┃ ┣ modules
 ┃ ┃ ┣ auth
 ┃ ┃ ┃ ┣ components
 ┃ ┃ ┃ ┣ contexts
 ┃ ┃ ┃ ┣ docs
 ┃ ┃ ┃ ┣ hooks
 ┃ ┃ ┃ ┣ services
 ┃ ┃ ┃ ┗ types
 ┃ ┃ ┣ expositions
 ┃ ┃ ┃ ┣ components
 ┃ ┃ ┃ ┣ contexts
 ┃ ┃ ┃ ┣ docs
 ┃ ┃ ┃ ┣ hooks
 ┃ ┃ ┃ ┣ services
 ┃ ┃ ┃ ┣ styles
 ┃ ┃ ┃ ┗ types
 ┃ ┃ ┣ map
 ┃ ┃ ┃ ┣ components
 ┃ ┃ ┃ ┃ ┗ MapControlPanel
 ┃ ┃ ┃ ┃   ┗ PanelSections
 ┃ ┃ ┃ ┣ contexts
 ┃ ┃ ┃ ┣ docs
 ┃ ┃ ┃ ┣ hooks
 ┃ ┃ ┃ ┣ services
 ┃ ┃ ┃ ┣ styles
 ┃ ┃ ┃ ┗ types
 ┃ ┃ ┣ navigation
 ┃ ┃ ┣ notifications
 ┃ ┃ ┣ specimens
 ┃ ┃ ┗ utils
 ┃ ┣ pages
 ┃ ┃ ┗ auth
 ┃ ┣ refactoring
 ┃ ┣ services
 ┃ ┣ styles
 ┃ ┣ types
 ┃ ┗ utils
 ┗ ...
```

## 3. Процесс переноса (или создания) проекта

### Шаг 1. Создание структуры директорий

1. **Ручное создание директорий**  
   Вы можете создавать папки вручную или с помощью набора команд `mkdir`. Если нужно автоматизировать процесс, воспользуйтесь готовым скриптом (см. ниже).

2. **Проверка и корректировка**  
   - Убедитесь, что вам подходят названия всех модулей (например, `specimens`, `navigation`, `expositions` и т.д.).  
   - Если у вас есть другие модули, добавьте для них подобные подпапки `components, contexts, docs` и т.д.

### Шаг 2. Перенос файлов и кода

1. **Перенос «как есть»**  
   - Перетащите из старых папок соответствующие файлы в новую структуру. Старайтесь соблюдать логику:  
     - **Компоненты** → `modules/<module>/components`  
     - **Контексты** → `modules/<module>/contexts`  
     - **Хуки** → `modules/<module>/hooks`  
     - **Сервисы** (работа с API, fetch-запросами и т.д.) → `modules/<module>/services`  
     - **Типы** (интерфейсы, типы TypeScript) → `modules/<module>/types`  
     - **Стили** (CSS/SCSS/CSS-in-TS/ModuleCSS) → `modules/<module>/styles` (или вместе с компонентами, если стили там более локальные).

2. **Актуализация импортов**  
   - В процессе переноса изменятся пути к файлам, поэтому **проверьте все импорты**. Например:
     ```ts
     // Было (старый путь):
     import { SomeComponent } from '../../../../../map/src/modules/map/components/SomeComponent';

     // Стало (новый путь):
     import { SomeComponent } from '@/modules/map/components/SomeComponent'; 
     ```
     (Здесь `'@'` — это условный alias, если вы используете `tsconfig.json` с настройками пути. Если алиасов нет, то будет относительный путь вида `../../../modules/map/components/SomeComponent`.)

3. **Удаление старых директорий**  
   - После переноса убедитесь, что **всё** перенесено, и только затем удаляйте старые папки, чтобы не потерять важные файлы.

4. **Рефакторинг внутри модулей**  
   - Если у вас есть время, рекомендуем на этапе переноса «привести в порядок» код внутри модулей, избавившись от дубликатов, неиспользуемых переменных и т.д.  
   - Например, если у вас есть два похожих файла, вроде `mapService.ts` и `mapService2.ts`, стоит объединить их или выбрать один, прежде чем переносить в папку `services`.

### Шаг 3. (Необязательно) Добавление alias путей в TypeScript

Чтобы упростить импорты при такой структуре, в `tsconfig.json` часто добавляют алиасы. Пример:

```jsonc
{
  "compilerOptions": {
    // ...
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"]
    }
  }
}
```

Теперь, вместо многоточечных относительных путей, можно писать:

```ts
import { SomeComponent } from "@/modules/map/components/SomeComponent";
```


> **Примечание**: В этом скрипте мы создаём базовую структуру директорий без файлов. Дальнейшая иерархия может изменяться по вашему усмотрению.

## 5. Рекомендации по дальнейшему развитию

- **Поддерживайте единую структуру во всех новых модулях** (придерживайтесь стандартных подпапок).  
- **Обновляйте документацию**, если в дальнейшем решите что-то переименовать или изменить (например, объединить `docs` и `refactoring` в один раздел, или перейти на другую систему хранения стилей).  
- **Автоматизация**: если проект большой, можно подключить линтер для пути импорта (например, ESLint rules) и автоматически находить «битые» импорты при переносе.

## Рекомендации по устранению дублирования компонентов

В проекте обнаружены следующие проблемы:

1. **Дублирование UI компонентов:** 
   - Наличие папки `ui` в корневом модуле и внутри модуля `specimens/components/ui`
   - Кнопки и стили для них определены по-разному в разных модулях
   - Компоненты навигации имеют свои стили, которые не используют общие стили из `global-styles.ts`

2. **Проблемы с импортами:**
   - Сложные пути импорта (например, `import { PatternType } from '../../../modules/ui/components/AbstractPattern';`)
   - Потенциальные круговые зависимости между модулями

### Рекомендации для рефакторинга:

1. **Создание централизованной UI библиотеки:**
   - Перенести все общие UI компоненты в модуль `ui`
   - Удалить папку `specimens/components/ui` и использовать компоненты из основного `ui` модуля
   - Создать для каждого UI компонента собственный файл экспорта и объединить их через индексные файлы

2. **Стандартизация стилей:**
   - Все стили кнопок и других UI элементов должны быть определены в `global-styles.ts`
   - В `Navbar.tsx` и других компонентах заменить локальные стили на импорт из глобальных стилей

3. **Улучшение импортов:**
   - Использовать абсолютные импорты для глобальных компонентов:
     ```ts
     // Было:
     import { SomeComponent } from '../../../modules/ui/components/SomeComponent';
     
     // Должно стать:
     import { SomeComponent } from '@/modules/ui';
     ```
   - Настроить в `tsconfig.json` алиасы путей для более коротких импортов

4. **План миграции:**
   - Сначала создать полный набор UI компонентов в модуле `ui`
   - Обновить экспорты в `ui/index.ts` для всех компонентов
   - Поэтапно заменять использование локальных UI компонентов на импорты из модуля `ui`
   - Стандартизировать все стили через `global-styles.ts`

## Текущий прогресс рефакторинга (по состоянию на 18.03.2025)

1. **Централизация UI компонентов:**
   - ✅ Создана централизованная структура в модуле `ui`
   - ✅ Созданы базовые компоненты: `Button`, `Card`, `TextField`, `LoadingSpinner`
   - ✅ Обновлен компонент `SectorCard` для большей гибкости
   - ✅ Создан промежуточный файл в `specimens/components/ui` для плавной миграции

2. **Стандартизация стилей:**
   - ✅ Расширены базовые стили в `global-styles.ts` для кнопок и карточек
   - ✅ Добавлены состояния для компонентов: `warning`, `success`, `disabled`
   - ⚠️ Нужно продолжить работу над переносом локальных стилей в глобальные

3. **Улучшение импортов:**
   - ✅ Настроены алиасы путей в `tsconfig.json`
   - ✅ Обновлены некоторые файлы для использования алиасов (`@modules/ui`)
   - ⚠️ Необходимо обновить оставшиеся файлы в проекте

4. **Следующие шаги:**
   - Создать остальные базовые UI компоненты (например, `Select`, `Checkbox`)
   - Завершить миграцию всех модулей на централизованную UI библиотеку
   - Создать документацию по использованию UI компонентов
   - Удалить дублирующиеся компоненты после завершения миграции

---

**Таким образом, данный документ** призван помочь вам в постепенном переносе существующего кода. При необходимости можете расширять его дополнительными сведениями: например, где лежат глобальные переменные окружения, как настраивается конфигурация сервера, какие зависимости устанавливать и т.д.