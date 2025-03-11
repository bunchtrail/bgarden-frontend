import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Specimen } from '../../../specimens/types';
import { useMapContext } from '../../contexts/MapContext';
import { useMapService } from '../../hooks';
import PlantMarker from '../markers/PlantMarker';

const PlantLayer: React.FC = () => {
  const { state, setLoading, setError } = useMapContext();
  const { getAllSpecimens, getSpecimensBySector } = useMapService();
  const [specimens, setSpecimens] = useState<Specimen[]>([]);
  const isLoadingRef = useRef(false);

  // Мемоизируем функцию загрузки образцов
  const loadSpecimens = useCallback(async () => {
    // Предотвращаем повторные вызовы, если загрузка уже идет
    if (isLoadingRef.current) return;

    try {
      isLoadingRef.current = true;
      setLoading(true);

      console.log(`Загрузка образцов для сектора ${state.selectedSector}...`);

      // Пробуем сначала получить все образцы, чтобы убедиться, что API работает
      const allSpecimens = await getAllSpecimens();
      console.log(`Все образцы (${allSpecimens.length}):`, allSpecimens);

      // Затем получаем образцы для выбранного сектора
      const filteredSpecimens = await getSpecimensBySector(
        state.selectedSector
      );
      console.log(
        `Образцы для сектора ${state.selectedSector} (${filteredSpecimens.length}):`,
        filteredSpecimens
      );

      // Для отладки: если нет образцов для сектора, но есть образцы в общем списке,
      // используем их с фильтрацией на клиенте
      if (filteredSpecimens.length === 0 && allSpecimens.length > 0) {
        console.log(
          `Нет образцов для сектора ${state.selectedSector}, но есть общие образцы. Применяем клиентскую фильтрацию.`
        );
        // Либо применяем фильтр, либо просто отображаем все
        const clientFilteredSpecimens =
          state.selectedSector !== null
            ? allSpecimens.filter((s) => s.sectorType === state.selectedSector)
            : allSpecimens;

        console.log(
          `Результат клиентской фильтрации (${clientFilteredSpecimens.length}):`,
          clientFilteredSpecimens
        );

        if (clientFilteredSpecimens.length > 0) {
          setSpecimens(clientFilteredSpecimens);
        } else {
          // Если и после клиентской фильтрации ничего нет, показываем все
          console.log('Используем все образцы вместо пустого списка');
          setSpecimens(allSpecimens);
        }
      } else {
        // Используем результаты от сервера
        setSpecimens(filteredSpecimens);
      }

      setError(null);
    } catch (error) {
      console.error('Ошибка при загрузке образцов растений:', error);
      setError('Не удалось загрузить образцы растений');
      setSpecimens([]);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [
    state.selectedSector,
    setError,
    setLoading,
    getSpecimensBySector,
    getAllSpecimens,
  ]);

  // Загрузка образцов растений при изменении сектора или готовности карты
  useEffect(() => {
    // Проверяем, что карта готова и существует
    if (!state.mapReady || !state.mapInstance) {
      console.log(
        'Карта не готова или не существует, пропускаем загрузку образцов'
      );
      return;
    }

    // Загружаем образцы только если не идет другая загрузка
    if (!isLoadingRef.current) {
      console.log('Запускаем загрузку образцов...');
      loadSpecimens();
    }
  }, [state.mapReady, state.mapInstance, state.selectedSector, loadSpecimens]);

  // Если карта не готова, ничего не рендерим
  if (!state.mapReady || !state.mapInstance) {
    return null;
  }

  return (
    <>
      {specimens.length > 0
        ? specimens.map((specimen) => (
            <PlantMarker key={specimen.id} specimen={specimen} />
          ))
        : state.mapReady &&
          !state.loading && (
            <div className='absolute top-10 right-10 bg-white p-3 rounded shadow-md z-[1000]'>
              <p className='text-gray-700'>
                В выбранном секторе нет образцов растений
              </p>
            </div>
          )}
    </>
  );
};

export default PlantLayer;
