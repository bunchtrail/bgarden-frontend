import React, { useEffect } from 'react';
import { Specimen } from '../../types';
import { 
  galleryContainerStyles,
  mainImageStyles,
  errorStateStyles
} from '../../styles';
import Card from '../../../../modules/ui/components/Card';

// Импорт вынесенных компонентов
import {
  GalleryHeader,
  MainImageDisplay,
  ImageCounter,
  ThumbnailsList,
  SpecimenInfoFooter,
  ImageViewModal,
  ImageUploadModal,
  ErrorState
} from './components';

// Импорт хука для работы с изображениями
import { useGalleryImages } from './hooks';
import { useAuth } from '../../../auth/hooks';

interface SpecimenGalleryProps {
  specimen: Specimen;
}

/**
 * Компонент галереи для отображения нескольких фотографий образца
 */
const SpecimenGallery: React.FC<SpecimenGalleryProps> = ({ specimen }) => {
  const { isAuthenticated } = useAuth();
  // Используем кастомный хук для логики работы с изображениями
  const {
    allImages,
    isLoading,
    error,
    currentImageIndex,
    selectedImages,
    isModalOpen,
    isUploadModalOpen,
    isUploading,
    uploadProgress,
    
    setCurrentImageIndex,
    handleOpenImageModal,
    handleCloseImageModal,
    handleOpenUploadModal,
    handleCloseUploadModal,
    handleNextImage,
    handlePrevImage,
    handleImagesChange,
    handleSaveImages,
    handleUploadError,
    handleSetMainImage,
    handleDeleteImage,
    handleImageError,
    reloadImages
  } = useGalleryImages({
    specimenId: specimen.id,
    imageUrl: specimen.imageUrl || undefined
  });
  
  // Текущее изображение для модального окна
  const currentImage = allImages.length > 0 ? allImages[currentImageIndex] : null;
  
  // Эффект для сброса выбранного изображения при изменении образца
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [specimen.id, setCurrentImageIndex]);
  
  const hasImages = allImages.length > 0;
  
  if (error) {
    return (
      <Card className={errorStateStyles.container}>
        <ErrorState message={error} onRetry={reloadImages} />
      </Card>
    );
  }
  
  return (
    <Card className={`${galleryContainerStyles.wrapper} p-3`}>
      <GalleryHeader
        onAddClick={handleOpenUploadModal}
        showAddButton={isAuthenticated}
      />
      
      <div className="flex flex-col items-center space-y-1">
        <div className={mainImageStyles.container}>
          <MainImageDisplay
            images={allImages}
            currentImageIndex={currentImageIndex}
            isLoading={isLoading}
            specimenName={specimen.russianName || 'Образец'}
            latinName={specimen.latinName || ''}
            onImageClick={handleOpenImageModal}
            onPrevClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
            onNextClick={() => setCurrentImageIndex(Math.min(allImages.length - 1, currentImageIndex + 1))}
            onImageError={() => {}}
          />
        </div>
        
        {hasImages && (
          <>
            <ImageCounter 
              currentIndex={currentImageIndex} 
              totalImages={allImages.length} 
            />
            <ThumbnailsList 
              images={allImages}
              currentIndex={currentImageIndex}
              onThumbnailClick={setCurrentImageIndex}
              onSetMainImage={handleSetMainImage}
            />
          </>
        )}
        
        <SpecimenInfoFooter 
          russianName={specimen.russianName}
          latinName={specimen.latinName}
        />
      </div>
      
      <ImageViewModal
        isOpen={isModalOpen}
        onClose={handleCloseImageModal}
        currentImage={currentImage}
        specimenName={specimen.russianName}
        latinName={specimen.latinName}
        onDelete={handleDeleteImage}
        onSetMain={handleSetMainImage}
      />
      
      <ImageUploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        onSave={handleSaveImages}
        onChange={handleImagesChange}
        selectedImages={selectedImages}
        onError={handleUploadError}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
      />
      
      {!isAuthenticated && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <span className="font-medium">📷 Изображения:</span> Авторизуйтесь для управления галереей изображений и загрузки новых фотографий.
          </p>
        </div>
      )}
    </Card>
  );
};

export default SpecimenGallery; 