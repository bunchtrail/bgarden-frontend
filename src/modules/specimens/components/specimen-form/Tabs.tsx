import React from 'react';
import { layoutClasses } from '../../../../styles/global-styles';
import { InfoIcon, LeafIcon, MapIcon, NoteIcon } from '../icons';
import { SpecimenFormTab, TabsProps } from './types';

export const FormTabs: React.FC<TabsProps> = ({
  activeTab,
  setActiveTab,
  errors,
}) => {
  const tabs = [
    {
      name: 'Основная информация',
      icon: <InfoIcon className='w-5 h-5 mr-2 text-blue-600' />,
      color: 'blue',
      tab: SpecimenFormTab.BasicInfo,
    },
    {
      name: 'Географическая информация',
      icon: <MapIcon className='w-5 h-5 mr-2 text-green-600' />,
      color: 'green',
      tab: SpecimenFormTab.GeographicInfo,
    },
    {
      name: 'Экспозиционная информация',
      icon: <LeafIcon className='w-5 h-5 mr-2 text-amber-600' />,
      color: 'amber',
      tab: SpecimenFormTab.ExpositionInfo,
    },
    {
      name: 'Дополнительная информация',
      icon: <NoteIcon className='w-5 h-5 mr-2 text-purple-600' />,
      color: 'purple',
      tab: SpecimenFormTab.AdditionalInfo,
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
    ].some((field) => !!errors[field]),
    ['regionId', 'country', 'naturalRange', 'latitude', 'longitude'].some(
      (field) => !!errors[field]
    ),
    ['expositionId', 'plantingYear', 'hasHerbarium', 'duplicatesInfo'].some(
      (field) => !!errors[field]
    ),
    [
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

  // Функция для получения градиентного цвета фона вкладки
  const getTabBackground = (color: string, isActive: boolean) => {
    if (!isActive) return 'bg-white';

    const gradients = {
      blue: 'bg-gradient-to-r from-blue-50 to-blue-100',
      green: 'bg-gradient-to-r from-green-50 to-green-100',
      amber: 'bg-gradient-to-r from-amber-50 to-amber-100',
      purple: 'bg-gradient-to-r from-purple-50 to-purple-100',
    };

    return gradients[color as keyof typeof gradients] || 'bg-white';
  };

  return (
    <div className='mb-8 rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
      <ul className={`${layoutClasses.flex} flex-wrap bg-white rounded-t-lg`}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.tab;
          const hasError = tabHasErrors[index];
          const textColorClass = isActive
            ? `text-${tab.color}-600`
            : 'text-gray-500 hover:text-gray-700';
          const bgClass = getTabBackground(tab.color, isActive);

          return (
            <li key={index} className='flex-grow'>
              <button
                type='button'
                onClick={() => setActiveTab(tab.tab)}
                className={`w-full flex items-center justify-center px-3 py-4 ${textColorClass} ${bgClass} transition-all duration-300 relative ${
                  isActive ? 'font-medium shadow-inner' : 'hover:bg-gray-50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div
                  className={`flex items-center transition-transform duration-300 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}
                >
                  <span
                    className={`transform transition-all duration-300 ${
                      isActive ? 'scale-125' : ''
                    }`}
                  >
                    {tab.icon}
                  </span>
                  <span
                    className={`hidden sm:inline ml-2 transition-all duration-300 ${
                      isActive ? 'font-medium' : ''
                    }`}
                  >
                    {tab.name}
                  </span>
                  <span className='sm:hidden ml-1 text-xs'>{index + 1}</span>
                </div>
                {hasError && (
                  <span
                    className={`absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse`}
                  >
                    !
                  </span>
                )}
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-0 w-full h-1 bg-${tab.color}-500 animate-pulse`}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
