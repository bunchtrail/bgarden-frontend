import React, { useState } from 'react';
import { useMapService } from '../../hooks';
import { MapData } from '../../types';
import MapContainer from '../MapContainer';
import MapList from '../MapList';

interface NewMapFormData {
  name: string;
  description: string;
  isActive: boolean;
}

const MapManagementPage: React.FC = () => {
  const { createMap, loading, error } = useMapService();
  const [showNewMapForm, setShowNewMapForm] = useState(false);
  const [formData, setFormData] = useState<NewMapFormData>({
    name: '',
    description: '',
    isActive: false,
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedMap, setSelectedMap] = useState<MapData | null>(null);

  // Обработчики изменений в форме
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createMap(formData);
      // Сбрасываем форму
      setFormData({
        name: '',
        description: '',
        isActive: false,
      });
      // Скрываем форму
      setShowNewMapForm(false);
      // Обновляем список карт
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error('Ошибка при создании карты:', err);
    }
  };

  // Обработчик выбора карты
  const handleSelectMap = (map: MapData) => {
    setSelectedMap(map);
  };

  return (
    <div className='map-management-page container mx-auto py-6 px-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Управление картами</h1>
        <button
          className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md'
          onClick={() => setShowNewMapForm(!showNewMapForm)}
        >
          {showNewMapForm ? 'Отменить' : 'Добавить новую карту'}
        </button>
      </div>

      {/* Форма создания новой карты */}
      {showNewMapForm && (
        <div className='new-map-form bg-white p-6 rounded-lg shadow-md mb-8'>
          <h2 className='text-xl font-semibold mb-4'>Создание новой карты</h2>

          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label className='block text-gray-700 font-medium mb-2'>
                Название карты:
              </label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                required
              />
            </div>

            <div className='mb-4'>
              <label className='block text-gray-700 font-medium mb-2'>
                Описание:
              </label>
              <textarea
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                rows={3}
              />
            </div>

            <div className='mb-4'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  name='isActive'
                  checked={formData.isActive}
                  onChange={handleCheckboxChange}
                  className='mr-2'
                />
                <span>Сделать активной</span>
              </label>
            </div>

            <div className='flex justify-end'>
              <button
                type='submit'
                className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md'
                disabled={loading || !formData.name}
              >
                {loading ? 'Создание...' : 'Создать карту'}
              </button>
            </div>
          </form>

          {error && (
            <div className='mt-4 p-3 bg-red-100 text-red-600 rounded'>
              {error.message}
            </div>
          )}
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
        {/* Левая колонка с выбранной картой */}
        <div className='lg:col-span-7 order-2 lg:order-1'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-2xl font-bold mb-4'>
              {selectedMap ? selectedMap.name : 'Выберите карту'}
            </h2>

            {selectedMap ? (
              <MapContainer mapId={selectedMap.id} />
            ) : (
              <div className='flex flex-col items-center justify-center h-80 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-16 w-16 text-gray-400 mb-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1}
                    d='M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'
                  />
                </svg>
                <p className='text-gray-500 text-lg'>
                  Выберите карту из списка справа
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Правая колонка со списком карт */}
        <div className='lg:col-span-5 order-1 lg:order-2'>
          <MapList
            key={refreshKey}
            onSelectMap={handleSelectMap}
            selectedMapId={selectedMap?.id}
          />
        </div>
      </div>
    </div>
  );
};

export default MapManagementPage;
