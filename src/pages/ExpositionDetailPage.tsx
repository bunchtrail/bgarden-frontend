import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../modules/auth';
import { ExpositionDto, expositionService } from '../modules/expositions';
import { UserRole } from '../modules/specimens/types';
import { useConfirmation } from '../modules/notifications';

const ExpositionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user && user.role === UserRole.Administrator;
  const { confirm } = useConfirmation();

  const [exposition, setExposition] = useState<ExpositionDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExposition = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const expositionId = parseInt(id, 10);
        if (isNaN(expositionId)) {
          throw new Error('Некорректный ID экспозиции');
        }

        const data = await expositionService.getExpositionById(expositionId);
        setExposition(data);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке данных экспозиции:', err);
        setError(
          'Не удалось загрузить данные экспозиции. Пожалуйста, попробуйте позже.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExposition();
  }, [id]);

  const handleDelete = async () => {
    if (!exposition) return;
    
    const confirmed = await confirm({
      title: 'Удаление экспозиции',
      message: `Вы уверены, что хотите удалить экспозицию "${exposition.name}"?`,
      confirmText: 'Да, удалить',
      cancelText: 'Отмена',
      variant: 'danger'
    });
    
    if (!confirmed) return;

    try {
      const success = await expositionService.deleteExposition(exposition.id);
      if (success) {
        navigate('/expositions');
      } else {
        setError('Не удалось удалить экспозицию');
      }
    } catch (err) {
      console.error('Ошибка при удалении экспозиции:', err);
      setError('Не удалось удалить экспозицию. Пожалуйста, попробуйте позже.');
    }
  };

  if (loading) {
    return (
      <div className='container mx-auto p-6 text-center'>
        <p className='text-gray-500'>Загрузка данных экспозиции...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto p-6'>
        <div className='bg-red-50 p-4 rounded-md border border-red-200'>
          <p className='text-red-700'>{error}</p>
        </div>
        <div className='mt-4'>
          <Link
            to='/expositions'
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
          >
            Вернуться к списку экспозиций
          </Link>
        </div>
      </div>
    );
  }

  if (!exposition) {
    return (
      <div className='container mx-auto p-6'>
        <h1 className='text-2xl font-bold text-gray-800 mb-4'>
          Экспозиция не найдена
        </h1>
        <p className='text-gray-600 mb-4'>
          Запрашиваемая экспозиция не существует или была удалена.
        </p>
        <Link
          to='/expositions'
          className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
        >
          Вернуться к списку экспозиций
        </Link>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-6'>
      <div className='flex items-center mb-6'>
        <Link
          to='/expositions'
          className='text-blue-600 hover:text-blue-800 transition-colors mr-4'
        >
          &larr; Назад к списку
        </Link>
        <h1 className='text-3xl font-bold text-gray-800'>{exposition.name}</h1>
      </div>

      <div className='bg-white p-6 rounded-lg shadow mb-8'>
        <div className='mb-6'>
          <h2 className='text-xl font-semibold text-gray-700 mb-2'>Описание</h2>
          <p className='text-gray-600'>{exposition.description}</p>
        </div>

        {exposition.specimensCount !== null && (
          <div className='mb-6'>
            <h2 className='text-xl font-semibold text-gray-700 mb-2'>
              Количество образцов
            </h2>
            <p className='text-gray-600'>{exposition.specimensCount}</p>
          </div>
        )}

        {isAdmin && (
          <div className='flex gap-4 mt-8'>
            <Link
              to={`/expositions/edit/${exposition.id}`}
              className='px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors'
            >
              Редактировать
            </Link>
            <button
              onClick={handleDelete}
              className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors'
            >
              Удалить
            </button>
          </div>
        )}
      </div>

      {/* Здесь можно добавить связанные образцы растений из данной экспозиции */}
      <div className='mt-8'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
          Образцы растений в этой экспозиции
        </h2>
        <Link
          to={`/specimens?expositionId=${exposition.id}`}
          className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
        >
          Просмотреть образцы
        </Link>
      </div>
    </div>
  );
};

export default ExpositionDetailPage;
