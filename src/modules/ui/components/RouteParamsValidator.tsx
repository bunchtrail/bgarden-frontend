import React from 'react';
import { useParams } from 'react-router-dom';
import NotFound from '../../../pages/NotFound';

interface RouteParamsValidatorProps {
  children: React.ReactNode;
  paramName: string;
  validation?: 'numeric' | 'alphanumeric' | 'custom';
  customValidator?: (value: string) => boolean;
  allowedValues?: string[];
}

/**
 * Компонент для валидации параметров маршрута
 * Показывает страницу 404, если параметр не проходит валидацию
 */
const RouteParamsValidator: React.FC<RouteParamsValidatorProps> = ({
  children,
  paramName,
  validation = 'numeric',
  customValidator,
  allowedValues
}) => {
  const params = useParams();
  const paramValue = params[paramName];

  // Если параметр отсутствует
  if (!paramValue) {
    return <NotFound />;
  }

  // Валидация в зависимости от типа
  let isValid = true;

  switch (validation) {
    case 'numeric':
      const numericValue = Number(paramValue);
      isValid = !isNaN(numericValue) && numericValue > 0 && Number.isInteger(numericValue);
      break;
    
    case 'alphanumeric':
      isValid = /^[a-zA-Z0-9]+$/.test(paramValue);
      break;
    
    case 'custom':
      isValid = customValidator ? customValidator(paramValue) : true;
      break;
    
    default:
      isValid = true;
  }

  // Проверка на разрешенные значения
  if (isValid && allowedValues && !allowedValues.includes(paramValue)) {
    isValid = false;
  }

  if (!isValid) {
    return <NotFound />;
  }

  return <>{children}</>;
};

export default RouteParamsValidator; 