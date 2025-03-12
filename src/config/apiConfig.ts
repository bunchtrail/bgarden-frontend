// Конфигурация API и URL для подключения к бэкенду

// Базовый URL API для локальной разработки
const LOCAL_API_URL = 'http://localhost:7254';

// Получаем URL из переменной окружения, если она задана
// или используем переменные окружения, задаваемые через .env файлы (process.env.REACT_APP_API_URL)
// Если не задано, используем локальный URL
export const API_URL = process.env.REACT_APP_API_URL || LOCAL_API_URL;

// Функция для получения полного URL к API
export const getApiUrl = (endpoint: string): string => {
  // Убедимся, что endpoint начинается с '/api/'
  if (endpoint.startsWith('/api/')) {
    const path = endpoint;
    return `${API_URL}${path}`;
  }
  // Если endpoint не содержит '/api/', добавляем его
  const path = endpoint.startsWith('/') ? `/api${endpoint}` : `/api/${endpoint}`;
  return `${API_URL}${path}`;
};

// Функция для получения полного URL к ресурсу (например, изображению)
export const getResourceUrl = (resourcePath: string | null): string | null => {
  if (!resourcePath) return null;
  
  // Убедимся, что путь к ресурсу начинается с '/'
  const path = resourcePath.startsWith('/') ? resourcePath : `/${resourcePath}`;
  return `${API_URL}${path}`;
}; 