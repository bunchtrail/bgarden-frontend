export enum UserRole {
    /**
     * Администратор системы (полный доступ)
     */
    Administrator = 1,
    
    /**
     * Работник ботанического сада (расширенный доступ)
     */
    Employee = 2,
    
    /**
     * Клиент (ограниченный доступ, только для просмотра)
     */
    Client = 3
}

export interface User {
    id: string;
    email: string;
    role: UserRole;
    name: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
}

export interface UserDto {
    id: number;
    username: string;
    email: string;
    fullName: string;
    role: UserRole;
    position: string | null;
    createdAt: string;
    lastLogin: string;
    isActive: boolean;
    token?: string;
}

export interface RegisterDto {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    IpAddress?: string;
    UserAgent?: string;
}

export interface LoginDto {
    username: string;
    password: string;
    IpAddress?: string;
    UserAgent?: string;
}

export interface AuthResponse {
    user: UserDto;
    token: string;
    message?: string;
}

export interface ErrorResponse {
    message: string;
    statusCode: number;
    isAuthError?: boolean;
}

export interface TokenDto {
    accessToken: string;
    refreshToken: string;
    expiration: string;
    tokenType: string;
    username: string;
    requiresTwoFactor: boolean;
}

export interface RefreshTokenDto {
    token: string;
    IpAddress?: string;
}

export interface TwoFactorAuthDto {
    requiresTwoFactor: boolean;
    username: string;
} 