import React from 'react';
import { Specimen } from '../../types';
import { headingClasses, specimenContainerClasses } from '../styles';

interface SpecimenTaxonomyProps {
  specimen: Specimen;
}

export const SpecimenTaxonomy: React.FC<SpecimenTaxonomyProps> = ({
  specimen,
}) => {
  // Создаем массив таксономической иерархии
  const taxonomyLevels = [
    { label: 'Царство', value: 'Plantae (Растения)', important: false },
    {
      label: 'Отдел',
      value: 'Magnoliophyta (Покрытосеменные)',
      important: false,
    },
    { label: 'Класс', value: 'Magnoliopsida (Двудольные)', important: false },
    { label: 'Порядок', value: 'Зависит от вида', important: false },
    { label: 'Семейство', value: specimen.familyName, important: true },
    { label: 'Род', value: specimen.genus, important: true },
    { label: 'Вид', value: specimen.species, important: true },
  ];

  if (specimen.cultivar) {
    taxonomyLevels.push({
      label: 'Сорт',
      value: specimen.cultivar,
      important: true,
    });
  }

  if (specimen.form) {
    taxonomyLevels.push({
      label: 'Форма',
      value: specimen.form,
      important: true,
    });
  }

  return (
    <div className={`${specimenContainerClasses.card} p-4 mb-6`}>
      <h3 className={headingClasses.heading}>Таксономическая информация</h3>

      <div className='mb-4'>
        <div className='flex flex-col sm:flex-row justify-between mb-2'>
          <div>
            <span className='text-sm text-gray-600'>Русское название:</span>
            <h4 className='text-lg font-semibold'>
              {specimen.russianName || '—'}
            </h4>
          </div>
          <div className='mt-2 sm:mt-0'>
            <span className='text-sm text-gray-600'>Латинское название:</span>
            <h4 className='text-lg font-semibold italic'>
              {specimen.latinName || '—'}
            </h4>
          </div>
        </div>

        {specimen.synonyms && (
          <div className='mt-2'>
            <span className='text-sm text-gray-600'>Синонимы:</span>
            <p className='text-gray-800'>{specimen.synonyms}</p>
          </div>
        )}
      </div>

      <div className='border-t border-gray-200 pt-3'>
        <h4 className='text-md font-medium mb-2'>Систематическое положение:</h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2'>
          {taxonomyLevels.map((level, index) => (
            <div key={index} className='py-1'>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>{level.label}:</span>
                <span
                  className={`text-sm ${
                    level.important ? 'font-semibold' : ''
                  } ${level.label === 'Вид' ? 'italic' : ''}`}
                >
                  {level.value}
                </span>
              </div>
              {level.important && (
                <div className='mt-1 h-0.5 bg-green-100'></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {specimen.determinedBy && (
        <div className='mt-4 text-sm text-gray-600'>
          <span className='font-medium'>Определил: </span>
          {specimen.determinedBy}
        </div>
      )}
    </div>
  );
};
