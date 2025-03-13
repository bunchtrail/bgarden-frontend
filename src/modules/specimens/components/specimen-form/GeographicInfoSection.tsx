import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { headingClasses } from '../styles';
import { NoteIcon } from '../icons';
import { GeographicInfoSectionProps, MapPlant } from './types';
import {
  SimpleMap,
  RegionInfo,
  CoordinatesSection,
  OriginSection,
  AdditionalFields,
  PlantsToggle,
  mapPlantToPlantMarker,
  ensureRegionSelected,
  debugLog,
  ENABLE_EXTRA_DOM_SYNC,
  SelectedArea,
  PlantMarker
} from './geographic';

// Константа для управления оптимизациями рендеринга
const PREVENT_REDUNDANT_RENDERS = true;

export const GeographicInfoSection: React.FC<GeographicInfoSectionProps> = React.memo(({
  formData,
  errors,
  touchedFields,
  formSubmitted,
  markFieldAsTouched,
  validateField,
  regionOptions,
  handleChange,
  handleSelectChange,
  handleNumberChange,
  mapImageUrl,
  onPositionSelected,
  mapAreas = [],
  mapPlants = [],
  onAreaSelected,
}) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showOtherPlants, setShowOtherPlants] = useState(false);
  const [selectedArea, setSelectedArea] = useState<SelectedArea | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [manualPositionSet, setManualPositionSet] = useState(false);
  
  // Refs для хранения состояний без вызова перерендера
  const realPositionRef = useRef<[number, number] | null>(null);
  const positionUpdateLockRef = useRef<boolean>(false);
  const lastSelectedAreaRef = useRef<SelectedArea | null>(null);
  const formDataRef = useRef(formData);
  const renderCountRef = useRef(0);
  
  // Обновляем ref для текущих данных формы
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);
  
  // Счетчик рендеров для отладки
  useEffect(() => {
    renderCountRef.current += 1;
    debugLog(`GeographicInfoSection рендер #${renderCountRef.current}`);
  });

  // Мемоизируем обработчики для стабильности ссылок
  const handleFieldTouch = useCallback((fieldName: string) => {
    markFieldAsTouched(fieldName);
  }, [markFieldAsTouched]);

  const handleFieldValidation = useCallback((fieldName: string, value: any) => {
    validateField(fieldName, value);
  }, [validateField]);

  // Мемоизируем список растений
  const allPlants: PlantMarker[] = useMemo(() => {
    return mapPlants.map(mapPlantToPlantMarker);
  }, [mapPlants]);

  // Объединяем все растения - но используем мемоизацию
  const combinedPlants = useMemo(() => [...allPlants], [allPlants]);

  // Оптимизируем для предотвращения частых обновлений при одинаковых координатах
  const handlePositionSelectedStable = useCallback(
    (lat: number, lng: number) => {
      // Используем ref для сравнения с текущими данными
      const currentFormData = formDataRef.current;
      
      // Если координаты не изменились, игнорируем
      if (
        currentFormData.latitude === lat &&
        currentFormData.longitude === lng
      ) {
        return;
      }
      
      // Проверяем наличие обработчика перед вызовом
      if (onPositionSelected) {
        onPositionSelected(lat, lng);
      }
    },
    [onPositionSelected]
  );

  // Оптимизируем обработчик выбора области
  const handleAreaSelectedStable = useCallback(
    (areaId: string, regionId: number) => {
      // Используем ref для сравнения с текущими данными
      const currentFormData = formDataRef.current;
      
      // Если регион не изменился, игнорируем
      if (currentFormData.regionId === regionId) {
        return;
      }
      
      // Проверяем наличие обработчика перед вызовом
      if (onAreaSelected) {
        onAreaSelected(areaId, regionId);
      }
    },
    [onAreaSelected]
  );

  // Инициализация selectedArea на основе regionId в formData - используем более эффективный подход
  useEffect(() => {
    if (formData.regionId && (!selectedArea || selectedArea.regionId !== formData.regionId)) {
      // Находим соответствующий регион в опциях
      const currentRegion = regionOptions.find(
        region => Number(region.id) === Number(formData.regionId)
      );
      
      if (currentRegion) {
        // Находим соответствующую область на карте
        const matchingArea = mapAreas.find(
          area => area.id === `region-${currentRegion.id}`
        );
        
        if (matchingArea) {
          // Устанавливаем выбранную область, но только если она отличается
          const newArea = {
            id: matchingArea.id,
            name: currentRegion.name,
            description: matchingArea.description,
            regionId: currentRegion.id
          };
          
          // Проверяем, отличается ли новая область от текущей
          if (!selectedArea || selectedArea.regionId !== newArea.regionId) {
            setSelectedArea(newArea);
          }
        }
      }
    }
  }, [formData.regionId, regionOptions, mapAreas, selectedArea]);

  // Сохраняем ручные координаты в ref для последующего использования
  useEffect(() => {
    if (manualPositionSet && selectedPosition) {
      realPositionRef.current = selectedPosition;
    }
  }, [selectedPosition, manualPositionSet]);

  // Дебаунсированная версия обработчика выбора позиции
  const handlePositionSelect = useCallback(
    (position: [number, number]) => {
      // Если система в процессе обновления позиции, блокируем обработку
      if (positionUpdateLockRef.current) {
        return;
      }

      // Блокируем другие обновления позиции
      positionUpdateLockRef.current = true;
      
      try {
        // Округляем координаты для стабильности
        const roundedLat = parseFloat(position[0].toFixed(6));
        const roundedLng = parseFloat(position[1].toFixed(6));
        const roundedPosition: [number, number] = [roundedLat, roundedLng];
        
        // Сравниваем с текущей позицией, чтобы избежать ненужных обновлений
        if (
          !selectedPosition || 
          selectedPosition[0] !== roundedLat || 
          selectedPosition[1] !== roundedLng
        ) {
          // Сохраняем "реальные" координаты в ref
          realPositionRef.current = roundedPosition;
          
          // Устанавливаем точные координаты в state
          setSelectedPosition(roundedPosition);
          
          // Отмечаем, что позиция была установлена вручную
          if (!manualPositionSet) {
            setManualPositionSet(true);
          }
          
          // Используем оптимизированный обработчик для уведомления родителя
          handlePositionSelectedStable(roundedLat, roundedLng);
        }
      } finally {
        // Снимаем блокировку с более короткой задержкой
        setTimeout(() => {
          positionUpdateLockRef.current = false;
        }, 150); // Уменьшаем задержку для более отзывчивого интерфейса
      }
    },
    [selectedPosition, manualPositionSet, handlePositionSelectedStable]
  );

  // Мемоизированный обработчик выбора области
  const handleAreaSelect = useCallback((area: SelectedArea | null) => {
    // Если блокировка активна, не обрабатываем
    if (positionUpdateLockRef.current) {
      return;
    }
    
    // Устанавливаем блокировку
    positionUpdateLockRef.current = true;
    
    try {
      // Если area равно null, просто игнорируем
      if (area === null) {
        return;
      }
      
      // Проверяем, изменилась ли область
      if (selectedArea && selectedArea.id === area.id) {
        // Если область та же, не делаем ничего
        return;
      }

      // Обновляем состояние выбранной области
      setSelectedArea(area);
      
      if (area && area.regionId) {
        // Проверяем, есть ли соответствующий регион в опциях
        const selectedRegion = regionOptions.find(
          region => Number(region.id) === Number(area.regionId)
        );
        
        if (selectedRegion) {
          // Уведомляем о выборе области
          handleAreaSelectedStable(String(area.id), Number(area.regionId));

          // Обновляем SelectField с помощью синтетического события
          const syntheticEvent = {
            target: {
              name: 'regionId',
              value: Number(selectedRegion.id),
              type: 'number'
            }
          } as unknown as React.ChangeEvent<HTMLSelectElement>;
          
          // Вызываем обработчик изменения select
          handleSelectChange(syntheticEvent);
          
          // Обновляем regionName в форме
          const regionNameEvent = {
            target: {
              name: 'regionName',
              value: selectedRegion.name
            }
          } as React.ChangeEvent<HTMLInputElement>;
          
          handleChange(regionNameEvent);
        } else {
          // Если регион с таким ID не найден, используем данные области
          handleAreaSelectedStable(String(area.id), Number(area.regionId));

          // Обновляем SelectField с помощью синтетического события
          const syntheticEvent = {
            target: {
              name: 'regionId',
              value: Number(area.regionId),
              type: 'number'
            }
          } as unknown as React.ChangeEvent<HTMLSelectElement>;
          
          // Вызываем обработчик изменения select
          handleSelectChange(syntheticEvent);
          
          // Обновляем regionName в форме используя имя области
          const regionNameEvent = {
            target: {
              name: 'regionName',
              value: area.name || `Регион ${area.regionId}`
            }
          } as React.ChangeEvent<HTMLInputElement>;
          
          handleChange(regionNameEvent);
        }
        
        // Отмечаем поле как затронутое
        handleFieldTouch('regionId');
        handleFieldValidation('regionId', area.regionId);
      }
    } finally {
      // Снимаем блокировку с более короткой задержкой
      setTimeout(() => {
        positionUpdateLockRef.current = false;
      }, 100);
    }
  }, [
    selectedArea,
    regionOptions,
    handleSelectChange,
    handleChange,
    handleFieldTouch,
    handleFieldValidation,
    handleAreaSelectedStable
  ]);

  // Мемоизируем переключатель для дополнительных полей
  const toggleAdvancedOptions = useCallback(() => {
    setShowAdvancedOptions(prev => !prev);
  }, []);

  // Мемоизируем отдельные секции компонента для предотвращения перерендера
  const memoizedRegionInfo = useMemo(() => (
    <RegionInfo selectedArea={selectedArea} />
  ), [selectedArea]);

  const memoizedCoordinatesSection = useMemo(() => (
    <CoordinatesSection
      formData={formData}
      errors={errors}
      touchedFields={touchedFields}
      formSubmitted={formSubmitted}
      markFieldAsTouched={markFieldAsTouched}
      handleNumberChange={handleNumberChange}
    />
  ), [formData.latitude, formData.longitude, errors.latitude, errors.longitude, 
      touchedFields.latitude, touchedFields.longitude, formSubmitted, 
      markFieldAsTouched, handleNumberChange]);

  const memoizedOriginSection = useMemo(() => (
    <OriginSection
      formData={formData}
      errors={errors}
      touchedFields={touchedFields}
      formSubmitted={formSubmitted}
      markFieldAsTouched={markFieldAsTouched}
      handleChange={handleChange}
      handleSelectChange={handleSelectChange}
      regionOptions={regionOptions}
    />
  ), [
    formData.regionId, 
    formData.regionName,
    errors.regionId, 
    errors.regionName,
    touchedFields.regionId, 
    touchedFields.regionName,
    formSubmitted, 
    markFieldAsTouched, 
    handleChange, 
    handleSelectChange, 
    regionOptions
  ]);

  const memoizedAdditionalFields = useMemo(() => (
    <AdditionalFields
      showAdvancedOptions={showAdvancedOptions}
      formData={formData}
      errors={errors}
      touchedFields={touchedFields}
      formSubmitted={formSubmitted}
      markFieldAsTouched={markFieldAsTouched}
      handleChange={handleChange}
      toggleAdvancedOptions={toggleAdvancedOptions}
    />
  ), [
    showAdvancedOptions, 
    formData,
    errors,
    touchedFields,
    formSubmitted, 
    markFieldAsTouched, 
    handleChange, 
    toggleAdvancedOptions
  ]);

  // Мемоизируем карту для предотвращения ее перерендера при изменениях, не связанных с ней
  const memoizedMap = useMemo(() => (
    <SimpleMap
      imageUrl={mapImageUrl || null}
      readOnly={false}
      onPositionSelect={handlePositionSelect}
      onAreaSelect={handleAreaSelect}
      plants={combinedPlants}
      areas={mapAreas}
      showOtherPlants={showOtherPlants}
      currentPlantId="current"
      onManualPositionSet={() => setManualPositionSet(true)}
    />
  ), [mapImageUrl, handlePositionSelect, handleAreaSelect, combinedPlants, 
      mapAreas, showOtherPlants]);

  return (
    <div className='mb-8 bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md'>
      <h3 className={`${headingClasses.heading} flex items-center text-xl mb-6 pb-3 border-b border-gray-200`}>
        <div className="p-2 rounded-lg bg-green-50 mr-3">
          <NoteIcon className='w-6 h-6 text-green-600' />
        </div>
        <span className="text-gray-800 font-semibold">Географическая информация</span>
      </h3>

      <div className='space-y-5'>
        <div className='bg-gradient-to-r from-green-50 to-green-50/50 p-4 rounded-lg border border-green-100 mb-4 backdrop-blur-sm'>
          <div className='flex items-center text-green-800 text-sm mb-2'>
            <span className='flex items-center justify-center w-6 h-6 rounded-full bg-green-100 mr-3'>ⓘ</span>
            <span className="font-medium">Информация о происхождении и географическом положении образца</span>
          </div>
        </div>
        
        {/* Переключатель для отображения других растений */}
        <PlantsToggle 
          showOtherPlants={showOtherPlants} 
          setShowOtherPlants={setShowOtherPlants} 
        />

        {/* Компонент карты - в карточке */}
        <div className='p-4 bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:border-green-200 focus-within:border-green-300 focus-within:ring-1 focus-within:ring-green-200'>
          <h4 className='font-medium text-gray-700 mb-3 flex items-center'>
            <span className="mr-2">📍</span>
            Расположение на карте
          </h4>
          <div className='h-96 border rounded-xl overflow-hidden shadow-inner bg-gray-50'>
            {memoizedMap}
          </div>
        </div>

        {/* Используем мемоизированные секции */}
        {memoizedRegionInfo}
        {memoizedCoordinatesSection}
        {memoizedOriginSection}
        {memoizedAdditionalFields}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Функция проверки, нужно ли перерендеривать компонент
  if (!PREVENT_REDUNDANT_RENDERS) return false; // Всегда перерендеривать если оптимизация отключена
  
  // Проверяем только те поля, которые важны для отображения
  return (
    prevProps.formData.latitude === nextProps.formData.latitude &&
    prevProps.formData.longitude === nextProps.formData.longitude &&
    prevProps.formData.regionId === nextProps.formData.regionId &&
    prevProps.formData.regionName === nextProps.formData.regionName &&
    prevProps.mapImageUrl === nextProps.mapImageUrl &&
    (prevProps.mapAreas || []).length === (nextProps.mapAreas || []).length &&
    (prevProps.mapPlants || []).length === (nextProps.mapPlants || []).length &&
    JSON.stringify(prevProps.errors) === JSON.stringify(nextProps.errors) &&
    JSON.stringify(prevProps.touchedFields) === JSON.stringify(nextProps.touchedFields) &&
    prevProps.formSubmitted === nextProps.formSubmitted
  );
});
