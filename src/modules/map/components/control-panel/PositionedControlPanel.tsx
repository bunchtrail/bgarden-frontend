import React from 'react';
import UnifiedControlPanel from './UnifiedControlPanel';
import { UnifiedControlPanelProps } from './types';

/**
 * Wrapper компонент для позиционированной панели управления
 * Обеспечивает стандартное позиционирование и настройки по умолчанию
 */
interface PositionedControlPanelProps
  extends Omit<UnifiedControlPanelProps, 'position'> {
  position?: UnifiedControlPanelProps['position'];
}

const PositionedControlPanel: React.FC<PositionedControlPanelProps> = ({
  position = 'topRight',
  className = '',
  zIndex = 1000,
  collapsible = true,
  defaultExpanded = true,
  ...props
}) => {
  return (
    <UnifiedControlPanel
      position={position}
      className={className}
      zIndex={zIndex}
      collapsible={collapsible}
      defaultExpanded={defaultExpanded}
      {...props}
    />
  );
};

export default PositionedControlPanel;
