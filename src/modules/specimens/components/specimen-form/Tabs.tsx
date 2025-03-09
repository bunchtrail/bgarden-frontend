import React from 'react';
import { InfoIcon, NoteIcon } from '../icons';
import { animationClasses, tabClasses } from '../styles';
import { SpecimenFormTab, TabsProps } from './types';

export const FormTabs: React.FC<TabsProps> = ({
  activeTab,
  setActiveTab,
  errors,
}) => {
  const tabs = [
    {
      name: 'Основная информация',
      icon: <InfoIcon className='w-5 h-5 text-blue-600' />,
      color: 'blue',
      tab: SpecimenFormTab.MainInfo,
      shortDescription: 'Основные данные и расположение образца',
    },
    {
      name: 'Дополнительная информация',
      icon: <NoteIcon className='w-5 h-5 text-purple-600' />,
      color: 'purple',
      tab: SpecimenFormTab.AdditionalInfo,
      shortDescription: 'Экспозиционные, научные и прочие данные об образце',
    },
  ];

  const tabHasErrors = [
    [
      'inventoryNumber',
      'russianName',
      'latinName',
      'familyId',
      'genus',
      'species',
      'cultivar',
      'form',
      'regionId',
      'country',
      'naturalRange',
      'latitude',
      'longitude',
    ].some((field) => !!errors[field]),
    [
      'expositionId',
      'plantingYear',
      'hasHerbarium',
      'duplicatesInfo',
      'synonyms',
      'determinedBy',
      'sampleOrigin',
      'ecologyAndBiology',
      'economicUse',
      'conservationStatus',
      'originalBreeder',
      'originalYear',
      'notes',
      'filledBy',
    ].some((field) => !!errors[field]),
  ];

  return (
    <div
      className={`${tabClasses.pillContainer} ${animationClasses.smoothTransition}`}
    >
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.tab;
        const hasError = tabHasErrors[index];

        // Базовые классы
        let tabClsName = `${tabClasses.pillTab} ${animationClasses.smoothTransition}`;

        // Добавляем активные/неактивные классы
        tabClsName += isActive
          ? ` ${tabClasses.pillActive}`
          : ` ${tabClasses.pillInactive}`;

        // Если есть ошибки, добавляем соответствующий стиль
        if (hasError) {
          tabClsName += isActive
            ? ' border-red-200 bg-red-50 text-red-600'
            : ' text-red-600 ring-1 ring-red-200';
        }

        return (
          <button
            key={index}
            type='button'
            onClick={() => setActiveTab(tab.tab)}
            className={tabClsName}
            title={tab.shortDescription}
          >
            <span className='flex items-center justify-center'>
              <span
                className={`inline-flex mr-2 ${isActive ? 'scale-110' : ''} ${
                  animationClasses.smoothTransition
                }`}
              >
                {tab.icon}
              </span>
              <span className='hidden sm:inline'>{tab.name}</span>
              <span className='inline sm:hidden font-semibold'>
                {index + 1}
              </span>

              {hasError && (
                <span className='ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600'>
                  <svg
                    className='h-3.5 w-3.5'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};
