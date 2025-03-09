import React, { useEffect, useState } from 'react';
import { Specimen } from '../../../specimens/types';
import { useMapContext } from '../../contexts/MapContext';
import { mapService } from '../../services/mapService';
import { MapMode } from '../../types';

interface PlantEditFormProps {
  specimen: Specimen;
}

const PlantEditForm: React.FC<PlantEditFormProps> = ({ specimen }) => {
  const { state, setMode } = useMapContext();
  const [formData, setFormData] = useState<Specimen>(specimen);
  const [saving, setSaving] = useState(false);

  // Обновляем данные формы при изменении выбранного образца
  useEffect(() => {
    setFormData(specimen);
  }, [specimen]);

  // Обработчик изменения полей формы
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'familyId' || name === 'regionId' || name === 'sectorType'
          ? parseInt(value, 10)
          : value,
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      // Отправка данных на сервер
      await mapService.updateSpecimen(formData.id, formData);

      // Сброс режима
      setMode(MapMode.VIEW);

      // Уведомляем пользователя
      alert('Растение успешно обновлено!');
    } catch (error) {
      console.error('Ошибка при обновлении растения:', error);
      alert('Не удалось обновить растение');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='plant-form bg-white p-4 rounded-lg shadow-md'>
      <h3 className='text-lg font-bold mb-4'>Редактировать растение</h3>

      <div className='mb-4 p-2 bg-blue-50 rounded border border-blue-100'>
        <p>
          <strong>ID:</strong> {formData.id}
          <br />
          <strong>Координаты:</strong> {formData.latitude.toFixed(6)},{' '}
          {formData.longitude.toFixed(6)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='form-group'>
          <label htmlFor='inventoryNumber' className='block mb-1'>
            Инвентарный номер
          </label>
          <input
            type='text'
            id='inventoryNumber'
            name='inventoryNumber'
            value={formData.inventoryNumber || ''}
            onChange={handleChange}
            className='w-full p-2 border rounded'
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='russianName' className='block mb-1'>
            Русское название
          </label>
          <input
            type='text'
            id='russianName'
            name='russianName'
            value={formData.russianName || ''}
            onChange={handleChange}
            className='w-full p-2 border rounded'
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='latinName' className='block mb-1'>
            Латинское название
          </label>
          <input
            type='text'
            id='latinName'
            name='latinName'
            value={formData.latinName || ''}
            onChange={handleChange}
            className='w-full p-2 border rounded'
            required
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='form-group'>
            <label htmlFor='genus' className='block mb-1'>
              Род
            </label>
            <input
              type='text'
              id='genus'
              name='genus'
              value={formData.genus || ''}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>

          <div className='form-group'>
            <label htmlFor='species' className='block mb-1'>
              Вид
            </label>
            <input
              type='text'
              id='species'
              name='species'
              value={formData.species || ''}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>
        </div>

        <div className='form-group'>
          <label htmlFor='familyId' className='block mb-1'>
            Семейство
          </label>
          <select
            id='familyId'
            name='familyId'
            value={formData.familyId}
            onChange={handleChange}
            className='w-full p-2 border rounded'
            required
          >
            <option value='0'>Выберите семейство...</option>
            {/* Здесь должен быть список семейств */}
          </select>
        </div>

        <div className='form-group'>
          <label htmlFor='regionId' className='block mb-1'>
            Регион
          </label>
          <select
            id='regionId'
            name='regionId'
            value={formData.regionId}
            onChange={handleChange}
            className='w-full p-2 border rounded'
            required
          >
            <option value='0'>Выберите регион...</option>
            {/* Здесь должен быть список регионов */}
          </select>
        </div>

        <div className='form-actions flex space-x-2 pt-2'>
          <button
            type='submit'
            className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400'
            disabled={saving}
          >
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
          <button
            type='button'
            className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
            onClick={() => setMode(MapMode.VIEW)}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlantEditForm;
