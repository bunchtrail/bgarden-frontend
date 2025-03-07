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

  return (
    <div className='mb-8 border-b border-gray-200'>
      <ul
        className={`${layoutClasses.flex} flex-wrap -mb-px text-sm font-medium`}
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.tab;
          const hasError = tabHasErrors[index];
          const borderColorClass = isActive
            ? `border-${tab.color}-600`
            : 'border-transparent hover:border-gray-300';
          const textColorClass = isActive
            ? `text-${tab.color}-600`
            : 'text-gray-500 hover:text-gray-700';

          return (
            <li key={index} className='mr-2'>
              <button
                type='button'
                onClick={() => setActiveTab(tab.tab)}
                className={`inline-flex items-center px-4 py-3 border-b-2 rounded-t-lg ${borderColorClass} ${textColorClass} transition-all duration-200 group relative`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  className={`transform transition-transform duration-200 ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                >
                  {tab.icon}
                </span>
                <span className='font-medium'>{tab.name}</span>
                {hasError && (
                  <span
                    className={`bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ml-2 animate-pulse`}
                  >
                    !
                  </span>
                )}
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-${tab.color}-600 transform scale-x-100 transition-transform duration-300`}
                  ></span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
