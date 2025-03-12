# Руководство по стилям для модуля авторизации (auth)

## Общие принципы

- Модуль авторизации использует Tailwind CSS v3.3.0 для стилизации компонентов.
- Все стили должны соответствовать общему дизайну приложения Botanical Garden.
- Используйте глобальные стили из `src/styles/global-styles.ts` вместо прямого применения классов Tailwind.

## Подробное руководство по стилизации компонентов

### Формы авторизации

- Используйте компонент `Form` из `src/components/ui/Form.tsx` для всех форм авторизации.
- Применяйте классы форм из глобальных стилей:

```jsx
import { formClasses } from '../../../styles/global-styles';

// Пример полной формы авторизации:
<form className={formClasses.base}>
  <div className={formClasses.control}>
    <label className={formClasses.label}>Логин</label>
    <input className={formClasses.input} type='text' />
  </div>

  <div className={formClasses.control}>
    <label className={formClasses.label}>Пароль</label>
    <input className={formClasses.input} type='password' />
    {error && <p className={formClasses.error}>{error}</p>}
  </div>

  <button
    type='submit'
    className={`${buttonClasses.base} ${buttonClasses.primary}`}
  >
    Войти
  </button>
</form>;
```

### Кнопки для действий авторизации

- Используйте классы кнопок из глобальных стилей:

```jsx
import { buttonClasses } from '../../../styles/global-styles';

// Основная кнопка (синяя)
<button className={`${buttonClasses.base} ${buttonClasses.primary}`}>
  Войти
</button>

// Вторичная кнопка (серая)
<button className={`${buttonClasses.base} ${buttonClasses.secondary}`}>
  Отмена
</button>

// Кнопка опасности для выхода из аккаунта
<button className={`${buttonClasses.base} ${buttonClasses.danger}`}>
  Выйти
</button>

// Полный набор доступных стилей для кнопок:
// buttonClasses.base - базовый стиль кнопки
// buttonClasses.primary - основная синяя кнопка (#0A84FF)
// buttonClasses.secondary - серая кнопка
// buttonClasses.warning - оранжевая кнопка
// buttonClasses.danger - красная кнопка
// buttonClasses.success - зеленая кнопка
// buttonClasses.disabled - стиль для отключенной кнопки
```

### Сообщения об ошибках авторизации

- Для ошибок авторизации используйте стили ошибок формы или текст с цветом опасности:

```jsx
import { formClasses } from '../../../styles/global-styles';
import { COLORS } from '../../../styles/global-styles';

// Через стили формы
<p className={formClasses.error}>Неверный логин или пароль</p>

// Или напрямую через цвета
<p style={{ color: COLORS.DANGER }}>Неверный логин или пароль</p>

// Цветовая палитра для разных типов сообщений:
// COLORS.DANGER - #FF3B30 (красный, для ошибок)
// COLORS.WARNING - #FF9F0A (оранжевый, для предупреждений)
// COLORS.SUCCESS - #30D158 (зеленый, для успешных действий)
```

## Защищенные маршруты

- Компонент `ProtectedRoute` должен использовать глобальные стили для отображения сообщений о необходимости авторизации:

```jsx
// Стилизация сообщения о необходимости авторизации
import {
  containerClasses,
  textClasses,
  buttonClasses,
} from '../../../styles/global-styles';

// Пример компонента ProtectedRoute со стилизацией
const UnauthorizedMessage = () => (
  <div className={containerClasses.base}>
    <h2 className={textClasses.heading}>Требуется авторизация</h2>
    <p className={textClasses.body}>
      Для доступа к этой странице необходимо авторизоваться.
    </p>
    <Link to='/login'>
      <button className={`${buttonClasses.base} ${buttonClasses.primary}`}>
        Войти
      </button>
    </Link>
  </div>
);
```

## Профиль пользователя

- Для страницы профиля используйте карточки в стиле Apple:

```jsx
import {
  cardClasses,
  textClasses,
  chipClasses,
} from '../../../styles/global-styles';

// Пример структуры страницы профиля
<div className={cardClasses.base}>
  <div className={cardClasses.header}>
    <h2 className={textClasses.heading}>Профиль пользователя</h2>
  </div>
  <div className={cardClasses.body}>
    <div className='mb-4'>
      <span className={textClasses.secondary}>Имя пользователя:</span>
      <p className={textClasses.body}>username</p>
    </div>

    <div className='mb-4'>
      <span className={textClasses.secondary}>Роль:</span>
      <span className={`${chipClasses.base} ${chipClasses.primary} ml-2`}>
        {user.role}
      </span>
    </div>

    <div className='mb-4'>
      <span className={textClasses.secondary}>Последний вход:</span>
      <p className={textClasses.body}>{user.lastLogin}</p>
    </div>
  </div>
  <div className={cardClasses.footer}>
    <button className={`${buttonClasses.base} ${buttonClasses.danger}`}>
      Выйти
    </button>
  </div>
</div>;

// Доступные классы для карточек:
// cardClasses.base - базовый стиль карточки
// cardClasses.interactive - интерактивная карточка с эффектами
// cardClasses.header - заголовок карточки
// cardClasses.body - содержимое карточки
// cardClasses.footer - подвал карточки
// cardClasses.title - стиль для заголовка внутри карточки
// cardClasses.subtitle - стиль для подзаголовка внутри карточки
```

## Адаптивный дизайн

- Используйте префиксы `sm:`, `md:`, `lg:` для адаптивного дизайна:

```jsx
// Формы авторизации должны быть адаптивными
<div className='w-full sm:w-3/4 md:w-1/2 lg:w-1/3 mx-auto'>
  {/* Форма авторизации */}
</div>

// Контрольные точки для адаптивного дизайна:
// sm: 640px - малые устройства
// md: 768px - средние устройства
// lg: 1024px - большие устройства
// xl: 1280px - очень большие устройства
```

## Цветовая палитра

Используйте следующие цвета из глобальных стилей:

```jsx
import { COLORS } from '../../../styles/global-styles';

// Основные цвета
const colors = {
  PRIMARY: '#0A84FF', // Apple blue - основной цвет для элементов авторизации
  SUCCESS: '#30D158', // Apple green - для успешной авторизации
  DANGER: '#FF3B30', // Apple red - для ошибок и кнопки выхода
  TEXT_PRIMARY: '#1D1D1F', // Apple dark gray - для основного текста
  TEXT_SECONDARY: '#86868B', // Apple medium gray - для вторичного текста
  BACKGROUND: '#F5F5F7', // Apple light gray - для фона
};
```

## Важные замечания по Windows

- При работе в Windows используйте PowerShell для лучшей совместимости.
- Используйте прямые слеши (/) для путей, чтобы обеспечить кроссплатформенную совместимость.
- Перед коммитом проверьте стили на соответствие дизайну в стиле Apple.
