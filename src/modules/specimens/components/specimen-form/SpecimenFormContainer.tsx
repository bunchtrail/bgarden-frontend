import React, { useEffect, useState } from 'react';
import {
  getActiveMap,
  getMapImageUrl,
  MapData,
} from '../../../../modules/map/services/mapService';
import { getAllSpecimens, convertSpecimensToPlants } from '../../../../modules/map/services/plantService';
import { getAllRegions, convertRegionsToAreas } from '../../../../modules/map/services/regionService';
import { Specimen, SpecimenFormData } from '../../types';
import { MessagePanel, MessageType } from '../ErrorPanel';
import { CancelIcon, SaveIcon } from '../icons';
import {
  actionsContainerClasses,
  animationClasses,
  containerClasses,
  formClasses,
  headingClasses,
} from '../styles';
import { AdditionalInfoSection } from './AdditionalInfoSection';
import { BasicInfoSection } from './BasicInfoSection';
import { ExpositionInfoSection } from './ExpositionInfoSection';
import { GeographicInfoSection } from './GeographicInfoSection';
import { FormTabs } from './Tabs';
import { SpecimenFormTab } from './types';
import { MapArea, MapPlant } from './types';
import { DraftSaveNotification } from '../../../../components/ui/DraftSaveNotification';

interface SpecimenFormContainerProps {
  initialData?: Specimen;
  onSave: (data: SpecimenFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  familyOptions?: { id: number; name: string }[];
  expositionOptions?: { id: number; name: string }[];
  regionOptions?: { id: number; name: string }[];
}

export const SpecimenFormContainer: React.FC<SpecimenFormContainerProps> = ({
  initialData,
  onSave,
  onCancel,
  isLoading = false,
  familyOptions = [],
  expositionOptions = [],
  regionOptions = [],
}) => {
  const emptyFormData: SpecimenFormData = {
    inventoryNumber: '',
    sectorType: 0,
    latitude: 0,
    longitude: 0,
    regionId: 1,
    regionName: '',
    familyId: 1,
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
    expositionId: 1,
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

  // Проверка, есть ли начальные данные, иначе используем пустую форму
  const [formData, setFormData] = useState<SpecimenFormData>(
    initialData || emptyFormData
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<SpecimenFormTab>(
    SpecimenFormTab.MainInfo
  );
  const [isEditMode, setIsEditMode] = useState(!!initialData?.id);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [formMessage, setFormMessage] = useState<{
    type: MessageType;
    text: string;
  } | null>(null);

  // Состояние для отображения расширенных полей
  const [showExtendedFields, setShowExtendedFields] = useState(false);

  // Состояние для хранения данных карты
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [mapImageUrl, setMapImageUrl] = useState<string | null>(null);
  
  // Добавляем состояния для растений и областей
  const [mapPlants, setMapPlants] = useState<MapPlant[]>([]);
  const [mapAreas, setMapAreas] = useState<MapArea[]>([]);
  
  // Состояния для отслеживания загрузки данных карты
  const [loadingMapData, setLoadingMapData] = useState<boolean>(false);
  const [loadingPlants, setLoadingPlants] = useState<boolean>(false);
  const [loadingAreas, setLoadingAreas] = useState<boolean>(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsEditMode(!!initialData.id);
    } else {
      setFormData(emptyFormData);
      setIsEditMode(false);
    }
  }, [initialData]);

  // Загрузка данных карты, растений и областей при монтировании компонента
  useEffect(() => {
    const fetchMapData = async () => {
      setLoadingMapData(true);
      try {
        const maps = await getActiveMap();
        if (maps && maps.length > 0) {
          setMapData(maps[0]);
          const imageUrl = getMapImageUrl(maps[0]);
          if (imageUrl) {
            setMapImageUrl(imageUrl);
          } else {
            // Используем статичное изображение, если URL не получен
            console.log('URL изображения карты не получен, используем резервное изображение');
            setMapImageUrl('/images/maps/garden-map.jpg');
          }
        } else {
          // Если карты не найдены, используем статичное изображение
          console.log('Карты не найдены, используем резервное изображение');
          setMapImageUrl('/images/maps/garden-map.jpg');
        }
      } catch (error) {
        console.error('Ошибка при загрузке карты:', error);
        // Используем запасной вариант, если не удалось загрузить карту
        console.log('Ошибка при загрузке карты, используем резервное изображение');
        setMapImageUrl('/images/maps/garden-map.jpg');
      } finally {
        setLoadingMapData(false);
      }
    };

    const fetchPlantsData = async () => {
      setLoadingPlants(true);
      try {
        const specimensData = await getAllSpecimens();
        const plantsData = convertSpecimensToPlants(specimensData);
        
        // Преобразуем в формат MapPlant
        const mapPlantsData: MapPlant[] = plantsData.map(plant => ({
          id: plant.id,
          name: plant.name,
          position: plant.position,
          description: plant.description
        }));
        
        setMapPlants(mapPlantsData);
      } catch (error) {
        console.error('Ошибка при загрузке растений:', error);
        // Создаем несколько тестовых растений в случае ошибки загрузки
        setMapPlants([
          {
            id: 'test-plant-1',
            name: 'Тестовое растение 1',
            position: [200, 200],
            description: 'Пример растения для тестирования'
          },
          {
            id: 'test-plant-2',
            name: 'Тестовое растение 2',
            position: [300, 300],
            description: 'Еще один пример растения'
          }
        ]);
      } finally {
        setLoadingPlants(false);
      }
    };

    const fetchAreasData = async () => {
      setLoadingAreas(true);
      try {
        const regionsData = await getAllRegions();
        const areasData = convertRegionsToAreas(regionsData);
        
        // Преобразуем в формат MapArea и проверяем корректность данных
        const mapAreasData: MapArea[] = areasData.map(area => {
          // Проверяем и исправляем координаты для предотвращения ошибок отображения
          const validPoints = validateAreaPoints(area.points);
          return {
            id: area.id,
            name: area.name,
            points: validPoints,
            description: area.description,
            strokeColor: area.strokeColor || '#FF5733',
            fillColor: area.fillColor || '#FFD700',
            fillOpacity: area.fillOpacity || 0.3
          };
        });
        
        setMapAreas(mapAreasData);
      } catch (error) {
        console.error('Ошибка при загрузке областей:', error);
        // Создаем тестовую область в случае ошибки загрузки
        setMapAreas([
          {
            id: 'test-area-1',
            name: 'Тестовая область',
            points: [
              [100, 100],
              [100, 300],
              [300, 300],
              [300, 100]
            ],
            description: 'Тестовая область для демонстрации',
            strokeColor: '#FF5733',
            fillColor: '#FFD700',
            fillOpacity: 0.3
          }
        ]);
      } finally {
        setLoadingAreas(false);
      }
    };

    // Функция для проверки и коррекции формата координат области
    const validateAreaPoints = (points: any[]): [number, number][] => {
      // Если points не массив или пустой массив, возвращаем координаты по умолчанию
      if (!Array.isArray(points) || points.length === 0) {
        return [[100, 100], [100, 300], [300, 300], [300, 100]];
      }

      // Проверяем каждую точку и корректируем при необходимости
      return points.map(point => {
        // Проверяем, что point это массив с двумя числовыми координатами
        if (Array.isArray(point) && point.length === 2 && 
            typeof point[0] === 'number' && typeof point[1] === 'number') {
          return [point[0], point[1]];
        } else if (typeof point === 'object' && point !== null && 
                  'lat' in point && 'lng' in point &&
                  typeof point.lat === 'number' && typeof point.lng === 'number') {
          // Если точка в формате {lat: number, lng: number}
          return [point.lat, point.lng];
        } else {
          // В случае некорректных данных используем значения по умолчанию
          console.warn('Некорректный формат координат точки:', point);
          return [0, 0];
        }
      });
    };

    // Загружаем все данные
    fetchMapData();
    fetchPlantsData();
    fetchAreasData();
  }, []);

  const markFieldAsTouched = (name: string) => {
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };
    markFieldAsTouched(name);

    // Сбрасываем ошибку для этого поля при изменении
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setFormData(updatedData);

    // Валидация на лету
    validateField(name, value);

    // Автоматически сохраняем черновик при изменении
    const draftTimer = setTimeout(() => {
      localStorage.setItem('specimenFormDraft', JSON.stringify(updatedData));
      setIsDraftSaved(true);
      setTimeout(() => {
        setIsDraftSaved(false);
      }, 2000);
    }, 1000);

    return () => clearTimeout(draftTimer);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log('handleSelectChange called with:', { name, value, type: typeof value });
    
    let updatedData = { ...formData };
    markFieldAsTouched(name);

    // Обработка связанных полей при выборе из списка
    if (name === 'familyId') {
      const selectedFamily = familyOptions.find((f) => f.id === Number(value));
      console.log('Found family:', selectedFamily);
      updatedData = {
        ...updatedData,
        [name]: Number(value),
        familyName: selectedFamily ? selectedFamily.name : '',
      };
    } else if (name === 'expositionId') {
      const selectedExposition = expositionOptions.find(
        (e) => e.id === Number(value)
      );
      console.log('Found exposition:', selectedExposition);
      updatedData = {
        ...updatedData,
        [name]: Number(value),
        expositionName: selectedExposition ? selectedExposition.name : '',
      };
    } else if (name === 'regionId') {
      // Преобразуем value в число, если оно было передано как строка
      const numericValue = typeof value === 'string' ? Number(value) : value;
      
      const selectedRegion = regionOptions.find((r) => Number(r.id) === numericValue);
      console.log('Found region:', selectedRegion);
      
      // Добавляем проверку, чтобы убедиться, что регион найден
      if (!selectedRegion) {
        console.warn(`Регион с ID ${numericValue} не найден. Доступные регионы:`, regionOptions.map(r => `${r.id}: ${r.name}`));
      }
      
      updatedData = {
        ...updatedData,
        [name]: numericValue,
        regionName: selectedRegion ? selectedRegion.name : `Регион ${numericValue}`,
      };
      
      console.log('Updated formData with regionId:', updatedData.regionId, 'type:', typeof updatedData.regionId);
      
      // Добавляем event для форсированного обновления селекта, если необходимо
      setTimeout(() => {
        // Находим элемент select для regionId
        const regionSelect = document.getElementById('regionId') as HTMLSelectElement;
        if (regionSelect && regionSelect.value !== String(numericValue)) {
          console.log('Обнаружено несоответствие значения select. Устанавливаем корректное значение:', numericValue);
          regionSelect.value = String(numericValue);
        }
      }, 0);
    } else {
      updatedData = {
        ...updatedData,
        [name]: Number(value),
      };
    }

    console.log('Updating form data:', updatedData);

    // Очищаем ошибки для данного поля
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setFormData(updatedData);
    validateField(name, value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
    markFieldAsTouched(name);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : Number(value);
    setFormData((prev) => ({ ...prev, [name]: numValue }));
    markFieldAsTouched(name);

    // Валидация на лету
    if (formSubmitted) {
      validateField(name, numValue);
    }
  };

  // Обработчик выбора позиции на карте
  const handlePositionSelected = (latitude: number, longitude: number) => {
    // Всегда округляем значения до 6 знаков после запятой для единообразия
    const roundedLatitude = parseFloat(latitude.toFixed(6));
    const roundedLongitude = parseFloat(longitude.toFixed(6));
    
    console.log(`handlePositionSelected: позиция выбрана: [${roundedLatitude}, ${roundedLongitude}]`);
    
    // Используем функциональное обновление для избежания race conditions
    setFormData(prevData => {
      // Проверяем, действительно ли координаты изменились, чтобы избежать лишних рендеров
      if (prevData.latitude === roundedLatitude && prevData.longitude === roundedLongitude) {
        console.log('Координаты не изменились, пропускаем обновление');
        return prevData;
      }
      
      console.log(`Обновляем координаты в форме: [${roundedLatitude}, ${roundedLongitude}]`);
      
      // Возвращаем обновленное состояние
      return { 
        ...prevData, 
        latitude: roundedLatitude, 
        longitude: roundedLongitude 
      };
    });
    
    // Очищаем ошибки для этих полей, если они были
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      if (newErrors.latitude) delete newErrors.latitude;
      if (newErrors.longitude) delete newErrors.longitude;
      return newErrors;
    });
    
    // Отмечаем поля как затронутые
    markFieldAsTouched('latitude');
    markFieldAsTouched('longitude');
    
    // Валидируем значения
    validateField('latitude', roundedLatitude);
    validateField('longitude', roundedLongitude);
  };

  // Добавляем обработчик выбора области (региона) на карте
  const handleAreaSelected = (selectedArea: any) => {
    console.log('handleAreaSelected called with:', selectedArea);
    
    // Проверяем, что получены правильные данные
    if (!selectedArea) {
      console.log('Нет данных о выбранной области, пропускаем обновление');
      return;
    }
    
    // Нормализуем regionId, убедившись, что это число
    let regionId: number | undefined; // Добавляем явный тип
    
    // Проверяем, является ли selectedArea строкой (id области)
    if (typeof selectedArea === 'string') {
      // Проверяем, если это строка вида 'region-X'
      if (selectedArea.startsWith('region-')) {
        const idMatch = selectedArea.match(/region-(\d+)/);
        if (idMatch && idMatch[1]) {
          const parsedId = Number(idMatch[1]);
          if (!isNaN(parsedId)) {
            regionId = parsedId;
          }
        }
      } else {
        // Пробуем преобразовать строку напрямую в число
        const parsedId = Number(selectedArea);
        if (!isNaN(parsedId)) {
          regionId = parsedId;
        }
      }
    } else if (typeof selectedArea === 'object' && selectedArea !== null) {
      // Обрабатываем случай, когда selectedArea - объект
      if (selectedArea.regionId !== undefined && selectedArea.regionId !== null) {
        const parsedId = Number(selectedArea.regionId);
        if (!isNaN(parsedId)) {
          regionId = parsedId;
        }
      } else if (typeof selectedArea.id === 'string' && selectedArea.id.startsWith('region-')) {
        // Попытка извлечь regionId из id области
        const idMatch = selectedArea.id.match(/region-(\d+)/);
        if (idMatch && idMatch[1]) {
          const parsedId = Number(idMatch[1]);
          if (!isNaN(parsedId)) {
            regionId = parsedId;
          }
          console.log(`Извлечен ID региона из ${selectedArea.id}: ${regionId}`);
        }
      }
    }
    
    // Проверяем, что regionId определен
    if (regionId === undefined) {
      console.error('Невозможно определить ID региона из выбранной области:', selectedArea);
      return;
    }
    
    // Теперь regionId гарантированно имеет тип number
    const validRegionId: number = regionId;
    
    // Находим объект региона по ID
    const selectedRegion = regionOptions.find(r => Number(r.id) === validRegionId);
    console.log('Found region:', selectedRegion);
    
    if (selectedRegion) {
      // Используем функциональное обновление для избежания race conditions
      setFormData(prevData => {
        // Проверяем, действительно ли изменился регион
        if (prevData.regionId === validRegionId) {
          console.log(`Регион не изменился (${validRegionId}), пропускаем обновление`);
          return prevData;
        }
        
        console.log(`Обновляем regionId в форме на ${validRegionId} (${selectedRegion.name})`);
        
        // Возвращаем обновленное состояние с проверкой на undefined
        const updatedData = { 
          ...prevData, 
          regionId: validRegionId, // Теперь используем переменную с явным типом number
          regionName: selectedRegion.name || prevData.regionName
        };
        
        // Добавляем логирование состояния формы
        console.log('🌍 Состояние формы места происхождения');
        console.log('Действие: Выбор области на карте');
        console.log('Текущие данные формы:', {
          regionId: updatedData.regionId,
          regionName: updatedData.regionName,
          country: updatedData.country
        });
        console.log('Ошибки:', {
          regionId: errors.regionId,
          country: errors.country
        });
        console.log('Затронутые поля:', {
          regionId: touchedFields.regionId,
          country: touchedFields.country
        });
        
        return updatedData;
      });
      
      // Очищаем ошибки для regionId, если они были
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        if (newErrors.regionId) {
          console.log('Очищаем ошибку для regionId');
          delete newErrors.regionId;
        }
        return newErrors;
      });
      
      // Отмечаем поле как затронутое
      markFieldAsTouched('regionId');
      
      // Валидируем значение
      validateField('regionId', validRegionId);
    } else {
      console.error(`Регион с ID ${validRegionId} не найден в списке доступных регионов:`, regionOptions);
      
      // Выводим доступные регионы для диагностики
      console.log('Доступные регионы:', regionOptions.map(r => `${r.id}: ${r.name}`));
    }
  };

  const validateField = (name: string, value: any): boolean => {
    let isValid = true;
    let errorMessage = '';

    switch (name) {
      case 'inventoryNumber':
        if (!value) {
          isValid = false;
          errorMessage = 'Инвентарный номер обязателен';
        }
        break;
      case 'russianName':
      case 'latinName':
        // Если проверяем русское название и латинское пустое
        if (name === 'russianName' && !value && !formData.latinName) {
          isValid = false;
          errorMessage = 'Должно быть указано хотя бы одно название';
        }
        // Если проверяем латинское название и русское пустое
        else if (name === 'latinName' && !value && !formData.russianName) {
          isValid = false;
          errorMessage = 'Должно быть указано хотя бы одно название';
        }
        break;
      case 'familyId':
        if (!value || value <= 0) {
          isValid = false;
          errorMessage = 'Необходимо выбрать семейство';
        }
        break;
      case 'expositionId':
        if (!value || value <= 0) {
          isValid = false;
          errorMessage = 'Необходимо выбрать местоположение';
        }
        break;
      case 'regionId':
        if (!value || value <= 0) {
          isValid = false;
          errorMessage = 'Необходимо выбрать регион';
        }
        break;
      case 'latitude':
        // Проверка диапазона удалена
        break;
      case 'longitude':
        // Проверка диапазона удалена
        break;
      case 'plantingYear':
        const currentYear = new Date().getFullYear();
        if (value > currentYear) {
          isValid = false;
          errorMessage = `Год посадки не может быть больше ${currentYear}`;
        } else if (value < 1700) {
          isValid = false;
          errorMessage = 'Год посадки не может быть меньше 1700';
        }
        break;
    }

    if (!isValid) {
      setErrors((prev) => ({ ...prev, [name]: errorMessage }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    return isValid;
  };

  const validate = (): boolean => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    // Пройдемся по всем полям формы и вызовем validateField
    // Инвентарный номер (обязательное поле)
    if (!validateField('inventoryNumber', formData.inventoryNumber)) {
      isValid = false;
      newErrors.inventoryNumber = 'Инвентарный номер обязателен';
    }

    // Названия (одно из двух должно быть заполнено)
    if (!formData.russianName && !formData.latinName) {
      isValid = false;
      newErrors.russianName = 'Должно быть указано хотя бы одно название';
      newErrors.latinName = 'Должно быть указано хотя бы одно название';
    }

    // Связанные сущности
    if (!formData.familyId || formData.familyId <= 0) {
      isValid = false;
      newErrors.familyId = 'Необходимо выбрать семейство';
    }

    if (!formData.expositionId || formData.expositionId <= 0) {
      isValid = false;
      newErrors.expositionId = 'Необходимо выбрать местоположение';
    }

    if (!formData.regionId || formData.regionId <= 0) {
      isValid = false;
      newErrors.regionId = 'Необходимо выбрать регион';
    }

    // Координаты
    // Проверки диапазона для широты и долготы удалены

    // Год посадки
    const currentYear = new Date().getFullYear();
    if (formData.plantingYear > currentYear) {
      isValid = false;
      newErrors.plantingYear = `Год посадки не может быть больше ${currentYear}`;
    } else if (formData.plantingYear < 1700) {
      isValid = false;
      newErrors.plantingYear = 'Год посадки не может быть меньше 1700';
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    const isValid = validate();
    if (isValid) {
      try {
        onSave(formData);
        // Показываем сообщение об успешном сохранении
        setFormMessage({
          type: MessageType.SUCCESS,
          text: 'Данные успешно сохранены',
        });
        // Очищаем форму если это не режим редактирования
        if (!isEditMode) {
          setFormData(emptyFormData);
          setTouchedFields({});
        }
        // Удаляем черновик после успешного сохранения
        localStorage.removeItem('specimenFormDraft');
      } catch (error) {
        setFormMessage({
          type: MessageType.ERROR,
          text: 'Ошибка при сохранении данных',
        });
      }
    } else {
      setFormMessage({
        type: MessageType.ERROR,
        text: 'Форма содержит ошибки. Проверьте заполнение полей.',
      });
      // Автоматически переходим к вкладке с ошибками
      if (
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
        ].some((field) => !!errors[field])
      ) {
        setActiveTab(SpecimenFormTab.MainInfo);
      } else {
        setActiveTab(SpecimenFormTab.AdditionalInfo);
      }
    }
  };

  // Обновлённый рендер контента вкладок с объединением разделов
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case SpecimenFormTab.MainInfo:
        return (
          <div className='space-y-6'>
            {/* Основная информация */}
            <div
              className={`${containerClasses.card} ${animationClasses.smoothTransition} ${animationClasses.elevate}`}
            >
              <h3 className={`${headingClasses.modern} mb-4`}>
                Основная информация
              </h3>
              <BasicInfoSection
                formData={formData}
                errors={errors}
                touchedFields={touchedFields}
                formSubmitted={formSubmitted}
                markFieldAsTouched={markFieldAsTouched}
                validateField={validateField}
                familyOptions={familyOptions}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
              />
            </div>

            {/* Географическая информация */}
            <div
              className={`${containerClasses.card} ${animationClasses.smoothTransition} ${animationClasses.elevate}`}
            >
              <h3 className={`${headingClasses.modern} mb-4`}>
                Географическая информация
              </h3>
              <GeographicInfoSection
                formData={formData}
                errors={errors}
                touchedFields={touchedFields}
                formSubmitted={formSubmitted}
                markFieldAsTouched={markFieldAsTouched}
                validateField={validateField}
                regionOptions={regionOptions}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
                handleNumberChange={handleNumberChange}
                mapImageUrl={mapImageUrl}
                onPositionSelected={handlePositionSelected}
                mapAreas={mapAreas}
                mapPlants={mapPlants}
                onAreaSelected={handleAreaSelected}
              />
            </div>
          </div>
        );

      case SpecimenFormTab.AdditionalInfo:
        return (
          <div className='space-y-6'>
            {/* Экспозиционная информация */}
            <div
              className={`${containerClasses.card} ${animationClasses.smoothTransition} ${animationClasses.elevate}`}
            >
              <h3 className={`${headingClasses.modern} mb-4`}>
                Экспозиционная информация
              </h3>
              <ExpositionInfoSection
                formData={formData}
                errors={errors}
                touchedFields={touchedFields}
                formSubmitted={formSubmitted}
                markFieldAsTouched={markFieldAsTouched}
                validateField={validateField}
                expositionOptions={expositionOptions}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
                handleNumberChange={handleNumberChange}
                handleCheckboxChange={handleCheckboxChange}
              />
            </div>

            {/* Дополнительная информация */}
            <div
              className={`${containerClasses.card} ${animationClasses.smoothTransition} ${animationClasses.elevate}`}
            >
              <div className='flex justify-between items-center mb-4'>
                <h3 className={`${headingClasses.modern}`}>
                  Дополнительная информация
                </h3>
                <button
                  type='button'
                  onClick={() => setShowExtendedFields(!showExtendedFields)}
                  className='text-sm text-blue-600 hover:text-blue-800 focus:outline-none transition-colors flex items-center gap-1'
                >
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      showExtendedFields ? 'rotate-180' : ''
                    }`}
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {showExtendedFields
                    ? 'Скрыть дополнительные поля'
                    : 'Показать дополнительные поля'}
                </button>
              </div>
              {showExtendedFields ? (
                <div className={`${animationClasses.fadeIn}`}>
                  <AdditionalInfoSection
                    formData={formData}
                    errors={errors}
                    touchedFields={touchedFields}
                    formSubmitted={formSubmitted}
                    markFieldAsTouched={markFieldAsTouched}
                    validateField={validateField}
                    handleChange={handleChange}
                    handleNumberChange={handleNumberChange}
                  />
                </div>
              ) : (
                <p className='text-sm text-gray-500 italic bg-gray-50 p-4 rounded-lg'>
                  Нажмите "Показать дополнительные поля" для заполнения
                  необязательных данных, таких как синонимы, информация о
                  происхождении и экономическом использовании.
                </p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Обработчики для переключателя режимов
  const handleAddNewMode = () => {
    if (isLoading) return;

    // Убираем диалог подтверждения и сразу переключаемся в режим добавления
    setFormData(emptyFormData);
    setErrors({});
    setTouchedFields({});
    setFormSubmitted(false);
    setIsEditMode(false);
    setActiveTab(SpecimenFormTab.MainInfo);

    // Не вызываем onCancel(), чтобы не перенаправлять на страницу списка образцов
  };

  // Обработчик для переключения в режим редактирования
  const handleEditMode = () => {
    if (isLoading || !initialData?.id) return;

    // Если есть данные для редактирования, восстанавливаем их
    if (initialData) {
      setFormData(initialData);
      setErrors({});
      setTouchedFields({});
      setFormSubmitted(false);
      setIsEditMode(true);
      setActiveTab(SpecimenFormTab.MainInfo);
    }
  };

  // Проверка, есть ли сохраненный черновик
  useEffect(() => {
    const savedDraft = localStorage.getItem('specimenFormDraft');
    if (savedDraft && !initialData) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        if (
          window.confirm(
            'Найден несохраненный черновик формы. Хотите восстановить данные?'
          )
        ) {
          setFormData(parsedDraft);
          setFormMessage({
            type: MessageType.INFO,
            text: 'Черновик восстановлен. Вы можете продолжить редактирование.',
          });
        } else {
          localStorage.removeItem('specimenFormDraft');
        }
      } catch (e) {
        localStorage.removeItem('specimenFormDraft');
      }
    }
  }, [initialData]);

  return (
    <div className={`${containerClasses.glassCard} p-6 max-w-5xl mx-auto`}>
      {formMessage && (
        <div className='mb-4'>
          <MessagePanel
            message={formMessage.text}
            type={formMessage.type}
            onClose={() => setFormMessage(null)}
          />
        </div>
      )}

      <h2 className={`${headingClasses.modern} mb-6 text-center`}>
        {isEditMode ? 'Редактирование образца' : 'Добавление нового образца'}
      </h2>

      <p className='text-gray-600 mb-6 text-center max-w-2xl mx-auto'>
        Заполните необходимую информацию об образце. Поля, отмеченные{' '}
        <span className='text-red-500 font-bold'>*</span>, обязательны для
        заполнения.
      </p>

      <form onSubmit={handleSubmit} className={formClasses.form}>
        <FormTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          errors={errors}
        />

        <div className={`py-6 ${animationClasses.fadeIn}`}>
          {renderActiveTabContent()}
        </div>

        <div className={actionsContainerClasses.container}>
          <button
            type='button'
            className={actionsContainerClasses.secondaryButton}
            onClick={onCancel}
            disabled={isLoading}
          >
            <CancelIcon className='w-5 h-5 mr-2' />
            Отмена
          </button>
          <button
            type='submit'
            className={actionsContainerClasses.primaryButton}
            disabled={isLoading}
          >
            <SaveIcon className='w-5 h-5 mr-2' />
            {isLoading ? (
              <span className='flex items-center'>
                <svg
                  className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Сохранение...
              </span>
            ) : (
              'Сохранить'
            )}
          </button>
        </div>

        <div className='text-center text-gray-500 text-xs mt-8'>
          Внесённые изменения автоматически сохраняются как черновик в локальном
          хранилище браузера
        </div>
      </form>

      <DraftSaveNotification isVisible={isDraftSaved} />
    </div>
  );
};
