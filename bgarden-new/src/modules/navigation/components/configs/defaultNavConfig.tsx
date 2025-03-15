import { UserRole } from '../../../../modules/auth/types';
import { NavConfig } from '../../types';

export const defaultNavConfig: NavConfig = {
  logo: {
    title: 'Ботанический сад',
    path: '/',
    imageSrc: '/logo192.png',
  },
  items: [
    {
      id: 'home',
      label: 'Главная',
      path: '/',
      requireAuth: false,
      order: 0,
    },
    {
      id: 'catalog',
      label: 'Каталог растений',
      path: '/specimens',
      requireAuth: false,
      order: 1,
    },
    {
      id: 'map',
      label: 'Карта сада',
      path: '/map',
      requireAuth: false,
      order: 2,
    },
    {
      id: 'expositions',
      label: 'Экспозиции',
      path: '/expositions',
      requireAuth: false,
      order: 3,
    },
    {
      id: 'profile',
      label: 'Профиль',
      path: '/profile',
      requireAuth: true,
      order: 4,
    },
  ],
};
