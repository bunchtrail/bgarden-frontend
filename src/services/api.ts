import axios, { AxiosError } from 'axios';
import { ChangePasswordDto, CreateUserDto, LoginDto, UpdateUserDto, UserDto, AuthResponse, ErrorResponse } from '../types/user';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7254/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain'
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
};

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

export const userApi = {
    getAll: async (): Promise<UserDto[]> => {
        const response = await api.get('/User');
        return response.data;
    },

    getById: async (id: number): Promise<UserDto> => {
        const response = await api.get(`/User/${id}`);
        return response.data;
    },

    getByUsername: async (username: string): Promise<UserDto> => {
        const response = await api.get(`/User/username/${username}`);
        return response.data;
    },

    create: async (createUserDto: CreateUserDto): Promise<UserDto> => {
        const response = await api.post('/User', createUserDto);
        return response.data;
    },

    update: async (id: number, updateUserDto: UpdateUserDto): Promise<UserDto> => {
        const response = await api.put(`/User/${id}`, updateUserDto);
        return response.data;
    },

    changePassword: async (userId: number, changePasswordDto: ChangePasswordDto): Promise<void> => {
        await api.post(`/User/${userId}/changepassword`, changePasswordDto);
    },

    deactivate: async (id: number): Promise<void> => {
        await api.post(`/User/${id}/deactivate`);
    },

    activate: async (id: number): Promise<void> => {
        await api.post(`/User/${id}/activate`);
    },

    login: async (loginDto: LoginDto): Promise<AuthResponse> => {
        try {
            const response = await api.post<AuthResponse>('/User/login', loginDto);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.user.username);
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

    logout: () => {
        clearAuthData();
    }
};

export default api; 