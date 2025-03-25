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
      let result;
      
      if (id && !isNewSpecimen) {
        // Обновление существующего
        result = await specimenService.updateSpecimen(Number(id), updatedSpecimen as unknown as Specimen);
      } else {
        // Создание нового
        result = await specimenService.createSpecimen(updatedSpecimen as unknown as Specimen);
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