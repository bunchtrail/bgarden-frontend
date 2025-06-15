import React, { ReactNode } from 'react';
import {
  Navbar,
  NavbarHeightProvider,
  useNavbarHeightContext,
} from '../../navigation';
import { NotificationContainer } from '../../notifications';

interface FullscreenLayoutProps {
  children?: ReactNode;
}

// Компонент, который использует контекст высоты навбара для полноэкранного режима
const FullscreenLayoutContent: React.FC<FullscreenLayoutProps> = ({
  children,
}) => {
  const { navbarRef } = useNavbarHeightContext();

  return (
    <div className="App flex flex-col h-screen overflow-hidden">
      <Navbar navbarRef={navbarRef} />
      <NotificationContainer />
      <main className="flex-1 flex flex-col navbar-transition overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export const FullscreenLayout: React.FC<FullscreenLayoutProps> = ({
  children,
}) => {
  return (
    <NavbarHeightProvider>
      <FullscreenLayoutContent>{children}</FullscreenLayoutContent>
    </NavbarHeightProvider>
  );
};
