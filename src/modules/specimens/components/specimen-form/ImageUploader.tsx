import React, { useState, useRef } from 'react';
import { cardClasses } from '@/styles/global-styles';
import { useLogger } from '@/hooks/useLogger';

interface ImageUploaderProps {
  onChange: (files: File[]) => void;
  value?: File[];
  maxImages?: number;
  onError?: (message: string) => void;
}

/**
 * Компонент для загрузки изображений образцов
 */
const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onChange, 
  value = [], 
  maxImages = 5,
  onError
}) => {
  const [previews, setPreviews] = useState<{ id: string; url: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const log = useLogger('ImageUploader');

  // Создаем превью при изменении value
  React.useEffect(() => {
    log.debug('Обновление превью изображений', { 
      filesCount: value.length,
      filesInfo: value.map(f => ({ name: f.name, size: f.size, type: f.type }))
    });
    
    const newPreviews = value.map((file, index) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}-${index}`,
      url: URL.createObjectURL(file)
    }));

    setPreviews(prev => {
      // Очищаем старые URL объекты для освобождения памяти
      log.debug('Очистка старых URL объектов превью', { oldPreviewsCount: prev.length });
      prev.forEach(item => URL.revokeObjectURL(item.url));
      return newPreviews;
    });

    log.debug('Созданы новые превью', { newPreviewsCount: newPreviews.length });

    return () => {
      // Очищаем URL объекты при размонтировании
      log.debug('Очистка URL объектов при размонтировании компонента');
      newPreviews.forEach(item => URL.revokeObjectURL(item.url));
    };
  }, [value, log]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      log.debug('Выбор файлов отменен или файлы не выбраны');
      return;
    }

    const files = Array.from(event.target.files);
    
    log.info('Пользователь выбрал файлы через input', {
      filesCount: files.length,
      maxImages,
      filesInfo: files.map(f => ({
        name: f.name,
        size: f.size,
        type: f.type,
        sizeInMB: (f.size / (1024 * 1024)).toFixed(2)
      }))
    });
    
    // Проверка на количество файлов
    if (files.length > maxImages) {
      const errorMsg = `Максимальное количество изображений: ${maxImages}`;
      log.warn('Превышено максимальное количество файлов', { 
        selectedCount: files.length, 
        maxImages,
        errorMsg 
      });
      onError?.(errorMsg);
      return;
    }
    
    // Проверка типов файлов
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      const errorMsg = 'Пожалуйста, выберите только изображения';
      log.warn('Выбраны файлы неподдерживаемых типов', {
        invalidFiles: invalidFiles.map(f => ({ name: f.name, type: f.type })),
        errorMsg
      });
      onError?.(errorMsg);
      return;
    }
    
    // Проверка размера файлов (максимум 5 МБ на файл)
    const MAX_SIZE_MB = 5;
    const oversizedFiles = files.filter(file => file.size > MAX_SIZE_MB * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      const errorMsg = `Размер каждого изображения не должен превышать ${MAX_SIZE_MB} МБ`;
      log.warn('Файлы превышают максимальный размер', {
        oversizedFiles: oversizedFiles.map(f => ({ 
          name: f.name, 
          size: f.size,
          sizeInMB: (f.size / (1024 * 1024)).toFixed(2)
        })),
        maxSizeMB: MAX_SIZE_MB,
        errorMsg
      });
      onError?.(errorMsg);
      return;
    }

    log.info('Все файлы прошли валидацию, передаем в родительский компонент', {
      validFilesCount: files.length,
      totalSizeInMB: (files.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024)).toFixed(2)
    });

    onChange(files);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.add('border-green-500');
    log.debug('Файлы перетаскиваются над областью загрузки');
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.remove('border-green-500');
    log.debug('Файлы покинули область загрузки');
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.remove('border-green-500');
    
    log.info('Файлы сброшены в область загрузки', {
      filesCount: event.dataTransfer.files?.length || 0
    });
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const allFiles = Array.from(event.dataTransfer.files);
      const files = allFiles.filter(file => file.type.startsWith('image/'));
      
      log.debug('Анализ перетаскиваемых файлов', {
        totalFiles: allFiles.length,
        imageFiles: files.length,
        nonImageFiles: allFiles.length - files.length,
        maxImages
      });
      
      if (files.length === 0) {
        const errorMsg = 'Пожалуйста, выберите только изображения';
        log.warn('Среди перетаскиваемых файлов нет изображений', {
          allFiles: allFiles.map(f => ({ name: f.name, type: f.type })),
          errorMsg
        });
        onError?.(errorMsg);
        return;
      }
      
      if (files.length > maxImages) {
        const errorMsg = `Максимальное количество изображений: ${maxImages}`;
        log.warn('Перетаскиваемые файлы превышают максимальное количество', {
          filesCount: files.length,
          maxImages,
          errorMsg
        });
        onError?.(errorMsg);
        return;
      }
      
      log.info('Перетаскиваемые файлы прошли валидацию', {
        validFilesCount: files.length,
        filesInfo: files.map(f => ({
          name: f.name,
          size: f.size,
          type: f.type,
          sizeInMB: (f.size / (1024 * 1024)).toFixed(2)
        }))
      });
      
      onChange(files);
    }
  };

  const handleRemoveFile = (index: number) => {
    const fileToRemove = value[index];
    log.info('Пользователь удаляет файл', {
      index,
      fileName: fileToRemove?.name,
      fileSize: fileToRemove?.size,
      remainingFilesCount: value.length - 1
    });
    
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange(newFiles);
    
    log.debug('Файл удален из списка', {
      removedFile: fileToRemove?.name,
      newFilesCount: newFiles.length
    });
  };

  const triggerFileInput = () => {
    log.debug('Пользователь кликнул на область загрузки, открываем файловый диалог');
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-6">
      <label className="block text-gray-700 font-semibold mb-2">
        Изображения образца
      </label>
      
      {/* Область для перетаскивания и загрузки файлов */}
      <div 
        className={`${cardClasses.outlined} border-dashed border-2 border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 hover:bg-gray-50`}
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        
        <p className="mt-2 text-sm text-gray-600">
          Перетащите изображения сюда или кликните для выбора
        </p>
        <p className="mt-1 text-xs text-gray-500">
          PNG, JPG, GIF до {maxImages} файлов (макс. 5 МБ каждый)
        </p>
      </div>

      {/* Превью загруженных файлов */}
      {previews.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Выбрано {previews.length} изображений:</p>
          <div className="flex flex-wrap gap-3">
            {previews.map((preview, index) => (
              <div key={preview.id} className="relative">
                <img
                  src={preview.url}
                  alt={`Превью ${index + 1}`}
                  className="h-24 w-24 object-cover rounded-md shadow-sm"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {index === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 bg-green-600 text-white text-xs px-1 py-0.5 text-center rounded-b-md">
                    Основное
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader; 