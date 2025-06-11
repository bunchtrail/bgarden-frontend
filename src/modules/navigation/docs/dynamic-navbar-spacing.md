# Динамические отступы от навбара

Система динамических отступов автоматически рассчитывает высоту навбара и предоставляет различные способы работы с ней.

## Как это работает

1. **Хук `useNavbarHeight`** - отслеживает высоту навбара через ResizeObserver и ref
2. **Контекст `NavbarHeightProvider`** - предоставляет высоту навбара всему приложению
3. **CSS-переменная `--navbar-height`** - автоматически обновляется и доступна глобально
4. **Утилитарные CSS-классы** - для удобного использования отступов

## Использование в компонентах

### Через контекст (рекомендуется)

```tsx
import { useNavbarHeightContext } from '../../navigation';

const MyComponent = () => {
  const { navbarHeight } = useNavbarHeightContext();

  return (
    <div style={{ paddingTop: navbarHeight }}>
      Контент с отступом от навбара
    </div>
  );
};
```

### Через CSS-классы (проще всего)

```tsx
// Отступ сверху равный высоте навбара
<div className="pt-navbar">Контент</div>

// Высота экрана минус навбар
<div className="h-screen-minus-navbar">Полноэкранный контент</div>

// Sticky позиционирование под навбаром
<div className="sticky-below-navbar">Липкий элемент</div>

// С плавными переходами
<div className="pt-navbar navbar-transition">Плавные переходы</div>
```

## Доступные CSS-классы

| Класс                       | Описание                                    |
| --------------------------- | ------------------------------------------- |
| `pt-navbar`                 | Отступ сверху равный высоте навбара         |
| `mt-navbar`                 | Внешний отступ сверху равный высоте навбара |
| `h-screen-minus-navbar`     | Высота экрана минус навбар                  |
| `min-h-screen-minus-navbar` | Минимальная высота экрана минус навбар      |
| `top-navbar`                | Позиционирование сверху на высоте навбара   |
| `navbar-transition`         | Плавные переходы для изменения отступов     |
| `sticky-below-navbar`       | Sticky позиционирование под навбаром        |

## CSS-переменная

Переменная `--navbar-height` доступна глобально:

```css
.my-custom-class {
  margin-top: var(--navbar-height);
  height: calc(100vh - var(--navbar-height));
}
```

## Интеграция в MainLayout

MainLayout автоматически:

- Создает провайдер контекста высоты навбара
- Передает ref в компонент Navbar
- Применяет отступы к основному контенту
- Обновляет CSS-переменную при изменении высоты

## Адаптивность

Система автоматически реагирует на:

- Изменение размера окна
- Изменение содержимого навбара (например, переход в мобильный режим)
- Динамическое добавление/удаление элементов навбара

## Примеры использования

### Полноэкранная карта под навбаром

```tsx
<div className="h-screen-minus-navbar w-full">
  <MapComponent />
</div>
```

### Боковая панель с sticky заголовком

```tsx
<div className="pt-navbar">
  <div className="sticky-below-navbar bg-white border-b p-4">
    Заголовок панели
  </div>
  <div className="p-4">Содержимое панели</div>
</div>
```

### Модальное окно на полный экран

```tsx
<div className="fixed inset-0 pt-navbar navbar-transition">
  <div className="h-full bg-white">Модальный контент</div>
</div>
```
