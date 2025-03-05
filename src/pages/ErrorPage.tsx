import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface ErrorPageProps {
  title?: string;
  message?: string;
  code?: number;
  backLink?: string;
  backText?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  title = 'Ошибка',
  message = 'Произошла непредвиденная ошибка.',
  code = 500,
  backLink = '/',
  backText = 'Вернуться на главную',
}) => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full text-center'>
        <div className='mb-6'>
          <h1 className='text-6xl font-bold text-red-500'>{code}</h1>
          <h2 className='mt-4 text-3xl font-extrabold text-gray-900'>
            {title}
          </h2>
          <p className='mt-2 text-gray-600'>{message}</p>
        </div>

        <div className='mt-8 flex flex-col sm:flex-row justify-center gap-4'>
          <Link
            to={backLink}
            className='bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md inline-block'
          >
            {backText}
          </Link>

          <button
            onClick={() => navigate(-1)}
            className='bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md'
          >
            Вернуться назад
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
