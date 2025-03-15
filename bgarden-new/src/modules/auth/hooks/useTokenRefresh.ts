import { useEffect, useRef } from 'react';
import { tokenService } from '../../../services/httpClient';
import { TokenDto } from '../types';

// Интервал проверки токена (в миллисекундах)
const TOKEN_CHECK_INTERVAL = 60000; // 1 минута

/**
 * Хук для автоматического обновления токена авторизации
 * @param isAuthenticated Флаг аутентификации пользователя
 * @param refreshCallback Функция обновления токена
 */
export const useTokenRefresh = (
  isAuthenticated: boolean,
  refreshCallback: () => Promise<TokenDto | void>
) => {
  // Используем useRef для хранения таймера, чтобы избежать его пересоздания при ререндерах
  const refreshTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      if (!isAuthenticated) return;

      try {
        // Получаем токен из localStorage
        const token = tokenService.getToken();
        if (!token) return;

        // Проверка необходимости обновления токена
        const needRefresh = isTokenExpiringSoon(token);
        
        if (needRefresh) {
          console.log('Токен скоро истечет, обновляем...');
          await refreshCallback();
        }
      } catch (error) {
        console.error('Ошибка при обновлении токена:', error);
      }
    };

    // Запуск таймера только если пользователь аутентифицирован
    if (isAuthenticated) {
      // Проверяем токен сразу при монтировании компонента
      checkAndRefreshToken();
      
      // Устанавливаем интервал для регулярной проверки
      refreshTimerRef.current = window.setInterval(() => {
        checkAndRefreshToken();
      }, TOKEN_CHECK_INTERVAL);
    }

    // Очистка таймера при размонтировании компонента или изменении isAuthenticated
    return () => {
      if (refreshTimerRef.current !== null) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [isAuthenticated, refreshCallback]);
};

/**
 * Проверяет, истекает ли токен в ближайшее время
 * @param token JWT токен
 * @returns true, если токен истекает менее чем через 5 минут
 */
function isTokenExpiringSoon(token: string): boolean {
  try {
    // Парсим JWT токен для получения полезной нагрузки
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Получаем время истечения токена
    const expirationTime = payload.exp * 1000; // переводим в миллисекунды
    
    // Получаем текущее время
    const currentTime = Date.now();
    
    // Проверяем, истекает ли токен в ближайшие 5 минут
    const timeUntilExpiration = expirationTime - currentTime;
    const fiveMinutesInMs = 5 * 60 * 1000;
    
    return timeUntilExpiration <= fiveMinutesInMs;
  } catch (error) {
    console.error('Ошибка при проверке токена:', error);
    return false;
  }
}

export default useTokenRefresh; 