import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { ApiError } from '../../../services/httpClient';
import { LoginDto, RegisterDto, TokenDto, UserDto } from '../types';
import useTokenRefresh from '../hooks/useTokenRefresh';

interface AuthContextType {
  user: UserDto | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (data: LoginDto) => Promise<boolean>;
  register: (data: RegisterDto) => Promise<boolean>;
  logout: (redirect?: boolean) => Promise<void>;
  clearError: () => void;
  unlockUser: (username: string) => Promise<boolean>;
  refreshToken: () => Promise<TokenDto | void>;
  handleAuthError: (err: any) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Проверка авторизации при загрузке
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      setLoading(true);
      try {
        // Начинаем проверку авторизации немедленно
        // Добавляем небольшую задержку перед проверкой, чтобы дать браузеру возможность полностью загрузить данные из localStorage
        await new Promise(resolve => setTimeout(resolve, 50));
        
        const userData = await authService.checkAuth();
        
        if (isMounted) {
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    };

    checkAuth();
    
    return () => {
      isMounted = false;
    };
  }, []); // Выполняется только при монтировании компонента

  const clearError = () => setError(null);

  const login = async (data: LoginDto): Promise<boolean> => {
    setLoading(true);
    setError(null);
    // Сбрасываем состояние аутентификации перед попыткой входа
    setIsAuthenticated(false);
    setUser(null);

    try {
      await authService.login(data);

      // Делаем небольшую задержку, чтобы токен успел сохраниться в localStorage
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Получаем данные пользователя после успешной авторизации
      const userData = await authService.checkAuth();

      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
        return true; // Авторизация успешна
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setError('Не удалось получить данные пользователя');
        return false; // Авторизация не удалась
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при входе в систему');
      }
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterDto): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await authService.register(data);

      // Делаем небольшую задержку, чтобы токен успел сохраниться в localStorage
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Получаем данные пользователя после успешной авторизации
      const userData = await authService.checkAuth();

      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
        return true; // Регистрация успешна
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setError('Не удалось получить данные пользователя после регистрации');
        return false; // Регистрация не удалась
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при регистрации');
      }
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async (redirect: boolean = true) => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error("Ошибка при выходе из системы:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      if (redirect) {
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleAuthError = useCallback((err: any) => {
    // Проверяем, является ли ошибка ошибкой авторизации
    if (err instanceof ApiError && err.isAuthError) {
      // Если это ошибка авторизации (401), выходим из системы
      logout(true);
      return true; // Ошибка была обработана
    }
    return false; // Ошибка не была обработана, продолжаем обычную обработку ошибок
  }, [logout]);

  const unlockUser = useCallback(async (username: string) => {
    try {
      return await authService.unlockUser(username);
    } catch (error) {
      console.error('Ошибка при разблокировке пользователя:', error);
      return false;
    }
  }, []);

  // Функция для обновления токена
  const refreshToken = useCallback(async () => {
    try {
      const tokenData = await authService.refreshToken();
      return tokenData;
    } catch (error) {
      console.error('Ошибка при обновлении токена:', error);
      // В случае ошибки при обновлении токена, выходим из системы
      logout(true);
      throw error;
    }
  }, [logout]);

  // Используем хук для автоматического обновления токена
  useTokenRefresh(isAuthenticated, refreshToken);

  const contextValue: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    clearError,
    unlockUser,
    refreshToken,
    handleAuthError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
