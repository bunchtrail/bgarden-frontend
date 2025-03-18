import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../../navigation';
import { NotificationContainer } from '../../notifications';

interface MainLayoutProps {
  children?: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="App">
      <Navbar />
      <NotificationContainer />
      <main className="container mx-auto px-4 py-8">
        {children || <Outlet />}
      </main>
    </div>
  );
}; 