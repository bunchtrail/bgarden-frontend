import React from 'react';
import { Polygon, Tooltip } from 'react-leaflet';
import { RegionData } from '../../types/mapTypes';
import { parseCoordinates } from '../../services/regionService';
import { useMap as useMapHook } from '../../hooks';
import { MAP_STYLES } from '../../styles';
import { COLORS, textClasses } from '../../../../styles/global-styles';

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
    setSelectedAreaId(`region-${regionId}`);
    if (onClick) onClick(String(regionId));
  };
  
  return (
    <>
      {regions.map((region) => {
        const coordinates = parseCoordinates(region.polygonCoordinates);
        if (coordinates.length < 3) return null; // Полигон должен иметь как минимум 3 точки
        
        const isSelected = highlightSelected && selectedAreaId === `region-${region.id}`;
        
        return (
          <Polygon
            key={`region-${region.id}`}
            positions={coordinates}
            pathOptions={{
              fillColor: isSelected ? COLORS.primary.main : (region.fillColor || COLORS.text.secondary),
              color: isSelected ? COLORS.primary.dark : (region.strokeColor || COLORS.text.primary),
              fillOpacity: isSelected ? 0.4 : (region.fillOpacity || 0.3),
              weight: isSelected ? 3 : 2,
              opacity: 0.8
            }}
            eventHandlers={{
              click: () => handleRegionClick(region.id),
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                  fillOpacity: 0.5,
                  weight: isSelected ? 3 : 2.5,
                });
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle({
                  fillOpacity: isSelected ? 0.4 : (region.fillOpacity || 0.3),
                  weight: isSelected ? 3 : 2,
                });
              }
            }}
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