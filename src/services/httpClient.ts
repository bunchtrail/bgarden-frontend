import { TokenDto } from '../modules/auth/types';
import { Notification, NotificationType } from '../modules/notifications';

// Тип для отправки уведомлений
type NotificationFunction = (notification: Omit<Notification, 'id'>) => void;
let addNotification: NotificationFunction | null = null;

export const setNotificationHandler = (handler: NotificationFunction) => {
  addNotification = handler;
};

const showErrorNotification = (message: string) => {
  if (addNotification) {
    addNotification({
      type: 'error',
      message,
      duration: 5000,
    });
  }
};

// Для «дебаунса» сообщений об ошибках авторизации
let lastAuthErrorTime = 0;
const AUTH_ERROR_DEBOUNCE_TIME = 5000; // 5 секунд

// Получаем базовый URL для API
const getBaseUrl = (): string => {
  const rawBase = process.env.REACT_APP_API_URL || 'http://localhost:7254/';
  // Гарантируем, что строка оканчивается на /, и содержит "api/" в конце
  let baseUrl = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
  if (!baseUrl.includes('/api/')) {
    baseUrl = `${baseUrl}api/`;
  }
  return baseUrl;
};

// Типы и интерфейсы
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  requiresAuth?: boolean;
  body?: any;
  signal?: AbortSignal;
  timeout?: number;
  suppressErrorsForStatus?: number[];
  onUploadProgress?: (progressEvent: { loaded: number; total?: number }) => void;
}

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

// Работа с токенами
export const tokenService = {
  getToken(): string | null {
    return localStorage.getItem('token');
  },
  setToken(token: string): void {
    localStorage.setItem('token', token);
  },
  setAuthData(tokenData: TokenDto): void {
    localStorage.setItem('token', tokenData.accessToken);
    localStorage.setItem('refreshToken', tokenData.refreshToken);
    localStorage.setItem('username', tokenData.username);
  },
  clearToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
  },
};

// Создание AbortController с учётом таймаута
function createAbortControllerWithTimeout(timeout?: number): { controller: AbortController; timeoutId?: number } {
  const controller = new AbortController();
  if (!timeout) return { controller };

  const timeoutId = window.setTimeout(() => controller.abort(), timeout);
  return { controller, timeoutId };
}

// Разбор ответа сервера в зависимости от Content-Type
async function parseResponse(response: Response): Promise<any> {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

// Универсальная функция для сетевых запросов
async function request<T>(endpoint: string, method: HttpMethod = 'GET', options: RequestOptions = {}): Promise<T> {
  const {
    headers = {},
    params = {},
    requiresAuth = true,
    body,
    signal,
    timeout,
    suppressErrorsForStatus = [],
    onUploadProgress,
  } = options;

  // Создаем собственный AbortController, если передан timeout и не задан внешний signal
  const abortData = !signal && timeout ? createAbortControllerWithTimeout(timeout) : undefined;
  const abortSignal = signal || abortData?.controller.signal;

  // Формируем url с параметрами
  const baseUrl = getBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const queryParams = new URLSearchParams(params).toString();
  const url = `${baseUrl}${cleanEndpoint}${queryParams ? `?${queryParams}` : ''}`;

  // Сбор заголовков
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain',
    ...headers,
  };

  // Проверка на авторизацию
  if (requiresAuth) {
    const token = tokenService.getToken();
    // Если токена нет, бросаем ошибку (кроме случая, когда запрос — refresh)
    if (!token && endpoint !== 'Auth/refresh-token') {
      throw new ApiError(401, 'Необходима авторизация', { isAuthError: true });
    }
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  // Подготовка fetch-опций
  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: 'include',
    signal: abortSignal,
  };

  // Добавляем тело запроса, если это не GET
  if (body && method !== 'GET') {
    if (body instanceof FormData) {
      // Для FormData удаляем заголовок «Content-Type», чтобы браузер выставил его автоматически
      fetchOptions.body = body;
      delete requestHeaders['Content-Type'];
    } else {
      fetchOptions.body = JSON.stringify(body);
    }
  }

  try {
    // Если хотим отслеживать прогресс загрузки
    const response = onUploadProgress && window.XMLHttpRequest
      ? await sendWithProgress(url, fetchOptions, onUploadProgress)
      : await fetch(url, fetchOptions);

    // Обработка 401 (Unauthorized)
    if (response.status === 401) {
      handleAuthError();
      throw new ApiError(401, 'Необходима авторизация', { isAuthError: true });
    }

    // Разбираем ответ
    const data = await parseResponse(response);
    if (!response.ok) {
      // Если статус не ok — выбрасываем ошибку, если не решили её подавлять
      if (!suppressErrorsForStatus.includes(response.status)) {
        throw new ApiError(response.status, data?.message || 'Ошибка при запросе', data);
      }
      // Для подавляемых статусов (GET-запросы) отдаём пустой массив
      if (method === 'GET') {
        return ([] as unknown) as T;
      }
    }

    return data as T;
  } catch (error) {
    handleError(error, suppressErrorsForStatus, method);
    // Этот код никогда не выполнится, так как handleError всегда выбрасывает исключение
    // Но TypeScript не может это определить, поэтому добавим явный возврат
    throw new Error("Недостижимый код");
  } finally {
    // Снимаем таймаут, если он был установлен
    if (abortData?.timeoutId) {
      clearTimeout(abortData.timeoutId);
    }
  }
}

// Обработка 401 с «дебаунсом» уведомлений
function handleAuthError() {
  const now = Date.now();
  if (now - lastAuthErrorTime > AUTH_ERROR_DEBOUNCE_TIME) {
    lastAuthErrorTime = now;
    showErrorNotification('Необходима авторизация');
  }
}

// Универсальная обработка ошибок
function handleError(error: unknown, suppressErrors: number[], method: HttpMethod): never {
  // Если это ApiError с кодом 404 и запрос был к Specimen/all, не логируем ошибку в консоль
  const isSpecimenNotFoundError = 
    error instanceof ApiError && 
    error.status === 404 && 
    (error.message.includes('Specimen') || 
     (error as any)?.url?.includes('/Specimen/all'));
  
  // Логируем ошибку только если это не подавляемая 404 для Specimen
  if (!isSpecimenNotFoundError) {
    console.error('Request failed:', error);
  }

  // Если это ApiError
  if (error instanceof ApiError) {
    // Если статус в списке подавляемых и это GET-запрос, отдадим пустой массив
    if (suppressErrors.includes(error.status) && method === 'GET') {
      // Для 404 на ресурсах Specimen не показываем уведомление
      if (isSpecimenNotFoundError) {
        return ([] as unknown) as never;
      }
      return ([] as unknown) as never;
    }
    
    // Не показываем уведомление для ошибок 404 Specimen
    if (!isSpecimenNotFoundError) {
      showErrorNotification(`Ошибка запроса: ${error.message}`);
    }
    throw error;
  }

  // Если запрос был прерван (AbortError)
  if (error instanceof DOMException && error.name === 'AbortError') {
    const apiError = new ApiError(408, 'Запрос отменён или истек таймаут', error);
    showErrorNotification(`Ошибка таймаута: ${apiError.message}`);
    throw apiError;
  }

  // Иначе любая другая непредвиденная ошибка (сеть и т.д.)
  const apiError = new ApiError(500, (error as Error)?.message || 'Неизвестная ошибка сети');
  showErrorNotification(`Ошибка сети: ${apiError.message}`);
  throw apiError;
}

// Отправка запроса с отслеживанием прогресса через XMLHttpRequest
async function sendWithProgress(
  url: string,
  options: RequestInit,
  onProgress: (progressEvent: { loaded: number; total?: number }) => void
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method || 'GET', url);

    // Устанавливаем заголовки (кроме Content-Type для FormData)
    if (options.headers) {
      Object.entries(options.headers as Record<string, string>).forEach(([key, value]) => {
        if (!(options.body instanceof FormData && key.toLowerCase() === 'content-type')) {
          xhr.setRequestHeader(key, value);
        }
      });
    }

    // Настройка получения ответа
    xhr.responseType = 'blob';

    // Учёт credentials
    if (options.credentials === 'include') {
      xhr.withCredentials = true;
    }

    // Прогресс загрузки
    xhr.upload.onprogress = (event) => {
      onProgress({
        loaded: event.loaded,
        total: event.lengthComputable ? event.total : undefined,
      });
    };

    // Успешный ответ
    xhr.onload = async () => {
      let responseData: Blob | string | any = xhr.response;

      // Сбор заголовков
      const headers = new Headers();
      xhr
        .getAllResponseHeaders()
        .split('\r\n')
        .forEach((line) => {
          const parts = line.split(': ');
          if (parts.length === 2) {
            headers.append(parts[0], parts[1]);
          }
        });

      // Преобразование ответа в JSON (если это application/json)
      const contentType = headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const text = await responseData.text();
          responseData = new Blob([text], { type: 'application/json' });
        } catch (err) {
          console.error('Ошибка при преобразовании ответа в JSON:', err);
        }
      }

      // Собираем итоговый объект Response
      const response = new Response(responseData, {
        status: xhr.status,
        statusText: xhr.statusText,
        headers,
      });

      resolve(response);
    };

    // Различные типы ошибок
    xhr.onerror = () => reject(new Error('Ошибка сети'));
    xhr.ontimeout = () => reject(new Error('Превышено время ожидания'));
    xhr.onabort = () => reject(new DOMException('Запрос был отменён', 'AbortError'));

    // Подписка на внешнее прерывание (AbortController)
    if (options.signal) {
      options.signal.addEventListener('abort', () => xhr.abort());
    }

    // Отправка
    xhr.send(options.body as Document | XMLHttpRequestBodyInit | null);
  });
}

// Удобные обёртки для стандартных методов
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
