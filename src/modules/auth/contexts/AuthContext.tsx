import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import {
  AuthLogDto,
  LoginDto,
  RegisterDto,
  TwoFactorSetupDto,
  UserDto,
  VerifyTwoFactorDto,
} from '../types';

interface AuthContextType {
  user: UserDto | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isTwoFactorRequired: boolean;
  temporaryUsername: string | null;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  verifyTwoFactor: (code: string, rememberMe: boolean) => Promise<void>;
  setupTwoFactor: () => Promise<TwoFactorSetupDto>;
  enableTwoFactor: (code: string) => Promise<boolean>;
  disableTwoFactor: (code: string) => Promise<boolean>;
  getAuthHistory: () => Promise<AuthLogDto[]>;
  unlockUser: (username: string) => Promise<boolean>;
  refreshToken: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTwoFactorRequired, setIsTwoFactorRequired] = useState(false);
  const [temporaryUsername, setTemporaryUsername] = useState<string | null>(
    null
  );
  const navigate = useNavigate();

  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const userData = await authService.checkAuth();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Ошибка при проверке авторизации:', err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // Выполняется только при монтировании компонента

  const clearError = () => setError(null);

  const login = async (data: LoginDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(data);

      // Проверяем, требуется ли двухфакторная аутентификация
      if ('requiresTwoFactor' in response && response.requiresTwoFactor) {
        setIsTwoFactorRequired(true);
        setTemporaryUsername(response.username);
        setIsAuthenticated(false);
        return;
      }

      // Если успешный вход (получили токен)
      if ('accessToken' in response) {
        // Делаем небольшую задержку, чтобы токен успел сохраниться в localStorage
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Получаем данные пользователя после успешной авторизации
        const userData = await authService.checkAuth();
        setUser(userData);
        setIsAuthenticated(true);
        setIsTwoFactorRequired(false);
        setTemporaryUsername(null);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при входе в систему');
      }
      setIsAuthenticated(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterDto) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.register(data);

      // Получаем данные пользователя после успешной регистрации
      const userData = await authService.checkAuth();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при регистрации');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      navigate('/login');
    }
  };

  const verifyTwoFactor = async (code: string, rememberMe: boolean) => {
    if (!temporaryUsername) {
      setError('Отсутствует имя пользователя для проверки');
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const verifyData: VerifyTwoFactorDto = {
        username: temporaryUsername,
        code,
        rememberMe,
      };

      const response = await authService.verifyTwoFactor(verifyData);

      // Получаем данные пользователя после успешной верификации
      const userData = await authService.checkAuth();
      setUser(userData);
      setIsAuthenticated(true);
      setIsTwoFactorRequired(false);
      setTemporaryUsername(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при проверке кода');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setupTwoFactor = async () => {
    try {
      setError(null);
      setLoading(true);
      const setupData = await authService.setupTwoFactor();
      return setupData;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при настройке двухфакторной аутентификации');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const enableTwoFactor = async (code: string) => {
    try {
      setError(null);
      setLoading(true);
      const result = await authService.enableTwoFactor(code);
      return result;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при включении двухфакторной аутентификации');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const disableTwoFactor = async (code: string) => {
    try {
      setError(null);
      setLoading(true);
      const result = await authService.disableTwoFactor(code);
      return result;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          'Произошла ошибка при отключении двухфакторной аутентификации'
        );
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAuthHistory = async () => {
    try {
      setError(null);
      setLoading(true);
      const history = await authService.getAuthHistory();
      return history;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при получении истории аутентификации');
      }
      throw err;
    } finally {
      setLoading(false);
    }
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

  const refreshToken = async (token: string) => {
    try {
      setError(null);
      setLoading(true);
      await authService.refreshToken(token);
      const userData = await authService.checkAuth();
      setUser(userData);
      setIsAuthenticated(!!userData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при обновлении токена');
      }
      setIsAuthenticated(false);
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
        isTwoFactorRequired,
        temporaryUsername,
        login,
        register,
        logout,
        clearError,
        verifyTwoFactor,
        setupTwoFactor,
        enableTwoFactor,
        disableTwoFactor,
        getAuthHistory,
        unlockUser,
        refreshToken,
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
