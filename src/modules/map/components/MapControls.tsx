import React, { useEffect, useRef } from 'react';
import { useMapContext } from '../contexts/MapContext';
import styles from '../map.module.css';
import mapStyles from '../styles';
import { MapMode } from '../types';
import PlantAddForm from './forms/PlantAddForm';
import PlantEditForm from './forms/PlantEditForm';

interface MapControlsProps {
  standaloneMode?: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({
  standaloneMode = false,
}) => {
  const { state, setMode, setMapReady } = useMapContext();
  const mapReadySetRef = useRef(false);

  // Если компонент работает в автономном режиме (для простого изображения),
  // устанавливаем mapReady в true
  useEffect(() => {
    if (
      (standaloneMode || state.isSimpleImageMode) &&
      !mapReadySetRef.current &&
      !state.mapReady
    ) {
      mapReadySetRef.current = true;
      // Используем setTimeout для отложенного вызова, чтобы предотвратить бесконечный цикл обновлений
      const timeoutId = setTimeout(() => {
        setMapReady(true);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [standaloneMode, state.isSimpleImageMode, setMapReady, state.mapReady]);

  // Функция для отображения подсказки в зависимости от режима
  const renderModeHelp = () => {
    switch (state.mode) {
      case MapMode.ADD_PLANT:
        return (
          <div
            className={`${mapStyles.controls.instructionsContainer.base} ${mapStyles.controls.instructionsContainer.add}`}
          >
            <div
              className={`${mapStyles.controls.instructionsTitle.base} ${mapStyles.controls.instructionsTitle.add}`}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className={mapStyles.controls.icon}
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                  clipRule='evenodd'
                />
              </svg>
              Добавление нового растения
            </div>
            <ol className={mapStyles.controls.instructionsList}>
              <li>
                Кликните на карте, чтобы выбрать место для нового растения
              </li>
              <li>Заполните информацию о растении в форме ниже</li>
              <li>Нажмите кнопку "Сохранить растение" для подтверждения</li>
            </ol>
          </div>
        );
      case MapMode.EDIT_PLANT:
        return (
          <div
            className={`${mapStyles.controls.instructionsContainer.base} ${mapStyles.controls.instructionsContainer.edit}`}
          >
            <div
              className={`${mapStyles.controls.instructionsTitle.base} ${mapStyles.controls.instructionsTitle.edit}`}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className={mapStyles.controls.icon}
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                  clipRule='evenodd'
                />
              </svg>
              Редактирование растения
            </div>
            <ol className={mapStyles.controls.instructionsList}>
              <li>Выберите растение на карте для редактирования</li>
              <li>Измените необходимые данные в форме</li>
              <li>Нажмите кнопку "Сохранить изменения" для подтверждения</li>
            </ol>
            {!state.selectedSpecimen && (
              <div className='mt-2 text-amber-700 bg-amber-100 p-2 rounded text-sm'>
                <span className='font-bold'>Подсказка:</span> Для начала
                выберите растение на карте!
              </div>
            )}
          </div>
        );
      case MapMode.DELETE_PLANT:
        return (
          <div
            className={`${mapStyles.controls.instructionsContainer.base} ${mapStyles.controls.instructionsContainer.delete}`}
          >
            <div
              className={`${mapStyles.controls.instructionsTitle.base} ${mapStyles.controls.instructionsTitle.delete}`}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className={mapStyles.controls.icon}
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                  clipRule='evenodd'
                />
              </svg>
              Удаление растения
            </div>
            <ol className={mapStyles.controls.instructionsList}>
              <li>Кликните на растение на карте, которое хотите удалить</li>
              <li>Подтвердите удаление в диалоговом окне</li>
            </ol>
            <div className='mt-2 text-red-700 bg-red-100 p-2 rounded text-sm'>
              <span className='font-bold'>Внимание:</span> Это действие нельзя
              отменить!
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Если компонент работает в автономном режиме, но карта не готова, не отображаем элементы управления
  if (!state.mapReady && !standaloneMode && !state.isSimpleImageMode) {
    return null;
  }

  return (
    <div className={mapStyles.controls.container}>
      <div className={mapStyles.controls.buttonsContainer}>
        <button
          className={`${mapStyles.controls.button.base} ${
            state.mode === MapMode.VIEW
              ? mapStyles.controls.button.view
              : mapStyles.controls.button.inactive
          }`}
          onClick={() => setMode(MapMode.VIEW)}
          title='Режим просмотра карты'
        >
          <span className='flex items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className={mapStyles.controls.icon}
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
              <path
                fillRule='evenodd'
                d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
                clipRule='evenodd'
              />
            </svg>
            Просмотр
          </span>
        </button>
        <button
          className={`${mapStyles.controls.button.base} ${
            state.mode === MapMode.ADD_PLANT
              ? mapStyles.controls.button.add
              : mapStyles.controls.button.inactive
          }`}
          onClick={() => setMode(MapMode.ADD_PLANT)}
          title='Добавить новое растение на карту'
        >
          <span className='flex items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className={mapStyles.controls.icon}
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                clipRule='evenodd'
              />
            </svg>
            Добавить растение
          </span>
        </button>
        <button
          className={`${mapStyles.controls.button.base} ${
            state.mode === MapMode.EDIT_PLANT
              ? mapStyles.controls.button.edit
              : mapStyles.controls.button.inactive
          }`}
          onClick={() => setMode(MapMode.EDIT_PLANT)}
          title='Редактировать существующее растение'
        >
          <span className='flex items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className={mapStyles.controls.icon}
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
            </svg>
            Редактировать
          </span>
        </button>
        <button
          className={`${mapStyles.controls.button.base} ${
            state.mode === MapMode.DELETE_PLANT
              ? mapStyles.controls.button.delete
              : mapStyles.controls.button.inactive
          }`}
          onClick={() => setMode(MapMode.DELETE_PLANT)}
          title='Удалить растение с карты'
        >
          <span className='flex items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className={mapStyles.controls.icon}
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
            Удалить
          </span>
        </button>
      </div>

      {/* Инструкции для пользователя */}
      {state.mode !== MapMode.VIEW && renderModeHelp()}

      {/* Показываем соответствующую форму в зависимости от режима */}
      <div className={mapStyles.controls.formsContainer}>
        {state.mode === MapMode.ADD_PLANT && (
          <div
            className={
              standaloneMode || state.isSimpleImageMode
                ? styles['simple-mode-form']
                : ''
            }
          >
            <PlantAddForm />
          </div>
        )}

        {state.mode === MapMode.EDIT_PLANT && state.selectedSpecimen && (
          <div
            className={
              standaloneMode || state.isSimpleImageMode
                ? styles['simple-mode-form']
                : ''
            }
          >
            <PlantEditForm specimen={state.selectedSpecimen} />
          </div>
        )}
      </div>

      {/* Отображение выбранного растения */}
      {state.selectedSpecimen && state.mode === MapMode.VIEW && (
        <div className='selected-specimen p-4 bg-white rounded-lg mt-4 shadow-md border border-gray-200'>
          <h3 className='text-lg font-bold mb-2 text-green-800'>
            {state.selectedSpecimen.russianName ||
              state.selectedSpecimen.latinName}
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
            <p>
              <strong className='text-gray-700'>Латинское название:</strong>{' '}
              <span className='italic'>{state.selectedSpecimen.latinName}</span>
            </p>
            <p>
              <strong className='text-gray-700'>Семейство:</strong>{' '}
              {state.selectedSpecimen.familyName}
            </p>
            <p>
              <strong className='text-gray-700'>Инвентарный номер:</strong>{' '}
              {state.selectedSpecimen.inventoryNumber}
            </p>
            <p>
              <strong className='text-gray-700'>Координаты:</strong>{' '}
              {state.selectedSpecimen.latitude.toFixed(6)},
              {state.selectedSpecimen.longitude.toFixed(6)}
            </p>
          </div>
          <div className='mt-3 flex gap-2'>
            <button
              className='px-3 py-1 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 transition-colors text-sm flex items-center'
              onClick={() => {
                setMode(MapMode.EDIT_PLANT);
              }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4 mr-1'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
              </svg>
              Редактировать
            </button>
            <button
              className='px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors text-sm flex items-center'
              onClick={() => {
                setMode(MapMode.DELETE_PLANT);
              }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4 mr-1'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              Удалить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapControls;
