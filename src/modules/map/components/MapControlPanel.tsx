import React, { useEffect, useRef, useState } from 'react';
import { useMapContext } from '../contexts';
import { MapMode } from '../contexts/MapContext';
import MapActions from './MapActions';
import MapLegend from './MapLegend';
import { PlantAddForm } from './plant-map';

// Минимальная высота для предотвращения перетаскивания в навбар
const MIN_Y_POSITION = 60; // высота навбара примерно 60px

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
    clusteringSettings,
    updateClusteringSettings,
    toggleClustering,
  } = useMapContext();

  // Функция для загрузки сохраненных настроек панели
  const getSavedPanelSettings = () => {
    // Загрузка позиции
    const getSavedPosition = () => {
      const savedPosition = localStorage.getItem('mapControlPanelPosition');
      if (savedPosition) {
        try {
          const position = JSON.parse(savedPosition);
          // Проверяем, что позиция находится в пределах экрана (на случай изменения размеров окна)
          const maxX = window.innerWidth - 240;
          const maxY = window.innerHeight - 40;
          return {
            x: Math.max(0, Math.min(position.x, maxX)),
            y: Math.max(MIN_Y_POSITION, Math.min(position.y, maxY)),
          };
        } catch (e) {
          console.error('Ошибка при загрузке позиции панели:', e);
          return { x: window.innerWidth - 240, y: 80 };
        }
      }
      return { x: window.innerWidth - 240, y: 80 };
    };

    // Загрузка состояния свернутости
    const getSavedCollapsedState = () => {
      try {
        const savedState = localStorage.getItem('mapControlPanelCollapsed');
        return savedState === 'true';
      } catch (e) {
        console.error('Ошибка при загрузке состояния панели:', e);
        return false;
      }
    };

    // Проверка нужно ли показывать подсказку (только первые 3 раза)
    const shouldShowHint = () => {
      try {
        const hintCount = localStorage.getItem('mapControlPanelHintCount');
        const count = hintCount ? parseInt(hintCount, 10) : 0;
        return count < 3;
      } catch (e) {
        console.error('Ошибка при проверке счетчика подсказок:', e);
        return true;
      }
    };

    // Проверка нужно ли показывать индикатор кнопки сворачивания (только первые 5 раз)
    const shouldShowCollapseIndicator = () => {
      try {
        const indicatorCount = localStorage.getItem(
          'mapControlPanelIndicatorCount'
        );
        const count = indicatorCount ? parseInt(indicatorCount, 10) : 0;
        return count < 5;
      } catch (e) {
        console.error('Ошибка при проверке счетчика индикатора:', e);
        return true;
      }
    };

    return {
      position: getSavedPosition(),
      isCollapsed: getSavedCollapsedState(),
      showHint: shouldShowHint(),
      showCollapseIndicator: shouldShowCollapseIndicator(),
    };
  };

  // Функция для сохранения позиции в localStorage
  const savePosition = (pos: { x: number; y: number }) => {
    try {
      localStorage.setItem('mapControlPanelPosition', JSON.stringify(pos));
    } catch (e) {
      console.error('Ошибка при сохранении позиции панели:', e);
    }
  };

  // Функция для сохранения состояния свернутости
  const saveCollapsedState = (collapsed: boolean) => {
    try {
      localStorage.setItem('mapControlPanelCollapsed', String(collapsed));
    } catch (e) {
      console.error('Ошибка при сохранении состояния панели:', e);
    }
  };

  // Функция для увеличения счетчика показов подсказки
  const incrementHintCount = () => {
    try {
      const hintCount = localStorage.getItem('mapControlPanelHintCount');
      const count = hintCount ? parseInt(hintCount, 10) : 0;
      localStorage.setItem('mapControlPanelHintCount', String(count + 1));
    } catch (e) {
      console.error('Ошибка при обновлении счетчика подсказок:', e);
    }
  };

  // Функция для увеличения счетчика показов индикатора
  const incrementIndicatorCount = () => {
    try {
      const indicatorCount = localStorage.getItem(
        'mapControlPanelIndicatorCount'
      );
      const count = indicatorCount ? parseInt(indicatorCount, 10) : 0;
      localStorage.setItem('mapControlPanelIndicatorCount', String(count + 1));
    } catch (e) {
      console.error('Ошибка при обновлении счетчика индикатора:', e);
    }
  };

  // Получаем сохраненные настройки
  const savedSettings = getSavedPanelSettings();

  // Состояние для отображения формы добавления растения
  const [showAddPlantForm, setShowAddPlantForm] = useState(false);
  // Состояние для скрытия/показа панели управления
  const [isCollapsed, setIsCollapsed] = useState(savedSettings.isCollapsed);
  // Состояние для отслеживания позиции панели
  const [position, setPosition] = useState(savedSettings.position);
  // Состояние для отслеживания перемещения панели
  const [isDragging, setIsDragging] = useState(false);
  // Точка привязки для перемещения
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  // Показывать подсказку о перетаскивании
  const [showDragHint, setShowDragHint] = useState(savedSettings.showHint);
  // Показывать индикатор кнопки сворачивания
  const [showCollapseIndicator, setShowCollapseIndicator] = useState(
    savedSettings.showCollapseIndicator
  );

  // Ссылка на DOM-элемент панели
  const panelRef = useRef<HTMLDivElement>(null);

  // Обработчик начала перетаскивания
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (panelRef.current) {
      e.preventDefault(); // Предотвращаем выделение текста

      // Вычисляем смещение между позицией мыши и левым верхним углом панели
      const rect = panelRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });

      setIsDragging(true);
    }
  };

  // Обработчик клика по заголовку панели
  const handleHeaderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Теперь метод просто игнорируется, так как мы используем отдельный handleToggleCollapse
  };

  // Новый обработчик для явного переключения сворачивания панели
  const handleToggleCollapse = (e: React.MouseEvent<SVGSVGElement>) => {
    // Останавливаем всплытие события, чтобы предотвратить запуск handleHeaderClick
    e.stopPropagation();
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    saveCollapsedState(newCollapsedState);

    // Скрываем индикатор после первого использования
    if (showCollapseIndicator) {
      setShowCollapseIndicator(false);
      incrementIndicatorCount();
    }
  };

  // Сохраняем позицию панели при изменении
  useEffect(() => {
    if (!isDragging) {
      savePosition(position);
    }
  }, [position, isDragging]);

  // Обработчик для корректировки позиции при изменении размера окна
  useEffect(() => {
    const handleResize = () => {
      // Убедимся, что панель не выходит за пределы экрана после ресайза
      const maxX = window.innerWidth - (panelRef.current?.offsetWidth || 200);
      const maxY = window.innerHeight - 40;

      setPosition((prev) => {
        const newPos = {
          x: Math.max(0, Math.min(prev.x, maxX)),
          y: Math.max(MIN_Y_POSITION, Math.min(prev.y, maxY)),
        };

        // Сохраняем обновленную позицию, если она изменилась
        if (newPos.x !== prev.x || newPos.y !== prev.y) {
          savePosition(newPos);
        }

        return newPos;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Обработчик для сброса позиции панели к значению по умолчанию
  const handleResetPosition = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultPosition = { x: window.innerWidth - 240, y: 80 };
    setPosition(defaultPosition);
    savePosition(defaultPosition);
  };

  // Эффект для отслеживания движения мыши и отпускания кнопки
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        // Обновляем позицию панели в соответствии с движением мыши
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Ограничиваем позицию, чтобы панель не выходила за пределы экрана
        // и не наезжала на навбар
        const maxX = window.innerWidth - (panelRef.current?.offsetWidth || 200);
        const maxY = window.innerHeight - 40;

        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(MIN_Y_POSITION, Math.min(newY, maxY)),
        });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        // Больше не меняем isCollapsed здесь, только завершаем перетаскивание
        setIsDragging(false);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Обработчик скрытия подсказки с увеличением счетчика
  const handleHideHint = () => {
    setShowDragHint(false);
    incrementHintCount();
  };

  // Скрыть подсказку о перетаскивании при первом перетаскивании
  useEffect(() => {
    if (isDragging && showDragHint) {
      setShowDragHint(false);
      incrementHintCount();
    }
  }, [isDragging, showDragHint]);

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
  const handleAddPlant = (
    name: string,
    description: string,
    position: [number, number]
  ) => {
    addPlant({
      name,
      description,
      position,
    });
  };

  // Классы для кнопок режимов
  const getModeButtonClass = (mode: MapMode) => {
    return `px-2 py-1.5 text-xs rounded-md flex items-center justify-center ${
      currentMode === mode
        ? 'bg-[#0A84FF] text-white shadow-sm'
        : 'bg-[#F5F5F7] text-[#1D1D1F] border border-[#E5E5EA] hover:bg-[#E5E5EA] hover:border-[#D1D1D6]'
    } transition-all duration-200 font-medium`;
  };

  // Используем абсолютное позиционирование для панели
  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: 20,
    cursor: isDragging ? 'grabbing' : 'auto',
  };

  // При первом рендере увеличиваем счетчик просмотров индикатора
  useEffect(() => {
    if (showCollapseIndicator) {
      const timeout = setTimeout(() => {
        incrementIndicatorCount();
      }, 2000); // Считаем, что индикатор показан, если пользователь видел его хотя бы 2 секунды

      return () => clearTimeout(timeout);
    }
  }, []);

  return (
    <div style={panelStyle} ref={panelRef}>
      <div
        className='bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-[#E5E5EA] w-55 overflow-hidden transition-all'
        style={{ maxHeight: isCollapsed ? '40px' : '80vh', opacity: 0.95 }}
      >
        <div
          className='border-b border-[#E5E5EA] py-2 px-3 flex justify-between items-center cursor-pointer select-none'
          onMouseDown={handleMouseDown}
          onClick={handleHeaderClick}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          title='Перетащите, чтобы переместить панель'
        >
          <h3 className='text-sm font-medium text-[#1D1D1F] flex items-center'>
            <svg
              className='w-3.5 h-3.5 mr-1 text-[#0A84FF]'
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
            <span className='flex gap-1 items-center'>
              Управление
              <svg
                className='w-3 h-3 text-[#86868B]'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4'
                />
              </svg>
            </span>
          </h3>
          <div
            className='flex items-center gap-1 group relative'
            title='Нажмите для сворачивания/разворачивания панели'
          >
            <span className='text-xs text-[#86868B] hidden md:inline'>
              {isCollapsed ? 'Развернуть' : 'Свернуть'}
            </span>
            <div className='relative'>
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${
                  isCollapsed ? 'rotate-180' : ''
                } text-[#007AFF] cursor-pointer hover:text-[#0A84FF] active:text-[#0062CC] p-0.5 rounded-full bg-[#F5F5F7] border border-[#E5E5EA] hover:bg-[#E5E5EA]`}
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                onClick={handleToggleCollapse}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
              {showCollapseIndicator && (
                <span className='absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#0A84FF] opacity-75 animate-pulse'></span>
              )}
            </div>
            <button
              className='hidden md:flex ml-1 text-xs text-[#86868B] hover:text-[#0A84FF] transition-colors items-center'
              onClick={handleResetPosition}
              title='Сбросить позицию панели'
            >
              <svg
                className='w-3.5 h-3.5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                />
              </svg>
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <div
            className='p-2 space-y-2 overflow-y-auto'
            style={{ maxHeight: 'calc(80vh - 40px)' }}
          >
            {showDragHint && (
              <div className='bg-[#F0F8FF] border border-[#007AFF] rounded-md p-1.5 mb-2 text-xs text-[#0A84FF] flex items-center'>
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
                    d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <span>Перетащите заголовок для перемещения панели</span>
                <button
                  className='ml-auto text-[#0A84FF] hover:text-[#0062CC]'
                  onClick={handleHideHint}
                  title='Скрыть подсказку'
                >
                  <svg
                    className='w-3 h-3'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Загрузка карты - минималистичная кнопка */}
            <button
              className='w-full bg-[#F0FFF7] text-[#28B14C] border border-[#30D158] rounded-md px-2 py-1.5 text-xs font-medium flex items-center justify-center transition-colors hover:bg-[#E2F9EB] active:bg-[#D6F5E6] shadow-sm'
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
                    className='px-2 py-1.5 text-xs rounded-md bg-[#0A84FF] text-white transition-all duration-200 disabled:opacity-50 disabled:bg-[#86868B] hover:bg-[#0062CC] active:bg-[#004F9E] flex items-center justify-center font-medium shadow-sm'
                    onClick={finishDrawing}
                    disabled={currentAreaPoints.length < 3}
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
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                    Завершить
                  </button>
                  <button
                    className='px-2 py-1.5 text-xs rounded-md border border-[#E5E5EA] bg-[#F5F5F7] transition-all duration-200 disabled:opacity-50 hover:bg-[#E5E5EA] active:bg-[#D1D1D6] flex items-center justify-center font-medium'
                    onClick={removeLastPoint}
                    disabled={currentAreaPoints.length === 0}
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
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                    Удалить точку
                  </button>
                  <button
                    className='col-span-2 px-2 py-1.5 text-xs rounded-md text-[#FF3B30] border border-[#FFE5E5] bg-[#FFF5F5] transition-all duration-200 disabled:opacity-50 hover:bg-[#FFE0E0] active:bg-[#FFCBCB] flex items-center justify-center font-medium'
                    onClick={clearAreaPoints}
                    disabled={currentAreaPoints.length === 0}
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
                        d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                      />
                    </svg>
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
                        className='px-2 py-1.5 text-xs rounded-md text-[#FF3B30] border border-[#FFE5E5] bg-[#FFF5F5] hover:bg-[#FFE0E0] active:bg-[#FFCBCB] transition-all duration-200 flex items-center justify-center font-medium'
                        onClick={clearSelectedPosition}
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
                            d='M6 18L18 6M6 6l12 12'
                          />
                        </svg>
                        Очистить
                      </button>
                      <button
                        className='px-2 py-1.5 text-xs rounded-md bg-[#0A84FF] text-white hover:bg-[#0062CC] active:bg-[#004F9E] transition-all duration-200 flex items-center justify-center font-medium shadow-sm'
                        onClick={handleCreatePlantFromPosition}
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
                            d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                          />
                        </svg>
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

            {/* Настройки кластеризации маркеров */}
            {!isCollapsed && currentMode !== MapMode.ADD && (
              <div className='border-t border-[#E5E5EA] pt-2'>
                <div className='flex justify-between items-center'>
                  <span className='text-xs font-medium text-[#86868B] mb-1 block'>
                    Кластеризация маркеров
                  </span>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={clusteringSettings.enabled}
                      onChange={toggleClustering}
                      className='sr-only peer'
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                  </label>
                </div>
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
        )}
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
