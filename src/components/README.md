# Компоненты приложения

В этой директории находятся общие компоненты, используемые во всём приложении.

## ErrorMessage

Модульный компонент для отображения ошибок в едином стиле. Компонент поддерживает различные типы ошибок и варианты отображения, специально разработан в современном стиле Apple.

### Использование

```tsx
import { ErrorMessage } from '../components';

// Простое сообщение об ошибке
<ErrorMessage
  message="Произошла ошибка при выполнении операции"
  severity="error"
/>

// С детальной информацией и возможностью закрыть
<ErrorMessage
  message="Ошибка соединения с сервером"
  detail="Проверьте подключение к интернету или повторите попытку позже"
  severity="warning"
  onClose={() => setError(null)}
/>

// С действием для решения проблемы
<ErrorMessage
  message="Операция не выполнена"
  severity="info"
  actionText="Повторить"
  onAction={handleRetry}
/>

// В виде баннера
<ErrorMessage
  message="Успешно сохранено"
  severity="success"
  variant="banner"
/>
```

### Параметры

| Параметр   | Тип                                                     | Обязательный | Описание                                      |
| ---------- | ------------------------------------------------------- | ------------ | --------------------------------------------- |
| message    | string &#124; null                                      | Да           | Основное сообщение об ошибке                  |
| detail     | string                                                  | Нет          | Дополнительная информация об ошибке           |
| severity   | 'error' &#124; 'warning' &#124; 'info' &#124; 'success' | Нет          | Тип сообщения (по умолчанию 'error')          |
| onClose    | () => void                                              | Нет          | Функция для закрытия сообщения                |
| variant    | 'standard' &#124; 'banner' &#124; 'toast'               | Нет          | Вариант отображения (по умолчанию 'standard') |
| actionText | string                                                  | Нет          | Текст кнопки действия                         |
| onAction   | () => void                                              | Нет          | Функция, вызываемая при нажатии на действие   |

### Цветовая схема

Компонент использует официальные цвета Apple:

- **Error**: RGB(255, 59, 48) - Красный
- **Warning**: RGB(255, 204, 0) - Жёлтый
- **Info**: RGB(0, 122, 255) - Синий
- **Success**: RGB(52, 199, 89) - Зелёный

### Интеграция с утилитами обработки ошибок

Компонент отлично интегрируется с утилитами из `src/utils/errorUtils.ts` для автоматического форматирования и определения типа ошибок:

```tsx
import { ErrorMessage } from '../components';
import {
  formatErrorMessage,
  getErrorType,
  getErrorDetails,
  getErrorAction,
} from '../utils';

// В компоненте:
const [error, setError] = useState<string | null>(null);
const [errorDetail, setErrorDetail] = useState<string | null>(null);

// При возникновении ошибки:
try {
  // выполнение операции
} catch (err) {
  setError(formatErrorMessage(err));
  setErrorDetail(getErrorDetails(err));
}

// В render:
<ErrorMessage
  message={error}
  detail={errorDetail}
  severity={
    error
      ? getErrorType(error).type === 'auth'
        ? 'error'
        : 'warning'
      : 'error'
  }
  actionText={getErrorAction(error) || undefined}
  onAction={handleErrorAction}
  onClose={() => setError(null)}
/>;
```
