import React from 'react';
import { RouteObject } from 'react-router-dom';
import { RouteParamsValidator } from '../modules/ui/components';
import { FullscreenLayout } from '../modules/layouts';
import { MapPage } from '../modules/map';
import {
  PositionedControlPanel,
  UNIFIED_PANEL_PRESETS,
} from '../modules/map/components/control-panel';

export const mapRoutes: RouteObject[] = [
  {
    path: 'map',
    element: (
      <FullscreenLayout>
        <MapPage
          showControls={true}
          extraControls={
            <PositionedControlPanel
              config={UNIFIED_PANEL_PRESETS.map}
              panelId="main-map-panel"
            />
          }
        />
      </FullscreenLayout>
    ),
  },
  {
    path: 'map/sector/:id',
    element: (
      <RouteParamsValidator paramName="id" validation="numeric">
        <FullscreenLayout>
          <MapPage
            showControls={true}
            extraControls={
              <PositionedControlPanel
                config={UNIFIED_PANEL_PRESETS.sector}
                panelId="sector-map-panel"
              />
            }
          />
        </FullscreenLayout>
      </RouteParamsValidator>
    ),
  },
];
