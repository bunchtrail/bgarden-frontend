# Руководство по использованию унифицированной системы форм

## Введение

Унифицированная система форм разработана для обеспечения единого стиля и поведения форм во всем приложении Botanical Garden. Она состоит из базовых компонентов в `Form.tsx` и расширенных компонентов с поддержкой валидации в `FormExtended.tsx`.

## Базовые компоненты форм (Form.tsx)

```tsx
import { Form, FormControl, FormLabel, FormInput, FormSelect, FormTextarea, FormError } from '../components/ui/Form';
```

- `Form` - контейнер формы
- `FormControl` - контейнер для отдельного поля формы
- `FormLabel` - метка поля
- `FormInput` - текстовое поле ввода
- `FormSelect` - поле выбора из списка
- `FormTextarea` - многострочное текстовое поле
- `FormError` - сообщение об ошибке

## Расширенные компоненты с валидацией (FormExtended.tsx)

```tsx
import { 
  ExtendedForm, 
  ValidatedTextField, 
  ValidatedNumberField, 
  ValidatedSelectField, 
  ValidatedCheckboxField 
} from '../components/ui/FormExtended';
```

Расширенные компоненты предоставляют:
- Индикация ошибок валидации
- Индикация успешной валидации
- Автоматическая проверка при потере фокуса
- Визуальная обратная связь
- Обработка обязательных полей

## Как использовать расширенные компоненты

### 1. Определите структуру данных формы

```tsx
interface FormData {
  name: string;
  description: string;
  category: string;
  quantity: number | '';
  isActive: boolean;
}
```

### 2. Настройте состояния формы

```tsx
const [formData, setFormData] = useState<FormData>({
  name: '',
  description: '',
  category: '',
  quantity: '',
  isActive: false
});

const [errors, setErrors] = useState<Record<string, string>>({});
const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
const [formSubmitted, setFormSubmitted] = useState(false);
```

### 3. Создайте обработчики изменений и валидации

```tsx
const markFieldAsTouched = (name: string) => {
  setTouchedFields(prev => ({ ...prev, [name]: true }));
  validateField(name, formData[name as keyof FormData]);
};

const validateField = (name: string, value: any): boolean => {
  let isValid = true;
  const newErrors = { ...errors };

  // Логика валидации
  
  setErrors(newErrors);
  return isValid;
};

const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
  if (touchedFields[name]) {
    validateField(name, value);
  }
};

// Аналогичные обработчики для других типов полей
```

### 4. Используйте компоненты в форме

```tsx
<ExtendedForm onSubmit={handleSubmit}>
  <ValidatedTextField
    label="Название"
    name="name"
    required
    value={formData.name}
    onChange={handleTextChange}
    errors={errors}
    touchedFields={touchedFields}
    formSubmitted={formSubmitted}
    markFieldAsTouched={markFieldAsTouched}
  />
  
  <ValidatedSelectField
    label="Категория"
    name="category"
    required
    options={categoryOptions}
    value={formData.category}
    onChange={handleSelectChange}
    errors={errors}
    touchedFields={touchedFields}
    formSubmitted={formSubmitted}
    markFieldAsTouched={markFieldAsTouched}
  />
  
  <button type="submit" className={`${buttonClasses.base} ${buttonClasses.primary}`}>
    Отправить
  </button>
</ExtendedForm>
```

## Доступные поля формы

### ValidatedTextField
Для текстовых полей, включая многострочные.

```tsx
<ValidatedTextField
  label="Строка"
  name="stringField"
  required={true}
  multiline={false}
  rows={1}
  value={formData.stringField}
  onChange={handleTextChange}
  placeholder="Введите текст"
  errors={errors}
  touchedFields={touchedFields}
  formSubmitted={formSubmitted}
  markFieldAsTouched={markFieldAsTouched}
/>
```

### ValidatedNumberField
Для числовых полей с возможностью установки минимального и максимального значения.

```tsx
<ValidatedNumberField
  label="Число"
  name="numberField"
  required={true}
  min={0}
  max={100}
  value={formData.numberField}
  onChange={handleNumberChange}
  errors={errors}
  touchedFields={touchedFields}
  formSubmitted={formSubmitted}
  markFieldAsTouched={markFieldAsTouched}
/>
```

### ValidatedSelectField
Для полей выбора из списка.

```tsx
<ValidatedSelectField
  label="Выбор"
  name="selectField"
  required={true}
  options={[
    { value: 'option1', label: 'Опция 1' },
    { value: 'option2', label: 'Опция 2' }
  ]}
  value={formData.selectField}
  onChange={handleSelectChange}
  errors={errors}
  touchedFields={touchedFields}
  formSubmitted={formSubmitted}
  markFieldAsTouched={markFieldAsTouched}
/>
```

### ValidatedCheckboxField
Для чекбоксов.

```tsx
<ValidatedCheckboxField
  label="Чекбокс"
  name="checkboxField"
  checked={formData.checkboxField}
  onChange={handleCheckboxChange}
  hint="Подсказка для поля"
  errors={errors}
  touchedFields={touchedFields}
  formSubmitted={formSubmitted}
  markFieldAsTouched={markFieldAsTouched}
/>
```

## Миграция с других форм

При миграции существующих форм на унифицированную систему:

1. Замените компоненты на соответствующие из унифицированной системы
2. Адаптируйте обработчики событий и валидацию
3. Используйте общие стили из `global-styles.ts` вместо локальных стилей
4. Удалите дублирующийся код валидации и обработки форм

## Полезные советы

- Используйте наш пример `UnifiedFormExample.tsx` как отправную точку
- Для более сложных форм создайте отдельные компоненты для разных секций
- При работе с большими формами используйте вкладки для разделения контента

## Заключение

Использование унифицированной системы форм позволяет:
- Обеспечить единообразный пользовательский опыт
- Сократить дублирование кода
- Упростить поддержку и модификацию форм
- Улучшить доступность и UX компонентов 