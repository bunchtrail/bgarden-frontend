import { UserRole } from '../../../../modules/auth/types';
import { NavConfig } from '../../types';

export const defaultNavConfig: NavConfig = {
  items: [
    {
      id: 'home',
      label: 'Главная',
      path: '/',
      requiredAuth: false,
    },
    {
      id: 'specimens',
      label: 'Каталог растений',
      path: '/specimens',
      requiredAuth: false,
    },
    {
      id: 'expositions',
      label: 'Экспозиции',
      path: '#',
      requiredAuth: false,
      dropdownItems: [
        {
          id: 'expositions-list',
          label: 'Список экспозиций',
          path: '/expositions',
          requiredAuth: false,
        },
        {
          id: 'map',
          label: 'Карта сада',
          path: '/map',
          requiredAuth: false,
        },
      ],
    },
    {
      id: 'admin',
      label: 'Управление',
      path: '#',
      requiredAuth: true,
      roles: [UserRole.Administrator.toString(), UserRole.Employee.toString()],
      dropdownItems: [
        {
          id: 'users',
          label: 'Пользователи',
          path: '/admin/users',
          requiredAuth: true,
          roles: [UserRole.Administrator.toString()],
        },
        {
          id: 'settings',
          label: 'Настройки',
          path: '/admin/settings',
          requiredAuth: true,
          roles: [
            UserRole.Administrator.toString(),
            UserRole.Employee.toString(),
          ],
        },
      ],
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
    title: 'Ботанический сад',
    imageSrc: '/logo192.png',
  },
};
