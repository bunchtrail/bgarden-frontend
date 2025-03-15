import { TokenDto } from '../modules/auth/types';

// Базовый URL API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:7254/api';

// Типы для запросов
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  requiresAuth?: boolean;
  body?: any;
  signal?: AbortSignal;
  timeout?: number;
};

// Класс для обработки ошибок
export class ApiError extends Error {
  status: number;
  data: any;
  isAuthError: boolean;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
    this.isAuthError = status === 401;
  }
}

// Функции для работы с токенами
export const tokenService = {
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
  
  setToken: (token: string): void => {
    localStorage.setItem('token', token);
  },
  
  setAuthData: (tokenData: TokenDto): void => {
    localStorage.setItem('token', tokenData.accessToken);
    localStorage.setItem('refreshToken', tokenData.refreshToken);
    localStorage.setItem('username', tokenData.username);
  },
  
  clearToken: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
  }
};

// Функция для создания AbortController с таймаутом
function createAbortControllerWithTimeout(timeout?: number): { controller: AbortController, timeoutId?: number } {
  const controller = new AbortController();
  
  if (!timeout) {
    return { controller };
  }
  
  const timeoutId = window.setTimeout(() => controller.abort(), timeout);
  return { controller, timeoutId };
}

// Основная функция для выполнения запросов
async function request<T>(
  endpoint: string,
  method: HttpMethod = 'GET',
  options: RequestOptions = {}
): Promise<T> {
  const { 
    headers = {}, 
    params = {}, 
    requiresAuth = true, 
    body,
    signal,
    timeout
  } = options;

  // Создаем AbortController если задан таймаут и не задан внешний signal
  const abortData = !signal && timeout ? createAbortControllerWithTimeout(timeout) : undefined;
  const abortSignal = signal || abortData?.controller.signal;

  try {
    // Формирование URL с параметрами
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/${endpoint}${queryParams ? `?${queryParams}` : ''}`;

    // Заголовки запроса
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain',
      ...headers,
    };

    // Добавление токена авторизации, если требуется
    if (requiresAuth) {
      const token = tokenService.getToken();
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }
    }

    // Опции запроса
    const fetchOptions: RequestInit = {
      method,
      headers: requestHeaders,
      credentials: 'include',
      signal: abortSignal
    };

    // Добавление тела запроса для не-GET методов
    if (body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(body);
    }

    // Выполнение запроса
    const response = await fetch(url, fetchOptions);
    
    // Обработка 401 Unauthorized - выход из системы
    if (response.status === 401) {
      // Выбрасываем ошибку авторизации, которую обработает вызывающий код
      throw new ApiError(401, 'Необходима авторизация', { isAuthError: true });
    }

    // Попытка получить данные как JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Проверка успешности запроса
    if (!response.ok) {
      const message = data?.message || 'Произошла ошибка при выполнении запроса';
      throw new ApiError(response.status, message, data);
    }

    return data as T;
  } catch (error) {
    // Если это уже ApiError, пробрасываем дальше
    if (error instanceof ApiError) {
      throw error;
    }

    // Проверка на ошибку AbortError (таймаут или отмена)
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(408, 'Запрос был отменен или превышено время ожидания', error);
    }

    // Иначе оборачиваем в ApiError
    console.error('Request failed:', error);
    throw new ApiError(500, (error as Error).message || 'Ошибка сети');
  } finally {
    // Очищаем таймаут, если он был установлен
    if (abortData?.timeoutId) {
      clearTimeout(abortData.timeoutId);
    }
  }
}

// Методы для удобства использования
const httpClient = {
  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, 'GET', options);
  },
  post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, 'POST', { ...options, body });
  },
  put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, 'PUT', { ...options, body });
  },
  patch<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, 'PATCH', { ...options, body });
  },
  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, 'DELETE', options);
  },
};

export default httpClient; 