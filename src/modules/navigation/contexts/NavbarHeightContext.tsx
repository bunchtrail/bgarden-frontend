import React, { createContext, useContext, ReactNode } from 'react';
import { useNavbarHeight } from '../hooks';

interface NavbarHeightContextValue {
  navbarHeight: number;
  navbarRef: React.RefObject<HTMLElement | null>;
}

const NavbarHeightContext = createContext<NavbarHeightContextValue | undefined>(
  undefined
);

interface NavbarHeightProviderProps {
  children: ReactNode;
}

export const NavbarHeightProvider: React.FC<NavbarHeightProviderProps> = ({
  children,
}) => {
  const { navbarRef, navbarHeight } = useNavbarHeight();

  // Устанавливаем CSS-переменную для глобального использования
  React.useEffect(() => {
    document.documentElement.style.setProperty(
      '--navbar-height',
      `${navbarHeight}px`
    );
  }, [navbarHeight]);

  return (
    <NavbarHeightContext.Provider value={{ navbarHeight, navbarRef }}>
      {children}
    </NavbarHeightContext.Provider>
  );
};

export const useNavbarHeightContext = () => {
  const context = useContext(NavbarHeightContext);
  if (context === undefined) {
    throw new Error(
      'useNavbarHeightContext must be used within a NavbarHeightProvider'
    );
  }
  return context;
};
