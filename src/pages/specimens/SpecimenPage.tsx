import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { specimenService } from '../../modules/specimens/services/specimenService';
import { SpecimenFormData, Specimen } from '../../modules/specimens/types';
import LoadingSpinner from '../../modules/ui/components/LoadingSpinner';
import Button from '../../modules/ui/components/Button';
import Card from '../../modules/ui/components/Card';
import SpecimenForm from '../../modules/specimens/components/specimen-form';
import {
  SpecimenHeader,
  SpecimenDisplay,
} from '../../modules/specimens/components/specimen-display';
import { useSpecimenData } from '../../modules/specimens/hooks/useSpecimenData';
import { useReferenceData } from '../../modules/specimens/hooks/useReferenceData';
import { specimenPageStyles } from '../../modules/specimens/styles';
import { getActiveMap } from '../../modules/map/services/mapService';
import { NotFound } from '../NotFound';

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
  const {
    specimen,
    loading: specimenLoading,
    error: specimenError,
    notFound: specimenNotFound,
    setSpecimen,
  } = useSpecimenData(specimenId);
  const {
    families,
    expositions,
    regions,
    loading: referencesLoading,
    error: referenceError,
  } = useReferenceData();

  // Проверяем URL на наличие '/edit' и переключаем режим редактирования
  useEffect(() => {
    if (location.pathname.includes('/edit') || isNewSpecimen) {
      setIsEditing(true);
    }
  }, [location.pathname, isNewSpecimen]);

  // Если образец не найден (404), показываем страницу NotFound
  if (!isNewSpecimen && specimenNotFound) {
    return <NotFound />;
  }

  // Обработчик сохранения образца
  const handleSave = async (updatedSpecimen: SpecimenFormData) => {
    try {
      // Получаем активную карту для использования её ID
      const activeMaps = await getActiveMap();
      const activeMapId =
        activeMaps && activeMaps.length > 0 ? activeMaps[0].id : 1; // Используем ID 1 как запасной вариант

      // Корректируем данные в зависимости от типа локации
      const correctedSpecimen = {
        ...updatedSpecimen,
        locationType:
          typeof updatedSpecimen.locationType === 'string'
            ? Number(updatedSpecimen.locationType)
            : updatedSpecimen.locationType,
        latitude:
          typeof updatedSpecimen.latitude === 'string'
            ? parseFloat(updatedSpecimen.latitude)
            : updatedSpecimen.latitude,
        longitude:
          typeof updatedSpecimen.longitude === 'string'
            ? parseFloat(updatedSpecimen.longitude)
            : updatedSpecimen.longitude,
        mapX:
          typeof updatedSpecimen.mapX === 'string'
            ? parseFloat(updatedSpecimen.mapX)
            : updatedSpecimen.mapX,
        mapY:
          typeof updatedSpecimen.mapY === 'string'
            ? parseFloat(updatedSpecimen.mapY)
            : updatedSpecimen.mapY,
      } as SpecimenFormData;

      // Логирование данных формы удалено

      let result;

      if (id && !isNewSpecimen) {
        // Обновление существующего
        result = await specimenService.updateSpecimen(
          Number(id),
          correctedSpecimen as unknown as Specimen
        );

        // Дополнительно обновляем местоположение с использованием нового контроллера
        if (correctedSpecimen.locationType) {
          let locationData = {
            locationType: correctedSpecimen.locationType,
            latitude: null as number | null,
            longitude: null as number | null,
            mapId: null as number | null,
            mapX: null as number | null,
            mapY: null as number | null,
          };

          // Устанавливаем только те поля, которые нужны для данного типа локации
          if (correctedSpecimen.locationType === 2) {
            // SchematicMap
            locationData = {
              ...locationData,
              mapId: activeMapId, // Всегда устанавливаем ID активной карты
              mapX: correctedSpecimen.mapX ?? null,
              mapY: correctedSpecimen.mapY ?? null,
            };
          } else if (correctedSpecimen.locationType === 1) {
            // Geographic
            locationData = {
              ...locationData,
              latitude: correctedSpecimen.latitude ?? null,
              longitude: correctedSpecimen.longitude ?? null,
            };
          }

          // Логирование обновления местоположения удалено

          // Обновляем местоположение через новый контроллер
          await specimenService.updateSpecimenLocation(
            Number(id),
            locationData
          );
        }
      } else {
        // Создание нового образца

        result = await specimenService.createSpecimen(
          correctedSpecimen as unknown as Specimen
        );

        // После создания образца обновляем его местоположение с типом локации
        if (result && result.id && correctedSpecimen.locationType) {
          let locationData = {
            locationType: correctedSpecimen.locationType,
            latitude: null as number | null,
            longitude: null as number | null,
            mapId: null as number | null,
            mapX: null as number | null,
            mapY: null as number | null,
          };

          // Устанавливаем только те поля, которые нужны для данного типа локации
          if (correctedSpecimen.locationType === 2) {
            // SchematicMap
            locationData = {
              ...locationData,
              mapId: activeMapId, // Всегда устанавливаем ID активной карты
              mapX: correctedSpecimen.mapX ?? null,
              mapY: correctedSpecimen.mapY ?? null,
            };
          } else if (correctedSpecimen.locationType === 1) {
            // Geographic
            locationData = {
              ...locationData,
              latitude: correctedSpecimen.latitude ?? null,
              longitude: correctedSpecimen.longitude ?? null,
            };
          }

          

          // Обновляем местоположение через новый контроллер
          await specimenService.updateSpecimenLocation(result.id, locationData);
        }
      }

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
  const loading = isNewSpecimen
    ? referencesLoading
    : specimenLoading || referencesLoading;
  const error = specimenError || referenceError;
  
  if (loading) {
    return (
      <div className={specimenPageStyles.loadingContainer}>
        <div className={specimenPageStyles.centerContent}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={specimenPageStyles.errorContainer}>
        <div className={specimenPageStyles.content}>
          <div className={specimenPageStyles.errorCard}>
            <h2 className={specimenPageStyles.errorTitle}>Ошибка</h2>
            <p className={specimenPageStyles.errorText}>{error}</p>
            <div className="flex gap-4 mt-4">
              <Button
                variant="primary"
                onClick={() => navigate('/specimens')}
              >
                Вернуться к списку
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.location.reload()}
              >
                Обновить страницу
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={specimenPageStyles.container}>
      <div className={specimenPageStyles.content}>
        <SpecimenHeader
          specimen={specimen}
          isNew={isNewSpecimen}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onBack={() => navigate('/specimens')}
        />

        {/* При создании нового образца сразу показываем форму редактирования */}
        {isEditing ? (
          <Card className={specimenPageStyles.formCard}>
            <SpecimenForm
              specimen={isNewSpecimen ? undefined : specimen || undefined}
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
    </div>
  );
};

export default SpecimenPage;
