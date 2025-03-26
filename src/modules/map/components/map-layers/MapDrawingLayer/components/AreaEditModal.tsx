// MapDrawingLayer/components/AreaEditModal.tsx
import React from 'react';
import { Button, Modal, TextField } from '@/modules/ui';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  newAreaName: string;
  setNewAreaName: (name: string) => void;
  newAreaDescription: string;
  setNewAreaDescription: (desc: string) => void;
  onSave: () => void;
}

const AreaEditModal: React.FC<Props> = ({
  isOpen,
  onClose,
  newAreaName,
  setNewAreaName,
  newAreaDescription,
  setNewAreaDescription,
  onSave
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Редактирование области"
      footer={
        <div className="flex justify-end space-x-3">
          <Button variant="neutral" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={onSave}>
            Сохранить
          </Button>
        </div>
      }
      size="small"
      animation="fade"
      closeOnEsc={false}
      closeOnOverlayClick={false}
      className="z-[9999]"
    >
      <div className="space-y-4">
        <TextField
          label="Название области"
          value={newAreaName}
          onChange={(e) => setNewAreaName(e.target.value)}
          fullWidth
          autoFocus
        />
        <TextField
          label="Описание (необязательно)"
          value={newAreaDescription}
          onChange={(e) => setNewAreaDescription(e.target.value)}
          fullWidth
        />
      </div>
    </Modal>
  );
};

export default AreaEditModal;
