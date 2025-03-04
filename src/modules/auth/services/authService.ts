import axios, { AxiosError, AxiosInstance } from 'axios';
import {
    AuthLogDto,
    ChangePasswordDto,
    CreateUserDto,
    ErrorResponse,
    LoginDto,
    RegisterDto,
    TokenDto,
    TwoFactorSetupDto,
    UpdateUserDto,
    UserDto,
    VerifyTwoFactorCodeDto,
    VerifyTwoFactorDto
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7254/api';

// Создаем экземпляр axios с базовыми настройками
const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain'
    },
});

// Очистка данных авторизации
export const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
};

// Добавляем перехватчик запросов для добавления токена авторизации
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    console.log('Токен в перехватчике:', token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Authorization header:', `Bearer ${token}`);
    } else {
        console.log('Токен отсутствует!');
    }
    return config;
});

// Добавляем перехватчик ответов для обработки ошибок
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ErrorResponse>) => {
        if (error.response?.status === 401) {
            clearAuthData();
            return Promise.reject({
                message: 'Сессия истекла. Пожалуйста, войдите снова.',
                statusCode: 401
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
    // Получение всех пользователей
    getAll: async (): Promise<UserDto[]> => {
        const response = await api.get('/User');
        return response.data;
    },

    // Получение пользователя по ID
    getById: async (id: number): Promise<UserDto> => {
        const response = await api.get(`/User/${id}`);
        return response.data;
    },

    // Получение пользователя по имени пользователя
    getByUsername: async (username: string): Promise<UserDto> => {
        const response = await api.get(`/User/username/${username}`);
        return response.data;
    },

    // Создание нового пользователя (регистрация)
    create: async (createUserDto: CreateUserDto): Promise<UserDto> => {
        const response = await api.post('/User', createUserDto);
        return response.data;
    },

    // Обновление данных пользователя
    update: async (id: number, updateUserDto: UpdateUserDto): Promise<UserDto> => {
        const response = await api.put(`/User/${id}`, updateUserDto);
        return response.data;
    },

    // Изменение пароля пользователя
    changePassword: async (userId: number, changePasswordDto: ChangePasswordDto): Promise<void> => {
        await api.post(`/User/${userId}/changepassword`, changePasswordDto);
    },

    // Деактивация пользователя
    deactivate: async (id: number): Promise<void> => {
        await api.post(`/User/${id}/deactivate`);
    },

    // Активация пользователя
    activate: async (id: number): Promise<void> => {
        await api.post(`/User/${id}/activate`);
    },

    // Методы авторизации, соответствующие AuthController API
    
    // Регистрация пользователя
    register: async (registerDto: RegisterDto): Promise<TokenDto> => {
        const response = await api.post<TokenDto>('/Auth/register', registerDto);
        if (response.data.accessToken) {
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('username', response.data.username);
        }
        return response.data;
    },

    // Авторизация пользователя
    login: async (loginDto: LoginDto): Promise<TokenDto | { requiresTwoFactor: boolean, username: string }> => {
        try {
            const response = await api.post<TokenDto | { requiresTwoFactor: boolean, username: string }>('/Auth/login', loginDto);
            
            // Проверяем, требуется ли двухфакторная аутентификация
            if ('requiresTwoFactor' in response.data && response.data.requiresTwoFactor) {
                return response.data;
            }
            
            // Обычный вход, сохраняем токен
            if ('accessToken' in response.data) {
                console.log('Получен токен:', response.data.accessToken);
                localStorage.setItem('token', response.data.accessToken);
                localStorage.setItem('username', response.data.username);
                
                // Проверяем сохранение токена
                const savedToken = localStorage.getItem('token');
                console.log('Сохраненный токен:', savedToken);
                
                return response.data;
            }
            
            return response.data;
        } catch (error) {
            clearAuthData();
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
    refreshToken: async (refreshToken: string): Promise<TokenDto> => {
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
    
    // Проверка кода двухфакторной аутентификации
    verifyTwoFactor: async (verifyDto: VerifyTwoFactorDto): Promise<TokenDto> => {
        const response = await api.post<TokenDto>('/Auth/verify-2fa', verifyDto);
        if (response.data.accessToken) {
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('username', response.data.username);
        }
        return response.data;
    },
    
    // Настройка двухфакторной аутентификации
    setupTwoFactor: async (): Promise<TwoFactorSetupDto> => {
        const response = await api.get<TwoFactorSetupDto>('/Auth/setup-2fa');
        return response.data;
    },
    
    // Включение двухфакторной аутентификации
    enableTwoFactor: async (code: string): Promise<boolean> => {
        const verifyDto: VerifyTwoFactorCodeDto = { code };
        const response = await api.post<{ message: string }>('/Auth/enable-2fa', verifyDto);
        return !!response.data;
    },
    
    // Отключение двухфакторной аутентификации
    disableTwoFactor: async (code: string): Promise<boolean> => {
        const verifyDto: VerifyTwoFactorCodeDto = { code };
        const response = await api.post<{ message: string }>('/Auth/disable-2fa', verifyDto);
        return !!response.data;
    },
    
    // Получение истории аутентификации
    getAuthHistory: async (): Promise<AuthLogDto[]> => {
        const response = await api.get<AuthLogDto[]>('/Auth/auth-history');
        return response.data;
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

        console.log('checkAuth - Токен:', token);
        console.log('checkAuth - Имя пользователя:', username);

        if (!token || !username) {
            console.log('checkAuth - Нет токена или имени пользователя');
            return null;
        }

        try {
            // Можно использовать GET /api/User/me вместо получения по имени пользователя
            console.log('checkAuth - Отправка запроса /User/me');
            const userData = await api.get<UserDto>('/User/me');
            console.log('checkAuth - Получен ответ:', userData.data);
            return userData.data;
        } catch (err) {
            console.error('Ошибка при проверке авторизации:', err);
            clearAuthData();
            return null;
        }
    }
};

export default api; 