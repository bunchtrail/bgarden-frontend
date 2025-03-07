import React from 'react';
import { Specimen, SpecimenFormData } from '../types';
import { SpecimenForm } from './SpecimenForm';
import { headingClasses } from './styles';

interface SpecimenFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Specimen | null;
  isLoading?: boolean;
  onSave: (data: any) => Promise<void>;
  familyOptions: { id: number; name: string }[];
  expositionOptions: { id: number; name: string }[];
  regionOptions: { id: number; name: string }[];
}

/**
 * Компонент модального окна для добавления/редактирования образца
 */
export const SpecimenFormModal: React.FC<SpecimenFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
  isLoading = false,
  onSave,
  familyOptions,
  expositionOptions,
  regionOptions,
}) => {
  // Если модальное окно закрыто, не рендерим его содержимое
  if (!isOpen) return null;

  const isEditMode = initialData && initialData.id > 0;
  const modalTitle = isEditMode
    ? 'Редактировать образец'
    : 'Добавить новый образец';

  const handleSubmit = async (data: SpecimenFormData) => {
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Ошибка при сохранении образца:', error);
      // Ошибка уже должна быть обработана в родительском компоненте
    }
  };

  return (
    <div
      className='fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4'
      onClick={(e) => {
        // Закрываем модальное окно при клике на затемненный фон
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className='bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className={headingClasses.base}>{modalTitle}</h2>
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700 focus:outline-none'
              disabled={isLoading}
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>

          <SpecimenForm
            initialData={initialData || undefined}
            onSave={handleSubmit}
            onCancel={onClose}
            isLoading={isLoading}
            familyOptions={familyOptions}
            expositionOptions={expositionOptions}
            regionOptions={regionOptions}
          />
        </div>
      </div>
    </div>
  );
};
