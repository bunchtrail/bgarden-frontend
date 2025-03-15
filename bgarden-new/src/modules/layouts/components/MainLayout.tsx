import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../../navigation';
import { NotificationContainer } from '../../notifications';

export const MainLayout: React.FC = () => {
  return (
    <div className="App">
      <Navbar />
      <NotificationContainer />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}; 