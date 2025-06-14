import React from 'react';
import { specimenDisplayStyles } from '../../styles';

interface InfoFieldProps {
  label: string;
  value: string | number | boolean | null | undefined;
  type?: 'default' | 'coordinates' | 'boolean' | 'highlight';
  coordinateType?: 'geographic' | 'schematic';
  className?: string;
}

/**
 * Универсальный компонент для отображения информационного поля
 * Убирает дублирование стилей в карточках образца
 */
const InfoField: React.FC<InfoFieldProps> = ({ 
  label, 
  value, 
  type = 'default',
  coordinateType = 'geographic',
  className = '' 
}) => {
  // Не отображаем поле если значение пустое
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const getValueClasses = () => {
    switch (type) {
      case 'coordinates':
        return specimenDisplayStyles.coordinates[coordinateType];
      case 'boolean':
        return value ? specimenDisplayStyles.boolean.yes : specimenDisplayStyles.boolean.no;
      case 'highlight':
        return specimenDisplayStyles.content.highlight;
      default:
        return specimenDisplayStyles.infoField.value;
    }
  };

  const formatValue = () => {
    if (type === 'boolean') {
      return value ? 'Да' : 'Нет';
    }
    return String(value);
  };

  return (
    <div className={`${specimenDisplayStyles.infoField.container} ${className}`}>
      <div className={specimenDisplayStyles.infoField.label}>{label}</div>
      <div className={getValueClasses()}>{formatValue()}</div>
    </div>
  );
};

export default InfoField; 