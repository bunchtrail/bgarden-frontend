import React from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../modules/auth/components/ProtectedRoute';
import { FullscreenLayout } from '../modules/layouts';
import { MapPage } from '../modules/map';
import { PositionedControlPanel } from '../modules/map/components/control-panel';

export const mapRoutes: RouteObject[] = [
  {
    path: 'map',
    element: (
      <ProtectedRoute>
        <FullscreenLayout>
          <MapPage
            showControls={true}
            extraControls={
              <PositionedControlPanel pageType="map" panelId="main-map-panel" />
            }
          />
        </FullscreenLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: 'map/sector/:id',
    element: (
      <ProtectedRoute>
        <FullscreenLayout>
          <MapPage
            showControls={true}
            extraControls={
              <PositionedControlPanel
                pageType="sector"
                panelId="sector-map-panel"
              />
            }
          />
        </FullscreenLayout>
      </ProtectedRoute>
    ),
  },
];
