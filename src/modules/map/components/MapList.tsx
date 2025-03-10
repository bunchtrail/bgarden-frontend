import React, { useEffect, useState } from 'react';
import { useMapService } from '../hooks';
import { MapData } from '../types';
import MapUploadForm from './forms/MapUploadForm';

interface MapListProps {
  onSelectMap?: (map: MapData) => void;
  selectedMapId?: number;
  showControls?: boolean;
}

/**
 * Компонент для отображения списка карт с использованием API
 */
const MapList: React.FC<MapListProps> = ({
  onSelectMap,
  selectedMapId,
  showControls = true,
}) => {
  const { getAllMaps, deleteMap, toggleMapActive, loading, error } =
    useMapService();
  const [maps, setMaps] = useState<MapData[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [uploadMapId, setUploadMapId] = useState<number | null>(null);

  // Загрузка списка карт
  useEffect(() => {
    const loadMaps = async () => {
      const mapsData = await getAllMaps();
      setMaps(mapsData);
    };

    loadMaps();
  }, [getAllMaps, refreshKey]);

  // Обработчик удаления карты
  const handleDeleteMap = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту карту?')) {
      const success = await deleteMap(id);
      if (success) {
        // Обновляем список после успешного удаления
        setRefreshKey((prev) => prev + 1);
      }
    }
  };

  // Обработчик изменения активного статуса карты
  const handleToggleActive = async (id: number, isActive: boolean) => {
    await toggleMapActive(id, !isActive);
    // Обновляем список после изменения статуса
    setRefreshKey((prev) => prev + 1);
  };

  // Обработчик успешной загрузки карты
  const handleUploadSuccess = (updatedMap: MapData) => {
    // Сбрасываем состояние загрузки
    setUploadMapId(null);

    // Перезагружаем список карт
    setRefreshKey((prev) => prev + 1);

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

  if (loading) {
    return <div className='p-4 text-center'>Загрузка списка карт...</div>;
  }

  if (error) {
    return (
      <div className='p-4 text-center text-red-600 bg-red-100 rounded'>
        {error.message}
      </div>
    );
  }

  if (maps.length === 0) {
    return <div className='p-4 text-center'>Карты не найдены</div>;
  }

  return (
    <div className='maps-list'>
      <h2 className='text-2xl font-bold mb-4'>Список карт</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {maps.map((map) => (
          <div
            key={map.id}
            className='map-card border p-4 rounded-lg shadow hover:shadow-md transition-shadow'
          >
            <div className='map-header mb-2'>
              <h3 className='text-xl font-semibold mb-1'>{map.name}</h3>
              {map.isActive && (
                <span className='inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded'>
                  Активная
                </span>
              )}
            </div>

            <p className='text-gray-600 text-sm mb-3'>{map.description}</p>

            <div className='text-xs text-gray-500 mb-3'>
              <div>
                Загружена: {new Date(map.uploadDate).toLocaleDateString()}
              </div>
              <div>
                Обновлена: {new Date(map.lastUpdated).toLocaleDateString()}
              </div>
              <div>Образцов: {map.specimensCount}</div>
            </div>

            {showControls && (
              <div className='map-actions flex gap-2 mt-4'>
                <button
                  onClick={() => onSelectMap && onSelectMap(map)}
                  className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm'
                >
                  Просмотр
                </button>

                <button
                  onClick={() => openUploadForm(map.id)}
                  className='bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm'
                >
                  Загрузить
                </button>

                <button
                  onClick={() => handleToggleActive(map.id, map.isActive)}
                  className={`${
                    map.isActive
                      ? 'bg-yellow-500 hover:bg-yellow-600'
                      : 'bg-gray-500 hover:bg-gray-600'
                  } text-white px-3 py-1 rounded text-sm`}
                >
                  {map.isActive ? 'Деактивировать' : 'Активировать'}
                </button>

                <button
                  onClick={() => handleDeleteMap(map.id)}
                  className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm'
                >
                  Удалить
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {uploadMapId !== null && (
        <div className='mb-6'>
          <MapUploadForm
            mapId={uploadMapId}
            onSuccess={handleUploadSuccess}
            onCancel={closeUploadForm}
          />
        </div>
      )}
    </div>
  );
};

export default MapList;
