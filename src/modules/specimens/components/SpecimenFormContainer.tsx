import React, { useEffect, useState } from 'react';
import {
  expositionService,
  familyService,
  regionService,
  specimenService,
} from '../services';
import { ExpositionDto } from '../services/expositionService';
import { FamilyDto } from '../services/familyService';
import { RegionDto } from '../services/regionService';
import { Specimen, SpecimenFormData } from '../types';
import { SpecimenForm } from './SpecimenForm';
import { AddIcon, NavigateBeforeIcon, NavigateNextIcon } from './icons';
import { buttonClasses } from './styles';

interface SpecimenFormContainerProps {
  initialData?: Specimen;
  onSaveSuccess: (specimen: Specimen) => void;
  onCancel: () => void;
  currentIndex?: number;
  totalCount?: number;
  onNavigate?: (direction: 'prev' | 'next') => void;
  onAddNew?: () => void;
}

export const SpecimenFormContainer: React.FC<SpecimenFormContainerProps> = ({
  initialData,
  onSaveSuccess,
  onCancel,
  currentIndex = 0,
  totalCount = 0,
  onNavigate,
  onAddNew,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Справочные данные для выпадающих списков
  const [families, setFamilies] = useState<FamilyDto[]>([]);
  const [expositions, setExpositions] = useState<ExpositionDto[]>([]);
  const [regions, setRegions] = useState<RegionDto[]>([]);

  // Загрузка справочных данных при монтировании компонента
  useEffect(() => {
    const loadReferenceData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Загружаем все справочные данные параллельно
        const [familiesData, expositionsData, regionsData] = await Promise.all([
          familyService.getAllFamilies(),
          expositionService.getAllExpositions(),
          regionService.getAllRegions(),
        ]);

        setFamilies(familiesData);
        setExpositions(expositionsData);
        setRegions(regionsData);
      } catch (err) {
        console.error('Ошибка при загрузке справочных данных:', err);
        setError(
          'Не удалось загрузить справочные данные. Пожалуйста, попробуйте позже.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadReferenceData();
  }, []);

  // Обработчик сохранения данных формы
  const handleSave = async (formData: SpecimenFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      let savedSpecimen: Specimen;

      // Убедимся, что все необходимые поля имеют правильные типы данных
      const preparedData: SpecimenFormData = {
        ...formData,
        familyId: Number(formData.familyId) || 1,
        regionId: Number(formData.regionId) || 1,
        expositionId: Number(formData.expositionId) || 1,
        latitude: Number(formData.latitude) || 0,
        longitude: Number(formData.longitude) || 0,
        plantingYear: Number(formData.plantingYear) || new Date().getFullYear(),
        originalYear: Number(formData.originalYear) || 0,
        sectorType: Number(formData.sectorType) || 0,
        hasHerbarium: Boolean(formData.hasHerbarium),
      };

      if (formData.id) {
        // Обновление существующего экземпляра
        savedSpecimen = await specimenService.updateSpecimen(
          formData.id,
          preparedData as Specimen
        );
      } else {
        // Создание нового экземпляра
        savedSpecimen = await specimenService.createSpecimen(preparedData);
      }

      onSaveSuccess(savedSpecimen);
    } catch (err: any) {
      console.error('Ошибка при сохранении экземпляра растения:', err);
      let errorMessage =
        'Не удалось сохранить данные. Пожалуйста, проверьте форму и попробуйте снова.';

      // Если есть ответ от сервера с подробностями ошибки
      if (err.response && err.response.data) {
        errorMessage = `Ошибка сервера: ${
          err.response.data.message || err.response.data
        }`;
      }

      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Компонент для отображения навигации и счетчика записей
  const NavigationHeader = () => {
    if (totalCount <= 0) return null;

    return (
      <div className='flex justify-between items-center mb-4 bg-white p-3 rounded-lg shadow-sm'>
        <div className='flex items-center'>
          {onNavigate && (
            <div className='flex space-x-2'>
              <button
                onClick={() => onNavigate('prev')}
                disabled={currentIndex <= 0 || isLoading}
                className={`${buttonClasses.base} ${
                  buttonClasses.secondary
                } p-2 rounded-full ${
                  currentIndex <= 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-100'
                }`}
                title='Предыдущая запись'
              >
                <NavigateBeforeIcon className='w-5 h-5' />
              </button>
              <button
                onClick={() => onNavigate('next')}
                disabled={currentIndex >= totalCount - 1 || isLoading}
                className={`${buttonClasses.base} ${
                  buttonClasses.secondary
                } p-2 rounded-full ${
                  currentIndex >= totalCount - 1
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-100'
                }`}
                title='Следующая запись'
              >
                <NavigateNextIcon className='w-5 h-5' />
              </button>
            </div>
          )}
        </div>

        <div className='bg-blue-50 text-blue-800 px-4 py-1.5 rounded-full font-medium text-sm flex items-center justify-center'>
          Запись {currentIndex + 1} из {totalCount}
        </div>

        <div>
          {onAddNew && (
            <button
              onClick={onAddNew}
              disabled={isLoading}
              className={`${buttonClasses.base} ${buttonClasses.primary} flex items-center`}
              title='Добавить новый образец'
            >
              <AddIcon className='w-5 h-5 mr-1' />
              Добавить
            </button>
          )}
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className='p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4'>
        <p>{error}</p>
        <button
          onClick={() => setError(null)}
          className='mt-2 bg-red-200 hover:bg-red-300 text-red-800 font-semibold py-1 px-3 rounded'
        >
          Закрыть
        </button>
      </div>
    );
  }

  return (
    <div className='bg-gray-50 p-4 rounded-lg'>
      <NavigationHeader />
      <SpecimenForm
        initialData={initialData}
        onSave={handleSave}
        onCancel={onCancel}
        isLoading={isLoading}
        familyOptions={families}
        expositionOptions={expositions}
        regionOptions={regions}
      />
    </div>
  );
};
