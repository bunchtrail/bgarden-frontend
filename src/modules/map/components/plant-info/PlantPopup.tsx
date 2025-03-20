import React, { useState, useEffect } from 'react';
import { Modal, Button } from '@/modules/ui';
import { SpecimenData, getSpecimenById } from '../../services/plantService';
import { Plant } from '../../contexts/MapContext';

interface PlantPopupProps {
  isOpen: boolean;
  onClose: () => void;
  plant: Plant | null;
}

/**
 * Компонент модального окна с детальной информацией о растении
 */
const PlantPopup: React.FC<PlantPopupProps> = ({ isOpen, onClose, plant }) => {
  const [specimenData, setSpecimenData] = useState<SpecimenData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Сбрасываем состояние при закрытии модалки
    if (!isOpen) {
      return;
    }

    // Сбрасываем состояние при открытии
    setSpecimenData(null);
    setLoading(true);
    setError(null);

    // Извлекаем ID экземпляра из ID растения на карте
    if (plant && plant.id) {
      const specimenIdMatch = plant.id.match(/specimen-(\d+)/);
      if (specimenIdMatch && specimenIdMatch[1]) {
        const specimenId = parseInt(specimenIdMatch[1], 10);
        
        // Загружаем данные о растении
        getSpecimenById(specimenId)
          .then(data => {
            setSpecimenData(data);
            setLoading(false);
          })
          .catch(err => {
            console.error('Ошибка при загрузке данных растения:', err);
            setError('Не удалось загрузить информацию о растении');
            setLoading(false);
          });
      } else {
        setError('Некорректный идентификатор растения');
        setLoading(false);
      }
    } else {
      setError('Данные о растении не найдены');
      setLoading(false);
    }
  }, [isOpen, plant]);

  // Рендер состояния загрузки
  if (loading) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Загрузка информации"
        size="medium"
        animation="slide"
        variant="glass"
      >
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
          <div className="w-12 h-12 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
          <p className="text-lg text-gray-700">Загружаем информацию о растении...</p>
        </div>
      </Modal>
    );
  }

  // Рендер ошибки
  if (error) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Ошибка"
        size="small"
        animation="slide"
        variant="glass"
      >
        <div className="p-6">
          <p className="text-red-500">{error}</p>
          <div className="mt-4 flex justify-end">
            <Button onClick={onClose} variant="secondary">Закрыть</Button>
          </div>
        </div>
      </Modal>
    );
  }

  // Рендер основной информации
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={specimenData?.russianName || plant?.name || 'Информация о растении'}
      size="medium"
      animation="slide"
      variant="glass"
      footer={
        <div className="flex justify-end p-3">
          <Button onClick={onClose} variant="secondary">Закрыть</Button>
        </div>
      }
    >
      <div className="p-6">
        {specimenData ? (
          <div className="flex flex-col space-y-6">
            {/* Основная информация */}
            <div className="flex flex-col space-y-2">
              <h3 className="text-xl font-bold text-green-800">{specimenData.russianName}</h3>
              <h4 className="text-lg italic text-gray-600">{specimenData.latinName}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <p><span className="font-medium">Род:</span> {specimenData.genus}</p>
                  <p><span className="font-medium">Вид:</span> {specimenData.species}</p>
                  {specimenData.cultivar && (
                    <p><span className="font-medium">Сорт:</span> {specimenData.cultivar}</p>
                  )}
                  {specimenData.form && (
                    <p><span className="font-medium">Форма:</span> {specimenData.form}</p>
                  )}
                  {specimenData.familyName && (
                    <p><span className="font-medium">Семейство:</span> {specimenData.familyName}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <p><span className="font-medium">Инвентарный номер:</span> {specimenData.inventoryNumber}</p>
                  {specimenData.regionName && (
                    <p><span className="font-medium">Расположение:</span> {specimenData.regionName}</p>
                  )}
                  {specimenData.expositionName && (
                    <p><span className="font-medium">Экспозиция:</span> {specimenData.expositionName}</p>
                  )}
                  {specimenData.plantingYear && (
                    <p><span className="font-medium">Год высадки:</span> {specimenData.plantingYear}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Дополнительная информация */}
            {(specimenData.ecologyAndBiology || specimenData.naturalRange || specimenData.economicUse) && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
                <h4 className="text-lg font-semibold text-green-800 mb-3">Дополнительная информация</h4>
                <div className="space-y-3">
                  {specimenData.naturalRange && (
                    <div>
                      <h5 className="font-medium text-green-700">Ареал распространения</h5>
                      <p className="text-gray-700">{specimenData.naturalRange}</p>
                    </div>
                  )}
                  {specimenData.ecologyAndBiology && (
                    <div>
                      <h5 className="font-medium text-green-700">Экология и биология</h5>
                      <p className="text-gray-700">{specimenData.ecologyAndBiology}</p>
                    </div>
                  )}
                  {specimenData.economicUse && (
                    <div>
                      <h5 className="font-medium text-green-700">Хозяйственное значение</h5>
                      <p className="text-gray-700">{specimenData.economicUse}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Примечания */}
            {specimenData.notes && (
              <div className="mt-2">
                <h5 className="font-medium text-gray-700">Примечания:</h5>
                <p className="text-gray-600 italic">{specimenData.notes}</p>
              </div>
            )}
            
            {/* Охранный статус */}
            {specimenData.conservationStatus && (
              <div className="mt-4 inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                Охранный статус: {specimenData.conservationStatus}
              </div>
            )}
          </div>
        ) : (
          // Базовая информация, если полных данных нет
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold text-green-800">{plant?.name}</h3>
            {plant?.latinName && <h4 className="text-lg italic text-gray-600">{plant.latinName}</h4>}
            {plant?.description && <p className="text-gray-700">{plant.description}</p>}
            <p className="text-gray-500">Для получения подробной информации, пожалуйста, обновите страницу и попробуйте снова.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PlantPopup; 