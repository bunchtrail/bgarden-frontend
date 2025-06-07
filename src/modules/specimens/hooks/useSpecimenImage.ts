import { useState, useEffect, useCallback } from 'react';
import { specimenService } from '../services/specimenService';
import { UploadImageOptions } from '../services/specimenService';
import { SpecimenImage, BatchImageUploadResult } from '../types';
import httpClient from '../../../services/httpClient';

/**
 * Хук для работы с изображениями образца
 * 
 * РЕКОМЕНДУЕТСЯ ИСПОЛЬЗОВАТЬ ЭТОТ ХУК для всех операций по управлению изображениями образцов.
 * Он предоставляет единый интерфейс для работы с изображениями и содержит всю необходимую логику.
 * 
 * Преимущества использования:
 * - Единообразный подход к работе с изображениями во всем приложении
 * - Управление состоянием загрузки, прогрессом и ошибками
 * - Автоматическое обновление отображения после загрузки
 * 
 * Пример использования:
 * ```
 * const { uploadImage, fetchSpecimenImage, imageSrc, isLoading } = useSpecimenImage(specimenId);
 * await uploadImage(files, { isMain: true });
 * ```
 * 
 * @param specimenId ID образца
 * @param imageUrl опциональный URL изображения (используется, если не удалось загрузить с сервера)
 * @param loadOnMount загружать ли изображение при монтировании компонента (по умолчанию true)
 * @returns объект с методами и данными для работы с изображениями образца
 */
export const useSpecimenImage = (
  specimenId: number, 
  imageUrl?: string | null, 
  loadOnMount: boolean = true
) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(loadOnMount);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const placeholderImage = '/images/specimens/placeholder.jpg';
  
  // Получение основного изображения образца
  const fetchSpecimenImage = useCallback(async () => {
    try {
      setIsLoading(true);
      const imageData = await specimenService.getSpecimenMainImage(specimenId);
      
      if (imageData && imageData.imageUrl) {
        setImageSrc(imageData.imageUrl);
      } else {
        console.log(`Для образца ID=${specimenId} используется изображение по умолчанию`);
        setImageSrc(imageUrl || placeholderImage);
      }
    } catch (error) {
      console.error(`Ошибка при загрузке изображения образца ID=${specimenId}:`, error);
      setImageSrc(imageUrl || placeholderImage);
    } finally {
      setIsLoading(false);
    }
  }, [specimenId, imageUrl, placeholderImage]);

  // Загрузка всех изображений образца
  const fetchAllSpecimenImages = useCallback(async () => {
    try {
      setIsLoading(true);
      return await specimenService.getSpecimenImages(specimenId);
    } catch (error) {
      console.error(`Ошибка при загрузке всех изображений образца ID=${specimenId}:`, error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [specimenId]);

  // Загрузка нового изображения для образца
  const uploadImage = useCallback(async (
    file: File | File[],
    options: UploadImageOptions = {}
  ) => {
    try {
      setIsUploading(true);
      
      // Опции по умолчанию
      const { isMain = false, description = '' } = options;
      
      // Обработка прогресса загрузки
      const onProgress = (progress: number) => {
        setUploadProgress(progress);
      };
      
      // Реализация загрузки изображений
      if (Array.isArray(file)) {
        console.log(`Начинаем множественную загрузку ${file.length} изображений для образца ID=${specimenId}`);
        
        const formData = new FormData();
        formData.append('SpecimenId', specimenId.toString());
        formData.append('IsMain', isMain.toString());
        
        if (description) {
          formData.append('Description', description);
        }
        
        // Добавляем файлы в FormData
        file.forEach(f => {
          formData.append('Files', f, f.name);
          console.log(`Добавлено изображение для загрузки: ${f.name}, ${f.type}, ${f.size} байт`);
        });
        
        // Отправляем запрос
        const result = await httpClient.post<BatchImageUploadResult>(
          'specimen-images/batch-upload',
          formData,
          {
            onUploadProgress: (progressEvent) => {
              if (onProgress && progressEvent.total) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentCompleted);
              }
            }
          }
        );
        
        // Обновляем текущее изображение, если загруженное изображение основное
        if (isMain) {
          fetchSpecimenImage();
        }
        
        return result;
      } else if (file instanceof File) {
        // Загрузка одного файла
        console.log(`Загрузка одиночного файла для образца ID=${specimenId}: ${file.name}`);
        
        const formData = new FormData();
        formData.append('SpecimenId', specimenId.toString());
        formData.append('IsMain', isMain.toString());
        formData.append('Files', file, file.name);
        
        if (description) {
          formData.append('Description', description);
        }
        
        // Отправляем запрос
        const result = await httpClient.post<BatchImageUploadResult>(
          'specimen-images/batch-upload',
          formData,
          {
            onUploadProgress: (progressEvent) => {
              if (onProgress && progressEvent.total) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentCompleted);
              }
            }
          }
        );
        
        // Обновляем текущее изображение, если загруженное изображение основное
        if (isMain) {
          fetchSpecimenImage();
        }
        
        // Если загрузка успешна, возвращаем первое изображение
        if (result.successCount > 0 && result.uploadedImageIds.length > 0) {
          const imageId = result.uploadedImageIds[0];
          const image = await specimenService.getSpecimenImageById(imageId);
          return image || result;
        }
        
        return result;
      }
      
      throw new Error('Неподдерживаемый тип данных для загрузки изображения');
    } catch (error) {
      console.error(`Ошибка при загрузке изображения для образца ID=${specimenId}:`, error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [specimenId, fetchSpecimenImage]);

  // Установка изображения как основного
  const setImageAsMain = useCallback(async (imageId: number) => {
    try {
      setIsLoading(true);
      console.log(`Установка изображения ID=${imageId} как основного`);
      
      // Используем PATCH запрос к эндпоинту /api/specimen-images/{id}/set-as-main
      const result = await httpClient.patch<SpecimenImage>(
        `specimen-images/${imageId}/set-as-main`, 
        {}
      );
      
      // Обновляем отображаемое изображение
      fetchSpecimenImage();
      
      return result;
    } catch (error) {
      console.error(`Ошибка при установке изображения ID=${imageId} как основного:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [specimenId, fetchSpecimenImage]);

  // Удаление изображения
  const deleteImage = useCallback(async (imageId: number) => {
    try {
      setIsLoading(true);
      const result = await specimenService.deleteSpecimenImage(imageId);
      
      // Обновляем изображение, если мы удалили основное изображение
      if (result) {
        fetchSpecimenImage();
      }
      
      return result;
    } catch (error) {
      console.error(`Ошибка при удалении изображения ID=${imageId}:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [specimenId, fetchSpecimenImage]);

  // Обработчик ошибки загрузки изображения
  const handleImageError = useCallback(() => {
    setImageSrc(placeholderImage);
  }, []);

  // Загрузка изображения при монтировании компонента
  useEffect(() => {
    if (loadOnMount) {
      fetchSpecimenImage();
    }
  }, [loadOnMount, fetchSpecimenImage]);

  return {
    imageSrc,
    isLoading,
    isUploading,
    uploadProgress,
    fetchImage: fetchSpecimenImage,
    fetchAllImages: fetchAllSpecimenImages,
    uploadImage,
    setImageAsMain,
    deleteImage,
    handleImageError,
    placeholderImage
  };
};

export default useSpecimenImage; 