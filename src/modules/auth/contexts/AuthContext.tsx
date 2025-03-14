import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, clearAuthData } from '../services/authService';
import { LoginDto, RegisterDto, UserDto } from '../types';

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
  refreshToken: () => Promise<void>;
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
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterDto): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);
      await authService.register(data);

      // Получаем данные пользователя после успешной регистрации
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
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        setError(err.message as string);
      } else {
        setError('Произошла ошибка при регистрации');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (redirect?: boolean) => {
    try {
      await authService.logout();
    } catch (error) {
      // Обработка ошибки
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      // Выполняем перенаправление только если это явно запрошено
      if (redirect) {
        navigate('/login');
      }
    }
  };

  // Добавляем метод для обработки ошибок авторизации
  const handleAuthError = (err: any) => {
    // Проверяем, является ли ошибка ошибкой авторизации
    if (err && (err.statusCode === 401 || err.isAuthError)) {
      // Очищаем данные авторизации
      clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
      setError('Сессия истекла. Пожалуйста, войдите снова.');
      return true;
    }
    return false;
  };

  const unlockUser = async (username: string) => {
    try {
      setError(null);
      setLoading(true);
      const result = await authService.unlockUser(username);
      return result;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при разблокировке пользователя');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      setError(null);
      setLoading(true);
      await authService.refreshToken();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при обновлении токена');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
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
