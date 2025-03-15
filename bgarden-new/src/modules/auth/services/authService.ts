import httpClient, { ApiError, tokenService } from '../../../services/httpClient';
import {
    ErrorResponse,
    LoginDto,
    RegisterDto,
    TokenDto,
    UserDto
} from '../types';

// Сервис авторизации
export const authService = {
    // Методы авторизации
    
    // Регистрация пользователя
    register: async (registerDto: RegisterDto): Promise<TokenDto> => {
        try {
            const response = await httpClient.post<TokenDto>('Auth/register', registerDto, {
                requiresAuth: false
            });
            
            if (response.accessToken) {
                tokenService.setAuthData(response);
            }
            return response;
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.status === 400) {
                    throw new Error(error.data?.message || 'Ошибка при регистрации. Проверьте правильность введенных данных.');
                }
                throw new Error(error.data?.message || 'Ошибка при регистрации пользователя');
            }
            throw error;
        }
    },

    // Авторизация пользователя
    login: async (loginDto: LoginDto): Promise<TokenDto> => {
        try {
            // Очищаем данные авторизации перед попыткой входа
            tokenService.clearToken();
            
            const response = await httpClient.post<TokenDto>('Auth/login', loginDto, {
                requiresAuth: false
            });
            
            // Обычный вход, сохраняем токен
            if (response.accessToken) {
                tokenService.setAuthData(response);
            }
            
            return response;
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.status === 401) {
                    throw new Error('Неверное имя пользователя или пароль');
                }
                throw new Error(error.data?.message || 'Ошибка при входе в систему');
            }
            throw error;
        }
    },
    
    // Обновление токена
    refreshToken: async (): Promise<TokenDto> => {
        try {
            const response = await httpClient.post<TokenDto>('Auth/refresh-token');
            if (response.accessToken) {
                tokenService.setToken(response.accessToken);
            }
            return response;
        } catch (error) {
            tokenService.clearToken();
            throw error;
        }
    },
    
    // Выход из системы
    logout: async (): Promise<void> => {
        try {
            await httpClient.post('Auth/logout');
        } finally {
            tokenService.clearToken();
        }
    },
    
    // Разблокировка пользователя (только для администраторов)
    unlockUser: async (username: string): Promise<boolean> => {
        const response = await httpClient.post<{ message: string }>(`Auth/unlock-user/${username}`);
        return !!response;
    },

    // Проверка авторизации
    checkAuth: async (): Promise<UserDto | null> => {
        const token = tokenService.getToken();
        const username = localStorage.getItem('username');

        if (!token || !username) {
            return null;
        }

        try {
            // Получаем данные пользователя с таймаутом в 3 секунды
            const userData = await httpClient.get<UserDto>('User/me', {
                timeout: 3000,
                headers: {
                    'Cache-Control': 'max-age=60'
                }
            });
            
            return userData;
        } catch (err) {
            console.error('Ошибка при проверке авторизации:', err);
            return null;
        }
    },

    // Обработчик ошибок авторизации
    handleAuthError: (error: unknown): ErrorResponse => {
        if (error instanceof ApiError) {
            return {
                message: error.message,
                statusCode: error.status,
                isAuthError: error.isAuthError
            };
        }
        
        if (error instanceof Error) {
            return {
                message: error.message, 
                statusCode: 500
            };
        }
        
        return {
            message: 'Неизвестная ошибка авторизации',
            statusCode: 500
        };
    }
};

// Экспортируем функцию очистки данных авторизации для обратной совместимости
export const clearAuthData = tokenService.clearToken;

export default authService; 