import { authService } from '../modules/auth';

// Реэкспортируем authService для обратной совместимости
export const userApi = authService;

// Экспортируем API по умолчанию
export default authService; 