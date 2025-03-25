import { useState, useEffect } from 'react';
import { RegionData } from '@/services/regions/types';
import { SpecimenFormData } from '@/modules/specimens/types';
import L from 'leaflet';
import { isPointInPolygon, parseCoordinates, pointToObject } from '@/services/regions';

interface ExtendedSpecimenFormData extends SpecimenFormData {
  locationDescription?: string;
}

export function useRegionMarkerLogic(
  formData: ExtendedSpecimenFormData, 
  regions: RegionData[], 
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
) {
  const [selectedRegionIds, setSelectedRegionIds] = useState<string[]>([]);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  
  // Инициализация маркера из координат formData
  useEffect(() => {
    if (formData.latitude && formData.longitude) {
      const lat = parseFloat(formData.latitude.toString());
      const lng = parseFloat(formData.longitude.toString());
      if (!isNaN(lat) && !isNaN(lng)) {
        setMarkerPosition([lat, lng]);
      }
    }
  }, [formData.latitude, formData.longitude]);

  // Обновление выбранных регионов при изменении regionId
  useEffect(() => {
    if (formData.regionId && formData.regionId !== null) {
      setSelectedRegionIds([formData.regionId.toString()]);
    } else {
      setSelectedRegionIds([]);
    }
  }, [formData.regionId]);

  // Обработчик клика по региону
  const handleRegionClick = (regionId: string) => {
    const numericId = parseInt(regionId.replace('region-', ''), 10);
    if (!isNaN(numericId)) {
      // Создаем объект, имитирующий изменение в select
      const mockEvent = {
        target: {
          name: 'regionId',
          value: numericId.toString()
        }
      };
      
      // Приводим к нужному типу
      onChange(mockEvent as unknown as React.ChangeEvent<HTMLSelectElement>);
      
      // Находим центр выбранного региона для установки маркера, если координаты еще не заданы
      const selectedRegion = regions.find(region => region.id.toString() === numericId.toString());
      if (selectedRegion && (!formData.latitude || !formData.longitude)) {
        // Преобразуем числовые координаты в строковые для handleCoordinatesChange
        const lat = Number(selectedRegion.latitude);
        const lng = Number(selectedRegion.longitude);
        handleCoordinatesChange(lat, lng);
      }
    }
  };

  // Обработчик изменения координат
  const handleCoordinatesChange = (lat: number, lng: number) => {
    // Обновляем положение маркера
    setMarkerPosition([lat, lng]);
    
    // Обновляем поля широты и долготы
    onChange({
      target: { name: 'latitude', value: lat.toString() }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
    
    onChange({
      target: { name: 'longitude', value: lng.toString() }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
    
    // Если точка находится внутри какого-то региона, выбираем этот регион
    const containingRegion = findRegionContainingPoint(regions, lat, lng);
    
    if (containingRegion && containingRegion.id.toString() !== formData.regionId?.toString()) {
      onChange({
        target: { name: 'regionId', value: containingRegion.id.toString() }
      } as unknown as React.ChangeEvent<HTMLSelectElement>);
    }
  };
  
  // Функция для определения региона, в котором находится точка
  const findRegionContainingPoint = (regions: RegionData[], lat: number, lng: number): RegionData | undefined => {
    // Сначала проверяем через polygonCoordinates
    for (const region of regions) {
      if (region.polygonCoordinates) {
        try {
          // Используем унифицированную функцию parseCoordinates
          const coordinates = parseCoordinates(region.polygonCoordinates);
          
          if (coordinates.length > 0) {
            // Используем унифицированную функцию isPointInPolygon
            if (isPointInPolygon([lat, lng], coordinates)) {
              return region;
            }
          }
        } catch (error) {
          console.error('Ошибка при парсинге координат полигона:', error);
        }
      }
      
      // Простая проверка по радиусу, если нет полигона
      if (region.radius) {
        const distance = L.latLng(lat, lng).distanceTo(L.latLng(Number(region.latitude), Number(region.longitude)));
        if (distance <= region.radius) {
          return region;
        }
      }
    }
    
    return undefined;
  };

  // Получение строкового представления regionId
  const getRegionIdString = (id: number | null | undefined): string => {
    if (id === null || id === undefined) return '';
    return id.toString();
  };

  return {
    selectedRegionIds,
    markerPosition,
    handleRegionClick,
    handleCoordinatesChange,
    getRegionIdString
  };
} 