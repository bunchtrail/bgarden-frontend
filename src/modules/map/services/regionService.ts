// Сервис для работы с областями (регионами) на карте

import { Area } from '../contexts/MapContext';
import { RegionData } from '../types/mapTypes';

// Функция для получения всех областей (регионов) с сервера
export const getAllRegions = async (): Promise<RegionData[]> => {
  try {
    const response = await fetch('http://localhost:7254/api/Region', {
      method: 'GET',
      headers: {
        'accept': 'text/plain'
      }
    });

    if (!response.ok) {
      throw new Error(`Ошибка при получении областей: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка при получении областей:', error);
    throw error;
  }
};

// Функция для преобразования координат из строки в массив точек
const parsePolygonCoordinates = (coordsString: string): [number, number][] => {
  try {
    // Преобразуем строку в объект JavaScript
    const coordsArray = JSON.parse(coordsString);
    
    // Преобразуем координаты в формат [x, y]
    return coordsArray.map((coord: [number, number]) => [coord[0], coord[1]]);
  } catch (error) {
    console.error('Ошибка при разборе координат:', error);
    return [];
  }
};

// Функция для преобразования данных с сервера в формат Area
export const convertRegionsToAreas = (regions: RegionData[]): Area[] => {
  return regions.map(region => {
    // Парсим координаты из строки JSON
    const points = parsePolygonCoordinates(region.polygonCoordinates);
    
    return {
      id: `region-${region.id}`,
      name: region.name || 'Неизвестная область',
      points: points,
      description: region.description || '',
      fillColor: region.fillColor,
      strokeColor: region.strokeColor,
      fillOpacity: region.fillOpacity
    };
  });
};