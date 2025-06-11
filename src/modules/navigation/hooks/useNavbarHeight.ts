import { useEffect, useRef, useState } from 'react';

/**
 * Хук для отслеживания высоты навбара
 * Возвращает ref для привязки к навбару и текущую высоту
 */
export const useNavbarHeight = () => {
  const navbarRef = useRef<HTMLElement | null>(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const updateNavbarHeight = () => {
      if (navbarRef.current) {
        const height = navbarRef.current.getBoundingClientRect().height;
        setNavbarHeight(height);
      }
    };

    // Обновляем высоту при первом рендере
    updateNavbarHeight();

    // Обновляем высоту при изменении размера окна
    const handleResize = () => {
      updateNavbarHeight();
    };

    window.addEventListener('resize', handleResize);

    // Обновляем высоту через ResizeObserver для более точного отслеживания
    if (navbarRef.current && window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(() => {
        updateNavbarHeight();
      });

      resizeObserver.observe(navbarRef.current);

      return () => {
        window.removeEventListener('resize', handleResize);
        resizeObserver.disconnect();
      };
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    navbarRef,
    navbarHeight,
  };
};
