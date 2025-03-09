import React from 'react';
import { Navbar } from '../../modules/navigation';

interface HeaderProps {
  logoUrl?: string;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({
  logoUrl = '/images/logo.jpg',
  title = 'Ботанический сад',
}) => {
  return (
    <Navbar
      config={{
        items: [
          {
            id: 'home',
            label: 'Главная',
            path: '/',
            requiredAuth: false,
          },
          {
            id: 'specimens',
            label: 'Дендрология',
            path: '/specimens',
            requiredAuth: true,
            roles: ['Administrator', 'Employee'],
          },
          {
            id: 'expositions',
            label: 'Экспозиции',
            path: '/expositions',
            requiredAuth: true,
            roles: ['Administrator', 'Employee'],
          },
          {
            id: 'admin',
            label: 'Админ-панель',
            path: '/admin',
            requiredAuth: true,
            roles: ['Administrator'],
          },
          {
            id: 'profile',
            label: 'Профиль',
            path: '/profile',
            requiredAuth: true,
          },
        ],
        logo: {
          path: '/',
          title: title,
          imageSrc: logoUrl,
        },
      }}
    />
  );
};

export default Header;
