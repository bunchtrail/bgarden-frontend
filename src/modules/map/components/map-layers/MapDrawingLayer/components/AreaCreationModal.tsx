// MapDrawingLayer/components/AreaCreationModal.tsx
import { Modal, Button, TextField } from '@/modules/ui';
import React from 'react';


interface Props {
  isOpen: boolean;
  onClose: () => void;
  newAreaName: string;
  setNewAreaName: (name: string) => void;
  newAreaDescription: string;
  setNewAreaDescription: (desc: string) => void;
  onSave: () => void;
}

const AreaCreationModal: React.FC<Props> = ({
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
      title="Создание новой области"
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

export default AreaCreationModal;
