export type UserRole = 'viewer' | 'editor';

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
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
    token?: string;
}

export interface CreateUserDto {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
}

export interface UpdateUserDto {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
}

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface LoginDto {
    username: string;
    password: string;
}

export interface AuthResponse {
    user: UserDto;
    token: string;
    message?: string;
}

export interface ErrorResponse {
    message: string;
    statusCode: number;
} 