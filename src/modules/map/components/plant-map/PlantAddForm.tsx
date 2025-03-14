// Форма добавления растения

import React, { useState } from 'react';
import { useMapContext } from '../../contexts';
import { useNotifications } from '../../../../modules/notifications';

interface PlantAddFormProps {
  position?: [number, number]; // Опциональные координаты по умолчанию
  onClose: () => void;
  onSubmit?: (name: string, description: string, position: [number, number]) => void;
}

const PlantAddForm: React.FC<PlantAddFormProps> = ({
  position = [0, 0],
  onClose,
  onSubmit,
}) => {
  const { addPlant } = useMapContext();
  const { showWarning, showSuccess } = useNotifications();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [plantPosition, setPlantPosition] =
    useState<[number, number]>(position);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showWarning('Введите название растения');
      return;
    }

    if (onSubmit) {
      // Если передан колбэк onSubmit, используем его
      onSubmit(name, description, plantPosition);
    } else {
      // Иначе используем контекст для добавления растения
      addPlant({
        name,
        description,
        position: plantPosition,
      });
    }

    showSuccess('Растение успешно добавлено');
    onClose();
  };

  return (
    <div className='bg-white p-4 rounded shadow-lg'>
      <h3 className='text-lg font-semibold mb-4'>Добавить растение</h3>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>Название</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full px-3 py-2 border rounded'
            required
          />
        </div>

        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='w-full px-3 py-2 border rounded'
            rows={3}
          />
        </div>

        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>
            Координаты X, Y
          </label>
          <div className='flex gap-2'>
            <input
              type='number'
              value={plantPosition[0]}
              onChange={(e) =>
                setPlantPosition([Number(e.target.value), plantPosition[1]])
              }
              className='w-1/2 px-3 py-2 border rounded'
            />
            <input
              type='number'
              value={plantPosition[1]}
              onChange={(e) =>
                setPlantPosition([plantPosition[0], Number(e.target.value)])
              }
              className='w-1/2 px-3 py-2 border rounded'
            />
          </div>
        </div>

        <div className='flex justify-end gap-2'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 border rounded text-gray-600 hover:bg-gray-100'
          >
            Отмена
          </button>
          <button
            type='submit'
            className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
          >
            Добавить
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlantAddForm;
