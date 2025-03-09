import React from 'react';
import { useMapContext } from '../contexts/MapContext';
import { MapMode } from '../types';
import PlantAddForm from './forms/PlantAddForm';
import PlantEditForm from './forms/PlantEditForm';

const MapControls: React.FC = () => {
  const { state, setMode } = useMapContext();

  return (
    <div className='map-controls mt-4'>
      <div className='map-control-buttons flex space-x-2 mb-4'>
        <button
          className={`px-3 py-2 rounded-lg ${
            state.mode === MapMode.VIEW
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setMode(MapMode.VIEW)}
        >
          Просмотр
        </button>
        <button
          className={`px-3 py-2 rounded-lg ${
            state.mode === MapMode.ADD_PLANT
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setMode(MapMode.ADD_PLANT)}
        >
          Добавить растение
        </button>
        <button
          className={`px-3 py-2 rounded-lg ${
            state.mode === MapMode.EDIT_PLANT
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setMode(MapMode.EDIT_PLANT)}
        >
          Редактировать растение
        </button>
        <button
          className={`px-3 py-2 rounded-lg ${
            state.mode === MapMode.DELETE_PLANT
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setMode(MapMode.DELETE_PLANT)}
        >
          Удалить растение
        </button>
      </div>

      {/* Показываем соответствующую форму в зависимости от режима */}
      <div className='map-forms'>
        {state.mode === MapMode.ADD_PLANT && <PlantAddForm />}
        {state.mode === MapMode.EDIT_PLANT && state.selectedSpecimen && (
          <PlantEditForm specimen={state.selectedSpecimen} />
        )}
      </div>

      {/* Инструкции для пользователя */}
      {state.mode !== MapMode.VIEW && (
        <div className='map-instructions p-4 bg-blue-50 rounded-lg mt-2 border border-blue-100'>
          {state.mode === MapMode.ADD_PLANT && (
            <p>Кликните на карте, чтобы выбрать место для нового растения</p>
          )}
          {state.mode === MapMode.EDIT_PLANT && (
            <p>Выберите растение на карте для редактирования</p>
          )}
          {state.mode === MapMode.DELETE_PLANT && (
            <p>Выберите растение на карте для удаления</p>
          )}
        </div>
      )}

      {/* Отображение выбранного растения */}
      {state.selectedSpecimen && state.mode === MapMode.VIEW && (
        <div className='selected-specimen p-4 bg-white rounded-lg mt-4 shadow-md'>
          <h3 className='text-lg font-bold mb-2'>
            {state.selectedSpecimen.russianName ||
              state.selectedSpecimen.latinName}
          </h3>
          <p>
            <strong>Латинское название:</strong>{' '}
            {state.selectedSpecimen.latinName}
          </p>
          <p>
            <strong>Семейство:</strong> {state.selectedSpecimen.familyName}
          </p>
          <p>
            <strong>Инвентарный номер:</strong>{' '}
            {state.selectedSpecimen.inventoryNumber}
          </p>
          <p>
            <strong>Координаты:</strong>{' '}
            {state.selectedSpecimen.latitude.toFixed(6)},
            {state.selectedSpecimen.longitude.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapControls;
