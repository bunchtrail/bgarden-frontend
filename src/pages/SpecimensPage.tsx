import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  SpecimenActions,
  SpecimenForm,
  SpecimensList,
  containerClasses,
  headingClasses,
  subheadingClasses,
  tabClasses,
} from '../modules/specimens/components';
import styles from '../modules/specimens/components/specimens.module.css';
import {
  useReferenceLists,
  useSpecimenFilters,
  useSpecimenPagination,
  useSpecimens,
} from '../modules/specimens/hooks';
import { SectorType, Specimen } from '../modules/specimens/types';
import { useNotifications } from '../modules/notifications/hooks/useNotifications';
import { useConfirmation } from '../modules/notifications';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

/**
 * Компонент для переключения между вкладками
 */
const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`specimens-tabpanel-${index}`}
      aria-labelledby={`specimens-tab-${index}`}
      className={`${value === index ? 'block' : 'hidden'}`}
      {...other}
    >
      {value === index && <div className='p-0'>{children}</div>}
    </div>
  );
};

/**
 * Вспомогательная функция для доступности вкладок
 */
const a11yProps = (index: number) => {
  return {
    id: `specimens-tab-${index}`,
    'aria-controls': `specimens-tabpanel-${index}`,
  };
};

/**
 * Страница управления образцами растений
 */
export const SpecimensPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Определяем сектор по параметру URL
  const sectorParam = searchParams.get('sector');
  const sectorTypeParam = sectorParam
    ? (Number(sectorParam) as SectorType)
    : SectorType.Dendrology;
  
  // Состояние интерфейса
  const [tabValue, setTabValue] = useState(0);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { showSuccess, showError } = useNotifications();
  const { confirm } = useConfirmation();

  // Хуки для работы с данными
  const {
    specimens,
    filteredSpecimens,
    setFilteredSpecimens,
    currentSpecimen,
    currentIndex,
    isLoading,
    error,
    createSpecimen,
    updateSpecimen,
    deleteSpecimen,
    navigateToFirst,
    navigateToLast,
    navigateToPrev,
    navigateToNext,
    navigateToIndex,
  } = useSpecimens({ sectorType: sectorTypeParam });

  // Хук для работы со справочниками
  const {
    familyOptions,
    expositionOptions,
    regionOptions,
    isLoading: referencesLoading,
    error: referencesError,
  } = useReferenceLists();

  // Хук для фильтрации данных
  const { searchQuery, handleFilterChange, resetFilters } = useSpecimenFilters({
    specimens,
    onFilterChange: setFilteredSpecimens,
  });

  // Хук для пагинации
  const { page, pageSize, totalCount, setPage, setPageSize, paginatedData } =
    useSpecimenPagination({
      specimens: filteredSpecimens,
      defaultPageSize: 10,
    });

  // Общее состояние загрузки и ошибок
  const isLoadingCombined = isLoading || referencesLoading;

  // Функция для получения заголовка раздела в зависимости от типа сектора
  const getSectionTitle = () => {
    switch (sectorTypeParam) {
      case SectorType.Dendrology:
        return 'Управление дендрологической коллекцией';
      case SectorType.Flora:
        return 'Управление коллекцией флоры';
      case SectorType.Flowering:
        return 'Управление коллекцией цветочно-декоративных растений';
      default:
        return 'Управление коллекционным фондом';
    }
  };

  // Обработчики событий
  const handleTabChange = async (event: React.SyntheticEvent, newValue: number) => {
    if (isAddingNew && newValue === 1) {
      // Заменяем window.confirm на модальное окно
      const confirmed = await confirm({
        title: 'Отмена добавления',
        message: 'Вы уверены, что хотите отменить добавление образца?',
        confirmText: 'Да, отменить',
        cancelText: 'Нет, продолжить',
        variant: 'warning'
      });
      
      if (confirmed) {
        setIsAddingNew(false);
        setTabValue(newValue);
      }
    } else {
      setTabValue(newValue);
    }
  };

  const handleAddNew = () => {
    const newSpecimen: Specimen = {
      id: 0,
      inventoryNumber: '',
      sectorType: sectorTypeParam,
      latitude: 0,
      longitude: 0,
      regionId: 0,
      regionName: '',
      familyId: 0,
      familyName: '',
      russianName: '',
      latinName: '',
      genus: '',
      species: '',
      cultivar: '',
      form: '',
      synonyms: '',
      determinedBy: '',
      plantingYear: new Date().getFullYear(),
      sampleOrigin: '',
      naturalRange: '',
      ecologyAndBiology: '',
      economicUse: '',
      conservationStatus: '',
      expositionId: 0,
      expositionName: '',
      hasHerbarium: false,
      duplicatesInfo: '',
      originalBreeder: '',
      originalYear: 0,
      country: '',
      illustration: '',
      notes: '',
      filledBy: '',
    };

    setIsAddingNew(true);
    setTabValue(0); // Переключаемся на вкладку с формой
  };

  const handleSaveSpecimen = async (data: any) => {
    try {
      if (data.id) {
        await updateSpecimen(data.id, data as Specimen);
      } else {
        await createSpecimen(data as Omit<Specimen, 'id'>);
      }

      setIsAddingNew(false);
      setTabValue(1); // Переключаемся на список после сохранения

      // Показываем сообщение об успешном сохранении
      showSuccess('Образец успешно сохранен');
    } catch (error) {
      console.error('Ошибка при сохранении образца:', error);
    }
  };

  const handleViewDetail = (index: number) => {
    navigateToIndex(index);
    setTabValue(0); // Переключаемся на вкладку с формой
  };

  const handleDeleteSpecimen = async (id: number) => {
    // Заменяем window.confirm на модальное окно
    const confirmed = await confirm({
      title: 'Удаление образца',
      message: 'Вы уверены, что хотите удалить этот образец?',
      confirmText: 'Да, удалить',
      cancelText: 'Отмена',
      variant: 'danger'
    });
    
    if (!confirmed) return;

    try {
      const success = await deleteSpecimen(id);

      if (success) {
        showSuccess('Образец успешно удален');
      }
    } catch (error) {
      console.error('Ошибка удаления образца:', error);
    }
  };

  // Обработчики навигации
  const handleViewPhenology = () => {
    if (currentSpecimen) {
      navigate(`/phenology?specimenId=${currentSpecimen.id}`);
    }
  };

  const handleViewBiometry = () => {
    if (currentSpecimen) {
      navigate(`/biometry?specimenId=${currentSpecimen.id}`);
    }
  };

  const handleViewReports = () => {
    navigate(`/reports?sector=${sectorTypeParam}`);
  };

  const handleExit = () => {
    navigate('/');
  };

  // Обработчики экспорта и печати
  const handlePrintCurrent = () => {
    if (currentSpecimen) {
      console.log('Печать текущего образца:', currentSpecimen);
      // Здесь будет реализация печати
    }
  };

  const handlePrintList = () => {
    console.log('Печать списка образцов:', filteredSpecimens);
    // Здесь будет реализация печати списка
  };

  const handleExportToExcel = () => {
    console.log('Экспорт в Excel:', filteredSpecimens);
    // Здесь будет реализация экспорта в Excel
  };

  const handleExportToPdf = () => {
    console.log('Экспорт в PDF:', filteredSpecimens);
    // Здесь будет реализация экспорта в PDF
  };

  return (
    <div className={`${containerClasses.page}`}>
      <h1 className={headingClasses.page}>{getSectionTitle()}</h1>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        {/* Левая колонка с панелью действий */}
        <div className='md:col-span-1'>
          <SpecimenActions
            currentIndex={currentIndex}
            totalCount={filteredSpecimens.length}
            isLoading={isLoadingCombined}
            onNavigateFirst={navigateToFirst}
            onNavigateLast={navigateToLast}
            onNavigatePrev={navigateToPrev}
            onNavigateNext={navigateToNext}
            onAddNew={handleAddNew}
            onPrintCurrent={handlePrintCurrent}
            onPrintList={handlePrintList}
            onExportToExcel={handleExportToExcel}
            onExportToPdf={handleExportToPdf}
            onViewPhenology={handleViewPhenology}
            onViewBiometry={handleViewBiometry}
            onViewReports={handleViewReports}
            onExit={handleExit}
            onDelete={
              currentSpecimen && !isAddingNew
                ? () => handleDeleteSpecimen(currentSpecimen.id)
                : undefined
            }
          />
        </div>

        {/* Правая колонка с основным содержимым */}
        <div className='md:col-span-3'>
          <div
            className={`${styles.paperContainer} rounded-lg overflow-hidden bg-white`}
          >
            <div className='border-b border-gray-200'>
              <div className={tabClasses.base}>
                <button
                  className={`px-4 py-2 border-b-2 ${
                    tabValue === 0
                      ? 'border-blue-500 ' + tabClasses.active
                      : 'border-transparent ' + tabClasses.inactive
                  }`}
                  onClick={(e) => handleTabChange(e, 0)}
                  {...a11yProps(0)}
                >
                  {isAddingNew ? 'Новый образец' : 'Форма образца'}
                </button>
                <button
                  className={`px-4 py-2 border-b-2 ${
                    tabValue === 1
                      ? 'border-blue-500 ' + tabClasses.active
                      : 'border-transparent ' + tabClasses.inactive
                  }`}
                  onClick={(e) => handleTabChange(e, 1)}
                  {...a11yProps(1)}
                >
                  Список образцов
                </button>
              </div>
            </div>

            <TabPanel value={tabValue} index={0}>
              <div className='p-4'>
                {isAddingNew || currentSpecimen ? (
                  <SpecimenForm
                    initialData={
                      isAddingNew ? undefined : currentSpecimen || undefined
                    }
                    onSave={handleSaveSpecimen}
                    onCancel={() => {
                      setIsAddingNew(false);
                      setTabValue(1);
                    }}
                    isLoading={isLoadingCombined}
                    familyOptions={familyOptions}
                    expositionOptions={expositionOptions}
                    regionOptions={regionOptions}
                  />
                ) : (
                  <div className='flex flex-col items-center justify-center p-8'>
                    <h2 className={subheadingClasses.base}>
                      Нет доступных образцов
                    </h2>
                    <p className='text-gray-600 mt-2 text-center'>
                      Добавьте новый образец или измените параметры фильтрации
                      для отображения данных.
                    </p>
                    <button
                      onClick={handleAddNew}
                      className={`mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors`}
                    >
                      Добавить новый образец
                    </button>
                  </div>
                )}
              </div>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <SpecimensList
                specimens={paginatedData}
                isLoading={isLoadingCombined}
                onViewSpecimen={handleViewDetail}
                onEditSpecimen={(id) => {
                  const specimen = filteredSpecimens.find((s) => s.id === id);
                  if (specimen) {
                    setIsAddingNew(false);
                    setTabValue(0);
                    navigateToIndex(filteredSpecimens.indexOf(specimen));
                  }
                }}
                onSearch={(filterParams) => {
                  if (typeof filterParams === 'string') {
                    handleFilterChange('search', filterParams);
                  } else if (filterParams.searchValue) {
                    handleFilterChange('search', filterParams.searchValue);
                  }
                }}
                onFilterChange={handleFilterChange}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
                familyOptions={familyOptions}
                regionOptions={regionOptions}
                expositionOptions={expositionOptions}
                sectorOptions={[
                  { id: SectorType.Dendrology, name: 'Дендрология' },
                  { id: SectorType.Flora, name: 'Флора' },
                  {
                    id: SectorType.Flowering,
                    name: 'Цветочно-декоративные растения',
                  },
                ]}
              />
            </TabPanel>
          </div>
        </div>
      </div>
    </div>
  );
};
