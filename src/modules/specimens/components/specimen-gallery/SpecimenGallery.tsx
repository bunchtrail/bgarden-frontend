import React from 'react';
import { Specimen } from '../../types';
import { 
  galleryContainerStyles,
  galleryHeaderStyles,
  mainImageStyles,
  imageCounterStyles,
  thumbnailStyles,
  specimenInfoStyles,
  imageViewModalStyles,
  imageUploadModalStyles,
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

interface SpecimenGalleryProps {
  specimen: Specimen;
}

/**
 * Компонент галереи для отображения нескольких фотографий образца
 */
const SpecimenGallery: React.FC<SpecimenGalleryProps> = ({ specimen }) => {
  // Используем кастомный хук для логики работы с изображениями
  const {
    allImages,
    isLoading,
    error,
    currentImageIndex,
    selectedImageId,
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
  
  if (error) {
    return (
      <Card className={errorStateStyles.container}>
        <ErrorState message={error} onRetry={reloadImages} />
      </Card>
    );
  }
  
  return (
    <Card className={`${galleryContainerStyles.wrapper} p-4`}>
      <GalleryHeader onAddClick={handleOpenUploadModal} />
      
      <div className="flex flex-col items-center">
        <div className={mainImageStyles.container}>
          <MainImageDisplay
            isLoading={isLoading}
            images={allImages}
            currentImageIndex={currentImageIndex}
            specimenName={specimen.russianName}
            latinName={specimen.latinName}
            onImageClick={handleOpenImageModal}
            onPrevClick={handlePrevImage}
            onNextClick={handleNextImage}
            onImageError={handleImageError}
          />
        </div>
        
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
    </Card>
  );
};

export default SpecimenGallery; 