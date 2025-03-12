import React from 'react';
import {
  containerClasses,
  layoutClasses,
  textClasses,
  cardClasses,
} from '../../../styles/global-styles';
import { MapProvider } from '../contexts';
import ControlPanel from './ControlPanel';
import MapActions from './MapActions';
import MapLegend from './MapLegend';
import { MapContainer } from './plant-map';

const MapPage: React.FC = () => {
  return (
    <div className={containerClasses.base}>
      <h1 className={textClasses.heading}>Карта ботанического сада</h1>
      <MapProvider>
        <div className={layoutClasses.flexCol}>
          <ControlPanel />
          <MapActions />
          <div className={cardClasses.base}>
            <div className={`${layoutClasses.flex} gap-6`}>
              <div className="flex-1">
                <MapContainer />
              </div>
              <div className="w-64">
                <MapLegend />
              </div>
            </div>
          </div>
        </div>
      </MapProvider>
    </div>
  );
};

export default MapPage;
