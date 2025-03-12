import React, { useState } from 'react';
import {
  buttonClasses,
  COLORS,
  containerClasses,
  layoutClasses,
  textClasses,
} from '../../../styles/global-styles';
import { useMapContext } from '../contexts';
import { MapMode } from '../contexts/MapContext';
import { PlantAddForm } from './plant-map';

const ControlPanel: React.FC = () => {
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

  // Классы для кнопок режимов
  const getModeButtonClass = (mode: MapMode) => {
    return `${buttonClasses.base} ${
      currentMode === mode ? buttonClasses.primary : buttonClasses.secondary
    }`;
  };

  return (
    <div className={`${containerClasses.base} mb-4`}>
      <h3 className={textClasses.subheading}>Панель управления</h3>

      {/* Режимы работы с картой */}
      <div className={`${layoutClasses.flex} flex-wrap gap-2 mb-4`}>
        <button
          className={getModeButtonClass(MapMode.VIEW)}
          onClick={() => handleModeChange(MapMode.VIEW)}
        >
          Просмотр
        </button>
        <button
          className={getModeButtonClass(MapMode.ADD)}
          onClick={() => handleModeChange(MapMode.ADD)}
        >
          Добавить растение
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
          Добавить область
        </button>
        <button
          className={getModeButtonClass(MapMode.FILTER)}
          onClick={() => handleModeChange(MapMode.FILTER)}
        >
          Фильтрация
        </button>
        <button
          className={getModeButtonClass(MapMode.SELECT_LOCATION)}
          onClick={() => handleModeChange(MapMode.SELECT_LOCATION)}
        >
          Выбрать геопозицию
        </button>
      </div>

      {/* Дополнительные элементы управления для режима области */}
      {currentMode === MapMode.AREA && !isDrawingComplete && (
        <div className={`${layoutClasses.flex} gap-2 mb-4`}>
          <button
            className={`${buttonClasses.base} ${buttonClasses.primary}`}
            onClick={finishDrawing}
            disabled={currentAreaPoints.length < 3}
          >
            Завершить создание области
          </button>
          <button
            className={`${buttonClasses.base} ${buttonClasses.secondary}`}
            onClick={removeLastPoint}
            disabled={currentAreaPoints.length === 0}
          >
            Удалить последнюю точку
          </button>
          <button
            className={`${buttonClasses.base} ${buttonClasses.danger}`}
            onClick={clearAreaPoints}
            disabled={currentAreaPoints.length === 0}
          >
            Очистить
          </button>
          <span className={`${textClasses.body} ml-2 self-center`}>
            Точек: {currentAreaPoints.length}
          </span>
        </div>
      )}

      {/* Отображение выбранной геопозиции */}
      {currentMode === MapMode.SELECT_LOCATION && (
        <div
          className={`mb-4 p-3 bg-[${COLORS.BACKGROUND}] border border-[${COLORS.SEPARATOR}] rounded-lg`}
        >
          {selectedPosition ? (
            <div>
              <p className={textClasses.body}>
                <strong>Выбрана позиция:</strong>
              </p>
              <p className={textClasses.body}>
                Широта: {selectedPosition.latitude.toFixed(6)}
              </p>
              <p className={textClasses.body}>
                Долгота: {selectedPosition.longitude.toFixed(6)}
              </p>
              <p className={textClasses.body}>
                Время: {new Date(selectedPosition.timestamp).toLocaleString()}
              </p>
              <div className={`${layoutClasses.flex} gap-2 mt-2`}>
                <button
                  className={`${buttonClasses.base} ${buttonClasses.danger}`}
                  onClick={clearSelectedPosition}
                >
                  Очистить позицию
                </button>
                <button
                  className={`${buttonClasses.base} ${buttonClasses.primary}`}
                  onClick={handleCreatePlantFromPosition}
                >
                  Создать растение здесь
                </button>
              </div>
            </div>
          ) : (
            <p className={textClasses.body}>
              Нажмите на карту, чтобы выбрать геопозицию.
            </p>
          )}
        </div>
      )}

      {/* Управление картой */}
      <div className='mb-4'>
        <button
          className={`${buttonClasses.base} ${buttonClasses.primary}`}
          onClick={handleLoadMap}
          disabled={loadingMap}
        >
          {loadingMap ? 'Загрузка...' : 'Загрузить карту'}
        </button>

        {loadMapError && (
          <p className={`${textClasses.body} text-[${COLORS.DANGER}] mt-2`}>
            {loadMapError}
          </p>
        )}
      </div>

      {/* Инструкции по текущему режиму */}
      <div
        className={`p-3 bg-[${COLORS.BACKGROUND}] border border-[${COLORS.SEPARATOR}] rounded-lg`}
      >
        {currentMode === MapMode.VIEW && (
          <p className={textClasses.body}>
            Режим просмотра: Нажимайте на растения, чтобы увидеть информацию о
            них.
          </p>
        )}
        {currentMode === MapMode.ADD && (
          <p className={textClasses.body}>
            Режим добавления: Нажмите на карту, чтобы добавить новое растение.
          </p>
        )}
        {currentMode === MapMode.EDIT && (
          <p className={textClasses.body}>
            Режим редактирования: Выберите и перетащите растение для изменения
            его положения на карте.
          </p>
        )}
        {currentMode === MapMode.AREA && (
          <p className={textClasses.body}>
            Режим добавления области: Нажимайте на карту, чтобы добавить точки
            для создания полигона. Когда закончите добавление точек, нажмите
            "Завершить создание области".
          </p>
        )}
        {currentMode === MapMode.FILTER && (
          <p className={textClasses.body}>
            Режим фильтрации: Настройте фильтры для отображения нужных растений.
          </p>
        )}
        {currentMode === MapMode.SELECT_LOCATION && (
          <p className={textClasses.body}>
            Режим выбора геопозиции: Нажмите на карту, чтобы выбрать и сохранить
            координаты. Эти координаты можно будет использовать для добавления
            растений.
          </p>
        )}
      </div>

      {/* Модальное окно добавления растения из выбранной геопозиции */}
      {showAddPlantForm && selectedPosition && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='w-full max-w-lg'>
            <PlantAddForm
              position={[selectedPosition.latitude, selectedPosition.longitude]}
              onClose={handleCloseAddPlantForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
