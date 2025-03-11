import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer } from '../..';
import {
  buttonClasses,
  containerClasses,
  formClasses,
  textClasses,
} from '../../../../styles/global-styles';
import { SectorType } from '../../../specimens/types';
import { useMapService } from '../../hooks';
import { MapData } from '../../types';

const MapPage: React.FC = () => {
  const { getActiveMap, getAllMaps, getSpecimensBySector, loading, error } =
    useMapService();
  const initialLoadRef = useRef(false);
  const _initialStatsLoadRef = useRef(false);
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
    if (initialLoadRef.current) return;

    const loadData = async () => {
      try {
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

        // Помечаем, что начальная загрузка выполнена
        initialLoadRef.current = true;
      } catch (error) {
        console.error('Ошибка при загрузке данных карты:', error);
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

        // Используем функциональную форму setState для безопасного обновления
        // на основе предыдущего состояния
        const specimenCount = specimens.length;
        setSpecimensCount((prev) => {
          // Обновляем только если значение изменилось
          return prev !== specimenCount ? specimenCount : prev;
        });

        // Подсчет уникальных видов (по latinName)
        const uniqueSpecies = new Set(specimens.map((s) => s.latinName));
        const uniqueSpeciesCount = uniqueSpecies.size;
        setUniqueSpeciesCount((prev) => {
          return prev !== uniqueSpeciesCount ? uniqueSpeciesCount : prev;
        });

        // Подсчет уникальных семейств (по familyId)
        const uniqueFamilies = new Set(specimens.map((s) => s.familyId));
        const familiesCount = uniqueFamilies.size;
        setFamiliesCount((prev) => {
          return prev !== familiesCount ? familiesCount : prev;
        });
      } catch (error) {
        console.error('Ошибка при загрузке статистики образцов:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    // Загружаем статистику только при изменении сектора или при первой загрузке
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
      <div className='p-4 bg-[#F5F5F7]'>
        <div className='container mx-auto max-w-6xl'>
          <div className='animate-pulse flex space-x-4 bg-white p-6 rounded-2xl shadow-sm'>
            <div className='flex-1 space-y-4 py-1'>
              <div className='h-5 bg-[#E5E5EA] rounded w-3/4'></div>
              <div className='space-y-2'>
                <div className='h-4 bg-[#E5E5EA] rounded'></div>
                <div className='h-4 bg-[#E5E5EA] rounded'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Отображение ошибки, если есть
  if (error) {
    return (
      <div className='p-4 bg-[#F5F5F7]'>
        <div className='container mx-auto max-w-6xl'>
          <div className='bg-[#FFE5E5] text-[#FF3B30] p-6 rounded-2xl shadow-sm'>
            <h2 className={textClasses.heading}>Ошибка загрузки карты</h2>
            <p className={textClasses.body}>{error.message}</p>
            <Link
              to='/'
              className={`${buttonClasses.base} ${buttonClasses.primary} mt-4 inline-flex`}
            >
              Вернуться на главную
            </Link>
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
    <div className='p-4 bg-[#F5F5F7]'>
      <div className='container mx-auto max-w-6xl'>
        <h1 className={`${textClasses.heading} text-3xl mb-6`}>
          Карта ботанического сада
        </h1>

        {/* Панель быстрого доступа к функциям управления картой */}
        <div className={`${containerClasses.base} mb-6`}>
          <h2 className={`${textClasses.subheading} mb-4`}>
            Управление картой
          </h2>
          <div className='flex flex-wrap gap-3'>
            <Link
              to='/maps/management'
              className={`${buttonClasses.base} ${buttonClasses.success}`}
            >
              Управление картами
            </Link>
            <Link
              to='/maps/upload'
              className={`${buttonClasses.base} ${buttonClasses.primary}`}
            >
              Загрузить изображение
            </Link>
          </div>
        </div>

        <div className={`${containerClasses.base} mb-6`}>
          <div className='flex flex-col md:flex-row md:items-center gap-4 mb-4'>
            {/* Выбор карты */}
            <div className='flex-1'>
              <label htmlFor='map-select' className={formClasses.label}>
                Карта:
              </label>
              <select
                id='map-select'
                value={selectedMapId}
                onChange={handleMapChange}
                className={formClasses.select}
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
            <div className='flex-1'>
              <label htmlFor='sector-select' className={formClasses.label}>
                Сектор:
              </label>
              <select
                id='sector-select'
                value={selectedSector}
                onChange={handleSectorChange}
                className={formClasses.select}
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
            <div className='p-3 rounded-lg bg-[#E2F9EB] border border-[#28B14C] mb-4'>
              <p className='text-[#28B14C]'>
                <span className='font-medium'>Активная карта:</span>{' '}
                {activeMap.name}
                {activeMap.description && ` - ${activeMap.description}`}
              </p>
            </div>
          )}
        </div>

        <div className={containerClasses.base}>
          {selectedMapId ? (
            <MapContainer mapId={selectedMapId} sectorType={selectedSector} />
          ) : (
            <div className='p-8 text-center'>
              <p className={textClasses.secondary}>
                Карты не найдены. Пожалуйста, создайте новую карту в разделе
                управления картами.
              </p>
              <Link
                to='/maps/upload'
                className={`${buttonClasses.base} ${buttonClasses.primary} mt-4 inline-flex`}
              >
                Загрузить карту
              </Link>
            </div>
          )}
        </div>

        {/* Статистика по растениям на карте */}
        {selectedMapId && (
          <div className={`${containerClasses.base} mt-6`}>
            <h2 className={textClasses.subheading}>
              Статистика сектора: {getSectorName(selectedSector)}
            </h2>

            {statsLoading ? (
              <div className='animate-pulse flex space-x-4'>
                <div className='flex-1 space-y-4 py-1'>
                  <div className='h-4 bg-[#E5E5EA] rounded w-3/4'></div>
                  <div className='space-y-2'>
                    <div className='h-4 bg-[#E5E5EA] rounded'></div>
                    <div className='h-4 bg-[#E5E5EA] rounded w-5/6'></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
                <div className='bg-[#F2F7FF] p-4 rounded-lg'>
                  <h3 className='font-medium text-[#0A84FF]'>Всего растений</h3>
                  <p className='text-2xl font-bold text-[#0071E3]'>
                    {specimensCount}
                  </p>
                </div>
                <div className='bg-[#E2F9EB] p-4 rounded-lg'>
                  <h3 className='font-medium text-[#28B14C]'>
                    Уникальных видов
                  </h3>
                  <p className='text-2xl font-bold text-[#28B14C]'>
                    {uniqueSpeciesCount}
                  </p>
                </div>
                <div className='bg-[#FFF8F0] p-4 rounded-lg'>
                  <h3 className='font-medium text-[#FF9F0A]'>Семейств</h3>
                  <p className='text-2xl font-bold text-[#C77A05]'>
                    {familiesCount}
                  </p>
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
