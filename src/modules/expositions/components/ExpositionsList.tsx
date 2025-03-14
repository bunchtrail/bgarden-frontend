import React, { useEffect, useState } from 'react';
import { expositionService } from '../services';
import { ExpositionDto } from '../types';
import { ExpositionCard } from './ExpositionCard';
import { useNotifications } from '../../../modules/notifications';
import { Link } from 'react-router-dom';
import { useConfirmation } from '../../notifications';

interface ExpositionsListProps {
  isAdmin?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const ExpositionsList: React.FC<ExpositionsListProps> = ({
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  const [expositions, setExpositions] = useState<ExpositionDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const { showError } = useNotifications();
  const { confirm } = useConfirmation();

  useEffect(() => {
    const fetchExpositions = async () => {
      try {
        setLoading(true);
        const data = await expositionService.getAllExpositions();
        setExpositions(data);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке экспозиций:', err);
        setError(
          'Не удалось загрузить список экспозиций. Пожалуйста, попробуйте позже.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExpositions();
  }, []);

  const handleDeleteExposition = async (id: number) => {
    const confirmed = await confirm({
      title: 'Удаление экспозиции',
      message: 'Вы уверены, что хотите удалить эту экспозицию?',
      confirmText: 'Да, удалить',
      cancelText: 'Отмена',
      variant: 'danger'
    });
    
    if (!confirmed) return;
    
    try {
      const success = await expositionService.deleteExposition(id);
      if (success) {
        setExpositions((prev) =>
          prev.filter((exposition) => exposition.id !== id)
        );
      }
    } catch (err) {
      console.error('Ошибка при удалении экспозиции:', err);
      showError('Не удалось удалить экспозицию. Пожалуйста, попробуйте позже.');
    }
  };

  const filteredExpositions = expositions.filter(
    (exposition) =>
      exposition.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      exposition.description.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className='space-y-6'>
      <div className='mb-6'>
        <input
          type='text'
          placeholder='Поиск по экспозициям...'
          className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      {loading ? (
        <div className='text-center py-6'>
          <p className='text-gray-500'>Загрузка экспозиций...</p>
        </div>
      ) : error ? (
        <div className='text-center py-6'>
          <p className='text-red-500'>{error}</p>
          <button
            className='mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
            onClick={() => window.location.reload()}
          >
            Попробовать снова
          </button>
        </div>
      ) : filteredExpositions.length === 0 ? (
        <div className='text-center py-6'>
          <p className='text-gray-500'>
            {searchValue
              ? 'Экспозиции не найдены. Попробуйте изменить параметры поиска.'
              : 'В ботаническом саду пока нет экспозиций.'}
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredExpositions.map((exposition) => (
            <ExpositionCard
              key={exposition.id}
              exposition={exposition}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onDelete={handleDeleteExposition}
            />
          ))}
        </div>
      )}
    </div>
  );
};
