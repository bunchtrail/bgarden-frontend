// MapDrawingLayer/components/AreaDeletionModal.tsx
import React from 'react';
import { Button, Modal } from '@/modules/ui';

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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Подтверждение удаления"
      footer={
        <div className="flex justify-end space-x-3">
          <Button variant="neutral" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Удалить
          </Button>
        </div>
      }
      size="small"
      animation="fade"
      closeOnEsc={true}
      closeOnOverlayClick={false}
      className="z-[9999]"
    >
      <div className="space-y-4">
        <p className="text-gray-700">
          Вы действительно хотите удалить область <strong>"{areaName}"</strong>?
        </p>
        <p className="text-sm text-gray-500">Это действие нельзя отменить.</p>
      </div>
    </Modal>
  );
};

export default AreaDeletionModal;
