import axios, { AxiosError, AxiosInstance } from 'axios';
import {
    ErrorResponse,
    LoginDto,
    RegisterDto,
    TokenDto,
    UserDto
} from '../types';

// Обновляем URL API для бэкенда ботанического сада
const API_URL =  'http://localhost:7254/api';

// Создаем экземпляр axios с базовыми настройками
const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain'
    },
    withCredentials: true,
});

// Очистка данных авторизации
export const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
};

// Добавляем перехватчик запросов для добавления токена авторизации
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Добавляем перехватчик ответов для обработки ошибок
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ErrorResponse>) => {
        if (error.response?.status === 401) {
            // Не очищаем данные авторизации здесь, а просто возвращаем ошибку с флагом
            return Promise.reject({
                message: 'Сессия истекла. Пожалуйста, войдите снова.',
                statusCode: 401,
                isAuthError: true // Добавляем флаг для идентификации ошибки авторизации
            });
        }
        if (error.response?.status === 403) {
            return Promise.reject({
                message: 'У вас нет прав для выполнения этого действия',
                statusCode: 403
            });
        }
        return Promise.reject({
            message: error.response?.data?.message || 'Произошла ошибка при выполнении запроса',
            statusCode: error.response?.status || 500
        });
    }
);

// Сервис авторизации
export const authService = {
    // Методы авторизации, соответствующие AuthController API
    
    // Регистрация пользователя
    register: async (registerDto: RegisterDto): Promise<TokenDto> => {
        try {
            const response = await api.post<TokenDto>('/Auth/register', registerDto);
            if (response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
                localStorage.setItem('username', response.data.username);
            }
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 400) {
                    throw new Error(error.response?.data?.message || 'Ошибка при регистрации. Проверьте правильность введенных данных.');
                }
                throw new Error(error.response?.data?.message || 'Ошибка при регистрации пользователя');
            }
            throw error;
        }
    },

    // Авторизация пользователя
    login: async (loginDto: LoginDto): Promise<TokenDto> => {
        try {
            // Очищаем данные авторизации перед попыткой входа
            clearAuthData();
            
            const response = await api.post<TokenDto>('/Auth/login', loginDto);
            
            // Обычный вход, сохраняем токен
            if (response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
                localStorage.setItem('username', response.data.username);
            }
            
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Неверное имя пользователя или пароль');
                }
                throw new Error(error.response?.data?.message || 'Ошибка при входе в систему');
            }
            throw error;
        }
    },
    
    // Обновление токена
    refreshToken: async (): Promise<TokenDto> => {
        const response = await api.post<TokenDto>('/Auth/refresh-token');
        if (response.data.accessToken) {
            localStorage.setItem('token', response.data.accessToken);
        }
        return response.data;
    },
    
    // Выход из системы
    logout: async (): Promise<void> => {
        try {
            await api.post('/Auth/logout');
        } finally {
            clearAuthData();
        }
    },
    
    // Разблокировка пользователя (только для администраторов)
    unlockUser: async (username: string): Promise<boolean> => {
        const response = await api.post<{ message: string }>(`/Auth/unlock-user/${username}`);
        return !!response.data;
    },

    // Проверка авторизации
    checkAuth: async (): Promise<UserDto | null> => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        if (!token || !username) {
            return null;
        }

        try {
            // Устанавливаем таймаут для запроса, чтобы не блокировать UI на долгое время
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            // Используем эндпоинт User/me для получения данных пользователя
            const userData = await api.get<UserDto>('/User/me', {
                signal: controller.signal,
                // Добавляем кеширование запросов
                headers: {
                    'Cache-Control': 'max-age=60'
                }
            });
            
            clearTimeout(timeoutId);
            return userData.data;
        } catch (err) {
            console.error('Ошибка при проверке авторизации:', err);
            return null;
        }
    }
};

export default api; 