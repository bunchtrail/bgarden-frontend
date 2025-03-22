import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../ui/components/Button';
import { Modal } from '../../../ui';
import { animationClasses } from '@/styles/global-styles';

interface ActionButtonsProps {
  specimenId: number;
  onDelete: (id: number) => void;
  variant?: 'card' | 'row';
}

/**
 * Компонент с кнопками действий для управления образцом
 */
const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  specimenId, 
  onDelete,
  variant = 'card'
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // В режиме строки таблицы показываем только иконки без текста
  const showText = variant === 'card';
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Останавливаем всплытие события
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = () => {
    onDelete(specimenId);
    setIsDeleteModalOpen(false);
  };
  
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };
  
  return (
    <>
      <div className={`flex ${variant === 'card' ? 'flex-wrap gap-3' : 'justify-end items-center space-x-1'}`}>
        <Button
          variant="neutral"
          size="small"
          onClick={handleDeleteClick}
          className={`flex items-center ${variant === 'card' ? '!px-3 py-1.5' : '!p-1.5'} rounded-md shadow-sm hover:shadow-md group ${animationClasses.transition}`}
        >
          <svg className="w-4 h-4 mr-1.5 text-red-500 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {showText && <span className="whitespace-nowrap text-gray-700 font-medium group-hover:text-red-600">Удалить</span>}
        </Button>
      </div>
      
      {/* Модальное окно подтверждения удаления */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        title="Подтверждение удаления"
        size="small"
        blockScroll={false}
        variant="elevated"
        animation="fade"
        footer={
          <div className="flex justify-end space-x-3">
            <Button 
              variant="neutral" 
              onClick={handleCancelDelete}
            >
              Отмена
            </Button>
            <Button 
              variant="danger" 
              onClick={handleConfirmDelete}
            >
              Удалить
            </Button>
          </div>
        }
      >
        <p className="mb-4">Вы действительно хотите удалить образец с ID: {specimenId}?</p>
        <p className="text-red-600 text-sm">Это действие нельзя будет отменить.</p>
      </Modal>
    </>
  );
};

export default ActionButtons; 