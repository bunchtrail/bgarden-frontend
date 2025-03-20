import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { specimenService } from '../../modules/specimens/services/specimenService';
import { familyService, FamilyDto } from '../../modules/specimens/services/familyService';
import { expositionService, ExpositionDto } from '../../modules/specimens/services/expositionService';
import { getAllRegions } from '../../modules/specimens/services/regionService';
import { Specimen, SpecimenFormData } from '../../modules/specimens/types';
import { RegionData } from '../../modules/map/types/mapTypes';
import LoadingSpinner from '../../modules/ui/components/LoadingSpinner';
import Button from '../../modules/ui/components/Button';
import Card from '../../modules/ui/components/Card';
import SpecimenForm from '../../modules/specimens/components/specimen-form';

/**
 * Страница детального просмотра и редактирования образца растения
 */
const SpecimenPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation(); // Получаем текущий URL
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

  // Рендеринг в зависимости от состояния
  if (loading || referencesLoading) {
    return (
      <div className="flex justify-center items-center p-10 mt-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md mt-16">
        <h2 className="text-lg font-bold">Ошибка</h2>
        <p>{error}</p>
        <Button 
          variant="danger"
          className="mt-2"
          onClick={() => navigate('/specimens')}
        >
          Вернуться к списку
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {id === 'new' 
            ? 'Добавление нового образца' 
            : `Образец: ${specimen?.russianName || specimen?.latinName || 'Без названия'}`}
        </h1>
        
        <div className="flex gap-2">
          {!isEditing && (
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
        <Card variant="outlined">
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
        <Card variant="outlined">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Основная информация</h2>
              {specimen && (
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Инвентарный номер:</span>
                    <p>{specimen.inventoryNumber}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Русское название:</span>
                    <p>{specimen.russianName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Латинское название:</span>
                    <p>{specimen.latinName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Семейство:</span>
                    <p>{specimen.familyName}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Географические данные</h2>
              {specimen && (
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Регион:</span>
                    <p>{specimen.regionName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Координаты:</span>
                    <p>
                      {specimen.latitude.toFixed(6)}, {specimen.longitude.toFixed(6)}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Экспозиция:</span>
                    <p>{specimen.expositionName}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Дополнительная информация</h2>
            {specimen && (
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Год посадки:</span>
                  <p>{specimen.plantingYear}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Происхождение образца:</span>
                  <p>{specimen.sampleOrigin}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Примечания:</span>
                  <p>{specimen.notes || "Нет примечаний"}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SpecimenPage; 