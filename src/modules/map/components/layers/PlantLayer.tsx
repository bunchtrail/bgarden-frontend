import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Specimen } from '../../../specimens/types';
import { useMapContext } from '../../contexts/MapContext';
import { useMapService } from '../../hooks';
import PlantMarker from '../markers/PlantMarker';

// Простой компонент отладки
const DebugPanel = ({
  onForceLoad,
  specimenCount,
  isLoading,
  isLoaded,
  mapReady,
  hasMapInstance,
}: {
  onForceLoad: () => void;
  specimenCount: number;
  isLoading: boolean;
  isLoaded: boolean;
  mapReady: boolean;
  hasMapInstance: boolean;
}) => (
  <div className='absolute top-4 right-4 bg-white p-3 rounded shadow-md z-[9999] text-xs'>
    <h3 className='font-bold mb-2'>Отладка загрузки растений</h3>
    <div className='mb-2'>
      <p>Статус карты: {mapReady ? '✅ Готова' : '❌ Не готова'}</p>
      <p>Экземпляр карты: {hasMapInstance ? '✅ Есть' : '❌ Нет'}</p>
      <p>Загрузка: {isLoading ? '🔄 Загружается...' : '⏹️ Не загружается'}</p>
      <p>Уже загружены: {isLoaded ? '✅ Да' : '❌ Нет'}</p>
      <p>Количество растений: {specimenCount}</p>
    </div>
    <div className='flex justify-center'>
      <button
        onClick={onForceLoad}
        disabled={isLoading}
        className='bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50'
      >
        {isLoading ? 'Загрузка...' : 'Загрузить растения'}
      </button>
    </div>
  </div>
);

const PlantLayer: React.FC = () => {
  console.log('PlantLayer монтирован');

  const { state, setLoading, setError } = useMapContext();
  const { getAllSpecimens } = useMapService();
  const [specimens, setSpecimens] = useState<Specimen[]>([]);
  const isLoadingRef = useRef(false);
  const loadedRef = useRef(false); // Флаг для отслеживания первой загрузки
  const contextFunctionsRef = useRef({ setLoading, setError });
  const [showDebug, setShowDebug] = useState(true); // Показывать отладочную панель

  // Добавляем отладочную информацию о состоянии карты
  console.log('PlantLayer - Состояние карты:', {
    mapReady: state.mapReady,
    hasMapInstance: !!state.mapInstance,
    alreadyLoaded: loadedRef.current,
    isCurrentlyLoading: isLoadingRef.current,
  });

  // Обновляем ссылки на функции контекста при их изменении,
  // но не вызываем перерендер
  useEffect(() => {
    contextFunctionsRef.current = { setLoading, setError };
  }, [setLoading, setError]);

  // Мемоизируем функцию загрузки образцов
  const loadSpecimens = useCallback(async () => {
    // Пропускаем повторную загрузку если уже загружали или идет загрузка
    if (isLoadingRef.current || loadedRef.current) {
      console.log(
        'PlantLayer: Загрузка образцов пропущена - isLoading:',
        isLoadingRef.current,
        'alreadyLoaded:',
        loadedRef.current
      );
      return;
    }

    const { setLoading, setError } = contextFunctionsRef.current;

    try {
      console.log('PlantLayer: Начинаю загрузку всех образцов растений...');
      isLoadingRef.current = true;
      setLoading(true);

      // Всегда загружаем все образцы растений, без фильтрации по сектору
      // ВАЖНО: Здесь используется getAllSpecimens из useMapService,
      // который обращается к правильному эндпоинту /Specimen/all
      // Ошибка "405 Method Not Allowed" возникает из-за обращения к /Specimen без пути
      const allSpecimens = await getAllSpecimens();
      console.log(`Загружено ${allSpecimens.length} образцов растений`);

      if (allSpecimens.length > 0) {
        console.log('Координаты первых 5 образцов:');
        allSpecimens.slice(0, 5).forEach((specimen: Specimen) => {
          console.log(
            `ID: ${specimen.id}, Название: ${specimen.russianName}, Координаты: [${specimen.latitude}, ${specimen.longitude}]`
          );
        });

        // Устанавливаем все образцы в состояние
        setSpecimens(allSpecimens);
      } else {
        console.warn('API вернул пустой массив образцов');
        setSpecimens([]);
      }

      setError(null);
      // Отмечаем, что загрузка уже была выполнена
      loadedRef.current = true;
    } catch (error) {
      console.error('Ошибка при загрузке образцов растений:', error);
      setError('Не удалось загрузить образцы растений');
      setSpecimens([]);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [getAllSpecimens]); // Убираем зависимости от setError и setLoading

  // Функция для принудительной загрузки образцов (для отладочной панели)
  const handleForceLoad = useCallback(() => {
    // Сбрасываем флаг загрузки, чтобы можно было загрузить заново
    loadedRef.current = false;
    loadSpecimens();
  }, [loadSpecimens]);

  // Загрузка образцов растений только при монтировании компонента и готовности карты
  useEffect(() => {
    // Проверяем, что карта готова и существует, и данные еще не загружены
    if (!state.mapReady || !state.mapInstance || loadedRef.current) {
      console.log(
        'PlantLayer: Условие для загрузки образцов не выполнено - mapReady:',
        state.mapReady,
        'mapInstance:',
        !!state.mapInstance,
        'alreadyLoaded:',
        loadedRef.current
      );
      return;
    }

    // Загружаем образцы только один раз при монтировании
    console.log('Запускаем однократную загрузку всех образцов...');
    loadSpecimens();

    // При размонтировании компонента сбрасываем флаг загрузки
    return () => {
      loadedRef.current = false;
    };
  }, [state.mapReady, state.mapInstance, loadSpecimens]);

  // Обработчик клавиатуры для отображения/скрытия отладочной панели
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+D для отображения/скрытия отладочной панели
      if (e.altKey && e.key === 'd') {
        setShowDebug((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Проверяем наличие образцов с правильными координатами
  // Это поможет в диагностике проблем с отображением на карте
  useEffect(() => {
    if (specimens.length > 0) {
      // Подсчитываем образцы с корректными и некорректными координатами
      const withValidCoords = specimens.filter(
        (s) =>
          s.latitude && s.longitude && !isNaN(s.latitude) && !isNaN(s.longitude)
      );

      const withInvalidCoords = specimens.filter(
        (s) =>
          !s.latitude || !s.longitude || isNaN(s.latitude) || isNaN(s.longitude)
      );

      console.log('🔍 Анализ координат образцов:');
      console.log(
        `✅ Образцы с корректными координатами: ${withValidCoords.length}`
      );
      console.log(
        `❌ Образцы с некорректными координатами: ${withInvalidCoords.length}`
      );

      if (withValidCoords.length > 0) {
        // Выводим диапазон координат для проверки
        const minLat = Math.min(...withValidCoords.map((s) => s.latitude));
        const maxLat = Math.max(...withValidCoords.map((s) => s.latitude));
        const minLng = Math.min(...withValidCoords.map((s) => s.longitude));
        const maxLng = Math.max(...withValidCoords.map((s) => s.longitude));

        console.log(
          `📍 Диапазон координат: широта ${minLat.toFixed(
            6
          )} - ${maxLat.toFixed(6)}, долгота ${minLng.toFixed(
            6
          )} - ${maxLng.toFixed(6)}`
        );
      }

      if (withInvalidCoords.length > 0) {
        console.log('❗ Первые 3 образца с некорректными координатами:');
        withInvalidCoords.slice(0, 3).forEach((s) => {
          console.log(
            `ID: ${s.id}, Название: ${
              s.russianName || s.latinName
            }, Координаты: [${s.latitude}, ${s.longitude}]`
          );
        });
      }
    }
  }, [specimens]);

  // Если карта не готова, ничего не рендерим
  if (!state.mapReady || !state.mapInstance) {
    console.log(
      'PlantLayer: Карта не готова или отсутствует экземпляр карты, ничего не рендерим'
    );
    return null;
  }

  // Добавляем отладочную информацию о рендеринге
  console.log(
    'PlantLayer: Рендеринг компонента с',
    specimens.length,
    'образцами растений'
  );

  return (
    <>
      {showDebug && (
        <DebugPanel
          onForceLoad={handleForceLoad}
          specimenCount={specimens.length}
          isLoading={isLoadingRef.current}
          isLoaded={loadedRef.current}
          mapReady={state.mapReady}
          hasMapInstance={!!state.mapInstance}
        />
      )}

      {specimens.length > 0 ? (
        <>
          {/* Логируем каждый специмен при отрисовке для отладки */}
          {console.log(`Рендеринг ${specimens.length} маркеров растений`)}

          {specimens.map((specimen) => {
            console.log(
              `Создаю маркер для растения ${specimen.id} (${
                specimen.russianName || specimen.latinName
              })`
            );
            return <PlantMarker key={specimen.id} specimen={specimen} />;
          })}
        </>
      ) : !isLoadingRef.current && loadedRef.current ? (
        <div className='absolute top-10 right-10 bg-white p-3 rounded shadow-md z-[1000]'>
          <p className='text-gray-700'>Нет доступных образцов растений</p>
        </div>
      ) : null}
    </>
  );
};

export default React.memo(PlantLayer); // Оборачиваем в React.memo для предотвращения лишних перерендеров
