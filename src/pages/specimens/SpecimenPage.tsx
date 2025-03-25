import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { specimenService } from '../../modules/specimens/services/specimenService';
import { familyService, FamilyDto } from '../../modules/specimens/services/familyService';
import { expositionService, ExpositionDto } from '../../modules/specimens/services/expositionService';
import { getAllRegions } from '../../modules/specimens/services/regionService';
import { Specimen, SpecimenFormData, SectorType } from '../../modules/specimens/types';
import { RegionData } from '../../modules/map/types/mapTypes';
import LoadingSpinner from '../../modules/ui/components/LoadingSpinner';
import Button from '../../modules/ui/components/Button';
import Card from '../../modules/ui/components/Card';
import SpecimenForm from '../../modules/specimens/components/specimen-form';
import { cardClasses, textClasses, buttonClasses, layoutClasses, chipClasses, animationClasses } from '../../styles/global-styles';

/**
 * Страница детального просмотра и редактирования образца растения
 */
const SpecimenPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [specimen, setSpecimen] = useState<Specimen | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Справочные данные для формы
  const [families, setFamilies] = useState<FamilyDto[]>([]);
  const [expositions, setExpositions] = useState<ExpositionDto[]>([]);
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [referencesLoading, setReferencesLoading] = useState<boolean>(true);

  // Проверяем URL на наличие '/edit' и переключаем режим редактирования
  useEffect(() => {
    if (location.pathname.includes('/edit')) {
      setIsEditing(true);
    }
  }, [location.pathname]);

  // Загрузка справочных данных
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        setReferencesLoading(true);
        
        // Параллельная загрузка всех справочников
        const [familiesData, expositionsData, regionsData] = await Promise.all([
          familyService.getAllFamilies(),
          expositionService.getAllExpositions(),
          getAllRegions()
        ]);
        
        setFamilies(familiesData);
        setExpositions(expositionsData);
        setRegions(regionsData);
      } catch (err) {
        console.error('Ошибка при загрузке справочных данных:', err);
        setError('Не удалось загрузить справочные данные');
      } finally {
        setReferencesLoading(false);
      }
    };

    fetchReferenceData();
  }, []);

  // Загрузка данных образца
  useEffect(() => {
    const fetchSpecimen = async () => {
      try {
        setLoading(true);
        if (id && id !== 'new') {
          const specimenData = await specimenService.getSpecimenById(Number(id));
          setSpecimen(specimenData);
        } else {
          // Новый образец - устанавливаем пустой объект
          // Проверяем, есть ли параметр sectorType в URL
          const params = new URLSearchParams(location.search);
          const sectorTypeParam = params.get('sectorType');
          
          // Создаем базовый образец с учетом типа сектора из URL
          if (sectorTypeParam) {
            const sectorType = Number(sectorTypeParam);
            // Создаем пустой образец с указанным типом сектора
            setSpecimen(null);
          } else {
            setSpecimen(null);
          }
          setIsEditing(true);
        }
      } catch (err) {
        setError('Не удалось загрузить данные образца');
        console.error('Ошибка при загрузке образца:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecimen();
  }, [id, location.search]);

  // Обработчик сохранения образца
  const handleSave = async (updatedSpecimen: SpecimenFormData) => {
    try {
      setLoading(true);
      
      // Добавляем логирование сектора перед отправкой
      let result;

      if (id && id !== 'new') {
        // Обновление существующего
        result = await specimenService.updateSpecimen(Number(id), updatedSpecimen as Specimen);
      } else {
        // Создание нового
        result = await specimenService.createSpecimen(updatedSpecimen);
      }

      setSpecimen(result);
      setIsEditing(false);
      
      if (id === 'new') {
        // После создания перенаправляем на страницу списка образцов
        navigate('/specimens');
      } else if (location.pathname.includes('/edit')) {
        // После сохранения перенаправляем на страницу списка образцов
        navigate('/specimens');
      }
    } catch (err) {
      setError('Ошибка при сохранении образца');
      console.error('Ошибка при сохранении:', err);
    } finally {
      setLoading(false);
    }
  };

  // Обработчик отмены редактирования
  const handleCancel = () => {
    if (id === 'new') {
      navigate('/specimens');
    } else {
      setIsEditing(false);
    }
  };

  // Получение названия сектора
  const getSectorTypeName = (sectorType: SectorType): string => {
    switch (sectorType) {
      case SectorType.Dendrology:
        return 'Дендрология';
      case SectorType.Flora:
        return 'Флора';
      case SectorType.Flowering:
        return 'Цветение';
      default:
        return 'Неизвестный сектор';
    }
  };

  // Рендеринг в зависимости от состояния
  if (loading || referencesLoading) {
    return (
      <div className={`${layoutClasses.flexCenter} p-10 mt-16`}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-6 rounded-xl mt-16 shadow-sm">
        <h2 className={`${textClasses.heading} text-lg mb-2`}>Ошибка</h2>
        <p className={textClasses.body}>{error}</p>
        <Button 
          variant="danger"
          className="mt-4"
          onClick={() => navigate('/specimens')}
        >
          Вернуться к списку
        </Button>
      </div>
    );
  }

  return (
    <div className={`${layoutClasses.container} mt-16 pb-16`}>
      <div className={`${layoutClasses.flexBetween} mb-6`}>
        <div>
          <h1 className={`${textClasses.heading} text-2xl sm:text-3xl`}>
            {id === 'new' 
              ? 'Добавление нового образца' 
              : `Образец: ${specimen?.russianName || specimen?.latinName || 'Без названия'}`}
          </h1>
          {specimen && (
            <div className="mt-2 flex flex-wrap gap-2">
              <span className={`${chipClasses.base} ${chipClasses.primary}`}>
                № {specimen.inventoryNumber}
              </span>
              <span className={`${chipClasses.base} ${chipClasses.secondary}`}>
                {getSectorTypeName(specimen.sectorType as SectorType)}
              </span>
              {specimen.hasHerbarium && (
                <span className={`${chipClasses.base} ${chipClasses.warning}`}>
                  Имеется гербарий
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {!isEditing && id !== 'new' && (
            <Button 
              variant="primary"
              onClick={() => setIsEditing(true)}
            >
              Редактировать
            </Button>
          )}
          
          <Button 
            variant="neutral"
            onClick={() => navigate('/specimens')}
          >
            Назад к списку
          </Button>
        </div>
      </div>

      {isEditing ? (
        <Card className={cardClasses.elevated}>
          <SpecimenForm
            specimen={specimen || undefined}
            onSubmit={handleSave}
            onCancel={handleCancel}
            families={families}
            expositions={expositions}
            regions={regions}
          />
        </Card>
      ) : (
        <div className={`${layoutClasses.grid2} gap-6`}>
          <Card className={`${cardClasses.elevated} ${animationClasses.transition} ${animationClasses.springHover}`}>
            <div className={cardClasses.header}>
              <h2 className={cardClasses.title}>Основная информация</h2>
            </div>
            <div className={cardClasses.content}>
              {specimen && (
                <div className={`space-y-4`}>
                  <div className="border-b border-gray-100 pb-3">
                    <div className={`${textClasses.small} ${textClasses.secondary}`}>Инвентарный номер</div>
                    <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.inventoryNumber}</div>
                  </div>
                  
                  <div className="border-b border-gray-100 pb-3">
                    <div className={`${textClasses.small} ${textClasses.secondary}`}>Русское название</div>
                    <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.russianName}</div>
                  </div>
                  
                  <div className="border-b border-gray-100 pb-3">
                    <div className={`${textClasses.small} ${textClasses.secondary}`}>Латинское название</div>
                    <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.latinName}</div>
                  </div>
                  
                  <div className="border-b border-gray-100 pb-3">
                    <div className={`${textClasses.small} ${textClasses.secondary}`}>Семейство</div>
                    <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.familyName}</div>
                  </div>
                  
                  <div className="border-b border-gray-100 pb-3">
                    <div className={`${textClasses.small} ${textClasses.secondary}`}>Род</div>
                    <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.genus}</div>
                  </div>
                  
                  <div className="border-b border-gray-100 pb-3">
                    <div className={`${textClasses.small} ${textClasses.secondary}`}>Вид</div>
                    <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.species}</div>
                  </div>
                  
                  {specimen.determinedBy && (
                    <div className="border-b border-gray-100 pb-3">
                      <div className={`${textClasses.small} ${textClasses.secondary}`}>Определил</div>
                      <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.determinedBy}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
          
          <Card className={`${cardClasses.elevated} ${animationClasses.transition} ${animationClasses.springHover}`}>
            <div className={cardClasses.header}>
              <h2 className={cardClasses.title}>Географические данные</h2>
            </div>
            <div className={cardClasses.content}>
              {specimen && (
                <div className={`space-y-4`}>
                  {specimen.regionName && (
                    <div className="border-b border-gray-100 pb-3">
                      <div className={`${textClasses.small} ${textClasses.secondary}`}>Регион</div>
                      <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.regionName}</div>
                    </div>
                  )}
                  
                  <div className="border-b border-gray-100 pb-3">
                    <div className={`${textClasses.small} ${textClasses.secondary}`}>Координаты</div>
                    <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>
                      {`${specimen.latitude.toFixed(6)}, ${specimen.longitude.toFixed(6)}`}
                    </div>
                  </div>
                  
                  <div className="border-b border-gray-100 pb-3">
                    <div className={`${textClasses.small} ${textClasses.secondary}`}>Экспозиция</div>
                    <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.expositionName}</div>
                  </div>
                  
                  {specimen.sampleOrigin && (
                    <div className="border-b border-gray-100 pb-3">
                      <div className={`${textClasses.small} ${textClasses.secondary}`}>Происхождение образца</div>
                      <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.sampleOrigin}</div>
                    </div>
                  )}
                  
                  {specimen.country && (
                    <div className="border-b border-gray-100 pb-3">
                      <div className={`${textClasses.small} ${textClasses.secondary}`}>Страна</div>
                      <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.country}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
          
          {specimen && (
            <>
              <Card className={`${cardClasses.elevated} ${animationClasses.transition} ${animationClasses.springHover}`}>
                <div className={cardClasses.header}>
                  <h2 className={cardClasses.title}>Время и развитие</h2>
                </div>
                <div className={cardClasses.content}>
                  <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-3">
                      <div className={`${textClasses.small} ${textClasses.secondary}`}>Год посадки</div>
                      <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.plantingYear}</div>
                    </div>
                    
                    {specimen.originalYear && (
                      <div className="border-b border-gray-100 pb-3">
                        <div className={`${textClasses.small} ${textClasses.secondary}`}>Год селекции</div>
                        <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.originalYear}</div>
                      </div>
                    )}
                    
                    {specimen.originalBreeder && (
                      <div className="border-b border-gray-100 pb-3">
                        <div className={`${textClasses.small} ${textClasses.secondary}`}>Селекционер</div>
                        <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.originalBreeder}</div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
              
              <Card className={`${cardClasses.elevated} ${animationClasses.transition} ${animationClasses.springHover}`}>
                <div className={cardClasses.header}>
                  <h2 className={cardClasses.title}>Дополнительная информация</h2>
                </div>
                <div className={cardClasses.content}>
                  <div className={`space-y-4`}>
                    {specimen.conservationStatus && (
                      <div className="border-b border-gray-100 pb-3">
                        <div className={`${textClasses.small} ${textClasses.secondary}`}>Статус сохранения</div>
                        <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.conservationStatus}</div>
                      </div>
                    )}
                    
                    {specimen.naturalRange && (
                      <div className="border-b border-gray-100 pb-3">
                        <div className={`${textClasses.small} ${textClasses.secondary}`}>Естественный ареал</div>
                        <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.naturalRange}</div>
                      </div>
                    )}
                    
                    {specimen.ecologyAndBiology && (
                      <div className="border-b border-gray-100 pb-3">
                        <div className={`${textClasses.small} ${textClasses.secondary}`}>Экология и биология</div>
                        <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.ecologyAndBiology}</div>
                      </div>
                    )}
                    
                    {specimen.economicUse && (
                      <div className="border-b border-gray-100 pb-3">
                        <div className={`${textClasses.small} ${textClasses.secondary}`}>Экономическое использование</div>
                        <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.economicUse}</div>
                      </div>
                    )}
                    
                    {specimen.notes && (
                      <div className="border-b border-gray-100 pb-3">
                        <div className={`${textClasses.small} ${textClasses.secondary}`}>Примечания</div>
                        <div className={`${textClasses.body} ${textClasses.primary} font-medium`}>{specimen.notes}</div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SpecimenPage; 