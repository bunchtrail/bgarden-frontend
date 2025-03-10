import React from 'react';
import { useMapContext } from '../contexts/MapContext';
import { MapMode } from '../types';
import PlantAddForm from './forms/PlantAddForm';
import PlantEditForm from './forms/PlantEditForm';

const MapControls: React.FC = () => {
  const { state, setMode } = useMapContext();

  return (
    <div className='map-controls mt-4'>
      <div className='map-control-buttons flex flex-wrap gap-2 mb-4'>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            state.mode === MapMode.VIEW
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
          onClick={() => setMode(MapMode.VIEW)}
        >
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Просмотр
          </span>
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            state.mode === MapMode.ADD_PLANT
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
          onClick={() => setMode(MapMode.ADD_PLANT)}
        >
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Добавить растение
          </span>
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            state.mode === MapMode.EDIT_PLANT
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
          onClick={() => setMode(MapMode.EDIT_PLANT)}
        >
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Редактировать
          </span>
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            state.mode === MapMode.DELETE_PLANT
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
          onClick={() => setMode(MapMode.DELETE_PLANT)}
        >
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Удалить
          </span>
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
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Кликните на карте, чтобы выбрать место для нового растения
            </p>
          )}
          {state.mode === MapMode.EDIT_PLANT && (
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Выберите растение на карте для редактирования
            </p>
          )}
          {state.mode === MapMode.DELETE_PLANT && (
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Выберите растение на карте для удаления
            </p>
          )}
        </div>
      )}

      {/* Отображение выбранного растения */}
      {state.selectedSpecimen && state.mode === MapMode.VIEW && (
        <div className='selected-specimen p-4 bg-white rounded-lg mt-4 shadow-md border border-gray-200'>
          <h3 className='text-lg font-bold mb-2 text-green-800'>
            {state.selectedSpecimen.russianName ||
              state.selectedSpecimen.latinName}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p>
              <strong className="text-gray-700">Латинское название:</strong>{' '}
              <span className="italic">{state.selectedSpecimen.latinName}</span>
            </p>
            <p>
              <strong className="text-gray-700">Семейство:</strong> {state.selectedSpecimen.familyName}
            </p>
            <p>
              <strong className="text-gray-700">Инвентарный номер:</strong>{' '}
              {state.selectedSpecimen.inventoryNumber}
            </p>
            <p>
              <strong className="text-gray-700">Координаты:</strong>{' '}
              {state.selectedSpecimen.latitude.toFixed(6)},
              {state.selectedSpecimen.longitude.toFixed(6)}
            </p>
          </div>
          <div className="mt-3 flex gap-2">
            <button 
              className="px-3 py-1 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 transition-colors text-sm"
              onClick={() => {
                setMode(MapMode.EDIT_PLANT);
              }}
            >
              Редактировать
            </button>
            <button 
              className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors text-sm"
              onClick={() => {
                setMode(MapMode.DELETE_PLANT);
              }}
            >
              Удалить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapControls;
