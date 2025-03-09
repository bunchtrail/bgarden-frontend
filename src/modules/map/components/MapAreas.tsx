import React, { useEffect, useState } from 'react';
import { GeoJSON, Tooltip } from 'react-leaflet';
import { AreaType, MapArea } from '../types';

// Интерфейс для пропсов компонента
interface MapAreasProps {
  areas: MapArea[];
  visibleTypes?: AreaType[];
  onClick?: (area: MapArea) => void;
}

// Стандартные цвета для различных типов областей
const defaultColors = {
  [AreaType.SECTOR]: {
    color: '#3b82f6', // text-blue-500
    fillColor: '#dbeafe', // bg-blue-100
  },
  [AreaType.EXPOSITION]: {
    color: '#10b981', // text-emerald-500
    fillColor: '#d1fae5', // bg-emerald-100
  },
  [AreaType.GREENHOUSE]: {
    color: '#f59e0b', // text-amber-500
    fillColor: '#fef3c7', // bg-amber-100
  },
  [AreaType.RESTRICTED]: {
    color: '#ef4444', // text-red-500
    fillColor: '#fee2e2', // bg-red-100
  },
};

// Компонент для отображения областей на карте
export const MapAreas: React.FC<MapAreasProps> = ({
  areas,
  visibleTypes,
  onClick,
}) => {
  // Состояние для хранения GeoJSON данных
  const [geoJsonData, setGeoJsonData] = useState<any[]>([]);

  // Подготовка GeoJSON данных
  useEffect(() => {
    if (!areas || areas.length === 0) {
      setGeoJsonData([]);
      return;
    }

    // Фильтрация областей по видимым типам
    const filteredAreas = visibleTypes
      ? areas.filter((area) => visibleTypes.includes(area.type))
      : areas;

    // Преобразование данных для использования в GeoJSON компоненте
    const geoJsonFeatures = filteredAreas
      .map((area) => {
        let coordinates;

        // Преобразование координат из строки или объекта
        if (typeof area.coordinates === 'string') {
          try {
            coordinates = JSON.parse(area.coordinates);
          } catch (error) {
            console.error(
              `Ошибка парсинга координат для области ${area.id}:`,
              error
            );
            return null;
          }
        } else {
          coordinates = area.coordinates;
        }

        // Если координаты недоступны или некорректны
        if (!coordinates) {
          return null;
        }

        // Определение цветов области
        const areaColors = defaultColors[area.type] || {
          color: '#6b7280', // text-gray-500
          fillColor: '#f3f4f6', // bg-gray-100
        };

        return {
          type: 'Feature',
          id: area.id,
          properties: {
            id: area.id,
            name: area.name,
            description: area.description,
            type: area.type,
            color: area.color || areaColors.color,
            fillColor: area.fillColor || areaColors.fillColor,
          },
          geometry: coordinates.type
            ? coordinates
            : {
                type: 'Polygon',
                coordinates: coordinates,
              },
        };
      })
      .filter(Boolean);

    setGeoJsonData(geoJsonFeatures);
  }, [areas, visibleTypes]);

  // Стиль для GeoJSON областей
  const areaStyle = (feature: any) => {
    return {
      weight: 2,
      opacity: 1,
      color: feature.properties.color,
      fillColor: feature.properties.fillColor,
      fillOpacity: 0.4,
    };
  };

  // Обработчик клика по области
  const handleClick = (event: any) => {
    if (onClick) {
      const { id, name, description, type } =
        event.sourceTarget.feature.properties;
      const area = areas.find((a) => a.id === id) || {
        id,
        name,
        description,
        type,
        coordinates: event.sourceTarget.feature.geometry,
      };
      onClick(area);
    }
  };

  if (!geoJsonData.length) {
    return null;
  }

  return (
    <>
      {geoJsonData.map((geoJson) => (
        <GeoJSON
          key={`area-${geoJson.id}`}
          data={geoJson}
          style={areaStyle}
          eventHandlers={{ click: handleClick }}
        >
          <Tooltip
            direction='center'
            className='bg-white shadow-md rounded px-2 py-1 text-sm'
          >
            <div>
              <h3 className='font-medium text-green-800'>
                {geoJson.properties.name}
              </h3>
              {geoJson.properties.description && (
                <p className='text-gray-600 text-xs mt-1'>
                  {geoJson.properties.description}
                </p>
              )}
            </div>
          </Tooltip>
        </GeoJSON>
      ))}
    </>
  );
};
