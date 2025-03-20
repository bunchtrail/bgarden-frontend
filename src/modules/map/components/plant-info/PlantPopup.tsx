import React, { useState } from 'react';
import { Popup } from 'react-leaflet';
import { Plant } from '../../contexts/MapContext';
import { SpecimenData, deleteSpecimen } from '../../services/plantService';
import useNotification from '@/modules/notifications/hooks/useNotification';
import { Card } from '@/modules/ui';
import { 
  getSpecimenCardHeader, 
  SpecimenBadges, 
  SpecimenDetails,
  SpecimenCardFooter 
} from '@/modules/specimens/components/specimens-components/card-parts';
import { SectorType } from '@/modules/specimens/types';

interface PlantPopupProps {
  plant: Plant | null;
  position: [number, number];
  specimenData?: SpecimenData | null;
  onClose: () => void;
  onEdit?: (specimenId: number) => void;
  onDelete?: (specimenId: number) => void;
}

/**
 * Компонент всплывающего попапа для просмотра информации о растении
 */
const PlantPopup: React.FC<PlantPopupProps> = ({ 
  plant, 
  position,
  specimenData, 
  onClose,
  onEdit,
  onDelete
}) => {
  const notification = useNotification();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!plant || !specimenData) return null;

  // Извлекаем ID образца из ID растения (format: specimen-123)
  const getSpecimenIdFromPlantId = (plantId: string): number | null => {
    const match = plantId.match(/specimen-(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  };

  // Получаем сектор для растения
  const getSectorTypeName = (sectorType: SectorType): string => {
    switch (sectorType) {
      case SectorType.Dendrology:
        return "Дендрология";
      case SectorType.Flora:
        return "Флора";
      case SectorType.Flowering:
        return "Цветущие";
      default:
        return "Неизвестно";
    }
  };

  // Преобразуем числовое значение из API в перечисление SectorType
  const getSectorTypeEnum = (): SectorType => {
    switch (specimenData.sectorType) {
      case 1: return SectorType.Dendrology;
      case 2: return SectorType.Flora;
      case 3: return SectorType.Flowering;
      default: return SectorType.Dendrology;
    }
  };

  const handleDelete = async () => {
    const specimenId = getSpecimenIdFromPlantId(plant.id);
    if (!specimenId) return;
    
    setIsDeleting(true);
    try {
      await deleteSpecimen(specimenId);
      
      // Закрываем попап и вызываем колбэк удаления если есть
      if (onDelete) {
        onDelete(specimenId);
      }
      onClose();
      
      // Показываем уведомление об успешном удалении
      notification.success(`Растение "${plant.name}" успешно удалено`, {
        title: 'Успешно',
        duration: 3000
      });
    } catch (error) {
      console.error('Ошибка при удалении растения:', error);
      notification.error('Не удалось удалить растение. Попробуйте еще раз', {
        title: 'Ошибка',
        duration: 5000
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Получаем ID образца для компонентов
  const specimenId = getSpecimenIdFromPlantId(plant.id) || 0;
  const sectorType = getSectorTypeEnum();
  
  // Создаем объект specimen для использования в компонентах
  const specimen = {
    id: specimenId,
    russianName: specimenData.russianName,
    latinName: specimenData.latinName,
    inventoryNumber: specimenData.inventoryNumber,
    sectorType,
    familyName: specimenData.familyName || '',
    familyId: specimenData.familyId,
    regionName: specimenData.regionName,
    expositionName: specimenData.expositionName,
    hasHerbarium: specimenData.hasHerbarium,
    // Добавляем остальные поля, чтобы удовлетворить интерфейс Specimen
    // Это поля, которые могут не быть в specimenData, но нужны для интерфейса
    latitude: specimenData.latitude,
    longitude: specimenData.longitude,
    genus: specimenData.genus,
    species: specimenData.species
  };

  // Получаем пропсы для заголовка
  const headerProps = getSpecimenCardHeader({
    id: specimenId,
    russianName: specimen.russianName,
    latinName: specimen.latinName,
    sectorType
  });

  return (
    <Popup 
      position={position}
      closeButton={true}
      closeOnClick={false}
      eventHandlers={{
        remove: onClose // event "remove" вызывается при закрытии popup
      }}
      className="specimen-popup"
      maxWidth={400}
    >
      <Card
        className="w-full overflow-auto max-h-80"
        headerClassName={headerProps.headerClassName}
        title={headerProps.title}
        subtitle={headerProps.subtitle}
        headerAction={headerProps.headerAction}
        footer={
          <div className="flex justify-end opacity-90 hover:opacity-100 transition-opacity">
            {specimenId > 0 && (
              <SpecimenCardFooter 
                specimenId={specimenId} 
                onDelete={handleDelete} 
              />
            )}
          </div>
        }
      >
        <div className="p-2">
          <SpecimenBadges 
            sectorType={sectorType}
            hasHerbarium={specimen.hasHerbarium}
            getSectorTypeName={getSectorTypeName}
          />
          
          <SpecimenDetails 
            inventoryNumber={specimen.inventoryNumber}
            latinName={specimen.latinName}
            familyName={specimen.familyName}
            regionName={specimen.regionName || undefined}
            expositionName={specimen.expositionName || undefined}
          />
        </div>
      </Card>
    </Popup>
  );
};

export default PlantPopup;