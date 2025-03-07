import { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../auth';
import { NavItem } from '../types';

export const useNavigation = (items: NavItem[]) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    logout(true);
    closeMenu();
  }, [logout, closeMenu]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Если требуется авторизация, но пользователь не авторизован
      if (item.requiredAuth && !user) return false;
      
      // Если есть ограничение по ролям и у пользователя нет необходимой роли
      if (item.roles && user && item.roles.length > 0) {
        // Проверяем по UserRole, у пользователя есть поле role, а не roles
        return item.roles.some(roleStr => {
          const roleEnum = parseInt(roleStr);
          return user.role === roleEnum;
        });
      }
      
      return true;
    });
  }, [items, user]);

  // Проверка активного пункта меню
  const isItemActive = useCallback((item: NavItem) => {
    if (item.isActive) {
      return item.isActive(location.pathname);
    }
    return location.pathname === item.path;
  }, [location.pathname]);

  return {
    isMenuOpen,
    toggleMenu,
    closeMenu,
    handleLogout,
    user,
    filteredItems,
    isItemActive
  };
}; 