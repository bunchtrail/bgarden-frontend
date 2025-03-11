import { useMapContext } from '../contexts/MapContext';
import { MapError } from '../types';

/**
 * Хук для централизованной обработки ошибок в модуле карты
 */
export const useErrorHandler = () => {
  const { setError } = useMapContext();

  /**
   * Обрабатывает ошибку и отображает уведомление
   * @param error объект ошибки или строка с сообщением
   * @param title опциональный заголовок для уведомления
   */
  const handleError = (error: Error | MapError | string, title: string = 'Ошибка') => {
    let errorMessage = '';

    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = error.message;
      
      // Если есть детали ошибки, можно добавить их в лог
      if ('details' in error && error.details) {
        console.error('Детали ошибки:', error.details);
      }
    } else {
      errorMessage = 'Произошла неизвестная ошибка';
    }

    // Сохраняем ошибку в контексте
    setError(errorMessage);
    
    // Показываем уведомление в консоли вместо toast
    console.error(`${title}: ${errorMessage}`);

    return errorMessage;
  };

  /**
   * Сбрасывает ошибку в контексте
   */
  const clearError = () => {
    setError(null);
  };

  return {
    handleError,
    clearError
  };
};

export default useErrorHandler; 