import React from 'react';
import { layoutClasses } from '../../styles/global-styles';
import { useSpecimens } from '../../modules/specimens/hooks/useSpecimens';

// Импорт подкомпонентов
import SpecimensHeader from '../../modules/specimens/components/SpecimensHeader';
import SpecimensSearchBar from '../../modules/specimens/components/SpecimensSearchBar';
import SpecimensSortControls from '../../modules/specimens/components/SpecimensSortControls';
import SpecimensGrid from '../../modules/specimens/components/SpecimensGrid';
import SpecimensTable from '../../modules/specimens/components/SpecimensTable';
import SpecimensEmptyState from '../../modules/specimens/components/SpecimensEmptyState';
import SpecimensLoading from '../../modules/specimens/components/SpecimensLoading';
import SpecimensError from '../../modules/specimens/components/SpecimensError';
import MobileAddButton from '../../modules/specimens/components/MobileAddButton';

/**
 * Страница со списком образцов растений
 */
const SpecimensListPage: React.FC = () => {
  // Получаем все данные и функции из хука
  const { 
    loading, 
    error, 
    searchQuery, 
    setSearchQuery, 
    activeSectorType, 
    view, 
    sortBy, 
    sortOrder, 
    sortedAndFilteredSpecimens,
    getSectorTypeName, 
    handleDelete,
    handleResetSectorFilter,
    toggleView,
    handleSort,
    getSortIcon
  } = useSpecimens();

  // Функция сброса поиска
  const handleResetSearch = () => setSearchQuery('');

  // Функция для повторной загрузки данных (при ошибке)
  const handleRetryLoading = () => window.location.reload();

  return (
    <div className={`${layoutClasses.container} py-6 mt-16`}>
      {/* Заголовок страницы и кнопки действий */}
      <SpecimensHeader 
        activeSectorType={activeSectorType}
        getSectorTypeName={getSectorTypeName}
        handleResetSectorFilter={handleResetSectorFilter}
        view={view}
        toggleView={toggleView}
      />

      {/* Строка поиска и фильтрации */}
      <div className="space-y-0">
        <SpecimensSearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        {/* Фильтры и сортировка */}
        <SpecimensSortControls 
          sortBy={sortBy}
          getSortIcon={getSortIcon}
          handleSort={handleSort}
        />
      </div>

      {/* Содержимое страницы в зависимости от состояния */}
      {loading && sortedAndFilteredSpecimens.length === 0 ? (
        <SpecimensLoading fullScreen={true} />
      ) : error ? (
        <SpecimensError 
          errorMessage={error} 
          onRetry={handleRetryLoading} 
        />
      ) : sortedAndFilteredSpecimens.length === 0 ? (
        <SpecimensEmptyState 
          searchQuery={searchQuery}
          activeSectorType={activeSectorType}
          getSectorTypeName={getSectorTypeName}
          onResetSearch={handleResetSearch}
          onResetSectorFilter={handleResetSectorFilter}
        />
      ) : view === 'grid' ? (
        <SpecimensGrid 
          specimens={sortedAndFilteredSpecimens}
          getSectorTypeName={getSectorTypeName}
          onDelete={handleDelete}
        />
      ) : (
        <SpecimensTable 
          specimens={sortedAndFilteredSpecimens}
          getSectorTypeName={getSectorTypeName}
          onDelete={handleDelete}
          sortBy={sortBy}
          sortOrder={sortOrder}
          handleSort={handleSort}
          getSortIcon={getSortIcon}
        />
      )}

      {/* Плавающая кнопка добавления образца на мобильных устройствах */}
      <MobileAddButton />

      {/* Индикатор загрузки */}
      {loading && sortedAndFilteredSpecimens.length > 0 && (
        <SpecimensLoading fullScreen={false} />
      )}
    </div>
  );
};

export default SpecimensListPage; 