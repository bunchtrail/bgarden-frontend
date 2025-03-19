import React from 'react';
import { layoutClasses, cardClasses, animationClasses, textClasses } from '../../styles/global-styles';
import { useSpecimens } from '../../modules/specimens/hooks/useSpecimens';

// Импорт подкомпонентов
import SpecimensHeader from '../../modules/specimens/components/specimens-ui/SpecimensHeader';
import SpecimensSearchBar from '../../modules/specimens/components/specimens-controls/SpecimensSearchBar';
import SpecimensSortControls from '../../modules/specimens/components/specimens-controls/SpecimensSortControls';
import SpecimensGrid from '../../modules/specimens/components/specimens-components/SpecimensGrid';
import SpecimensTable from '../../modules/specimens/components/specimens-components/SpecimensTable';
import SpecimensEmptyState from '../../modules/specimens/components/specimens-states/SpecimensEmptyState';
import SpecimensLoading from '../../modules/specimens/components/specimens-states/SpecimensLoading';
import SpecimensError from '../../modules/specimens/components/specimens-states/SpecimensError';
import MobileAddButton from '../../modules/specimens/components/specimens-ui/MobileAddButton';
import { Specimen } from '@/modules/specimens/types';

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
    <div className={`${layoutClasses.container} ${animationClasses.fadeIn} max-w-5xl mx-auto py-10 mt-20`}>
      {/* Верхняя панель навигации с шагами */}
      <div>
        <h1 className={`${textClasses.heading} text-2xl mb-2`}>Коллекция образцов</h1>
        <p className={`${textClasses.secondary} mb-6`}>
          Просмотр и управление экземплярами растений ботанического сада
        </p>
        
        {/* Компонент заголовка */}
        <SpecimensHeader 
          activeSectorType={activeSectorType}
          getSectorTypeName={getSectorTypeName}
          handleResetSectorFilter={handleResetSectorFilter}
          view={view}
          toggleView={toggleView}
        />
      </div>

      {/* Основная область контента */}
      <div className={`${cardClasses.base} ${cardClasses.outlined} rounded-xl overflow-hidden`}>
        {/* Панель поиска и фильтров */}
        <div className="p-6 border-b border-gray-200">
          <div className="space-y-4">
            <SpecimensSearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            
            <SpecimensSortControls 
              sortBy={sortBy}
              getSortIcon={getSortIcon}
              handleSort={handleSort}
            />
          </div>
        </div>

        {/* Область отображения контента */}
        <div className="min-h-[500px] relative overflow-hidden transition-all duration-300 bg-[#FAFAFA]">
          {loading && sortedAndFilteredSpecimens.length === 0 ? (
            <div className="flex items-center justify-center h-[500px]">
              <SpecimensLoading fullScreen={true} />
            </div>
          ) : error ? (
            <div className="p-6">
              <SpecimensError 
                errorMessage={error} 
                onRetry={handleRetryLoading} 
              />
            </div>
          ) : sortedAndFilteredSpecimens.length === 0 ? (
            <div className="p-6">
              <SpecimensEmptyState 
                searchQuery={searchQuery}
                activeSectorType={activeSectorType}
                getSectorTypeName={getSectorTypeName}
                onResetSearch={handleResetSearch}
                onResetSectorFilter={handleResetSectorFilter}
              />
            </div>
          ) : view === 'grid' ? (
            <div className="p-6">
              <SpecimensGrid 
                specimens={sortedAndFilteredSpecimens}
                getSectorTypeName={getSectorTypeName}
                onDelete={handleDelete}
              />
            </div>
          ) : (
            <div className="p-6 pb-2">
              <SpecimensTable 
                specimens={sortedAndFilteredSpecimens}
                getSectorTypeName={getSectorTypeName}
                onDelete={handleDelete}
                sortBy={sortBy}
                sortOrder={sortOrder}
                handleSort={handleSort as (key: keyof Specimen) => void}
                getSortIcon={getSortIcon as (key: keyof Specimen) => string}
              />
            </div>
          )}

          {/* Индикатор загрузки */}
          {loading && sortedAndFilteredSpecimens.length > 0 && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
              <SpecimensLoading fullScreen={false} />
            </div>
          )}
        </div>

        {/* Нижняя панель с навигацией или дополнительными действиями */}
        <div className="flex justify-between p-6 border-t border-gray-200">
          <div>
            {/* При необходимости здесь можно добавить кнопки для навигации между страницами */}
          </div>
          <div>
            <p className={`${textClasses.small} ${textClasses.secondary}`}>
              {sortedAndFilteredSpecimens.length > 0 
                ? `Показано ${sortedAndFilteredSpecimens.length} образцов` 
                : 'Нет образцов для отображения'}
            </p>
          </div>
        </div>
      </div>

      {/* Плавающая кнопка добавления образца на мобильных устройствах */}
      <MobileAddButton />
    </div>
  );
};

export default SpecimensListPage; 