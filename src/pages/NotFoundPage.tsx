import React from 'react';
import ErrorPage from './ErrorPage';

const NotFoundPage: React.FC = () => {
  return (
    <ErrorPage
      title='Страница не найдена'
      message='Запрашиваемая страница не существует или была перемещена.'
      code={404}
      backLink='/'
      backText='Вернуться на главную'
    />
  );
};

export default NotFoundPage;
