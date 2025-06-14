import React from 'react';
import { pageClasses } from '../styles/global-styles';

export const NotFound: React.FC = () => (
  <div className={`${pageClasses.base} ${pageClasses.centerContent}`}>
    <div className={pageClasses.container}>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600">404</h1>
        <p className="text-xl mt-2">Страница не найдена</p>
      </div>
    </div>
  </div>
);
