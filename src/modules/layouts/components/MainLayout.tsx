import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Navbar,
  NavbarHeightProvider,
  useNavbarHeightContext,
} from '../../navigation';
import { NotificationContainer } from '../../notifications';

interface MainLayoutProps {
  children?: ReactNode;
}

// Компонент, который использует контекст высоты навбара
const MainLayoutContent: React.FC<MainLayoutProps> = ({ children }) => {
  const { navbarRef } = useNavbarHeightContext();

  return (
    <div className="App flex flex-col min-h-screen">
      <Navbar navbarRef={navbarRef} />
      <NotificationContainer />
      <main className="flex-1 flex flex-col pt-navbar navbar-transition">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <NavbarHeightProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </NavbarHeightProvider>
  );
};

