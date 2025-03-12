import React, { useState } from 'react';
import { useMapContext } from '../contexts';
import { MapMode } from '../contexts/MapContext';
import MapActions from './MapActions';
import MapLegend from './MapLegend';
import { PlantAddForm } from './plant-map';

const MapControlPanel: React.FC = () => {
  const {
    loadMapFromServer,
    loadingMap,
    loadMapError,
    currentMode,
    setCurrentMode,
    clearAreaPoints,
    currentAreaPoints,
    finishDrawing,
    removeLastPoint,
    isDrawingComplete,
    selectedPosition,
    clearSelectedPosition,
    addPlant,
    selectedPlantId,
  } = useMapContext();

  // Состояние для отображения формы добавления растения
  const [showAddPlantForm, setShowAddPlantForm] = useState(false);

  // Обработчик смены режима
  const handleModeChange = (mode: MapMode) => {
    // При смене режима, очищаем текущие точки области
    if (currentMode === MapMode.AREA && mode !== MapMode.AREA) {
      clearAreaPoints();
    }

    // При выходе из режима выбора геопозиции, очищаем текущую позицию
    // если не показываем форму добавления растения
    if (
      currentMode === MapMode.SELECT_LOCATION &&
      mode !== MapMode.SELECT_LOCATION &&
      !showAddPlantForm
    ) {
      clearSelectedPosition();
    }

    setCurrentMode(mode);
  };

  // Обработчик для создания растения из выбранной геопозиции
  const handleCreatePlantFromPosition = () => {
    if (selectedPosition) {
      setShowAddPlantForm(true);
    }
  };

  // Обработчик закрытия формы добавления растения
  const handleCloseAddPlantForm = () => {
    setShowAddPlantForm(false);
  };

  // Обработчик загрузки карты
  const handleLoadMap = async () => {
    await loadMapFromServer();
  };

  // Адаптер для добавления растения
  const handleAddPlant = (name: string, description: string, position: [number, number]) => {
    addPlant({
      name,
      description,
      position,
    });
  };

  // Классы для кнопок режимов
  const getModeButtonClass = (mode: MapMode) => {
    return `px-2 py-1.5 text-xs rounded-md ${
      currentMode === mode
        ? 'bg-[#0A84FF] text-white'
        : 'bg-[#F5F5F7] text-[#1D1D1F] border border-[#E5E5EA]'
    } transition-colors`;
  };

  return (
    <div className='fixed top-16 right-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-[#E5E5EA] w-52 overflow-hidden'>
      <div className='border-b border-[#E5E5EA] py-2 px-3'>
        <h3 className='text-sm font-medium text-[#1D1D1F] flex items-center'>
          <svg
            className='w-3.5 h-3.5 mr-1'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
            />
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
            />
          </svg>
          Управление
        </h3>
      </div>

      <div className='p-2 space-y-2'>
        {/* Загрузка карты - минималистичная кнопка */}
        <button
          className='w-full bg-[#F0FFF7] text-[#28B14C] border border-[#30D158] rounded-md px-2 py-1.5 text-xs font-medium flex items-center justify-center transition-colors hover:bg-[#E2F9EB]'
          onClick={handleLoadMap}
          disabled={loadingMap}
        >
          <svg
            className='w-3 h-3 mr-1'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
            />
          </svg>
          {loadingMap ? 'Загрузка...' : 'Загрузить карту'}
        </button>

        {loadMapError && (
          <p className='text-xs text-[#FF3B30] mt-1 mb-1'>{loadMapError}</p>
        )}

        {/* Режимы просмотра - в виде компактных групп кнопок */}
        <div className='border-t border-[#E5E5EA] pt-2'>
          <span className='text-xs font-medium text-[#86868B] mb-1 block'>
            Режимы просмотра
          </span>
          <div className='grid grid-cols-2 gap-1 mb-2'>
            <button
              className={getModeButtonClass(MapMode.VIEW)}
              onClick={() => handleModeChange(MapMode.VIEW)}
            >
              Просмотр
            </button>
            <button
              className={getModeButtonClass(MapMode.FILTER)}
              onClick={() => handleModeChange(MapMode.FILTER)}
            >
              Фильтрация
            </button>
          </div>
        </div>

        {/* Редактирование - минималистичные кнопки в сетке */}
        <div className='border-t border-[#E5E5EA] pt-2'>
          <span className='text-xs font-medium text-[#86868B] mb-1 block'>
            Редактирование
          </span>
          <div className='grid grid-cols-2 gap-1'>
            <button
              className={getModeButtonClass(MapMode.ADD)}
              onClick={() => handleModeChange(MapMode.ADD)}
            >
              Добавить
            </button>
            <button
              className={getModeButtonClass(MapMode.EDIT)}
              onClick={() => handleModeChange(MapMode.EDIT)}
            >
              Редактировать
            </button>
            <button
              className={getModeButtonClass(MapMode.AREA)}
              onClick={() => handleModeChange(MapMode.AREA)}
            >
              Область
            </button>
            <button
              className={getModeButtonClass(MapMode.SELECT_LOCATION)}
              onClick={() => handleModeChange(MapMode.SELECT_LOCATION)}
            >
              Геопозиция
            </button>
          </div>
        </div>

        {/* Управление областью - компактные кнопки */}
        {currentMode === MapMode.AREA && !isDrawingComplete && (
          <div className='border-t border-[#E5E5EA] pt-2'>
            <span className='text-xs font-medium text-[#86868B] mb-1 block'>
              Создание области ({currentAreaPoints.length} точек)
            </span>
            <div className='grid grid-cols-2 gap-1'>
              <button
                className='px-2 py-1.5 text-xs rounded-md bg-[#0A84FF] text-white transition-colors disabled:opacity-50'
                onClick={finishDrawing}
                disabled={currentAreaPoints.length < 3}
              >
                Завершить
              </button>
              <button
                className='px-2 py-1.5 text-xs rounded-md border border-[#E5E5EA] bg-[#F5F5F7] transition-colors disabled:opacity-50'
                onClick={removeLastPoint}
                disabled={currentAreaPoints.length === 0}
              >
                Удалить точку
              </button>
              <button
                className='col-span-2 px-2 py-1.5 text-xs rounded-md text-[#FF3B30] border border-[#FFE5E5] bg-[#FFF5F5] transition-colors disabled:opacity-50'
                onClick={clearAreaPoints}
                disabled={currentAreaPoints.length === 0}
              >
                Очистить все точки
              </button>
            </div>
          </div>
        )}

        {/* Геопозиция - компактное отображение */}
        {currentMode === MapMode.SELECT_LOCATION && (
          <div className='border-t border-[#E5E5EA] pt-2'>
            <span className='text-xs font-medium text-[#86868B] mb-1 block'>
              Выбор геопозиции
            </span>
            {selectedPosition ? (
              <div className='text-xs'>
                <div className='mb-1'>
                  <span className='font-medium'>Широта:</span>{' '}
                  {selectedPosition.latitude.toFixed(6)}
                </div>
                <div className='mb-1'>
                  <span className='font-medium'>Долгота:</span>{' '}
                  {selectedPosition.longitude.toFixed(6)}
                </div>
                <div className='grid grid-cols-2 gap-1 mt-2'>
                  <button
                    className='px-2 py-1.5 text-xs rounded-md text-[#FF3B30] border border-[#FFE5E5] bg-[#FFF5F5]'
                    onClick={clearSelectedPosition}
                  >
                    Очистить
                  </button>
                  <button
                    className='px-2 py-1.5 text-xs rounded-md bg-[#0A84FF] text-white'
                    onClick={handleCreatePlantFromPosition}
                  >
                    Создать
                  </button>
                </div>
              </div>
            ) : (
              <p className='text-xs text-[#86868B]'>
                Нажмите на карту для выбора позиции
              </p>
            )}
          </div>
        )}

        {/* Показываем легенду в самом низу панели всегда */}
        <div className='border-t border-[#E5E5EA] pt-2'>
          <span className='text-xs font-medium text-[#86868B] mb-1 block'>
            Легенда
          </span>
          <MapLegend />
        </div>
      </div>

      {/* Форма добавления растения */}
      {showAddPlantForm && selectedPosition && (
        <PlantAddForm
          position={[selectedPosition.latitude, selectedPosition.longitude]}
          onClose={handleCloseAddPlantForm}
          onSubmit={handleAddPlant}
        />
      )}

      {/* Информация о выбранном растении */}
      {selectedPlantId && <MapActions />}
    </div>
  );
};

export default MapControlPanel;
