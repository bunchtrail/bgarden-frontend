import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { pageClasses, buttonClasses, textClasses } from '../styles/global-styles';
import Button from '../modules/ui/components/Button';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Определяем тип ошибки на основе URL
  const getErrorType = () => {
    const path = location.pathname;
    if (path.startsWith('/specimens/') && path !== '/specimens/new') {
      const id = path.split('/')[2];
      if (id && !isNaN(Number(id))) {
        return {
          title: 'Образец не найден',
          message: `Образец с ID ${id} не существует или был удален`,
          backPath: '/specimens',
          backText: 'К списку образцов'
        };
      }
    }
    if (path.startsWith('/map/sector/')) {
      const id = path.split('/')[3];
      return {
        title: 'Сектор не найден',
        message: `Сектор с ID ${id} не существует`,
        backPath: '/map',
        backText: 'К карте'
      };
    }
    return {
      title: 'Страница не найдена',
      message: 'Запрашиваемая страница не существует',
      backPath: '/',
      backText: 'На главную'
    };
  };

  const errorInfo = getErrorType();

  return (
    <div className={`${pageClasses.base} ${pageClasses.centerContent} min-h-screen`}>
      <div className={pageClasses.container}>
        <div className="text-center max-w-md mx-auto">
          {/* Иконка 404 */}
          <div className="mb-8">
            <svg className="w-24 h-24 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.816-6.22-2.18M9 6.366L6.366 9M17.634 9L15 6.366m6 6c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" />
            </svg>
          </div>

          {/* Заголовки и сообщение */}
          <h1 className={`${textClasses.heading} text-4xl font-bold text-red-600 mb-4`}>
            404
          </h1>
          <h2 className={`${textClasses.heading} text-xl font-semibold text-gray-800 mb-3`}>
            {errorInfo.title}
          </h2>
          <p className={`${textClasses.body} text-gray-600 mb-8`}>
            {errorInfo.message}
          </p>

          {/* Кнопки навигации */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              onClick={() => navigate(errorInfo.backPath)}
              className="min-w-[140px]"
            >
              {errorInfo.backText}
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
              className="min-w-[140px]"
            >
              Назад
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
              className="min-w-[140px]"
            >
              Обновить
            </Button>
          </div>

          {/* Дополнительная информация */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">
              Если вы считаете, что это ошибка, обратитесь к администратору или попробуйте позже.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              URL: {location.pathname}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
