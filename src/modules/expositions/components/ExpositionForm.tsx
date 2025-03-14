import React, { useEffect, useState } from 'react';
import { expositionService } from '../services';
import { ExpositionDto, ExpositionFormData } from '../types';
import { useNotifications } from '../../../modules/notifications';

interface ExpositionFormProps {
  expositionId?: number;
  onSuccess: (exposition: ExpositionDto) => void;
  onCancel: () => void;
}

export const ExpositionForm: React.FC<ExpositionFormProps> = ({
  expositionId,
  onSuccess,
  onCancel,
}) => {
  const isEditMode = !!expositionId;
  const { showSuccess, showError } = useNotifications();

  const [formData, setFormData] = useState<ExpositionFormData>({
    name: '',
    description: '',
    specimensCount: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchExposition = async () => {
      if (expositionId) {
        try {
          const data = await expositionService.getExpositionById(expositionId);
          setFormData(data);
        } catch (error) {
          console.error('Ошибка при загрузке данных экспозиции:', error);
          showError('Не удалось загрузить данные экспозиции. Пожалуйста, попробуйте позже.');
        }
      }
    };

    fetchExposition();
  }, [expositionId, showError]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Название экспозиции обязательно к заполнению';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание экспозиции обязательно к заполнению';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: ExpositionFormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let result: ExpositionDto;

      if (isEditMode && expositionId) {
        result = await expositionService.updateExposition(expositionId, {
          ...formData,
          id: expositionId,
        } as ExpositionDto);
        showSuccess('Экспозиция успешно обновлена');
      } else {
        result = await expositionService.createExposition(formData);
        showSuccess('Новая экспозиция успешно создана');
      }

      onSuccess(result);
    } catch (error) {
      console.error('Ошибка при сохранении экспозиции:', error);
      showError('Не удалось сохранить экспозицию. Пожалуйста, проверьте данные и попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>
        {isEditMode ? 'Редактирование экспозиции' : 'Создание новой экспозиции'}
      </h2>

      <div>
        <label
          htmlFor='name'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Название экспозиции *
        </label>
        <input
          type='text'
          id='name'
          name='name'
          value={formData.name}
          onChange={handleChange}
          className={`w-full p-3 border ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder='Например: Хвойные'
        />
        {errors.name && (
          <p className='mt-1 text-sm text-red-500'>{errors.name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor='description'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Описание экспозиции *
        </label>
        <textarea
          id='description'
          name='description'
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`w-full p-3 border ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder='Описание экспозиции...'
        />
        {errors.description && (
          <p className='mt-1 text-sm text-red-500'>{errors.description}</p>
        )}
      </div>

      <div className='flex gap-4 pt-4'>
        <button
          type='button'
          onClick={onCancel}
          className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors'
          disabled={isSubmitting}
        >
          Отмена
        </button>
        <button
          type='submit'
          disabled={isSubmitting}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400'
        >
          {isSubmitting
            ? 'Сохранение...'
            : isEditMode
            ? 'Сохранить изменения'
            : 'Создать экспозицию'}
        </button>
      </div>
    </form>
  );
};
