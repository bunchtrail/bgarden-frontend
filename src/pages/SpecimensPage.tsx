import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Container,
  Grid,
  IconButton,
  Modal,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  SectorType,
  Specimen,
  SpecimenActions,
  SpecimenCard,
  SpecimenFilterParams,
  SpecimenForm,
  SpecimenFormData,
  SpecimensList,
} from '../modules/specimens';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

/**
 * Страница для работы с образцами растений
 */
const SpecimensPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Получаем параметр sector из URL
  const queryParams = new URLSearchParams(location.search);
  const sectorParam = queryParams.get('sector');
  const initialSectorType = sectorParam
    ? (Number(sectorParam) as SectorType)
    : undefined;

  // Состояние для демонстрации, в реальности данные бы подгружались из API
  const [specimens, setSpecimens] = useState<Specimen[]>([]);
  const [filteredSpecimens, setFilteredSpecimens] = useState<Specimen[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingSpecimen, setEditingSpecimen] = useState<Specimen | undefined>(
    undefined
  );

  // Состояние для фильтров
  const [currentFilters, setCurrentFilters] = useState<SpecimenFilterParams>({
    sectorType: initialSectorType,
  });

  // Состояние для табов
  const [tabValue, setTabValue] = useState(0);

  // Моковые данные для выпадающих списков
  const familyOptions = [
    { id: 1, name: 'Розоцветные' },
    { id: 2, name: 'Астровые' },
    { id: 3, name: 'Бобовые' },
    { id: 4, name: 'Злаковые' },
  ];

  const expositionOptions = [
    { id: 1, name: 'Оранжерея №1' },
    { id: 2, name: 'Экспозиция цветов' },
    { id: 3, name: 'Дендрарий' },
    { id: 4, name: 'Альпийская горка' },
  ];

  const sectorOptions = [
    { id: SectorType.Dendrology, name: 'Дендрология' },
    { id: SectorType.Floriculture, name: 'Цветоводство' },
  ];

  // Имитация загрузки данных
  useEffect(() => {
    const loadSampleData = async () => {
      setIsLoading(true);
      try {
        // В реальном приложении здесь будет вызов API
        // Моковые данные для демонстрации
        const mockData: Specimen[] = [
          {
            id: 1,
            inventoryNumber: 'DEN-2023-001',
            sectorType: SectorType.Dendrology,
            latitude: 55.45,
            longitude: 37.37,
            regionId: 1,
            regionName: 'Центральный регион',
            familyId: 1,
            familyName: 'Розоцветные',
            russianName: 'Яблоня домашняя',
            latinName: 'Malus domestica',
            genus: 'Malus',
            species: 'domestica',
            cultivar: 'Антоновка',
            form: '',
            synonyms: 'Malus pumila',
            determinedBy: 'Иванов И.И.',
            plantingYear: 2020,
            sampleOrigin: 'Районированный сорт',
            naturalRange: 'Европейская часть России',
            ecologyAndBiology: 'Листопадное дерево высотой до 10 м',
            economicUse: 'Плодовое растение',
            conservationStatus: '',
            expositionId: 3,
            expositionName: 'Дендрарий',
            hasHerbarium: true,
            duplicatesInfo: '',
            originalBreeder: 'Мичурин И.В.',
            originalYear: 1924,
            country: 'Россия',
            illustration: '',
            notes: 'Хорошо адаптирована к местным условиям',
            filledBy: 'Петров П.П.',
          },
          {
            id: 2,
            inventoryNumber: 'FLR-2023-105',
            sectorType: SectorType.Floriculture,
            latitude: 55.46,
            longitude: 37.38,
            regionId: 1,
            regionName: 'Центральный регион',
            familyId: 2,
            familyName: 'Астровые',
            russianName: 'Хризантема садовая',
            latinName: 'Chrysanthemum morifolium',
            genus: 'Chrysanthemum',
            species: 'morifolium',
            cultivar: 'Золотой шар',
            form: '',
            synonyms: 'Dendranthema grandiflora',
            determinedBy: 'Сидорова А.А.',
            plantingYear: 2022,
            sampleOrigin: 'Интродуцент',
            naturalRange: 'Восточная Азия',
            ecologyAndBiology: 'Многолетнее травянистое растение',
            economicUse: 'Декоративное растение',
            conservationStatus: '',
            expositionId: 2,
            expositionName: 'Экспозиция цветов',
            hasHerbarium: false,
            duplicatesInfo: '',
            originalBreeder: '',
            originalYear: 0,
            country: 'Япония',
            illustration: '',
            notes: 'Требует укрытия на зиму',
            filledBy: 'Козлова Е.В.',
          },
        ];

        setSpecimens(mockData);

        // Применяем начальный фильтр по сектору, если он указан
        applyFilters(mockData, currentFilters);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSampleData();
  }, []);

  // Функция для применения фильтров к списку образцов
  const applyFilters = (data: Specimen[], filters: SpecimenFilterParams) => {
    let result = [...data];

    // Фильтр по сектору
    if (filters.sectorType !== undefined) {
      result = result.filter(
        (specimen) => specimen.sectorType === filters.sectorType
      );
    }

    // Фильтр по семейству
    if (filters.familyId !== undefined) {
      result = result.filter(
        (specimen) => specimen.familyId === filters.familyId
      );
    }

    // Фильтр по поисковому полю
    if (filters.searchField && filters.searchValue) {
      const searchValue = filters.searchValue.toLowerCase();
      result = result.filter((specimen) => {
        const fieldValue = String(
          specimen[filters.searchField as keyof Specimen]
        ).toLowerCase();
        return fieldValue.includes(searchValue);
      });
    }

    setFilteredSpecimens(result);

    // Сбрасываем индекс текущего образца при изменении фильтров
    if (result.length > 0) {
      setCurrentIndex(0);
    }
  };

  // Обработчики навигации
  const handleNavigateFirst = () => {
    setCurrentIndex(0);
  };

  const handleNavigateLast = () => {
    setCurrentIndex(filteredSpecimens.length - 1);
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

  // Обработчики действий с образцами
  const handleViewSpecimen = (id: number) => {
    const index = filteredSpecimens.findIndex((specimen) => specimen.id === id);
    if (index !== -1) {
      setCurrentIndex(index);
      setShowCardModal(true);
    }
  };

  const handleAddNew = () => {
    setEditingSpecimen(undefined);

    // Если задан фильтр по сектору, устанавливаем его значение по умолчанию для нового образца
    if (currentFilters.sectorType !== undefined) {
      const defaultData: Partial<SpecimenFormData> = {
        sectorType: currentFilters.sectorType,
      };
      setEditingSpecimen(defaultData as unknown as Specimen);
    }

    setShowFormModal(true);
  };

  const handleEditSpecimen = (id: number) => {
    const specimen = filteredSpecimens.find((s) => s.id === id);
    if (specimen) {
      setEditingSpecimen(specimen);
      setShowFormModal(true);
    }
  };

  const handleSaveSpecimen = (data: SpecimenFormData) => {
    setIsLoading(true);

    // Имитация сохранения данных
    setTimeout(() => {
      if (data.id) {
        // Обновление существующего образца
        const updatedSpecimens = specimens.map((s) =>
          s.id === data.id ? ({ ...data, id: data.id } as Specimen) : s
        );
        setSpecimens(updatedSpecimens);
        applyFilters(updatedSpecimens, currentFilters);
      } else {
        // Добавление нового образца
        const newId = Math.max(...specimens.map((s) => s.id), 0) + 1;
        const newSpecimen: Specimen = { ...data, id: newId } as Specimen;
        const updatedSpecimens = [...specimens, newSpecimen];
        setSpecimens(updatedSpecimens);
        applyFilters(updatedSpecimens, currentFilters);
      }

      setShowFormModal(false);
      setEditingSpecimen(undefined);
      setIsLoading(false);
    }, 500);
  };

  const handleSearch = (filterParams: SpecimenFilterParams) => {
    setIsLoading(true);

    // Имитация поиска
    setTimeout(() => {
      // Сохраняем текущие фильтры
      const newFilters = { ...currentFilters, ...filterParams };
      setCurrentFilters(newFilters);

      // Применяем фильтры к данным
      applyFilters(specimens, newFilters);

      setIsLoading(false);
    }, 500);
  };

  // Обработчики дополнительных действий
  const handlePrintCurrent = () => {
    console.log('Печать карточки образца:', filteredSpecimens[currentIndex]);
    // Реализация печати
  };

  const handlePrintList = () => {
    console.log('Печать списка образцов');
    // Реализация печати списка
  };

  const handleExportToExcel = () => {
    console.log('Экспорт в Excel');
    // Реализация экспорта
  };

  const handleExportToPdf = () => {
    console.log('Экспорт в PDF');
    // Реализация экспорта
  };

  const handleViewPhenology = () => {
    console.log(
      'Переход к фенологии для образца:',
      filteredSpecimens[currentIndex].id
    );
    // Переход к фенологическим наблюдениям
  };

  const handleViewBiometry = () => {
    console.log(
      'Переход к биометрии для образца:',
      filteredSpecimens[currentIndex].id
    );
    // Переход к биометрии (только для цветоводства)
  };

  const handleViewReports = () => {
    console.log('Переход к форме запросов');
    // Переход к форме запросов
  };

  const handleExit = () => {
    // Выход из приложения или возврат к предыдущей странице
    navigate('/');
  };

  // Обработчик изменения табов
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Получение текущего образца
  const currentSpecimen = filteredSpecimens[currentIndex];

  // Генерируем название страницы на основе выбранного сектора
  const getSectionTitle = () => {
    if (currentFilters.sectorType !== undefined) {
      const sector = sectorOptions.find(
        (opt) => opt.id === currentFilters.sectorType
      );
      return sector ? `${sector.name}: Образцы растений` : 'Образцы растений';
    }
    return 'Образцы растений';
  };

  return (
    <Container
      maxWidth='xl'
      sx={{ mt: { xs: 2, sm: 4 }, mb: 4, px: { xs: 1, sm: 2, md: 3 } }}
    >
      <Typography
        variant='h4'
        gutterBottom
        sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}
      >
        {getSectionTitle()}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', overflowX: 'auto' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label='режимы работы с образцами'
          variant='scrollable'
          scrollButtons='auto'
        >
          <Tab label='Режим карточки' {...a11yProps(0)} />
          <Tab label='Режим списка' {...a11yProps(1)} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {/* Режим отображения и редактирования одного образца */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} order={{ xs: 2, md: 1 }}>
            {currentSpecimen ? (
              <SpecimenCard specimen={currentSpecimen} />
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant='h6'>
                  {isLoading ? 'Загрузка...' : 'Нет данных для отображения'}
                </Typography>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
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
              onViewBiometry={
                currentSpecimen?.sectorType === SectorType.Floriculture
                  ? handleViewBiometry
                  : undefined
              }
              onViewReports={handleViewReports}
              onExit={handleExit}
            />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Режим списка образцов */}
        <SpecimensList
          specimens={filteredSpecimens}
          onViewSpecimen={handleViewSpecimen}
          onEditSpecimen={handleEditSpecimen}
          onSearch={handleSearch}
          isLoading={isLoading}
          familyOptions={familyOptions}
          sectorOptions={sectorOptions}
        />
      </TabPanel>

      {/* Модальное окно просмотра карточки */}
      <Modal
        open={showCardModal}
        onClose={() => setShowCardModal(false)}
        aria-labelledby='modal-card-title'
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '90%', md: '80%' },
            maxWidth: 800,
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 24,
            p: { xs: 2, sm: 4 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 2,
              position: 'sticky',
              top: 0,
              bgcolor: 'background.paper',
              zIndex: 1,
              py: 1,
            }}
          >
            <Typography id='modal-card-title' variant='h6' component='h2'>
              Карточка образца
            </Typography>
            <IconButton onClick={() => setShowCardModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ overflow: 'auto', flex: 1 }}>
            {currentSpecimen && <SpecimenCard specimen={currentSpecimen} />}
          </Box>
        </Box>
      </Modal>

      {/* Модальное окно формы редактирования/создания */}
      <Modal
        open={showFormModal}
        onClose={() => setShowFormModal(false)}
        aria-labelledby='modal-form-title'
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '90%', md: '85%' },
            maxWidth: 1000,
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 24,
            p: { xs: 2, sm: 4 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 2,
              position: 'sticky',
              top: 0,
              bgcolor: 'background.paper',
              zIndex: 1,
              py: 1,
            }}
          >
            <Typography id='modal-form-title' variant='h6' component='h2'>
              {editingSpecimen?.id ? 'Редактирование образца' : 'Новый образец'}
            </Typography>
            <IconButton onClick={() => setShowFormModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ overflow: 'auto', flex: 1 }}>
            <SpecimenForm
              initialData={editingSpecimen}
              onSave={handleSaveSpecimen}
              onCancel={() => setShowFormModal(false)}
              isLoading={isLoading}
              familyOptions={familyOptions}
              expositionOptions={expositionOptions}
            />
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default SpecimensPage;
