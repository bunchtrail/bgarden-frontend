import React, { useState } from 'react';
import {
  buttonClasses,
  COLORS,
  containerClasses,
  layoutClasses,
  textClasses,
} from '../../../styles/global-styles';
import { useMapContext } from '../contexts';

// Режимы работы с картой
enum MapMode {
  VIEW = 'view',
  ADD = 'add',
  EDIT = 'edit',
  FILTER = 'filter',
}

const ControlPanel: React.FC = () => {
  const { loadMapFromServer, loadingMap, loadMapError } = useMapContext();
  const [activeMode, setActiveMode] = useState<MapMode>(MapMode.VIEW);

  // Обработчик смены режима
  const handleModeChange = (mode: MapMode) => {
    setActiveMode(mode);
  };

  // Обработчик загрузки карты
  const handleLoadMap = async () => {
    await loadMapFromServer();
  };

  // Классы для кнопок режимов
  const getModeButtonClass = (mode: MapMode) => {
    return `${buttonClasses.base} ${
      activeMode === mode ? buttonClasses.primary : buttonClasses.secondary
    }`;
  };

  return (
    <div className={`${containerClasses.base} mb-4`}>
      <h3 className={textClasses.subheading}>Панель управления</h3>

      {/* Режимы работы с картой */}
      <div className={`${layoutClasses.flex} gap-2 mb-4`}>
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
          Добавление
        </button>
        <button
          className={getModeButtonClass(MapMode.EDIT)}
          onClick={() => handleModeChange(MapMode.EDIT)}
        >
          Редактирование
        </button>
        <button
          className={getModeButtonClass(MapMode.FILTER)}
          onClick={() => handleModeChange(MapMode.FILTER)}
        >
          Фильтрация
        </button>
      </div>

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
        {activeMode === MapMode.VIEW && (
          <p className={textClasses.body}>
            Режим просмотра: Нажимайте на растения, чтобы увидеть информацию о
            них.
          </p>
        )}
        {activeMode === MapMode.ADD && (
          <p className={textClasses.body}>
            Режим добавления: Нажмите на карту, чтобы добавить новое растение.
          </p>
        )}
        {activeMode === MapMode.EDIT && (
          <p className={textClasses.body}>
            Режим редактирования: Выберите растение для редактирования его
            информации.
          </p>
        )}
        {activeMode === MapMode.FILTER && (
          <p className={textClasses.body}>
            Режим фильтрации: Настройте фильтры для отображения нужных растений.
          </p>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
