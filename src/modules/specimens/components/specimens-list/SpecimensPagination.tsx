import React from 'react';
import { buttonClasses } from '../styles';

interface SpecimensPaginationProps {
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onChangePage: (newPage: number) => void;
  onChangeRowsPerPage: (newRowsPerPage: number) => void;
}

export const SpecimensPagination: React.FC<SpecimensPaginationProps> = ({
  page,
  rowsPerPage,
  totalCount,
  onChangePage,
  onChangeRowsPerPage,
}) => {
  const totalPages = Math.ceil(totalCount / rowsPerPage);
  const startItem = page * rowsPerPage + 1;
  const endItem = Math.min((page + 1) * rowsPerPage, totalCount);

  const handlePrevPage = () => {
    if (page > 0) {
      onChangePage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      onChangePage(page + 1);
    }
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    onChangeRowsPerPage(Number(event.target.value));
  };

  if (totalCount === 0) {
    return null;
  }

  // Вычисляем номера страниц для отображения
  const displayMaxPages = 5; // Максимальное количество номеров страниц
  let pageNumbers = [];

  if (totalPages <= displayMaxPages) {
    // Если всего страниц меньше или равно максимальному количеству, показываем все
    pageNumbers = Array.from({ length: totalPages }, (_, i) => i);
  } else {
    // Иначе, показываем страницы рядом с текущей
    const startPage = Math.max(
      0,
      Math.min(
        page - Math.floor(displayMaxPages / 2),
        totalPages - displayMaxPages
      )
    );
    pageNumbers = Array.from(
      { length: displayMaxPages },
      (_, i) => startPage + i
    );
  }

  return (
    <div className='w-full mt-6 border-t border-gray-200 pt-4'>
      <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
        <div className='text-gray-600 text-sm'>
          Показано <span className='font-medium'>{startItem}</span>-
          <span className='font-medium'>{endItem}</span> из{' '}
          <span className='font-medium'>{totalCount}</span> образцов
        </div>

        <div className='flex items-center gap-4'>
          <div className='flex items-center'>
            <label htmlFor='rowsPerPage' className='mr-2 text-sm text-gray-600'>
              Строк:
            </label>
            <select
              id='rowsPerPage'
              className='border border-gray-300 rounded-md text-sm py-1 px-2 bg-white focus:border-blue-500 focus:ring-blue-500 shadow-sm'
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className='flex items-center gap-1'>
            <button
              className={`${buttonClasses.base} ${
                page === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:bg-blue-50'
              } w-9 h-9 p-0 flex items-center justify-center rounded-md border border-gray-300`}
              onClick={handlePrevPage}
              disabled={page === 0}
              aria-label='Предыдущая страница'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
            </button>

            {pageNumbers.map((pageNum) => (
              <button
                key={pageNum}
                className={`${
                  buttonClasses.base
                } w-9 h-9 p-0 flex items-center justify-center rounded-md border ${
                  pageNum === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 text-gray-700 hover:bg-blue-50'
                }`}
                onClick={() => onChangePage(pageNum)}
              >
                {pageNum + 1}
              </button>
            ))}

            <button
              className={`${buttonClasses.base} ${
                page >= totalPages - 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:bg-blue-50'
              } w-9 h-9 p-0 flex items-center justify-center rounded-md border border-gray-300`}
              onClick={handleNextPage}
              disabled={page >= totalPages - 1}
              aria-label='Следующая страница'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
