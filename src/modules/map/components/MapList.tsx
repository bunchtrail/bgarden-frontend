import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { mapService } from '../services/mapService';
import { MapData } from '../types';
import MapUploadForm from './forms/MapUploadForm';

interface MapListProps {
  onSelectMap?: (map: MapData) => void;
  selectedMapId?: number;
}

const MapList: React.FC<MapListProps> = ({ onSelectMap, selectedMapId }) => {
  const [maps, setMaps] = useState<MapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadMapId, setUploadMapId] = useState<number | null>(null);

  // Загрузка списка карт
  const loadMaps = async () => {
    try {
      setLoading(true);
      const data = await mapService.getAllMaps();
      setMaps(data);
      setError(null);
    } catch (err) {
      console.error('Ошибка при загрузке списка карт:', err);
      setError('Не удалось загрузить список карт');
    } finally {
      setLoading(false);
    }
  };

  // Загрузка карт при монтировании компонента
  useEffect(() => {
    loadMaps();
  }, []);

  // Обработчик изменения активной карты
  const handleToggleActive = async (map: MapData) => {
    try {
      // Получаем текущий статус
      const newStatus = !map.isActive;

      // Обновляем статус карты
      await mapService.toggleMapActive(map.id, newStatus);

      // Показываем уведомление
      toast.success(`Карта ${newStatus ? 'активирована' : 'деактивирована'}`);

      // Перезагружаем список карт
      loadMaps();
    } catch (err) {
      console.error('Ошибка при изменении статуса карты:', err);
      toast.error('Не удалось изменить статус карты');
    }
  };

  // Обработчик успешной загрузки карты
  const handleUploadSuccess = (updatedMap: MapData) => {
    // Сбрасываем состояние загрузки
    setUploadMapId(null);

    // Перезагружаем список карт
    loadMaps();

    // Вызываем callback выбора карты, если он предоставлен
    if (onSelectMap) {
      onSelectMap(updatedMap);
    }
  };

  // Открытие формы загрузки для карты
  const openUploadForm = (mapId: number) => {
    setUploadMapId(mapId);
  };

  // Закрытие формы загрузки
  const closeUploadForm = () => {
    setUploadMapId(null);
  };

  if (loading && maps.length === 0) {
    return (
      <div className='p-4 text-center'>
        <div className='animate-pulse'>Загрузка списка карт...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-4 bg-red-50 border border-red-200 rounded-lg text-center'>
        <div className='text-red-600'>{error}</div>
        <button
          onClick={loadMaps}
          className='mt-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors'
        >
          Повторить
        </button>
      </div>
    );
  }

  return (
    <div className='map-list'>
      <h2 className='text-xl font-bold mb-4'>Карты ботанического сада</h2>

      {uploadMapId !== null && (
        <div className='mb-6'>
          <MapUploadForm
            mapId={uploadMapId}
            onSuccess={handleUploadSuccess}
            onCancel={closeUploadForm}
          />
        </div>
      )}

      {maps.length === 0 ? (
        <div className='p-4 bg-gray-50 border border-gray-200 rounded-lg text-center'>
          <p>Список карт пуст</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {maps.map((map) => (
            <div
              key={map.id}
              className={`
                bg-white p-4 rounded-lg shadow-md border-2 transition-all
                ${
                  selectedMapId === map.id
                    ? 'border-green-500'
                    : 'border-transparent'
                }
                ${map.isActive ? 'ring-2 ring-green-300' : ''}
                hover:shadow-lg
              `}
            >
              {/* Название и описание карты */}
              <div className='mb-3'>
                <h3 className='text-lg font-semibold'>{map.name}</h3>
                {map.description && (
                  <p className='text-gray-600 text-sm mt-1'>
                    {map.description}
                  </p>
                )}
              </div>

              {/* Изображение карты */}
              {map.filePath && (
                <div className='mb-3'>
                  <img
                    src={mapService.getMapImageUrl(map.filePath)}
                    alt={map.name}
                    className='w-full h-32 object-cover rounded-md'
                  />
                </div>
              )}

              {/* Информация о карте */}
              <div className='text-sm text-gray-500 mb-3'>
                <p>
                  Загружена: {new Date(map.uploadDate).toLocaleDateString()}
                </p>
                <p>Растений: {map.specimensCount}</p>
                <p>
                  Статус:{' '}
                  {map.isActive ? (
                    <span className='text-green-600 font-medium'>Активна</span>
                  ) : (
                    <span className='text-gray-400'>Неактивна</span>
                  )}
                </p>
              </div>

              {/* Кнопки управления */}
              <div className='flex justify-between mt-2'>
                <button
                  onClick={() => handleToggleActive(map)}
                  className={`
                    px-3 py-1 rounded-md text-sm
                    ${
                      map.isActive
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }
                  `}
                >
                  {map.isActive ? 'Деактивировать' : 'Активировать'}
                </button>

                <div className='space-x-2'>
                  <button
                    onClick={() => openUploadForm(map.id)}
                    className='px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200'
                  >
                    Загрузить
                  </button>

                  {onSelectMap && (
                    <button
                      onClick={() => onSelectMap(map)}
                      className='px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700'
                    >
                      Выбрать
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MapList;
