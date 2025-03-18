import { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../auth';
import { NavItem } from '../types';

export const useNavigation = (items: NavItem[]) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const filteredItems = useMemo(() => {
    return items
      .filter(item => {
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

  // Проверка активного пункта меню
  const isItemActive = useCallback(
    (item: NavItem) => {
      if (item.path === '/' && pathname === '/') return true;
      if (item.path !== '/' && pathname.startsWith(item.path)) return true;
      return false;
    },
    [pathname]
  );

  return {
    isMenuOpen,
    toggleMenu,
    closeMenu,
    user,
    isAuthenticated,
    filteredItems,
    isItemActive
  };
}; 