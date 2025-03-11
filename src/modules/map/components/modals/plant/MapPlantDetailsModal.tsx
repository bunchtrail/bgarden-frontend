import React from 'react';
import { Specimen } from '../../../../specimens/types';

interface MapPlantDetailsModalProps {
  open: boolean;
  onClose: () => void;
  specimen: Specimen | null;
}

/**
 * Компонент модального окна для отображения подробной информации о растении
 */
const MapPlantDetailsModal: React.FC<MapPlantDetailsModalProps> = ({
  open,
  onClose,
  specimen,
}) => {
  if (!specimen || !open) return null;

  // Создаем подготовленные данные для отображения
  const specimenName = specimen.russianName || specimen.latinName;
  const scientificName = specimen.latinName;
  const description = specimen.ecologyAndBiology || 'Нет описания';
  const imgUrl = specimen.illustration || '/assets/plant-placeholder.jpg';
  const sector =
    specimen.sectorType === 0
      ? 'Дендрология'
      : specimen.sectorType === 1
      ? 'Флора'
      : specimen.sectorType === 2
      ? 'Цветение'
      : 'Не указан';
  const age = specimen.plantingYear
    ? new Date().getFullYear() - specimen.plantingYear
    : 'Не указан';
  const plantingDate = specimen.plantingYear
    ? `${specimen.plantingYear} г.`
    : 'Не указан';
  const healthStatus = specimen.notes || 'Не указано';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        open ? 'visible' : 'invisible'
      }`}
    >
      {/* Затемненный фон */}
      <div
        className='fixed inset-0 bg-black/50 transition-opacity'
        onClick={onClose}
      />

      {/* Содержимое модального окна */}
      <div className='relative w-full max-w-xl max-h-[80vh] overflow-auto bg-white rounded-xl shadow-xl m-4 p-5 transition-all transform'>
        {/* Заголовок */}
        <h2 className='text-xl sm:text-2xl font-bold mb-3'>
          {specimenName} (ID: {specimen.id})
        </h2>

        {/* Изображение */}
        <div className='h-60 mb-4 rounded-lg overflow-hidden bg-gray-50'>
          <img
            src={imgUrl}
            alt={specimenName}
            className='w-full h-full object-contain'
          />
        </div>

        {/* Основная информация */}
        <div className='space-y-4'>
          <p className='text-base leading-relaxed'>
            <strong>Научное название:</strong> {scientificName}
          </p>

          <p className='text-base leading-relaxed'>
            <strong>Описание:</strong> {description}
          </p>

          <hr className='my-4 border-gray-200' />

          <h3 className='text-lg font-semibold'>Информация об экземпляре</h3>

          <div className='space-y-2 text-sm text-gray-700'>
            <p>
              <strong>Сектор:</strong> {sector}
            </p>
            <p>
              <strong>Возраст:</strong> {age}
            </p>
            <p>
              <strong>Посажен:</strong> {plantingDate}
            </p>
            <p>
              <strong>Состояние:</strong> {healthStatus}
            </p>
          </div>

          {/* Кнопка закрытия */}
          <div className='mt-5 flex justify-end'>
            <button
              onClick={onClose}
              className='px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors'
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPlantDetailsModal;
