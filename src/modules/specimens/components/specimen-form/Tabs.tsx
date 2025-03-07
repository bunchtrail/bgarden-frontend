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
      icon: <InfoIcon className='w-5 h-5 text-blue-600' />,
      color: 'blue',
      tab: SpecimenFormTab.BasicInfo,
      shortDescription: 'Основные данные образца: название, классификация'
    },
    {
      name: 'Географическая информация',
      icon: <MapIcon className='w-5 h-5 text-green-600' />,
      color: 'green',
      tab: SpecimenFormTab.GeographicInfo,
      shortDescription: 'Расположение и происхождение образца'
    },
    {
      name: 'Экспозиционная информация',
      icon: <LeafIcon className='w-5 h-5 text-amber-600' />,
      color: 'amber',
      tab: SpecimenFormTab.ExpositionInfo,
      shortDescription: 'Информация о размещении в экспозиции'
    },
    {
      name: 'Дополнительная информация',
      icon: <NoteIcon className='w-5 h-5 text-purple-600' />,
      color: 'purple',
      tab: SpecimenFormTab.AdditionalInfo,
      shortDescription: 'Научные и прочие данные об образце'
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

  // Получение стилей для каждой вкладки
  const getTabStyles = (color: string, isActive: boolean, hasError: boolean) => {
    const baseClasses = 'flex items-center justify-center px-4 py-3 text-sm font-medium transition-all duration-300';
    
    if (hasError) {
      return `${baseClasses} ${isActive 
        ? `bg-${color}-100 text-${color}-700 border-b-2 border-red-500` 
        : 'text-red-600 hover:text-red-700 hover:bg-red-50'}`;
    }
    
    if (isActive) {
      return `${baseClasses} bg-${color}-50 text-${color}-700 border-b-2 border-${color}-500 shadow-inner`;
    }
    
    return `${baseClasses} text-gray-600 hover:text-${color}-600 hover:bg-${color}-50`;
  };

  // Текущий активный таб и индекс
  const currentTabIndex = tabs.findIndex(tab => tab.tab === activeTab);
  const currentTab = tabs[currentTabIndex];

  return (
    <>
      <ul className={`${layoutClasses.flex} flex-wrap border-b border-gray-200`}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.tab;
          const hasError = tabHasErrors[index];
          const tabStyle = getTabStyles(tab.color, isActive, hasError);
          
          // Добавляем индикатор завершенности
          const isCompleted = index < currentTabIndex;

          return (
            <li key={index} className='flex-1' role="presentation">
              <button
                type='button'
                onClick={() => setActiveTab(tab.tab)}
                className={tabStyle}
                aria-current={isActive ? 'page' : undefined}
                role="tab"
                aria-selected={isActive}
                title={tab.shortDescription}
              >
                <span className='flex items-center'>
                  {isCompleted && !hasError ? (
                    <span className='w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2'>
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  ) : (
                    <span className={`${isActive ? 'scale-110' : ''} flex items-center justify-center w-5 h-5 mr-2 transition-transform duration-300`}>
                      {tab.icon}
                    </span>
                  )}
                  <span className='hidden sm:inline transition-all duration-300'>
                    {tab.name}
                  </span>
                  <span className='inline sm:hidden text-xs font-bold ml-1 bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center'>
                    {index + 1}
                  </span>
                  
                  {hasError && (
                    <span className='ml-1.5 flex-shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                      !
                    </span>
                  )}
                </span>
              </button>
              
              {isActive && (
                <div className={`h-0.5 bg-${tab.color}-500 animate-pulse`} />
              )}
            </li>
          );
        })}
      </ul>
      
      {/* Описание текущей вкладки */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-sm flex items-center">
        <span className="block mr-2">
          {currentTab.icon}
        </span>
        <div>
          <h3 className="font-medium text-gray-800">{currentTab.name}</h3>
          <p className="text-xs text-gray-600">{currentTab.shortDescription}</p>
        </div>
      </div>
    </>
  );
};
