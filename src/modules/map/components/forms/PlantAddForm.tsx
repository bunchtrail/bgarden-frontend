import React, { useEffect, useState } from 'react';
import { Specimen } from '../../../specimens/types';
import { useMapContext } from '../../contexts/MapContext';
import { mapService } from '../../services/mapService';
import { MapMode } from '../../types';

interface LocationState {
  latitude: number;
  longitude: number;
}

const PlantAddForm: React.FC = () => {
  const { state, setMode } = useMapContext();
  const [location, setLocation] = useState<LocationState | null>(null);
  const [formData, setFormData] = useState<Partial<Specimen>>({
    sectorType: state.selectedSector,
    inventoryNumber: '',
    russianName: '',
    latinName: '',
    genus: '',
    species: '',
    familyId: 0,
    regionId: 0,
  });
  const [saving, setSaving] = useState(false);

  // Устанавливаем обработчик клика по карте для выбора местоположения
  useEffect(() => {
    // Проверяем, что карта готова и находимся в правильном режиме
    if (
      !state.mapInstance ||
      !state.mapReady ||
      state.mode !== MapMode.ADD_PLANT
    ) {
      console.log(
        'Карта не готова для добавления точек или режим не соответствует'
      );
      return;
    }

    console.log('Добавление обработчика клика на карту');

    // Обработчик клика по карте с обработкой ошибок
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      try {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        // Проверка координат на валидность
        if (isNaN(lat) || isNaN(lng)) {
          console.error('Невалидные координаты:', lat, lng);
          return;
        }

        console.log('Выбраны координаты:', lat, lng);

        // Устанавливаем координаты в состояние
        setLocation({
          latitude: lat,
          longitude: lng,
        });
      } catch (error) {
        console.error('Ошибка при обработке клика по карте:', error);
      }
    };

    try {
      // Добавляем обработчик с проверкой доступности карты
      state.mapInstance.on('click', handleMapClick);

      // Очистка при размонтировании
      return () => {
        try {
          if (state.mapInstance) {
            console.log('Удаление обработчика клика с карты');
            state.mapInstance.off('click', handleMapClick);
          }
        } catch (error) {
          console.error('Ошибка при удалении обработчика клика:', error);
        }
      };
    } catch (error) {
      console.error('Ошибка при установке обработчика клика:', error);
    }
  }, [state.mapInstance, state.mapReady, state.mode]);

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

    if (!location) {
      alert('Выберите местоположение растения на карте');
      return;
    }

    try {
      setSaving(true);

      // Подготовка данных для отправки
      const specimenData: Omit<Specimen, 'id'> = {
        ...(formData as Omit<Specimen, 'id'>),
        latitude: location.latitude,
        longitude: location.longitude,
      };

      // Отправка данных на сервер
      await mapService.addSpecimen(specimenData);

      // Сброс формы и режима
      setFormData({
        sectorType: state.selectedSector,
        inventoryNumber: '',
        russianName: '',
        latinName: '',
        genus: '',
        species: '',
        familyId: 0,
        regionId: 0,
      });
      setLocation(null);
      setMode(MapMode.VIEW);

      // Уведомляем пользователя
      alert('Растение успешно добавлено!');
    } catch (error) {
      console.error('Ошибка при добавлении растения:', error);
      alert('Не удалось добавить растение');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='plant-form bg-white p-4 rounded-lg shadow-md'>
      <h3 className='text-lg font-bold mb-4'>Добавить новое растение</h3>

      {location && (
        <div className='mb-4 p-2 bg-green-50 rounded border border-green-100'>
          <p>
            Выбранное местоположение: {location.latitude.toFixed(6)},{' '}
            {location.longitude.toFixed(6)}
          </p>
        </div>
      )}

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
            disabled={saving || !location}
          >
            {saving ? 'Сохранение...' : 'Добавить растение'}
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

export default PlantAddForm;
