import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMapService } from '../../hooks';
import { MapData } from '../../types';

interface MapUploadFormProps {
  mapId: number;
  onSuccess?: (updatedMap: MapData) => void;
  onCancel?: () => void;
}

const MapUploadForm: React.FC<MapUploadFormProps> = ({
  mapId,
  onSuccess,
  onCancel,
}) => {
  const { uploadMapImage } = useMapService();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Обработчик выбора файла
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;

    // Сбрасываем ошибку при выборе нового файла
    setError(null);

    if (selectedFile) {
      // Проверяем тип файла - разрешаем только изображения
      if (!selectedFile.type.startsWith('image/')) {
        setError(
          'Пожалуйста, выберите файл изображения (jpg, png, gif и т.д.)'
        );
        setFile(null);
        setPreview(null);
        return;
      }

      // Устанавливаем выбранный файл
      setFile(selectedFile);

      // Создаем превью изображения
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // Если файл не выбран, сбрасываем state
      setFile(null);
      setPreview(null);
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Пожалуйста, выберите файл для загрузки');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Загружаем файл карты с использованием хука
      const updatedMap = await uploadMapImage(mapId, file);

      // Показываем уведомление об успешной загрузке
      toast.success('Карта успешно загружена');

      // Вызываем коллбэк успешной загрузки, если он предоставлен
      if (onSuccess && updatedMap) {
        onSuccess(updatedMap);
      }
    } catch (err) {
      console.error('Ошибка при загрузке карты:', err);
      setError('Не удалось загрузить карту. Пожалуйста, попробуйте еще раз.');
      toast.error('Ошибка при загрузке карты');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='map-upload-form bg-white p-6 rounded-lg shadow-md'>
      <h3 className='text-xl font-semibold mb-4'>Загрузка изображения карты</h3>

      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block text-gray-700 font-medium mb-2'>
            Выберите файл изображения карты:
          </label>

          <input
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
            disabled={loading}
          />

          {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
        </div>

        {/* Превью изображения */}
        {preview && (
          <div className='mb-4'>
            <p className='text-gray-700 font-medium mb-2'>
              Предварительный просмотр:
            </p>
            <img
              src={preview}
              alt='Превью карты'
              className='max-w-full h-auto rounded-md border border-gray-300'
              style={{ maxHeight: '200px' }}
            />
          </div>
        )}

        <div className='flex justify-end space-x-4'>
          {onCancel && (
            <button
              type='button'
              onClick={onCancel}
              className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors'
              disabled={loading}
            >
              Отмена
            </button>
          )}

          <button
            type='submit'
            className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors'
            disabled={loading || !file}
          >
            {loading ? 'Загрузка...' : 'Загрузить карту'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MapUploadForm;
