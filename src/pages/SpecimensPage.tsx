import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { SpecimenActions } from '../modules/specimens/components/SpecimenActions';
import { SpecimenForm } from '../modules/specimens/components/SpecimenForm';
import styles from '../modules/specimens/components/specimens.module.css';
import { SpecimensList } from '../modules/specimens/components/SpecimensList';
import {
  containerClasses,
  headingClasses,
  subheadingClasses,
  tabClasses,
} from '../modules/specimens/components/styles';
import { SectorType, Specimen } from '../modules/specimens/types';

// Импортируем необходимые зависимости и сервисы
import {
  expositionService,
  familyService,
  regionService,
  specimenService,
} from '../modules/specimens/services';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`specimens-tabpanel-${index}`}
      aria-labelledby={`specimens-tab-${index}`}
      className={`${styles.fadeIn} ${value === index ? 'block' : 'hidden'}`}
      {...other}
    >
      {value === index && <div className='p-0'>{children}</div>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `specimens-tab-${index}`,
    'aria-controls': `specimens-tabpanel-${index}`,
  };
};

export const SpecimensPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const sectorParam = searchParams.get('sector');

  // Определяем сектор по параметру URL
  const sectorTypeParam = sectorParam
    ? (Number(sectorParam) as SectorType)
    : SectorType.Dendrology;

  // Состояние
  const [tabValue, setTabValue] = useState(0);
  const [sectorType, setSectorType] = useState(sectorTypeParam);

  // Состояние данных
  const [specimens, setSpecimens] = useState<Specimen[]>([]);
  const [filteredSpecimens, setFilteredSpecimens] = useState<Specimen[]>([]);
  const [currentSpecimen, setCurrentSpecimen] = useState<Specimen | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editingSpecimen, setEditingSpecimen] = useState<Specimen | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Состояние модального окна
  const [showFormModal, setShowFormModal] = useState(false);

  // Фильтры
  const [searchQuery, setSearchQuery] = useState('');
  const [expositionFilter, setExpositionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Справочные данные
  const [familyOptions, setFamilyOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [expositionOptions, setExpositionOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [regionOptions, setRegionOptions] = useState<
    { id: number; name: string }[]
  >([]);

  // Функция для получения заголовка раздела в зависимости от типа сектора
  const getSectionTitle = () => {
    switch (sectorType) {
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

  // Загрузка данных
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Загрузка экспозиций и других справочников параллельно
        const [expositions, families, regions, data] = await Promise.all([
          expositionService.getAllExpositions(),
          familyService.getAllFamilies(),
          regionService.getAllRegions(),
          specimenService.getSpecimensBySectorType(sectorType),
        ]);

        setExpositionOptions(expositions);
        setFamilyOptions(families);

        console.log('Загруженные регионы:', regions);

        // Если регионов нет или их мало, используем временное сопоставление
        if (!regions || regions.length === 0) {
          const sectorData = [
            { id: 1, name: 'Дендрарий', sectorType: 0 },
            { id: 2, name: 'Участок флоры', sectorType: 1 },
            { id: 3, name: 'Участок цветоводства', sectorType: 2 },
          ];

          const sectorRegionMapping =
            regionService.getSectorRegionMapping(sectorData);
          const temporaryRegions = Object.values(sectorRegionMapping);
          setRegionOptions(temporaryRegions);
          console.log(
            'Используем временное сопоставление регионов:',
            temporaryRegions
          );
        } else {
          setRegionOptions(regions);
        }

        console.log('Загруженные экземпляры:', data);

        // Если у экземпляров нет regionName, добавляем его
        const enhancedData = data.map((specimen) => {
          if (!specimen.regionName && specimen.regionId) {
            // Ищем регион по ID
            const matchedRegion =
              regions.find((r) => r.id === specimen.regionId) ||
              regionOptions.find((r) => r.id === specimen.regionId);
            if (matchedRegion) {
              return {
                ...specimen,
                regionName: matchedRegion.name,
              };
            }
          }
          return specimen;
        });

        setSpecimens(enhancedData);
        setFilteredSpecimens(enhancedData);

        if (enhancedData.length > 0) {
          setCurrentIndex(0);
          setCurrentSpecimen(enhancedData[0]);
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [sectorType]);

  // Используем useEffect с полной зависимостью от currentIndex
  useEffect(() => {
    if (
      specimens.length > 0 &&
      currentIndex >= 0 &&
      currentIndex < specimens.length
    ) {
      setCurrentSpecimen(specimens[currentIndex]);
    } else {
      setCurrentSpecimen(null);
    }
  }, [specimens, currentIndex]);

  // Объединим обработчики фильтров в один общий
  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === 'exposition') {
      setExpositionFilter(value);
    } else if (filterType === 'status') {
      setStatusFilter(value);
    }

    // Обновляем фильтрованные данные
    let filtered = [...specimens];

    if (searchQuery) {
      filtered = filtered.filter(
        (specimen) =>
          specimen.inventoryNumber.includes(searchQuery) ||
          specimen.russianName.includes(searchQuery) ||
          specimen.latinName.includes(searchQuery)
      );
    }

    if (expositionFilter !== 'all') {
      filtered = filtered.filter(
        (specimen) => specimen.expositionName === expositionFilter
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((specimen) => {
        // Логика фильтрации по статусу (пример)
        if (statusFilter === 'active') return specimen.hasHerbarium;
        if (statusFilter === 'inactive') return !specimen.hasHerbarium;
        return true;
      });
    }

    setFilteredSpecimens(filtered);
  };

  // Обработчики событий
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Навигация по образцам
  const handleNavigateFirst = () => {
    if (filteredSpecimens.length > 0) {
      setCurrentIndex(0);
    }
  };

  const handleNavigateLast = () => {
    if (filteredSpecimens.length > 0) {
      setCurrentIndex(filteredSpecimens.length - 1);
    }
  };

  const handleNavigatePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNavigateNext = () => {
    if (currentIndex < filteredSpecimens.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Действия с образцами
  const handleViewDetail = (index: number) => {
    setCurrentIndex(index);
    setTabValue(0); // Переключаемся на вкладку с формой
  };

  const handleAddNew = () => {
    setEditingSpecimen({
      id: 0,
      inventoryNumber: '',
      sectorType,
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
    });
    setShowFormModal(true);
  };

  const handleSaveSpecimen = async (data: any) => {
    setIsLoading(true);

    try {
      let savedSpecimen: Specimen;
      if (data.id) {
        savedSpecimen = await specimenService.updateSpecimen(data.id, data);
      } else {
        savedSpecimen = await specimenService.createSpecimen(data);
      }

      setSpecimens((prevSpecimens) => {
        if (data.id) {
          return prevSpecimens.map((s) =>
            s.id === data.id ? savedSpecimen : s
          );
        } else {
          return [...prevSpecimens, savedSpecimen];
        }
      });

      setShowFormModal(false);
      setEditingSpecimen(null);

      // Показываем сообщение об успешном сохранении
      alert('Образец успешно сохранен');
    } catch (error) {
      console.error('Ошибка при сохранении образца:', error);
      // Показываем сообщение об ошибке
      alert('Ошибка при сохранении образца');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSpecimen = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот образец?')) return;

    setIsLoading(true);
    try {
      await specimenService.deleteSpecimen(id);
      const updatedSpecimens = specimens.filter((s) => s.id !== id);
      setSpecimens(updatedSpecimens);

      // Корректируем текущий индекс
      if (currentIndex >= updatedSpecimens.length) {
        setCurrentIndex(
          updatedSpecimens.length > 0 ? updatedSpecimens.length - 1 : -1
        );
      }
    } catch (error) {
      console.error('Ошибка удаления образца:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Прочие обработчики
  const handlePrintCurrent = () => {
    if (currentSpecimen) {
      // Временно заменили на console.log, так как метод printSpecimen отсутствует
      console.log('Печать текущего образца:', currentSpecimen);
    }
  };

  const handlePrintList = () => {
    // Временно заменили на console.log, так как метод printSpecimensList отсутствует
    console.log('Печать списка образцов:', filteredSpecimens);
  };

  const handleExportToExcel = () => {
    // Временно заменили на console.log, так как метод exportToExcel отсутствует
    console.log('Экспорт в Excel:', filteredSpecimens);
  };

  const handleExportToPdf = () => {
    // Временно заменили на console.log, так как метод exportToPdf отсутствует
    console.log('Экспорт в PDF:', filteredSpecimens);
  };

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
    navigate(`/reports?sector=${sectorType}`);
  };

  const handleExit = () => {
    navigate('/');
  };

  // Обработчик поиска
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);

    if (!query) {
      setFilteredSpecimens(specimens);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = specimens.filter(
      (specimen) =>
        specimen.russianName.toLowerCase().includes(lowerQuery) ||
        specimen.latinName.toLowerCase().includes(lowerQuery) ||
        specimen.inventoryNumber.toLowerCase().includes(lowerQuery)
    );

    setFilteredSpecimens(filtered);
  };

  return (
    <div className={`${containerClasses.page} ${styles.fadeIn}`}>
      <h1 className={headingClasses.page}>{getSectionTitle()}</h1>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        {/* Левая колонка с панелью действий */}
        <div className='md:col-span-1'>
          <SpecimenActions
            currentIndex={currentIndex}
            totalCount={filteredSpecimens.length}
            isLoading={isLoading}
            onNavigateFirst={handleNavigateFirst}
            onNavigateLast={handleNavigateLast}
            onNavigatePrev={handleNavigatePrev}
            onNavigateNext={handleNavigateNext}
            onAddNew={handleAddNew}
            onPrintCurrent={handlePrintCurrent}
            onPrintList={handlePrintList}
            onExportToExcel={handleExportToExcel}
            onExportToPdf={handleExportToPdf}
            onViewPhenology={handleViewPhenology}
            onViewBiometry={handleViewBiometry}
            onViewReports={handleViewReports}
            onExit={handleExit}
            onDelete={handleDeleteSpecimen}
          />
        </div>

        {/* Правая колонка с основным содержимым */}
        <div className='md:col-span-3'>
          <div
            className={`${styles.paperContainer} rounded-lg shadow-md overflow-hidden bg-white`}
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
                  Форма образца
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
                {currentSpecimen ? (
                  <SpecimenForm
                    initialData={currentSpecimen}
                    onSave={handleSaveSpecimen}
                    onCancel={() => setTabValue(1)} // Возврат к списку
                    isLoading={isLoading}
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
                      className={`mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors ${styles.buttonHover}`}
                    >
                      Добавить новый образец
                    </button>
                  </div>
                )}
              </div>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <SpecimensList
                specimens={filteredSpecimens}
                isLoading={isLoading}
                onViewSpecimen={handleViewDetail}
                onEditSpecimen={() => {}}
                onSearch={(params) => {
                  if (params.searchValue) {
                    handleFilterChange('exposition', params.searchValue);
                  }
                }}
                familyOptions={familyOptions}
                regionOptions={regionOptions}
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

      {/* Модальное окно для добавления нового образца */}
      {showFormModal && (
        <div className='fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto'>
            <div className='p-6'>
              <h2 className={headingClasses.base}>Добавить новый образец</h2>
              <SpecimenForm
                initialData={editingSpecimen || undefined}
                onSave={handleSaveSpecimen}
                onCancel={() => {
                  setShowFormModal(false);
                  setEditingSpecimen(null);
                }}
                isLoading={isLoading}
                familyOptions={familyOptions}
                expositionOptions={expositionOptions}
                regionOptions={regionOptions}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
