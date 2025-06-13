import { setNotificationHandler } from '../services/httpClient';

// Типы для уровней логгирования
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

// Интерфейс для записи лога
export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  module?: string;
  data?: any;
  error?: Error;
}

// Интерфейс для конфигурации логгера
export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableStorage: boolean;
  maxStorageEntries: number;
  prefix?: string;
  colors?: boolean;
}

// Класс Logger
class Logger {
  private static instance: Logger;
  private config: LoggerConfig;
  private storage: LogEntry[] = [];
  private colors: Record<LogLevel, string> = {
    [LogLevel.DEBUG]: '#6b7280', // серый
    [LogLevel.INFO]: '#3b82f6',  // синий
    [LogLevel.WARN]: '#f59e0b',  // жёлтый
    [LogLevel.ERROR]: '#ef4444', // красный
    [LogLevel.NONE]: '#000000'
  };

  private constructor() {
    // Дефолтная конфигурация
    this.config = {
      level: process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
      enableConsole: process.env.NODE_ENV !== 'production',
      enableStorage: true,
      maxStorageEntries: 1000,
      prefix: '[BGarden]',
      colors: true
    };
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // Настройка конфигурации
  public configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // Получение текущей конфигурации
  public getConfig(): LoggerConfig {
    return { ...this.config };
  }

  // Основной метод логгирования
  private log(level: LogLevel, message: string, module?: string, data?: any, error?: Error): void {
    // Проверяем, нужно ли логгировать этот уровень
    if (level < this.config.level) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      module,
      data,
      error
    };

    // Сохраняем в хранилище
    if (this.config.enableStorage) {
      this.addToStorage(entry);
    }

    // Выводим в консоль
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }
  }

  // Добавление записи в хранилище
  private addToStorage(entry: LogEntry): void {
    this.storage.push(entry);
    
    // Ограничиваем размер хранилища
    if (this.storage.length > this.config.maxStorageEntries) {
      this.storage = this.storage.slice(-this.config.maxStorageEntries);
    }
  }

  // Вывод в консоль
  private logToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toLocaleTimeString();
    const levelName = LogLevel[entry.level];
    const modulePrefix = entry.module ? `[${entry.module}]` : '';
    const prefix = this.config.prefix || '';
    
    const fullMessage = `${prefix} ${timestamp} ${levelName} ${modulePrefix} ${entry.message}`;
    
    // Определяем метод консоли
    const consoleMethod = this.getConsoleMethod(entry.level);
    
    if (this.config.colors && typeof window !== 'undefined') {
      // Цветной вывод для браузера
      consoleMethod(
        `%c${fullMessage}`,
        `color: ${this.colors[entry.level]}; font-weight: ${entry.level >= LogLevel.WARN ? 'bold' : 'normal'}`
      );
    } else {
      // Обычный вывод
      consoleMethod(fullMessage);
    }

    // Выводим дополнительные данные
    if (entry.data) {
      consoleMethod('Data:', entry.data);
    }

    if (entry.error) {
      consoleMethod('Error:', entry.error);
    }
  }

  // Получение соответствующего метода консоли
  private getConsoleMethod(level: LogLevel): (...args: any[]) => void {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.ERROR:
        return console.error;
      default:
        return console.log;
    }
  }

  // Публичные методы для разных уровней логгирования
  public debug(message: string, module?: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, module, data);
  }

  public info(message: string, module?: string, data?: any): void {
    this.log(LogLevel.INFO, message, module, data);
  }

  public warn(message: string, module?: string, data?: any): void {
    this.log(LogLevel.WARN, message, module, data);
  }

  public error(message: string, module?: string, data?: any, error?: Error): void {
    this.log(LogLevel.ERROR, message, module, data, error);
  }

  // Методы для работы с хранилищем
  public getLogs(level?: LogLevel, module?: string): LogEntry[] {
    let logs = [...this.storage];

    if (level !== undefined) {
      logs = logs.filter(entry => entry.level >= level);
    }

    if (module) {
      logs = logs.filter(entry => entry.module === module);
    }

    return logs;
  }

  public clearLogs(): void {
    this.storage = [];
  }

  public exportLogs(): string {
    return JSON.stringify(this.storage, null, 2);
  }

  // Создание логгера для конкретного модуля
  public createModuleLogger(moduleName: string) {
    return {
      debug: (message: string, data?: any) => this.debug(message, moduleName, data),
      info: (message: string, data?: any) => this.info(message, moduleName, data),
      warn: (message: string, data?: any) => this.warn(message, moduleName, data),
      error: (message: string, data?: any, error?: Error) => this.error(message, moduleName, data, error)
    };
  }
}

// Создаем глобальный экземпляр
export const logger = Logger.getInstance();

// Экспортируем удобные функции для быстрого использования
export const logDebug = (message: string, module?: string, data?: any) => 
  logger.debug(message, module, data);

export const logInfo = (message: string, module?: string, data?: any) => 
  logger.info(message, module, data);

export const logWarning = (message: string, module?: string, data?: any) => 
  logger.warn(message, module, data);

// Вспомогательная функция для преобразования unknown ошибки в Error
const convertUnknownToError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }
  if (typeof error === 'string') {
    return new Error(error);
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return new Error(String(error.message));
  }
  return new Error(`Unknown error: ${String(error)}`);
};

export const logError = (message: string, module?: string, data?: any, error?: unknown) => {
  const convertedError = error ? convertUnknownToError(error) : undefined;
  logger.error(message, module, data, convertedError);
};

// Экспортируем как дефолтный объект для обратной совместимости
export default {
  debug: logDebug,
  info: logInfo,
  warning: logWarning,
  warn: logWarning,
  error: logError,
  logger,
  LogLevel,
  configure: (config: Partial<LoggerConfig>) => logger.configure(config),
  createModuleLogger: (moduleName: string) => logger.createModuleLogger(moduleName),
  getLogs: (level?: LogLevel, module?: string) => logger.getLogs(level, module),
  clearLogs: () => logger.clearLogs(),
  exportLogs: () => logger.exportLogs()
}; 