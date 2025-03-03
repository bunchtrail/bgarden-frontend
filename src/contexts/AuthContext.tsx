import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import { CreateUserDto, LoginDto, UserDto } from '../types/user';

interface AuthContextType {
  user: UserDto | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: CreateUserDto) => Promise<void>;
  logout: () => void;
  clearError: () => void;
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
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');

      if (!token || !username) {
        setLoading(false);
        setIsAuthenticated(false);
        return;
      }

      try {
        const userData = await userApi.getByUsername(username);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Ошибка при проверке авторизации:', err);
        setIsAuthenticated(false);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // Выполняется только при монтировании компонента

  const clearError = () => setError(null);

  const login = async (data: LoginDto) => {
    try {
      setError(null);
      setLoading(true);
      const response = await userApi.login(data);
      setUser(response.user);
      setIsAuthenticated(true);
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

  const register = async (data: CreateUserDto) => {
    try {
      setError(null);
      setLoading(true);
      await userApi.create(data);
      await login({ username: data.username, password: data.password });
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

  const logout = () => {
    userApi.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    navigate('/login');
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
