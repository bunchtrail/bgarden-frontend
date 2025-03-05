import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import { Specimen, specimenService } from '../modules/specimens';
import { SpecimenFormContainer } from '../modules/specimens/components/SpecimenFormContainer';
import {
  formClasses,
  tabsContainerClasses,
} from '../modules/specimens/components/styles';
import { animationClasses } from '../styles/global-styles';

/**
 * Форма 2 для детального просмотра и редактирования образца
 */
const SpecimenDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [specimen, setSpecimen] = useState<Specimen | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Опции для выпадающих списков (в реальном приложении будут загружаться с сервера)
  const familyOptions = [
    { id: 1, name: 'Розовые (Rosaceae)' },
    { id: 2, name: 'Злаковые (Poaceae)' },
    { id: 3, name: 'Астровые (Asteraceae)' },
    { id: 4, name: 'Бобовые (Fabaceae)' },
  ];

  // Загрузка данных образца
  useEffect(() => {
    const loadSpecimen = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const specimenId = parseInt(id);
        const data = await specimenService.getSpecimenById(specimenId);
        setSpecimen(data);
      } catch (err) {
        console.error('Ошибка при загрузке образца:', err);
        setError(
          'Не удалось загрузить данные образца. Пожалуйста, попробуйте позже.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSpecimen();
  }, [id]);

  // Обработчики навигации по записям
  const handleNavigateFirst = () => {
    navigate(`/specimen-detail/1`);
  };

  const handleNavigateLast = () => {
    navigate(`/specimen-detail/100`); // Предполагаем, что у нас 100 записей
  };

  const handleNavigatePrev = () => {
    if (id && parseInt(id) > 1) {
      navigate(`/specimen-detail/${parseInt(id) - 1}`);
    }
  };

  const handleNavigateNext = () => {
    if (id) {
      navigate(`/specimen-detail/${parseInt(id) + 1}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportToWord = () => {
    alert('Экспорт в Word...');
  };

  const handleExportToExcel = () => {
    alert('Экспорт в Excel...');
  };

  const handleBack = () => {
    navigate('/specimens');
  };

  // Добавляем обработчик для переключения в режим редактирования
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Добавляем обработчик для отмены редактирования
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Обработчик изменения вкладок
  const handleTabChange = (tabIndex: number) => {
    setCurrentTab(tabIndex);
  };

  // Переход к другим формам
  const handleOpenPhenology = () => {
    alert('Открытие формы фенологических наблюдений...');
  };

  const handleOpenBiometry = () => {
    alert('Открытие формы биометрии...');
  };

  // Отрисовка вкладок
  const renderTabs = () => {
    return (
      <div className={`${tabsContainerClasses.base} border-b mb-6`}>
        <nav className='flex -mb-px overflow-x-auto'>
          <button
            onClick={() => handleTabChange(0)}
            className={`${tabsContainerClasses.tab} whitespace-nowrap ${
              currentTab === 0
                ? tabsContainerClasses.activeTab
                : tabsContainerClasses.inactiveTab
            }`}
          >
            <span>Основная информация</span>
            {currentTab === 0 && (
              <div className={tabsContainerClasses.tabIndicator}></div>
            )}
          </button>
          <button
            onClick={() => handleTabChange(1)}
            className={`${tabsContainerClasses.tab} whitespace-nowrap ${
              currentTab === 1
                ? tabsContainerClasses.activeTab
                : tabsContainerClasses.inactiveTab
            }`}
          >
            <span>Экология и происхождение</span>
            {currentTab === 1 && (
              <div className={tabsContainerClasses.tabIndicator}></div>
            )}
          </button>
          <button
            onClick={() => handleTabChange(2)}
            className={`${tabsContainerClasses.tab} whitespace-nowrap ${
              currentTab === 2
                ? tabsContainerClasses.activeTab
                : tabsContainerClasses.inactiveTab
            }`}
          >
            <span>Дополнительно</span>
            {currentTab === 2 && (
              <div className={tabsContainerClasses.tabIndicator}></div>
            )}
          </button>
        </nav>
      </div>
    );
  };

  // Отображение формы редактирования или просмотра
  const renderForm = () => {
    if (!specimen)
      return (
        <div className={`${animationClasses.fadeIn} text-center p-6`}>
          Загрузка данных...
        </div>
      );

    // Если включен режим редактирования, показываем форму редактирования
    if (isEditing) {
      return (
        <div className={`${animationClasses.fadeIn} mt-4`}>
          <div className='mb-4 flex justify-between items-center'>
            <h2 className='text-xl font-semibold'>Редактирование образца</h2>
            <Button variant='secondary' onClick={handleCancelEdit}>
              Отмена
            </Button>
          </div>
          <SpecimenFormContainer
            initialData={specimen}
            onSaveSuccess={(updatedSpecimen: Specimen) => {
              setSpecimen(updatedSpecimen);
              setIsEditing(false);
            }}
            onCancel={handleCancelEdit}
          />
        </div>
      );
    }

    // Форма просмотра (не редактирования)
    return (
      <div className={`${animationClasses.fadeIn} mt-4`}>
        <div className='mb-4 flex justify-between items-center'>
          <h2 className='text-xl font-semibold'>Просмотр образца</h2>
          <Button variant='primary' onClick={handleEdit}>
            Редактировать
          </Button>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          {currentTab === 0 && (
            <>
              <div className={formClasses.control}>
                <label className={formClasses.label}>Инвентарный номер</label>
                <div className='mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md'>
                  {specimen.inventoryNumber}
                </div>
              </div>

              <div className={formClasses.control}>
                <label className={formClasses.label}>Семейство</label>
                <div className='mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md'>
                  {specimen.familyName}
                </div>
              </div>

              <div className={formClasses.control}>
                <label className={formClasses.label}>Род</label>
                <div className='mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md'>
                  {specimen.genus}
                </div>
              </div>

              <div className={formClasses.control}>
                <label className={formClasses.label}>Вид</label>
                <div className='mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md'>
                  {specimen.species}
                </div>
              </div>

              <div className={formClasses.control}>
                <label className={formClasses.label}>Сорт</label>
                <div className='mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md'>
                  {specimen.cultivar || '—'}
                </div>
              </div>

              <div className={formClasses.control}>
                <label className={formClasses.label}>Форма</label>
                <div className='mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md'>
                  {specimen.form || '—'}
                </div>
              </div>

              <div className={formClasses.control}>
                <label className={formClasses.label}>Определил</label>
                <div className='mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md'>
                  {specimen.determinedBy}
                </div>
              </div>

              <div className={formClasses.control}>
                <label className={formClasses.label}>Год посадки</label>
                <div className='mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md'>
                  {specimen.plantingYear}
                </div>
              </div>

              <div className={formClasses.control}>
                <label className={formClasses.label}>Охранный статус</label>
                <div className='mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md'>
                  {specimen.conservationStatus}
                </div>
              </div>

              <div className={formClasses.control}>
                <label className={formClasses.label}>Заполнил</label>
                <div className='mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md'>
                  {specimen.filledBy}
                </div>
              </div>

              <div className='mb-4 col-span-1 sm:col-span-2'>
                <label className={formClasses.label}>
                  Местоположение на территории сада
                </label>
                <div className='mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md'>
                  {specimen.expositionName}
                </div>
              </div>

              <div className='mb-4 col-span-1 sm:col-span-2 flex items-center'>
                <input
                  type='checkbox'
                  checked={specimen.hasHerbarium}
                  readOnly
                  className={formClasses.checkbox}
                />
                <label className='ml-2 block text-sm text-gray-700'>
                  Наличие гербария
                </label>
              </div>

              <div className='mb-4 col-span-1 sm:col-span-2'>
                <label className={formClasses.label}>
                  Информация о дубликатах
                </label>
                <div className='mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md'>
                  {specimen.duplicatesInfo || 'Отсутствует'}
                </div>
              </div>
            </>
          )}

          {currentTab === 1 && (
            <>
              <div className='mb-4 col-span-1 sm:col-span-2'>
                <label className={formClasses.label}>Синонимы</label>
                <div className='mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md'>
                  {specimen.synonyms || 'Не указано'}
                </div>
              </div>

              <div className='mb-4 col-span-1 sm:col-span-2'>
                <label className={formClasses.label}>
                  Происхождение образца
                </label>
                <div className='mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md'>
                  {specimen.sampleOrigin || 'Не указано'}
                </div>
              </div>

              <div className='mb-4 col-span-1 sm:col-span-2'>
                <label className={formClasses.label}>Природный ареал</label>
                <div className='mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md'>
                  {specimen.naturalRange || 'Не указано'}
                </div>
              </div>

              <div className='mb-4 col-span-1 sm:col-span-2'>
                <label className={formClasses.label}>
                  Экология и биология вида
                </label>
                <div className='mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md'>
                  {specimen.ecologyAndBiology || 'Не указано'}
                </div>
              </div>
            </>
          )}

          {currentTab === 2 && (
            <>
              <div className='mb-4 col-span-1 sm:col-span-2'>
                <label className={formClasses.label}>
                  Хозяйственное применение
                </label>
                <div className='mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md'>
                  {specimen.economicUse || 'Не указано'}
                </div>
              </div>

              <div className={formClasses.control}>
                <label className={formClasses.label}>Оригинатор</label>
                <div className='mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md'>
                  {specimen.originalBreeder || 'Не указано'}
                </div>
              </div>

              <div className={formClasses.control}>
                <label className={formClasses.label}>Год</label>
                <div className='mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md'>
                  {specimen.originalYear || 'Не указано'}
                </div>
              </div>

              <div className={formClasses.control}>
                <label className={formClasses.label}>Страна</label>
                <div className='mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md'>
                  {specimen.country || 'Не указано'}
                </div>
              </div>

              <div className='mb-4 col-span-1 sm:col-span-2'>
                <label className={formClasses.label}>Иллюстрация</label>
                <div className='mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md'>
                  {specimen.illustration ? (
                    <img
                      src={specimen.illustration}
                      alt='Иллюстрация образца'
                      className='max-w-full max-h-[300px]'
                    />
                  ) : (
                    'Отсутствует'
                  )}
                </div>
              </div>

              <div className='mb-4 col-span-1 sm:col-span-2'>
                <label className={formClasses.label}>Примечание</label>
                <div className='mt-1 p-2 min-h-[100px] bg-gray-50 border border-gray-300 rounded-md'>
                  {specimen.notes || 'Не указано'}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // Отрендерить содержимое страницы в зависимости от состояния
  if (isLoading && !specimen) {
    return (
      <div className='container mx-auto p-4'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold'>Загрузка данных образца...</h2>
          <div className='mt-4 flex justify-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500'></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !specimen) {
    return (
      <div className='container mx-auto p-4'>
        <div
          className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'
          role='alert'
        >
          <strong className='font-bold'>Ошибка!</strong>
          <span className='block sm:inline'> {error}</span>
          <div className='mt-4'>
            <Button onClick={() => navigate('/specimens')}>
              Вернуться к списку
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!specimen) {
    return (
      <div className='container mx-auto p-4'>
        <div
          className='bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative'
          role='alert'
        >
          <strong className='font-bold'>Образец не найден</strong>
          <div className='mt-4'>
            <Button onClick={() => navigate('/specimens')}>
              Вернуться к списку
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='bg-white rounded-lg shadow-md p-6'>
        {/* Верхняя панель с заголовком и кнопкой "Назад" */}
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold text-gray-900'>
            {specimen ? `Образец: ${specimen.inventoryNumber}` : 'Загрузка...'}
          </h1>
          <Button variant='secondary' onClick={handleBack}>
            Назад к списку
          </Button>
        </div>

        {/* Панель навигации по записям */}
        <div className='sticky top-0 z-10 bg-white py-2 border-b border-gray-200 mb-6'>
          <div className='flex justify-between items-center'>
            <div className='text-sm text-gray-500'>
              {specimen
                ? `ID: ${specimen.id} | Номер: ${specimen.inventoryNumber}`
                : ''}
            </div>
            <div className='flex space-x-2'>
              <Button variant='secondary' onClick={handleNavigateFirst}>
                Первая
              </Button>
              <Button variant='secondary' onClick={handleNavigatePrev}>
                Предыдущая
              </Button>
              <Button variant='secondary' onClick={handleNavigateNext}>
                Следующая
              </Button>
              <Button variant='secondary' onClick={handleNavigateLast}>
                Последняя
              </Button>
            </div>
          </div>
        </div>

        {/* Вкладки и форма */}
        {renderTabs()}
        {renderForm()}

        {/* Нижняя панель действий */}
        <div className='flex flex-wrap justify-between mt-8 pt-4 border-t'>
          <div className='flex flex-wrap gap-2 mb-2 sm:mb-0'>
            <Button variant='primary' onClick={handlePrint}>
              Печать
            </Button>
            <Button variant='secondary' onClick={handleExportToWord}>
              Экспорт в Word
            </Button>
            <Button variant='secondary' onClick={handleExportToExcel}>
              Экспорт в Excel
            </Button>
          </div>

          <div className='flex flex-wrap gap-2'>
            <Button variant='secondary' onClick={handleOpenPhenology}>
              Фенология
            </Button>
            <Button variant='secondary' onClick={handleOpenBiometry}>
              Биометрия
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecimenDetailPage;
