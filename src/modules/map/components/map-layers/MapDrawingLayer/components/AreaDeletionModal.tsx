// MapDrawingLayer/components/AreaDeletionModal.tsx
import React from 'react';
import { Button } from '@/modules/ui';
import { cardClasses, textClasses } from '@/styles/global-styles';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  areaName: string;
  onConfirm: () => void;
}

const AreaDeletionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  areaName,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup Card */}
      <div className={`
        relative max-w-md w-full mx-4 
        ${cardClasses.base} ${cardClasses.elevated}
        transform transition-all duration-300 scale-100
        animate-fadeIn
      `}>
        {/* Header */}
        <div className={cardClasses.header}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 className={`${textClasses.heading} text-lg`}>
                Удаление области
              </h3>
              <p className={`${textClasses.secondary} text-sm`}>
                Это действие нельзя отменить
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={cardClasses.content}>
          <p className={`${textClasses.body} ${textClasses.primary} leading-relaxed`}>
            Вы действительно хотите удалить область{' '}
            <span className="font-semibold text-red-600">"{areaName}"</span>?
          </p>
          <p className={`${textClasses.small} ${textClasses.secondary} mt-2`}>
            Все данные, связанные с этой областью, будут безвозвратно удалены.
          </p>
        </div>

        {/* Footer */}
        <div className={`${cardClasses.footer} flex justify-end space-x-3`}>
          <Button 
            variant="neutral" 
            onClick={onClose}
            className="px-6"
          >
            Отмена
          </Button>
          <Button 
            variant="danger" 
            onClick={onConfirm}
            className="px-6"
          >
            Удалить
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AreaDeletionModal;
