import React from 'react';
import Button from '../../../ui/components/Button';

interface ControlButtonsProps {
  onReset: () => void;
  onSave: () => void;
  hasChanges: boolean;
}

/**
 * Компонент с кнопками сброса и сохранения настроек
 */
const ControlButtons: React.FC<ControlButtonsProps> = ({
  onReset,
  onSave,
  hasChanges
}) => {
  if (!hasChanges) {
    return null;
  }

  return (
    <div className="flex justify-between mt-4">
      <Button 
        onClick={onReset} 
        variant="neutral"
        size="small"
      >
        Сбросить
      </Button>
      <Button 
        onClick={onSave} 
        variant="success"
        size="small"
      >
        Сохранить
      </Button>
    </div>
  );
};

export default ControlButtons; 