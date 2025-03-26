import { useState, useEffect, useCallback } from 'react';
import { specimenService } from '../services/specimenService';

/**
 * Хук для получения основного изображения образца
 * @param specimenId ID образца
 * @param imageUrl опциональный URL изображения (используется, если не удалось загрузить с сервера)
 * @param loadOnMount загружать ли изображение при монтировании компонента (по умолчанию true)
 * @returns объект с URL изображения, состоянием загрузки и методом для принудительной загрузки
 */
export const useSpecimenImage = (
  specimenId: number, 
  imageUrl?: string | null, 
  loadOnMount: boolean = true
) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(loadOnMount);
  const placeholderImage = '/images/specimens/placeholder.jpg';
  
  const fetchSpecimenImage = useCallback(async () => {
    try {
      setIsLoading(true);
      const imageData = await specimenService.getSpecimenMainImage(specimenId);
      
      if (imageData && imageData.imageDataBase64) {
        setImageSrc(`data:${imageData.contentType};base64,${imageData.imageDataBase64}`);
      } else {
        setImageSrc(imageUrl || placeholderImage);
      }
    } catch (error) {
      console.error(`Ошибка при загрузке изображения образца ID=${specimenId}:`, error);
      setImageSrc(imageUrl || placeholderImage);
    } finally {
      setIsLoading(false);
    }
  }, [specimenId, imageUrl]);

  useEffect(() => {
    if (loadOnMount) {
      fetchSpecimenImage();
    }
  }, [loadOnMount, fetchSpecimenImage]);

  // Обработчик ошибки загрузки изображения
  const handleImageError = useCallback(() => {
    setImageSrc(placeholderImage);
  }, []);

  return {
    imageSrc,
    isLoading,
    fetchImage: fetchSpecimenImage,
    handleImageError,
    placeholderImage
  };
};

export default useSpecimenImage; 