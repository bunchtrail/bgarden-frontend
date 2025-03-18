import { useState, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/contexts/AuthContext';
import { NavItem } from '../types';

export const useNavigation = (items: NavItem[]) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    closeMenu();
  }, [logout, closeMenu]);

  const isItemActive = useCallback(
    (item: NavItem) => {
      if (item.path === '/' && pathname === '/') return true;
      if (item.path !== '/' && pathname.startsWith(item.path)) return true;
      return false;
    },
    [pathname]
  );

  // Фильтрация элементов навигации на основе аутентификации
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Скрываем элементы, требующие авторизации, если пользователь не авторизован
        if (item.requireAuth && !isAuthenticated) return false;
        return true;
      })
      .sort((a, b) => {
        // Сортировка по порядку, если он указан
        const orderA = a.order ?? 999;
        const orderB = b.order ?? 999;
        return orderA - orderB;
      });
  }, [items, isAuthenticated]);

  return {
    isMenuOpen,
    toggleMenu,
    closeMenu,
    handleLogout,
    isAuthenticated,
    user,
    filteredItems,
    isItemActive,
  };
};
