import React from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../modules/auth/components/ProtectedRoute';
import { FullscreenLayout } from '../modules/layouts';
import { MapPage, UnifiedControlPanel } from '../modules/map';

export const mapRoutes: RouteObject[] = [
  {
    path: 'map',
    element: (
      <ProtectedRoute>
        <FullscreenLayout>
          <MapPage
            showControls={true}
            extraControls={<UnifiedControlPanel pageType="map" />}
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
            extraControls={<UnifiedControlPanel pageType="sector" />}
          />
        </FullscreenLayout>
      </ProtectedRoute>
    ),
  },
];
