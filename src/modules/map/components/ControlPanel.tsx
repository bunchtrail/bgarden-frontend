import React from 'react';
import MapControlPanel from './MapControlPanel';

// Данный компонент сохранен для обратной совместимости
// Используйте MapControlPanel для новой реализации
const ControlPanel: React.FC = () => {
  // Возвращаем новую панель управления
  return <MapControlPanel />;
};

export default ControlPanel;
