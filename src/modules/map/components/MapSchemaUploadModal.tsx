import React, { ChangeEvent, useState } from 'react';
import { uploadCustomMapSchema } from '../services/map/schemaService';
import { CreateCustomMapSchemaDto } from '../types';

// Интерфейс для пропсов модального окна
interface MapSchemaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

// Компонент модального окна для загрузки пользовательской схемы карты
export const MapSchemaUploadModal: React.FC<MapSchemaUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  // Состояния для формы
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [southBound, setSouthBound] = useState<string>('');
  const [westBound, setWestBound] = useState<string>('');
  const [northBound, setNorthBound] = useState<string>('');
  const [eastBound, setEastBound] = useState<string>('');

  // Состояния для обработки загрузки
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Если модальное окно закрыто, не рендерим его содержимое
  if (!isOpen) return null;

  // Обработчик выбора файла
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Проверка типа файла
      if (!file.type.match('image.*')) {
        setError('Пожалуйста, выберите изображение');
        return;
      }

      // Проверка размера файла (10MB максимум)
      if (file.size > 10 * 1024 * 1024) {
        setError('Размер файла не должен превышать 10MB');
        return;
      }

      setSelectedFile(file);
      setError(null);

      // Создаем URL для предпросмотра
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Очищаем URL при размонтировании компонента
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  // Валидация формы
  const validateForm = (): boolean => {
    if (!name.trim()) {
      setError('Введите название схемы');
      return false;
    }

    if (!selectedFile) {
      setError('Выберите файл изображения');
      return false;
    }

    // Валидация границ
    if (!southBound || !westBound || !northBound || !eastBound) {
      setError('Укажите все границы изображения');
      return false;
    }

    try {
      const south = parseFloat(southBound);
      const west = parseFloat(westBound);
      const north = parseFloat(northBound);
      const east = parseFloat(eastBound);

      if (isNaN(south) || isNaN(west) || isNaN(north) || isNaN(east)) {
        setError('Границы должны быть числами');
        return false;
      }

      if (south < -90 || south > 90 || north < -90 || north > 90) {
        setError('Широта должна быть в диапазоне от -90 до 90');
        return false;
      }

      if (west < -180 || west > 180 || east < -180 || east > 180) {
        setError('Долгота должна быть в диапазоне от -180 до 180');
        return false;
      }

      if (south >= north) {
        setError('Южная граница должна быть меньше северной');
        return false;
      }

      if (west >= east) {
        setError('Западная граница должна быть меньше восточной');
        return false;
      }
    } catch (e) {
      setError('Ошибка при проверке границ');
      return false;
    }

    return true;
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      if (selectedFile) {
        const schemaData: CreateCustomMapSchemaDto = {
          name,
          description: description.trim() ? description : undefined,
          image: selectedFile,
          bounds: [
            [parseFloat(southBound), parseFloat(westBound)],
            [parseFloat(northBound), parseFloat(eastBound)],
          ],
        };

        const result = await uploadCustomMapSchema(schemaData);

        if (result) {
          setSuccess(true);
          // Очищаем форму
          setName('');
          setDescription('');
          setSelectedFile(null);
          setPreviewUrl(null);
          setSouthBound('');
          setWestBound('');
          setNorthBound('');
          setEastBound('');

          // Вызываем обработчик успешной загрузки
          if (onUploadSuccess) {
            onUploadSuccess();
          }

          // Закрываем модальное окно через 1.5 секунды
          setTimeout(() => {
            onClose();
            setSuccess(false);
          }, 1500);
        } else {
          setError('Не удалось загрузить схему');
        }
      }
    } catch (e) {
      setError('Ошибка при загрузке схемы');
      console.error('Ошибка при загрузке схемы:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='map-schema-upload-modal'>
      <div className='map-schema-upload-overlay' onClick={onClose}></div>
      <div className='map-schema-upload-content'>
        <button className='map-schema-upload-close' onClick={onClose}>
          &times;
        </button>

        <h3>Загрузка схемы карты</h3>

        {success ? (
          <div className='map-schema-upload-success'>
            <i className='fa fa-check-circle'></i>
            <p>Схема успешно загружена!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className='map-schema-upload-error'>{error}</div>}

            <div className='form-group'>
              <label htmlFor='schema-name'>Название схемы *</label>
              <input
                id='schema-name'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Введите название схемы'
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='schema-description'>Описание</label>
              <textarea
                id='schema-description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Введите описание схемы (необязательно)'
                rows={3}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='schema-image'>Изображение схемы *</label>
              <input
                id='schema-image'
                type='file'
                accept='image/*'
                onChange={handleFileSelect}
                required
              />
              <div className='map-schema-upload-hint'>
                Рекомендуемый формат: PNG, JPG. Максимальный размер: 10MB.
              </div>
            </div>

            {previewUrl && (
              <div className='map-schema-upload-preview'>
                <img src={previewUrl} alt='Предпросмотр' />
              </div>
            )}

            <div className='map-schema-upload-bounds'>
              <h4>Географические границы изображения *</h4>
              <div className='bounds-grid'>
                <div className='form-group'>
                  <label htmlFor='north-bound'>Северная широта</label>
                  <input
                    id='north-bound'
                    type='text'
                    value={northBound}
                    onChange={(e) => setNorthBound(e.target.value)}
                    placeholder='90.0'
                    required
                  />
                </div>

                <div className='form-group'>
                  <label htmlFor='west-bound'>Западная долгота</label>
                  <input
                    id='west-bound'
                    type='text'
                    value={westBound}
                    onChange={(e) => setWestBound(e.target.value)}
                    placeholder='-180.0'
                    required
                  />
                </div>

                <div className='form-group'>
                  <label htmlFor='east-bound'>Восточная долгота</label>
                  <input
                    id='east-bound'
                    type='text'
                    value={eastBound}
                    onChange={(e) => setEastBound(e.target.value)}
                    placeholder='180.0'
                    required
                  />
                </div>

                <div className='form-group'>
                  <label htmlFor='south-bound'>Южная широта</label>
                  <input
                    id='south-bound'
                    type='text'
                    value={southBound}
                    onChange={(e) => setSouthBound(e.target.value)}
                    placeholder='-90.0'
                    required
                  />
                </div>
              </div>
              <div className='map-schema-upload-hint'>
                Укажите географические координаты, соответствующие границам
                изображения.
              </div>
            </div>

            <div className='map-schema-upload-actions'>
              <button
                type='button'
                className='map-schema-upload-cancel'
                onClick={onClose}
                disabled={isLoading}
              >
                Отмена
              </button>
              <button
                type='submit'
                className='map-schema-upload-submit'
                disabled={isLoading}
              >
                {isLoading ? 'Загрузка...' : 'Загрузить'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
