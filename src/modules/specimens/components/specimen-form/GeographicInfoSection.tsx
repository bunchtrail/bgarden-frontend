import React, { useCallback, useState, useMemo, useEffect, ChangeEvent } from 'react';
import { headingClasses } from '../styles';
import { NoteIcon } from '../icons';
import { GeographicInfoSectionProps } from './types';
import {
  SimpleMap,
  RegionInfo,
  CoordinatesSection,
  OriginSection,
  AdditionalFields,
  PlantsToggle,
  mapPlantToPlantMarker,
  SelectedArea,
} from './geographic';

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
  
  // Мемоизированное преобразование растений
  const plantsMarkers = useMemo(() => mapPlants.map(mapPlantToPlantMarker), [mapPlants]);
  
  // Обработчик выбора позиции с округлением координат
  const handlePositionSelect = useCallback((position: [number, number]) => {
    const [lat, lng] = position.map(coord => parseFloat(coord.toFixed(6)));
    if (formData.latitude === lat && formData.longitude === lng) return;
    setSelectedPosition([lat, lng]);
    onPositionSelected?.(lat, lng);
  }, [formData.latitude, formData.longitude, onPositionSelected]);
  
  // Обработчик выбора области
  const handleAreaSelect = useCallback((area: SelectedArea | null) => {
    if (!area || (selectedArea && selectedArea.id === area.id)) return;
    
    setSelectedArea(area);
    
    if (area.regionId) {
      // Находим соответствующий регион в списке доступных регионов
      const selectedRegion = regionOptions.find(
        region => Number(region.id) === Number(area.regionId)
      );
      
      // Логируем для диагностики
      console.log(`Выбрана область с regionId=${area.regionId}, найден регион:`, selectedRegion);
      
      // Передаем информацию родительскому компоненту через callback
      onAreaSelected?.(area);
      
      // Вначале отмечаем поле как затронутое и валидируем
      markFieldAsTouched('regionId');
      validateField('regionId', area.regionId);
      
      // Создаем искусственное событие select для изменения значения regionId через React
      const selectEvent = {
        target: { 
          name: 'regionId', 
          value: Number(area.regionId), 
          type: 'number' 
        }
      } as unknown as ChangeEvent<HTMLSelectElement>;
      
      const inputEvent = {
        target: { 
          name: 'regionName', 
          value: selectedRegion?.name || area.name || `Регион ${area.regionId}` 
        }
      } as unknown as ChangeEvent<HTMLInputElement>;
      
      // Добавляем дополнительное логирование события
      console.log('Создано событие выбора региона в селекте:', {
        name: 'regionId', 
        value: Number(area.regionId),
        regionName: selectedRegion?.name
      });
      
      // Вызываем обработчики для обновления состояния через React
      handleSelectChange(selectEvent);
      handleChange(inputEvent);
    } else {
      console.log('В выбранной области отсутствует regionId:', area);
    }
  }, [
    selectedArea,
    regionOptions,
    onAreaSelected,
    handleSelectChange,
    handleChange,
    markFieldAsTouched,
    validateField
  ]);
  
  // Автоматическое обновление выбранной области при изменении formData.regionId
  useEffect(() => {
    if (formData.regionId && (!selectedArea || selectedArea.regionId !== formData.regionId)) {
      const currentRegion = regionOptions.find(
        region => Number(region.id) === Number(formData.regionId)
      );
      
      if (currentRegion) {
        const matchingArea = mapAreas.find(
          area => area.id === `region-${currentRegion.id}`
        );
        
        if (matchingArea) {
          setSelectedArea({
            id: matchingArea.id,
            name: currentRegion.name,
            description: matchingArea.description,
            regionId: currentRegion.id
          });
        }
      }
    }
  }, [formData.regionId, regionOptions, mapAreas, selectedArea]);
  
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
        
        <PlantsToggle 
          showOtherPlants={showOtherPlants} 
          setShowOtherPlants={setShowOtherPlants} 
        />
        
        <div className='p-4 bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:border-green-200 focus-within:border-green-300 focus-within:ring-1 focus-within:ring-green-200'>
          <h4 className='font-medium text-gray-700 mb-3 flex items-center'>
            <span className="mr-2">📍</span>
            Расположение на карте
          </h4>
          <div className='h-96 border rounded-xl overflow-hidden shadow-inner bg-gray-50'>
            <SimpleMap
              imageUrl={mapImageUrl || null}
              readOnly={false}
              onPositionSelect={handlePositionSelect}
              onAreaSelect={handleAreaSelect}
              plants={plantsMarkers}
              areas={mapAreas}
              showOtherPlants={showOtherPlants}
              currentPlantId="current"
            />
          </div>
        </div>
        
        <RegionInfo selectedArea={selectedArea} />
        <CoordinatesSection
          formData={formData}
          errors={errors}
          touchedFields={touchedFields}
          formSubmitted={formSubmitted}
          markFieldAsTouched={markFieldAsTouched}
          handleNumberChange={handleNumberChange}
        />
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
        <AdditionalFields
          showAdvancedOptions={showAdvancedOptions}
          formData={formData}
          errors={errors}
          touchedFields={touchedFields}
          formSubmitted={formSubmitted}
          markFieldAsTouched={markFieldAsTouched}
          handleChange={handleChange}
          toggleAdvancedOptions={() => setShowAdvancedOptions(prev => !prev)}
        />
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Проверяем только те поля, которые важны для отображения
  const isFormDataEqual = 
    prevProps.formData.latitude === nextProps.formData.latitude &&
    prevProps.formData.longitude === nextProps.formData.longitude &&
    prevProps.formData.regionId === nextProps.formData.regionId &&
    prevProps.formData.regionName === nextProps.formData.regionName;
    
  const isMapDataEqual = 
    prevProps.mapImageUrl === nextProps.mapImageUrl &&
    (prevProps.mapAreas?.length || 0) === (nextProps.mapAreas?.length || 0) &&
    (prevProps.mapPlants?.length || 0) === (nextProps.mapPlants?.length || 0);
    
  const isFormStateEqual = 
    prevProps.formSubmitted === nextProps.formSubmitted;
    
  // Используем поверхностное сравнение для errors и touchedFields
  const areErrorsEqual = Object.keys(prevProps.errors).length === Object.keys(nextProps.errors).length &&
    Object.keys(prevProps.errors).every(key => prevProps.errors[key] === nextProps.errors[key]);
    
  const areTouchedFieldsEqual = Object.keys(prevProps.touchedFields).length === Object.keys(nextProps.touchedFields).length &&
    Object.keys(prevProps.touchedFields).every(key => prevProps.touchedFields[key] === nextProps.touchedFields[key]);
  
  return isFormDataEqual && isMapDataEqual && isFormStateEqual && areErrorsEqual && areTouchedFieldsEqual;
});
