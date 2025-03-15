import React from 'react';
import { RouteObject } from 'react-router-dom';

// Импорт маршрутов из отдельных модулей
import { authRoutes } from './authRoutes';
import { specimenRoutes } from './specimenRoutes';
import { mapRoutes } from './mapRoutes';
import { expositionRoutes } from './expositionRoutes';

// Импорт макета
import { MainLayout } from '../modules/layouts';

// Компоненты для общих страниц
import Home from '../pages/Home';
import { NotFound } from '../pages/NotFound';

// Определение основных маршрутов приложения
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <Home />,
        index: true,
      },
      // Вложение маршрутов из других модулей
      ...authRoutes,
      ...specimenRoutes,
      ...mapRoutes,
      ...expositionRoutes,
      // Маршрут для страницы 404
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]; 