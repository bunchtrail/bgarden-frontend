import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Specimen } from '../../../specimens/types';
import { useMapContext } from '../../contexts/MapContext';
import { mapService } from '../../services/mapService';
import PlantMarker from '../markers/PlantMarker';

const PlantLayer: React.FC = () => {
  const { state, setLoading, setError } = useMapContext();
  const [specimens, setSpecimens] = useState<Specimen[]>([]);
  const isLoadingRef = useRef(false);

  // Мемоизируем функцию загрузки образцов
  const loadSpecimens = useCallback(async () => {
    // Предотвращаем повторные вызовы, если загрузка уже идет
    if (isLoadingRef.current) return;

    try {
      isLoadingRef.current = true;
      setLoading(true);

      // Получаем все образцы растений из API
      const allSpecimens = await mapService.getAllSpecimens();

      // Фильтруем образцы по выбранному сектору
      const filteredSpecimens = allSpecimens.filter(
        (specimen) => specimen.sectorType === state.selectedSector
      );

      setSpecimens(filteredSpecimens);
      setError(null);
    } catch (error) {
      console.error('Ошибка при загрузке образцов растений:', error);
      setError('Не удалось загрузить образцы растений');
      setSpecimens([]);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [state.selectedSector, setError, setLoading]);

  // Загрузка образцов растений при изменении сектора или готовности карты
  useEffect(() => {
    // Проверяем, что карта готова и существует
    if (!state.mapReady || !state.mapInstance) return;

    // Загружаем образцы только если не идет другая загрузка
    if (!isLoadingRef.current) {
      loadSpecimens();
    }

  }, [state.mapReady, state.mapInstance, state.selectedSector, loadSpecimens]);

  // Если карта не готова, ничего не рендерим
  if (!state.mapReady || !state.mapInstance) {
    return null;
  }

  return (
    <>
      {specimens.map((specimen) => (
        <PlantMarker key={specimen.id} specimen={specimen} />
      ))}
      {specimens.length === 0 && state.mapReady && !state.loading && (
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
