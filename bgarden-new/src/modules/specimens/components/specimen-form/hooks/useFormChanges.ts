import { useState, useCallback } from 'react';
import { SpecimenFormData } from '../../../types';

interface UseFormChangesResult {
  formData: SpecimenFormData;
  setFormData: React.Dispatch<React.SetStateAction<SpecimenFormData>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  updateField: (name: string, value: any) => void;
}

/**
 * Хук для управления изменениями в форме
 * @param initialData Начальные данные формы
 * @param onFieldChange Функция обратного вызова при изменении поля (для валидации и т.д.)
 */
export const useFormChanges = (
  initialData: SpecimenFormData,
  onFieldChange?: (name: string, value: any) => void
): UseFormChangesResult => {
  const [formData, setFormData] = useState<SpecimenFormData>(initialData);

  // Функция для обновления отдельного поля
  const updateField = useCallback((name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (onFieldChange) {
      onFieldChange(name, value);
    }
  }, [onFieldChange]);

  // Обработчик события изменения в форме
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Для чекбоксов обрабатываем отдельно
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      updateField(name, checkbox.checked);
      return;
    }
    
    // Для числовых полей преобразуем значение
    if (type === 'number') {
      updateField(name, value === '' ? 0 : Number(value));
      return;
    }
    
    // Для остальных полей просто устанавливаем значение
    updateField(name, value);
  }, [updateField]);

  return {
    formData,
    setFormData,
    handleChange,
    updateField
  };
};

export default useFormChanges; 