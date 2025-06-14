import httpClient, { ApiError, tokenService } from '../../../services/httpClient';
import {
    ErrorResponse,
    LoginDto,
    RegisterDto,
    TokenDto,
    UserDto,
    TwoFactorAuthDto,
    UserRole
} from '../types';

// Функция для маппинга строковых ролей в enum
const mapStringRoleToEnum = (role: string): UserRole => {
    switch (role) {
        case 'Administrator':
            return UserRole.Administrator;
        case 'Employee':
            return UserRole.Employee;
        case 'Client':
            return UserRole.Client;
        default:
            console.warn(`Неизвестная роль: ${role}, используется роль Client по умолчанию`);
            return UserRole.Client;
    }
};

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
    login: async (loginDto: LoginDto): Promise<TokenDto | TwoFactorAuthDto> => {
        try {
            // Очищаем данные авторизации перед попыткой входа
            tokenService.clearToken();
            
            const response = await httpClient.post<TokenDto | TwoFactorAuthDto>('Auth/login', loginDto, {
                requiresAuth: false
            });
            
            // Проверяем, требуется ли двухфакторная аутентификация
            if ('requiresTwoFactor' in response && response.requiresTwoFactor) {
                // Возвращаем ответ о необходимости двухфакторной аутентификации
                return response;
            }
            
            // Проверяем, что response содержит все поля TokenDto
            if (
                'accessToken' in response && 
                'refreshToken' in response && 
                'expiration' in response && 
                'tokenType' in response
            ) {
                tokenService.setAuthData(response as TokenDto);
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
            // Пытаемся декодировать токен и проверить его действительность
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const expirationTime = payload.exp * 1000;
                const currentTime = Date.now();
                
                // Если токен истек, не отправляем запрос
                if (expirationTime <= currentTime) {
                    tokenService.clearToken();
                    return null;
                }
            } catch (e) {
                // Если не удалось декодировать токен, считаем его недействительным
                tokenService.clearToken();
                return null;
            }
            
            // Получаем данные пользователя с таймаутом в 3 секунды
            const userData = await httpClient.get<any>('User/me', {
                timeout: 3000,
                headers: {
                    'Cache-Control': 'max-age=60'
                }
            });
            
            // Маппируем строковую роль в enum
            const mappedUserData: UserDto = {
                ...userData,
                role: typeof userData.role === 'string' 
                    ? mapStringRoleToEnum(userData.role) 
                    : userData.role
            };
            
            return mappedUserData;
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