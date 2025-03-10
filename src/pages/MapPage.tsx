import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer } from '../modules/map';
import { useMapService } from '../modules/map/hooks';
import { MapData } from '../modules/map/types';
import { SectorType } from '../modules/specimens/types';

const MapPage: React.FC = () => {
  const { getActiveMap, getAllMaps, getSpecimensBySector, loading, error } =
    useMapService();
  const [selectedSector, setSelectedSector] = useState<SectorType>(
    SectorType.Dendrology
  );
  const [maps, setMaps] = useState<MapData[]>([]);
  const [activeMap, setActiveMap] = useState<MapData | null>(null);
  const [selectedMapId, setSelectedMapId] = useState<number | undefined>(
    undefined
  );
  const [specimensCount, setSpecimensCount] = useState(0);
  const [uniqueSpeciesCount, setUniqueSpeciesCount] = useState(0);
  const [familiesCount, setFamiliesCount] = useState(0);
  const [statsLoading, setStatsLoading] = useState(false);

  // Загрузка карт при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      // Получаем активную карту
      const active = await getActiveMap();
      if (active) {
        setActiveMap(active);
        setSelectedMapId(active.id);
      }

      // Получаем все карты
      const allMaps = await getAllMaps();
      setMaps(allMaps);

      // Если нет активной карты, но есть хотя бы одна карта, выбираем первую
      if (!active && allMaps.length > 0) {
        setSelectedMapId(allMaps[0].id);
      }
    };

    loadData();
  }, [getActiveMap, getAllMaps]);

  // Загрузка статистики при изменении сектора
  useEffect(() => {
    const loadSpecimensStats = async () => {
      if (!selectedSector) return;

      try {
        setStatsLoading(true);
        const specimens = await getSpecimensBySector(selectedSector);

        // Подсчет общего количества образцов
        setSpecimensCount(specimens.length);

        // Подсчет уникальных видов (по latinName)
        const uniqueSpecies = new Set(specimens.map((s) => s.latinName));
        setUniqueSpeciesCount(uniqueSpecies.size);

        // Подсчет уникальных семейств (по familyId)
        const uniqueFamilies = new Set(specimens.map((s) => s.familyId));
        setFamiliesCount(uniqueFamilies.size);
      } catch (error) {
        console.error('Ошибка при загрузке статистики образцов:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    loadSpecimensStats();
  }, [selectedSector, getSpecimensBySector]);

  // Обработчик изменения сектора
  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSector(parseInt(e.target.value, 10) as SectorType);
  };

  // Обработчик выбора карты
  const handleMapChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mapId = parseInt(e.target.value, 10);
    setSelectedMapId(mapId);
  };

  // Отображение лоадера при загрузке
  if (loading && !maps.length) {
    return (
      <div className='map-page p-4'>
        <div className='container mx-auto text-center py-8'>
          <div className='animate-pulse'>Загрузка данных карты...</div>
        </div>
      </div>
    );
  }

  // Отображение ошибки, если есть
  if (error) {
    return (
      <div className='map-page p-4'>
        <div className='container mx-auto'>
          <div className='bg-red-100 text-red-700 p-4 rounded-lg'>
            <h2 className='text-xl font-bold mb-2'>Ошибка загрузки карты</h2>
            <p>{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Функция для отображения названия сектора
  const getSectorName = (sectorType: SectorType): string => {
    switch (sectorType) {
      case SectorType.Dendrology:
        return 'Дендрологический';
      case SectorType.Flora:
        return 'Флора';
      case SectorType.Flowering:
        return 'Цветущие';
      default:
        return 'Неизвестный сектор';
    }
  };

  return (
    <div className='map-page p-4'>
      <div className='container mx-auto'>
        <h1 className='text-3xl font-bold mb-6'>Карта ботанического сада</h1>

        {/* Панель быстрого доступа к функциям управления картой */}
        <div className='map-admin-panel mb-6 p-4 bg-gray-50 rounded-lg shadow-sm'>
          <h2 className='text-xl font-bold mb-3'>Управление картой</h2>
          <div className='flex flex-wrap gap-3'>
            <Link
              to='/maps/management'
              className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition'
            >
              Управление картами
            </Link>
            <Link
              to='/maps/upload'
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
            >
              Загрузить изображение
            </Link>
          </div>
        </div>

        <div className='flex flex-col md:flex-row md:items-center gap-4 mb-6'>
          {/* Выбор карты */}
          <div className='flex items-center'>
            <label htmlFor='map-select' className='mr-2 font-medium'>
              Карта:
            </label>
            <select
              id='map-select'
              value={selectedMapId}
              onChange={handleMapChange}
              className='p-2 border rounded'
              disabled={loading}
            >
              {maps.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.name} {map.isActive ? '(активная)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Выбор сектора */}
          <div className='flex items-center'>
            <label htmlFor='sector-select' className='mr-2 font-medium'>
              Сектор:
            </label>
            <select
              id='sector-select'
              value={selectedSector}
              onChange={handleSectorChange}
              className='p-2 border rounded'
              disabled={loading}
            >
              <option value={SectorType.Dendrology}>Дендрологический</option>
              <option value={SectorType.Flora}>Флора</option>
              <option value={SectorType.Flowering}>Цветущие</option>
            </select>
          </div>
        </div>

        {/* Информация о выбранной карте */}
        {activeMap && (
          <div className='mb-4 bg-green-50 p-3 rounded-lg border border-green-200'>
            <p>
              <span className='font-medium'>Активная карта:</span>{' '}
              {activeMap.name}
              {activeMap.description && ` - ${activeMap.description}`}
            </p>
          </div>
        )}

        <div className='bg-white rounded-lg shadow-md overflow-hidden'>
          {selectedMapId ? (
            <MapContainer mapId={selectedMapId} sectorType={selectedSector} />
          ) : (
            <div className='p-8 text-center text-gray-500'>
              Карты не найдены. Пожалуйста, создайте новую карту в разделе
              управления картами.
            </div>
          )}
        </div>

        {/* Статистика по растениям на карте */}
        {selectedMapId && (
          <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
            <h2 className='text-xl font-bold mb-3'>
              Статистика сектора: {getSectorName(selectedSector)}
            </h2>

            {statsLoading ? (
              <div className='animate-pulse flex space-x-4'>
                <div className='flex-1 space-y-4 py-1'>
                  <div className='h-4 bg-gray-300 rounded w-3/4'></div>
                  <div className='space-y-2'>
                    <div className='h-4 bg-gray-300 rounded'></div>
                    <div className='h-4 bg-gray-300 rounded w-5/6'></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='bg-white p-3 rounded-lg shadow-sm'>
                  <h3 className='font-medium text-gray-700'>Всего растений</h3>
                  <p className='text-2xl font-bold'>{specimensCount}</p>
                </div>
                <div className='bg-white p-3 rounded-lg shadow-sm'>
                  <h3 className='font-medium text-gray-700'>
                    Уникальных видов
                  </h3>
                  <p className='text-2xl font-bold'>{uniqueSpeciesCount}</p>
                </div>
                <div className='bg-white p-3 rounded-lg shadow-sm'>
                  <h3 className='font-medium text-gray-700'>Семейств</h3>
                  <p className='text-2xl font-bold'>{familiesCount}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
