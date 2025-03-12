// Компонент формы для создания/редактирования области на карте

import React, { useState } from 'react';
import {
  buttonClasses,
  COLORS,
  containerClasses,
  layoutClasses,
  textClasses,
} from '../../../../styles/global-styles';
import { useMapContext } from '../../contexts';
import styles from '../../styles/map.module.css';

const AreaForm: React.FC = () => {
  const { saveCurrentArea, closeAreaForm, isAreaFormOpen, currentAreaPoints } =
    useMapContext();

  const [areaName, setAreaName] = useState('Новая область');
  const [areaDescription, setAreaDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveCurrentArea(areaName, areaDescription);
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
            >
              Сохранить область
            </button>
          </div>
        </form>
        
        <div className={`${textClasses.body} ${textClasses.secondary} mt-2`}>
          <p>Количество точек в области: {currentAreaPoints.length}</p>
        </div>
      </div>
    </div>
  );
};

export default AreaForm;
