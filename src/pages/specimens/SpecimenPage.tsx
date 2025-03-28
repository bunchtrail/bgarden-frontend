import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { specimenService } from '../../modules/specimens/services/specimenService';
import { SpecimenFormData, Specimen } from '../../modules/specimens/types';
import LoadingSpinner from '../../modules/ui/components/LoadingSpinner';
import Button from '../../modules/ui/components/Button';
import Card from '../../modules/ui/components/Card';
import SpecimenForm from '../../modules/specimens/components/specimen-form';
import { SpecimenHeader, SpecimenDisplay } from '../../modules/specimens/components/specimen-display';
import { useSpecimenData } from '../../modules/specimens/hooks/useSpecimenData';
import { useReferenceData } from '../../modules/specimens/hooks/useReferenceData';
import { cardClasses, textClasses, layoutClasses } from '../../styles/global-styles';
import { getActiveMap } from '../../modules/map/services/mapService';

/**
 * Страница детального просмотра и редактирования образца растения
 */
const SpecimenPage: React.FC = () => {
  // Получаем id из параметров URL
  const params = useParams<{ id: string }>();
  const { id } = params;
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Определяем, является ли текущая страница страницей создания нового образца
  const isNewSpecimen = id === 'new' || location.pathname === '/specimens/new';
  
  // Используем хуки для загрузки данных, передаем 'new' если определили что это страница нового образца
  const specimenId = isNewSpecimen ? 'new' : id;
  const { specimen, loading: specimenLoading, error: specimenError, setSpecimen } = useSpecimenData(specimenId);
  const { families, expositions, regions, loading: referencesLoading, error: referenceError } = useReferenceData();

  // Проверяем URL на наличие '/edit' и переключаем режим редактирования
  useEffect(() => {
    if (location.pathname.includes('/edit') || isNewSpecimen) {
      setIsEditing(true);
    }
  }, [location.pathname, isNewSpecimen]);

  // Обработчик сохранения образца
  const handleSave = async (updatedSpecimen: SpecimenFormData) => {
    try {
      // Получаем активную карту для использования её ID
      const activeMaps = await getActiveMap();
      const activeMapId = activeMaps && activeMaps.length > 0 ? activeMaps[0].id : 1; // Используем ID 1 как запасной вариант
      
      // Корректируем данные в зависимости от типа локации
      const correctedSpecimen = { ...updatedSpecimen };
      if (correctedSpecimen.locationType === 2) { // SchematicMap
        // Для схематических координат убираем географические
        correctedSpecimen.latitude = null as unknown as number;
        correctedSpecimen.longitude = null as unknown as number;
        // Устанавливаем ID активной карты
        correctedSpecimen.mapId = activeMapId;
      } else if (correctedSpecimen.locationType === 1) { // Geographic
        // Для географических координат убираем схематические
        correctedSpecimen.mapId = null as unknown as number;
        correctedSpecimen.mapX = null as unknown as number;
        correctedSpecimen.mapY = null as unknown as number;
      }
      
      // Логируем данные формы перед отправкой
      console.log('Отправляемые данные формы (после корректировки):', JSON.stringify(correctedSpecimen, null, 2));
      
      let result;
      
      if (id && !isNewSpecimen) {
        // Обновление существующего
        console.log('Обновление существующего образца с ID:', id);
        result = await specimenService.updateSpecimen(Number(id), correctedSpecimen as unknown as Specimen);
        
        // Дополнительно обновляем местоположение с использованием нового контроллера
        if (correctedSpecimen.locationType) {
          let locationData = {
            locationType: correctedSpecimen.locationType,
            latitude: null as number | null,
            longitude: null as number | null,
            mapId: null as number | null,
            mapX: null as number | null,
            mapY: null as number | null
          };
          
          // Устанавливаем только те поля, которые нужны для данного типа локации
          if (correctedSpecimen.locationType === 2) { // SchematicMap
            locationData = {
              ...locationData,
              mapId: activeMapId, // Всегда устанавливаем ID активной карты
              mapX: correctedSpecimen.mapX ?? null,
              mapY: correctedSpecimen.mapY ?? null
            };
          } else if (correctedSpecimen.locationType === 1) { // Geographic
            locationData = {
              ...locationData,
              latitude: correctedSpecimen.latitude ?? null,
              longitude: correctedSpecimen.longitude ?? null
            };
          }
          
          console.log('Обновление местоположения образца:', JSON.stringify(locationData, null, 2));
          
          // Обновляем местоположение через новый контроллер
          await specimenService.updateSpecimenLocation(Number(id), locationData);
        }
      } else {
        // Создание нового образца
        console.log('Создание нового образца...');
        
        result = await specimenService.createSpecimen(correctedSpecimen as unknown as Specimen);
        console.log('Образец успешно создан с ID:', result.id);
        
        // После создания образца обновляем его местоположение с типом локации
        if (result && result.id && correctedSpecimen.locationType) {
          let locationData = {
            locationType: correctedSpecimen.locationType,
            latitude: null as number | null,
            longitude: null as number | null,
            mapId: null as number | null,
            mapX: null as number | null,
            mapY: null as number | null
          };
          
          // Устанавливаем только те поля, которые нужны для данного типа локации
          if (correctedSpecimen.locationType === 2) { // SchematicMap
            locationData = {
              ...locationData,
              mapId: activeMapId, // Всегда устанавливаем ID активной карты
              mapX: correctedSpecimen.mapX ?? null,
              mapY: correctedSpecimen.mapY ?? null
            };
          } else if (correctedSpecimen.locationType === 1) { // Geographic
            locationData = {
              ...locationData,
              latitude: correctedSpecimen.latitude ?? null,
              longitude: correctedSpecimen.longitude ?? null
            };
          }
          
          console.log('Обновление местоположения нового образца:', JSON.stringify(locationData, null, 2));
          
          // Обновляем местоположение через новый контроллер
          await specimenService.updateSpecimenLocation(result.id, locationData);
          console.log('Местоположение образца успешно обновлено');
        }
      }

      console.log('Результат сохранения образца:', JSON.stringify(result, null, 2));
      setSpecimen(result);
      setIsEditing(false);
      
      // После сохранения перенаправляем на страницу списка образцов
      navigate('/specimens');
    } catch (err) {
      console.error('Ошибка при сохранении:', err);
    }
  };

  // Обработчик отмены редактирования
  const handleCancel = () => {
    if (isNewSpecimen) {
      navigate('/specimens');
    } else {
      setIsEditing(false);
    }
  };

  // Состояния загрузки и ошибок
  const loading = (isNewSpecimen) ? referencesLoading : (specimenLoading || referencesLoading);
  const error = specimenError || referenceError;

  if (loading) {
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
      <SpecimenHeader 
        specimen={specimen} 
        isNew={isNewSpecimen}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onBack={() => navigate('/specimens')}
      />

      {/* При создании нового образца сразу показываем форму редактирования */}
      {isEditing ? (
        <Card className={cardClasses.elevated}>
          <SpecimenForm
            specimen={isNewSpecimen ? undefined : (specimen || undefined)}
            onSubmit={handleSave}
            onCancel={handleCancel}
            families={families}
            expositions={expositions}
            regions={regions}
          />
        </Card>
      ) : (
        <SpecimenDisplay specimen={specimen} />
      )}
    </div>
  );
};

export default SpecimenPage; 