import React from 'react';
import { Polygon, Tooltip } from 'react-leaflet';
import { AreaType, MapArea } from '../types';

interface MapAreasProps {
  areas: MapArea[];
  onAreaClick?: (area: MapArea) => void;
}

// Компонент для отображения областей (секторов, экспозиций) на карте
export const MapAreas: React.FC<MapAreasProps> = ({ areas, onAreaClick }) => {
  // Получение стиля для области в зависимости от её типа
  const getAreaStyle = (
    areaType: AreaType,
    customColor?: string,
    customFillColor?: string
  ) => {
    const defaultStyle = {
      weight: 2,
      opacity: 0.8,
      color: '#3388ff',
      dashArray: '',
      fillOpacity: 0.3,
      fillColor: '#3388ff',
    };

    // Стили по типу области
    switch (areaType) {
      case AreaType.SECTOR:
        return {
          ...defaultStyle,
          color: customColor || '#2563EB', // blue-600
          fillColor: customFillColor || '#DBEAFE', // blue-100
          fillOpacity: 0.4,
        };
      case AreaType.EXPOSITION:
        return {
          ...defaultStyle,
          color: customColor || '#16A34A', // green-600
          fillColor: customFillColor || '#DCFCE7', // green-100
          fillOpacity: 0.5,
        };
      case AreaType.GREENHOUSE:
        return {
          ...defaultStyle,
          color: customColor || '#F59E0B', // amber-500
          fillColor: customFillColor || '#FEF3C7', // amber-100
          fillOpacity: 0.5,
        };
      case AreaType.RESTRICTED:
        return {
          ...defaultStyle,
          color: customColor || '#DC2626', // red-600
          fillColor: customFillColor || '#FEE2E2', // red-100
          fillOpacity: 0.4,
          dashArray: '5, 5',
        };
      default:
        return {
          ...defaultStyle,
          color: customColor || defaultStyle.color,
          fillColor: customFillColor || defaultStyle.fillColor,
        };
    }
  };

  return (
    <>
      {areas.map((area) => {
        const style = getAreaStyle(area.type, area.color, area.fillColor);

        return (
          <Polygon
            key={area.id}
            positions={area.coordinates}
            pathOptions={style}
            eventHandlers={{
              click: () => onAreaClick && onAreaClick(area),
            }}
          >
            <Tooltip sticky>
              <div>
                <strong>{area.name}</strong>
                {area.description && <p>{area.description}</p>}
              </div>
            </Tooltip>
          </Polygon>
        );
      })}
    </>
  );
};
