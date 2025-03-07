import React from 'react';
import { Specimen } from '../../types';
import { InfoIcon, LeafIcon, MapIcon } from '../icons';
import styles from '../specimens.module.css';
import {
  chipClasses,
  specimenCardStyles,
  specimenContainerClasses,
  specimenTextClasses,
  wordBreakClasses,
} from '../styles';

interface SpecimenCardProps {
  specimen: Specimen;
  onClick?: () => void;
}

export const SpecimenCard: React.FC<SpecimenCardProps> = ({
  specimen,
  onClick,
}) => {
  return (
    <div
      className={`${specimenContainerClasses.card} ${styles.specimenCard} ${styles.fadeIn} bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300`}
      onClick={onClick}
    >
      <div className='p-5'>
        {/* Заголовок и основная информация */}
        <div className='border-b border-gray-200 pb-3 mb-3'>
          <h2
            className={`${specimenCardStyles.title} ${wordBreakClasses.base} text-xl font-semibold text-blue-700 mb-1`}
          >
            {specimen.russianName || specimen.latinName}
          </h2>
          {specimen.russianName && specimen.latinName && (
            <p
              className={`${specimenCardStyles.latinName} mb-2 text-gray-600 italic`}
            >
              {specimen.latinName}
            </p>
          )}
          <div className='flex flex-wrap items-center gap-2 mb-1'>
            <span className='inline-block bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium'>
              Инв. {specimen.inventoryNumber}
            </span>
            {specimen.plantingYear && (
              <span className='inline-block bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full font-medium'>
                Год посадки: {specimen.plantingYear}
              </span>
            )}
          </div>
        </div>

        {/* Основная информация о растении */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4'>
          <div className='bg-gray-50 p-3 rounded-lg border border-gray-100'>
            <h3 className='text-sm font-semibold text-gray-700 mb-2 flex items-center'>
              <InfoIcon className='w-4 h-4 mr-1.5 text-blue-600' />
              Таксономическая информация
            </h3>
            <div className='space-y-1.5'>
              <p className={`${specimenTextClasses.base} flex justify-between`}>
                <span
                  className={`${specimenTextClasses.label} text-sm text-gray-600`}
                >
                  Семейство:
                </span>
                <span className='text-sm text-gray-800 font-medium'>
                  {specimen.familyName}
                </span>
              </p>
              <p className={`${specimenTextClasses.base} flex justify-between`}>
                <span
                  className={`${specimenTextClasses.label} text-sm text-gray-600`}
                >
                  Род:
                </span>
                <span className='text-sm text-gray-800 font-medium'>
                  {specimen.genus}
                </span>
              </p>
              <p className={`${specimenTextClasses.base} flex justify-between`}>
                <span
                  className={`${specimenTextClasses.label} text-sm text-gray-600`}
                >
                  Вид:
                </span>
                <span className='text-sm text-gray-800 font-medium'>
                  {specimen.species}
                </span>
              </p>
              {specimen.cultivar && (
                <p
                  className={`${specimenTextClasses.base} flex justify-between`}
                >
                  <span
                    className={`${specimenTextClasses.label} text-sm text-gray-600`}
                  >
                    Сорт:
                  </span>
                  <span className='text-sm text-gray-800 font-medium'>
                    {specimen.cultivar}
                  </span>
                </p>
              )}
              {specimen.form && (
                <p
                  className={`${specimenTextClasses.base} flex justify-between`}
                >
                  <span
                    className={`${specimenTextClasses.label} text-sm text-gray-600`}
                  >
                    Форма:
                  </span>
                  <span className='text-sm text-gray-800 font-medium'>
                    {specimen.form}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className='bg-gray-50 p-3 rounded-lg border border-gray-100'>
            <h3 className='text-sm font-semibold text-gray-700 mb-2 flex items-center'>
              <MapIcon className='w-4 h-4 mr-1.5 text-green-600' />
              Местоположение и информация
            </h3>
            <div className='space-y-1.5'>
              <p className={`${specimenTextClasses.base} flex justify-between`}>
                <span
                  className={`${specimenTextClasses.label} text-sm text-gray-600`}
                >
                  Экспозиция:
                </span>
                <span className='text-sm text-gray-800 font-medium'>
                  {specimen.expositionName}
                </span>
              </p>
              {(specimen.regionId > 0 || specimen.regionName) && (
                <p
                  className={`${specimenTextClasses.base} flex justify-between`}
                >
                  <span
                    className={`${specimenTextClasses.label} text-sm text-gray-600`}
                  >
                    Регион:
                  </span>
                  <span className='text-sm text-gray-800 font-medium'>
                    {specimen.regionName ||
                      (specimen.sectorType === 0
                        ? 'Европа (Дендрарий)'
                        : specimen.sectorType === 1
                        ? 'Азия (Участок флоры)'
                        : specimen.sectorType === 2
                        ? 'Северная Америка (Цветоводство)'
                        : 'Не указан')}
                  </span>
                </p>
              )}
              {specimen.determinedBy && (
                <p
                  className={`${specimenTextClasses.base} flex justify-between`}
                >
                  <span
                    className={`${specimenTextClasses.label} text-sm text-gray-600`}
                  >
                    Определил:
                  </span>
                  <span className='text-sm text-gray-800 font-medium'>
                    {specimen.determinedBy}
                  </span>
                </p>
              )}
              {specimen.filledBy && (
                <p
                  className={`${specimenTextClasses.base} flex justify-between`}
                >
                  <span
                    className={`${specimenTextClasses.label} text-sm text-gray-600`}
                  >
                    Заполнил:
                  </span>
                  <span className='text-sm text-gray-800 font-medium'>
                    {specimen.filledBy}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Статусы и метки */}
        <div className='flex flex-wrap gap-2 mt-3'>
          {specimen.conservationStatus && (
            <span className={`${chipClasses.conservation} flex items-center`}>
              <LeafIcon className='w-3.5 h-3.5 mr-1' />
              {specimen.conservationStatus}
            </span>
          )}

          {specimen.hasHerbarium && (
            <span className={`${chipClasses.herbarium} flex items-center`}>
              <LeafIcon className='w-3.5 h-3.5 mr-1' />
              Имеется гербарий
            </span>
          )}
        </div>

        {/* Примечания */}
        {specimen.notes && (
          <div className='mt-3 pt-3 border-t border-gray-200'>
            <p
              className={`${wordBreakClasses.base} whitespace-pre-line text-sm text-gray-700`}
            >
              <span className={`${specimenTextClasses.label} font-medium`}>
                Примечания:
              </span>{' '}
              {specimen.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
