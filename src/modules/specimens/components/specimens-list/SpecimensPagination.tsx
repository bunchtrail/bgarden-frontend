import React from 'react';

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

  return (
    <div className='flex flex-col md:flex-row justify-between items-center mt-4 text-sm'>
      <div className='mb-2 md:mb-0 text-gray-600'>
        Показано {startItem}-{endItem} из {totalCount} образцов
      </div>

      <div className='flex items-center'>
        <div className='mr-4'>
          <label htmlFor='rowsPerPage' className='mr-2 text-gray-600'>
            Строк на странице:
          </label>
          <select
            id='rowsPerPage'
            className='border rounded px-2 py-1 text-sm'
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className='flex items-center'>
          <button
            className='px-3 py-1 rounded border mr-1 disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={handlePrevPage}
            disabled={page === 0}
          >
            ←
          </button>
          <span className='mx-2 text-gray-700'>
            Страница {page + 1} из {totalPages}
          </span>
          <button
            className='px-3 py-1 rounded border ml-1 disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={handleNextPage}
            disabled={page >= totalPages - 1}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};
