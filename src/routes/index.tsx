import React from 'react';
import { RouteObject } from 'react-router-dom';
import { MainLayout } from '../modules/layouts';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import { authRoutes } from './authRoutes';
import { expositionRoutes } from './expositionRoutes';
import { mapRoutes } from './mapRoutes';
import { specimenRoutes } from './specimenRoutes';

// Основные маршруты
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      ...authRoutes,
      ...specimenRoutes,
      ...expositionRoutes,
      ...mapRoutes, // Убедились, что маршруты карты добавлены
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]; 