// Компонент формы для создания/редактирования области на карте

import React, { useState } from 'react';
import {
  buttonClasses,
  COLORS,
  containerClasses,
  layoutClasses,
  textClasses,
} from '../../../../styles/global-styles';
import { useMapContext, CreateAreaParams } from '../../contexts';
import styles from '../../styles/map.module.css';

const AreaForm: React.FC = () => {
  const { saveCurrentArea, closeAreaForm, isAreaFormOpen, currentAreaPoints } =
    useMapContext();

  const [areaName, setAreaName] = useState('Новая область');
  const [areaDescription, setAreaDescription] = useState('');
  const [strokeColor, setStrokeColor] = useState('#FF5733');
  const [fillColor, setFillColor] = useState('#FFD700');
  const [fillOpacity, setFillOpacity] = useState(0.3);
  const [sectorType, setSectorType] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Вычисляем центр области (latitude, longitude)
    const calculateCenter = (points: [number, number][]) => {
      if (points.length === 0) return { lat: 0, lng: 0 };
      
      const sum = points.reduce(
        (acc, point) => {
          return { lat: acc.lat + point[0], lng: acc.lng + point[1] };
        },
        { lat: 0, lng: 0 }
      );
      
      return {
        lat: sum.lat / points.length,
        lng: sum.lng / points.length
      };
    };
    
    // Примерный радиус области (можно улучшить алгоритм)
    const calculateRadius = (points: [number, number][], center: { lat: number, lng: number }) => {
      if (points.length === 0) return 0;
      
      return Math.max(
        ...points.map(point => 
          Math.sqrt(
            Math.pow(point[0] - center.lat, 2) + 
            Math.pow(point[1] - center.lng, 2)
          )
        )
      );
    };

    const center = calculateCenter(currentAreaPoints);
    const radius = calculateRadius(currentAreaPoints, center);
    
    // Передаем все данные в контекст
    saveCurrentArea({
      name: areaName,
      description: areaDescription,
      latitude: center.lat,
      longitude: center.lng,
      radius: radius,
      strokeColor: strokeColor,
      fillColor: fillColor,
      fillOpacity: parseFloat(fillOpacity.toString()),
      sectorType: parseInt(sectorType.toString()),
      boundaryWkt: "", // Это поле будет заполнено на сервере или может быть добавлено позже
    });
  };

  if (!isAreaFormOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3 className={`${textClasses.subheading} mb-4`}>Создание новой области</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`${textClasses.body} block mb-1`}>
              Название области:
            </label>
            <input
              type="text"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className={`${textClasses.body} block mb-1`}>
              Описание (необязательно):
            </label>
            <textarea
              value={areaDescription}
              onChange={(e) => setAreaDescription(e.target.value)}
              className={styles.formTextarea}
              rows={3}
            />
          </div>
          
          <div className="mb-4">
            <label className={`${textClasses.body} block mb-1`}>
              Цвет границы:
            </label>
            <div className="flex items-center">
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="mr-2 w-10 h-10 rounded"
              />
              <input
                type="text"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className={styles.formInput}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className={`${textClasses.body} block mb-1`}>
              Цвет заливки:
            </label>
            <div className="flex items-center">
              <input
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="mr-2 w-10 h-10 rounded"
              />
              <input
                type="text"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className={styles.formInput}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className={`${textClasses.body} block mb-1`}>
              Прозрачность заливки (0-1):
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={fillOpacity}
              onChange={(e) => setFillOpacity(parseFloat(e.target.value))}
              className="w-full mb-1"
            />
            <span>{fillOpacity}</span>
          </div>
          
          <div className="mb-4">
            <label className={`${textClasses.body} block mb-1`}>
              Тип сектора:
            </label>
            <select
              value={sectorType}
              onChange={(e) => setSectorType(parseInt(e.target.value))}
              className={styles.formInput}
            >
              <option value="0">Стандартный</option>
              <option value="1">Экспозиция</option>
              <option value="2">Администрация</option>
              <option value="3">Служебный</option>
            </select>
          </div>
          
          <div className={`${layoutClasses.flex} justify-between mt-6`}>
            <button
              type="button"
              className={`${buttonClasses.base} ${buttonClasses.secondary}`}
              onClick={closeAreaForm}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={`${buttonClasses.base} ${buttonClasses.primary}`}
              disabled={currentAreaPoints.length < 3}
            >
              Сохранить область
            </button>
          </div>
        </form>
        
        <div className={`${textClasses.body} ${textClasses.secondary} mt-2`}>
          <p>Количество точек в области: {currentAreaPoints.length}</p>
          {currentAreaPoints.length < 3 && (
            <p className="text-red-500">Для создания области необходимо минимум 3 точки</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AreaForm;
