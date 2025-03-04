export type UserRole = 'viewer' | 'editor' | 'admin' | 'user';

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
    role: number | string;
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
    expiresIn: number;
    userId: number;
    username: string;
}

export interface RefreshTokenDto {
    token: string;
    IpAddress?: string;
} 