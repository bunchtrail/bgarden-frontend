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

export interface RegisterDto {
    username: string;
    email: string;
    password: string;
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

export interface VerifyTwoFactorDto {
    username: string;
    code: string;
    rememberMe: boolean;
}

export interface VerifyTwoFactorCodeDto {
    code: string;
}

export interface TwoFactorSetupDto {
    secretKey: string;
    qrCodeUrl: string;
}

export interface AuthLogDto {
    id: number;
    username: string;
    timestamp: string;
    ipAddress: string;
    userAgent: string;
    succeeded: boolean;
    failureReason?: string;
} 