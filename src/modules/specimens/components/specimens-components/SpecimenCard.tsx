import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../ui/components/Card';
import Modal from '../../../ui/components/Modal';
import Button from '../../../ui/components/Button';
import { Specimen, SectorType } from '../../types';
import {
  animationClasses,
  getUnifiedButtonClasses,
} from '../../../../styles/global-styles';
import { sectorTypeColors, getSectorTypeNumber } from '../../styles';
import {
  SpecimenBadges,
  SpecimenDetails,
  SpecimenCardFooter,
} from './card-parts';
import SpecimenModal from './SpecimenModal';
import { useSpecimenImage } from '../../hooks';

interface SpecimenCardProps {
  specimen: Specimen;
  getSectorTypeName: (sectorType: SectorType) => string;
  onDelete: (id: number) => void;
  onClick?: () => void;
  isClickable?: boolean;
}

/**
 * Компонент карточки образца для отображения в режиме сетки
 */
const SpecimenCard: React.FC<SpecimenCardProps> = ({
  specimen,
  getSectorTypeName,
  onDelete,
  onClick,
  isClickable = true,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const navigate = useNavigate();
  const sectorTypeNumber = getSectorTypeNumber(specimen.sectorType);
  const sectorType = sectorTypeNumber as SectorType;

  // Получаем пропсы для заголовка
  const sectorColor = sectorTypeColors[sectorTypeNumber as keyof typeof sectorTypeColors] || sectorTypeColors[0];
  const headerClassName = `${sectorColor.bg} py-3 border-b border-gray-200`;

  // Используем хук для загрузки изображения, только когда открыто модальное окно
  const {
    imageSrc,
    isLoading,
    fetchImage,
    handleImageError,
    placeholderImage,
  } = useSpecimenImage(
    specimen.id,
    specimen.imageUrl,
    false // не загружать автоматически при монтировании
  );

  // Используем useEffect для загрузки изображения при открытии модального окна
  useEffect(() => {
    if (isImageModalOpen && !imageSrc) {
      fetchImage();
    }
  }, [isImageModalOpen, imageSrc, fetchImage]);

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (isClickable) {
      navigate(`/specimens/${specimen.id}`);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenImageModal = (e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем срабатывание onClick всей карточки
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
  };

  // Получаем унифицированные стили для кнопок
  const buttonClass = getUnifiedButtonClasses('card');

  return (
    <div className="relative h-full">
      {' '}
      <Card
        className={`flex flex-col h-full ${
          animationClasses.transition
        } group overflow-hidden
          hover:shadow-lg transform hover:scale-[1.02] hover:-translate-y-1 ${
            isClickable ? 'cursor-pointer' : ''
          }`}
        contentClassName="flex-grow"
        headerClassName={headerClassName}
        title={specimen.russianName || 'Без названия'}
        footer={
          <div className="flex flex-col items-center w-full gap-2">
            <SpecimenCardFooter specimenId={specimen.id} onDelete={onDelete} />
            <Button
              variant="neutral"
              size="small"
              onClick={handleOpenImageModal}
              className={`${buttonClass} w-full justify-center`}
              leftIcon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
            >
              Изображение
            </Button>
          </div>
        }
        onClick={isClickable ? handleCardClick : undefined}
      >
        <SpecimenBadges
          sectorType={sectorType}
          hasHerbarium={specimen.hasHerbarium}
          getSectorTypeName={getSectorTypeName}
        />

        <SpecimenDetails
          inventoryNumber={specimen.inventoryNumber}
          latinName={specimen.latinName}
          familyName={specimen.familyName || undefined}
          regionName={specimen.regionName || undefined}
          expositionName={specimen.expositionName || undefined}
        />
      </Card>
      {/* Модальное окно с детальной информацией */}
      <SpecimenModal
        specimen={specimen}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        getSectorTypeName={getSectorTypeName}
        onDelete={onDelete}
        size="large"
      />
      {/* Модальное окно с изображением */}
      <Modal
        isOpen={isImageModalOpen}
        onClose={handleCloseImageModal}
        title={`Изображение: ${specimen.russianName}`}
        size="large"
        variant="elevated"
        animation="spring"
        blockScroll={true}
        usePortal={true}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full max-w-md mx-auto overflow-hidden rounded-lg bg-gray-50 border border-gray-200">
            {isLoading ? (
              <div className="aspect-square flex items-center justify-center bg-gray-100 min-h-[300px]">
                <div className="flex flex-col items-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="text-gray-500 text-sm">Загрузка изображения...</span>
                </div>
              </div>
            ) : (
              <img
                src={imageSrc || placeholderImage}
                alt={`${specimen.russianName} (${specimen.latinName})`}
                className="w-full h-auto max-h-[400px] object-contain"
                onError={() => handleImageError()}
              />
            )}
          </div>
          <div className="text-center w-full space-y-2 px-2">
            {specimen.latinName && (
              <p className="text-base text-gray-700 italic font-medium break-words">
                {specimen.latinName}
              </p>
            )}
            {specimen.expositionName && (
              <p className="text-sm text-gray-600 break-words">
                <span className="font-medium">Экспозиция:</span> {specimen.expositionName}
              </p>
            )}
            {specimen.inventoryNumber && (
              <p className="text-sm text-gray-600 break-words">
                <span className="font-medium">Инв. номер:</span> {specimen.inventoryNumber}
              </p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default React.memo(SpecimenCard);
