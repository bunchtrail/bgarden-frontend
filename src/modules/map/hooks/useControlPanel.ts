import { useState, useCallback, useMemo } from 'react';

interface UseControlPanelProps {
  controlPanelPosition?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
}

interface UseControlPanelReturn {
  showControlPanel: boolean;
  toggleControlPanel: () => void;
  controlPanelStyles: string;
}

/**
 * Хук для управления панелью управления карты
 */
export const useControlPanel = ({
  controlPanelPosition = 'topRight'
}: UseControlPanelProps = {}): UseControlPanelReturn => {
  const [showControlPanel, setShowControlPanel] = useState<boolean>(false);
  
  // Переключение панели управления
  const toggleControlPanel = useCallback(() => {
    setShowControlPanel(prev => !prev);
  }, []);

  // Вычисляем позицию панели управления
  const controlPanelStyles = useMemo(() => {
    const baseStyles = 'absolute z-[999]';
    switch(controlPanelPosition) {
      case 'topLeft': return `${baseStyles} top-4 left-4`;
      case 'bottomLeft': return `${baseStyles} bottom-4 left-4`;
      case 'bottomRight': return `${baseStyles} bottom-4 right-4`;
      case 'topRight': 
      default: return `${baseStyles} top-4 right-4`;
    }
  }, [controlPanelPosition]);

  return {
    showControlPanel,
    toggleControlPanel,
    controlPanelStyles
  };
};

export default useControlPanel; 