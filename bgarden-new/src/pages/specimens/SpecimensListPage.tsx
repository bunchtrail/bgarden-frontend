import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { specimenService } from '../../modules/specimens/services/specimenService';
import { Specimen, SpecimenFilterParams, SectorType } from '../../modules/specimens/types';
import { sectorTypeColors } from '../../modules/specimens/styles';
import LoadingSpinner from '../../modules/ui/components/LoadingSpinner';
import Button from '../../modules/ui/components/Button';

/**
 * Страница со списком образцов растений
 */
const SpecimensListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [specimens, setSpecimens] = useState<Specimen[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SpecimenFilterParams>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSectorType, setActiveSectorType] = useState<SectorType | null>(null);

  // Получение параметров фильтрации из URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sectorTypeParam = params.get('sectorType');
    
    if (sectorTypeParam) {
      const sectorType = Number(sectorTypeParam) as SectorType;
      setActiveSectorType(sectorType);
      setFilters(prev => ({ ...prev, sectorType }));
    }
  }, [location.search]);

  // Функция для отображения типа сектора в виде текста
  const getSectorTypeName = (sectorType: SectorType): string => {
    switch (sectorType) {
      case SectorType.Dendrology:
        return 'Дендрология';
      case SectorType.Flora:
        return 'Флора';
      case SectorType.Flowering:
        return 'Цветоводство';
      default:
        return 'Все секторы';
    }
  };

  // Загрузка списка образцов
  useEffect(() => {
    const fetchSpecimens = async () => {
      try {
        setLoading(true);
        let data: Specimen[] = [];

        // Если указан тип сектора, то загружаем только образцы этого сектора
        if (filters.sectorType !== undefined) {
          console.log(`Загрузка образцов для сектора типа: ${filters.sectorType}`);
          data = await specimenService.getSpecimensBySectorType(filters.sectorType);
          console.log('Получены образцы:', data);
        } 
        
        // Обеспечиваем, что data всегда массив
        if (!Array.isArray(data)) {
          data = [data];
        }
        
        setSpecimens(data);
      } catch (err) {
        console.error('Ошибка при загрузке списка образцов:', err);
        setError('Не удалось загрузить список образцов');
      } finally {
        setLoading(false);
      }
    };

    fetchSpecimens();
  }, [filters.sectorType]);

  // Обработчик удаления образца
  const handleDelete = async (id: number) => {
    // В реальном приложении добавить подтверждение перед удалением
    if (window.confirm('Вы уверены, что хотите удалить этот образец?')) {
      try {
        setLoading(true);
        await specimenService.deleteSpecimen(id);
        // Обновляем локальный список без перезагрузки с сервера
        setSpecimens(specimens.filter(specimen => specimen.id !== id));
      } catch (err) {
        setError('Ошибка при удалении образца');
        console.error('Ошибка при удалении образца:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Сброс фильтра по типу сектора
  const handleResetSectorFilter = () => {
    setActiveSectorType(null);
    setFilters(prev => {
      const { sectorType, ...rest } = prev;
      return rest;
    });
    
    // Удаляем параметр из URL без перезагрузки страницы
    const params = new URLSearchParams(location.search);
    params.delete('sectorType');
    navigate({ search: params.toString() }, { replace: true });
  };

  // Фильтрация образцов на основе searchQuery
  const filteredSpecimens = specimens.filter(specimen => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      (specimen.russianName?.toLowerCase().includes(query) || false) ||
      (specimen.latinName?.toLowerCase().includes(query) || false) ||
      (specimen.inventoryNumber?.toLowerCase().includes(query) || false) ||
      (specimen.familyName?.toLowerCase().includes(query) || false)
    );
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Образцы растений</h1>
          {activeSectorType !== null && (
            <div className="flex items-center mt-2">
              <span className="text-sm bg-blue-100 text-blue-800 py-1 px-3 rounded-full">
                Сектор: {getSectorTypeName(activeSectorType)}
              </span>
              <Button 
                variant="neutral" 
                size="small" 
                className="ml-2 text-xs"
                onClick={handleResetSectorFilter}
              >
                Сбросить фильтр
              </Button>
            </div>
          )}
        </div>
        <Button 
          variant="success"
          onClick={() => navigate('/specimens/new')}
        >
          Добавить образец
        </Button>
      </div>

      {/* Строка поиска */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md pl-10"
            placeholder="Поиск по названию, номеру, семейству..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {loading && specimens.length === 0 ? (
        <div className="flex justify-center items-center p-10">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          <h2 className="text-lg font-bold">Ошибка</h2>
          <p>{error}</p>
          <Button 
            variant="danger"
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Попробовать снова
          </Button>
        </div>
      ) : filteredSpecimens.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-500">Образцы не найдены</h3>
          <p className="text-gray-400 mt-2">
            {searchQuery 
              ? 'По вашему запросу ничего не найдено' 
              : activeSectorType !== null 
                ? `В секторе "${getSectorTypeName(activeSectorType)}" пока нет образцов` 
                : 'В базе данных пока нет образцов'
            }
          </p>
          {(searchQuery || activeSectorType !== null) && (
            <div className="mt-4 space-x-2">
              {searchQuery && (
                <Button 
                  variant="primary"
                  onClick={() => setSearchQuery('')}
                >
                  Сбросить поиск
                </Button>
              )}
              {activeSectorType !== null && (
                <Button 
                  variant="neutral"
                  onClick={handleResetSectorFilter}
                >
                  Сбросить фильтр сектора
                </Button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpecimens.map((specimen) => {
            const sectorType = specimen.sectorType as SectorType;
            const sectorColor = sectorTypeColors[sectorType] || sectorTypeColors[0];
            
            return (
              <div key={specimen.id} className={`rounded-lg shadow-md overflow-hidden border ${sectorColor.border} bg-white`}>
                <div className={`${sectorColor.bg} py-2 px-4`}>
                  <span className={`text-xs font-medium ${sectorColor.text}`}>
                    {getSectorTypeName(sectorType)}
                  </span>
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2 text-gray-800">
                    {specimen.russianName || specimen.latinName || 'Без названия'}
                  </h2>
                  
                  <div className="text-sm text-gray-600">
                    <p><span className="font-medium">Инв. номер:</span> {specimen.inventoryNumber}</p>
                    {specimen.familyName && (
                      <p><span className="font-medium">Семейство:</span> {specimen.familyName}</p>
                    )}
                    {specimen.regionName && (
                      <p><span className="font-medium">Регион:</span> {specimen.regionName}</p>
                    )}
                    {specimen.expositionName && (
                      <p><span className="font-medium">Экспозиция:</span> {specimen.expositionName}</p>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => navigate(`/specimens/${specimen.id}`)}
                    >
                      Просмотр
                    </Button>
                    <Button
                      variant="warning"
                      size="small"
                      onClick={() => navigate(`/specimens/${specimen.id}/edit`)}
                    >
                      Изменить
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDelete(specimen.id)}
                    >
                      Удалить
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {loading && specimens.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white p-2 rounded-full shadow-lg">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default SpecimensListPage; 