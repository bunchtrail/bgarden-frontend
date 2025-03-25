import React from 'react';
import { Polygon, Tooltip } from 'react-leaflet';
import { RegionData } from '@/modules/map/types/mapTypes';
import { PolygonFactory } from '@/services/regions/PolygonFactory';
import { parseCoordinates } from '@/services/regions/RegionUtils';
import { useMap } from '@/modules/map/hooks';
import regionBridge from '@/services/regions/RegionBridge';
import { MAP_STYLES } from '../../styles';
import { COLORS, textClasses } from '@/styles/global-styles';

export interface MapRegionsLayerProps {
  regions: RegionData[];
  highlightSelected?: boolean;
  showTooltips?: boolean;
  onClick?: (regionId: string) => void;
}

const MapRegionsLayer: React.FC<MapRegionsLayerProps> = ({
  regions,
  highlightSelected = true,
  showTooltips = true,
  onClick
}) => {
  const { setSelectedAreaId, selectedAreaId } = useMap();

  const handleRegionClick = (regionId: string | number) => {
    const id = typeof regionId === 'number' ? regionBridge.regionIdToAreaId(regionId) : regionId;
    setSelectedAreaId(id);
    if (onClick) onClick(typeof regionId === 'number' ? String(regionId) : regionId);
  };
  
  return (
    <>
      {regions.map((region) => {
        // Используем RegionBridge для преобразования RegionData в Area и получения points
        const area = regionBridge.toArea(region);
        if (area.points.length < 3) return null; // Полигон должен иметь как минимум 3 точки
        
        const isSelected = highlightSelected && selectedAreaId === area.id;
        
        // Используем унифицированную фабрику для создания стилей полигонов
        const pathOptions = PolygonFactory.createStyles({ 
          isSelected, 
          strokeColor: region.strokeColor,
          fillColor: region.fillColor,
          fillOpacity: region.fillOpacity
        });
        
        // Используем унифицированную фабрику для создания обработчиков событий
        const eventHandlers = PolygonFactory.createEventHandlers(
          { 
            isSelected, 
            onClick: handleRegionClick 
          }, 
          region
        );
        
        return (
          <Polygon
            key={`region-${region.id}`}
            positions={area.points}
            pathOptions={pathOptions}
            eventHandlers={eventHandlers}
          >
            {showTooltips && (
              <Tooltip direction="center" opacity={0.9} permanent={false}>
                <div className="font-medium text-sm">
                  {region.name || 'Unnamed Region'}
                </div>
                {region.description && (
                  <div className="text-xs mt-1 text-gray-600">
                    {region.description}
                  </div>
                )}
              </Tooltip>
            )}
          </Polygon>
        );
      })}
    </>
  );
};

export default MapRegionsLayer; 