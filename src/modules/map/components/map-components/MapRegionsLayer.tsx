import React from 'react';
import { Polygon, Tooltip } from 'react-leaflet';
import { RegionData } from '../../types/mapTypes';
import { useMap as useMapHook } from '../../hooks';
import { MAP_STYLES } from '../../styles';
import { COLORS, textClasses } from '@/styles/global-styles';
import { parseCoordinates, PolygonFactory } from '@/services/regions';

interface MapRegionsLayerProps {
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
  const { setSelectedAreaId, selectedAreaId } = useMapHook();

  const handleRegionClick = (regionId: string | number) => {
    const id = typeof regionId === 'number' ? `region-${regionId}` : regionId;
    setSelectedAreaId(id);
    if (onClick) onClick(typeof regionId === 'number' ? String(regionId) : regionId);
  };
  
  return (
    <>
      {regions.map((region) => {
        const coordinates = parseCoordinates(region.polygonCoordinates);
        if (coordinates.length < 3) return null; // Полигон должен иметь как минимум 3 точки
        
        const isSelected = highlightSelected && selectedAreaId === `region-${region.id}`;
        
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
            positions={coordinates}
            pathOptions={pathOptions}
            eventHandlers={eventHandlers}
          >
            {showTooltips && (
              <Tooltip sticky>
                <div className={MAP_STYLES.regionTooltip}>
                  <strong className={textClasses.subheading}>{region.name}</strong>
                  {region.description && <p className={textClasses.secondary}>{region.description}</p>}
                  <p className={`${textClasses.body} ${MAP_STYLES.regionInfo}`}>
                    Экземпляров: <span className={MAP_STYLES.regionCount} style={{color: COLORS.primary.main}}>{region.specimensCount}</span>
                  </p>
                </div>
              </Tooltip>
            )}
          </Polygon>
        );
      })}
    </>
  );
};

export default MapRegionsLayer; 