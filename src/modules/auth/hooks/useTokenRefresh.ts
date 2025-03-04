import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Хук для автоматического обновления токена авторизации
 * @param refreshInterval Интервал обновления токена в миллисекундах (по умолчанию 15 минут)
 */
export const useTokenRefresh = (refreshInterval = 15 * 60 * 1000) => {
  const { isAuthenticated, refreshToken } = useAuth();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const setupRefreshTimer = () => {
      if (isAuthenticated) {
        // Очищаем предыдущий таймер если он существует
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
        }

        // Устанавливаем новый таймер для обновления токена
        timerRef.current = window.setInterval(async () => {
          try {
            // Получаем текущий токен обновления из куков
            const currentRefreshToken = document.cookie
              .split('; ')
              .find(row => row.startsWith('refreshToken='))
              ?.split('=')[1];

            if (currentRefreshToken) {
              // Вызываем refreshToken без параметров, как определено в AuthContext
              await refreshToken();
            }
          } catch (error) {
            // Ошибка при обновлении токена
          }
        }, refreshInterval);
      } else if (timerRef.current) {
        // Если пользователь вышел, очищаем таймер
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    setupRefreshTimer();

    // Очистка при размонтировании компонента
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isAuthenticated, refreshToken, refreshInterval]);
}; 