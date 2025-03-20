import { useState, useCallback, useMemo } from 'react';

interface UseControlPanelProps {
  controlPanelPosition?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
}

interface UseControlPanelReturn {
  showControlPanel: boolean;
  toggleControlPanel: () => void;
  controlPanelStyles: Record<string, string>;
}

/**
 * Хук для управления панелью управления карты
 */
export const useControlPanel = ({
  controlPanelPosition = 'topRight'
}: UseControlPanelProps = {}): UseControlPanelReturn => {
  const [showControlPanel, setShowControlPanel] = useState<boolean>(true);
  
  // Переключение панели управления
  const toggleControlPanel = useCallback(() => {
    setShowControlPanel(prev => !prev);
  }, []);

  // Вычисляем позицию панели управления
  const controlPanelStyles = useMemo(() => {
    const baseStyles = 'absolute z-[999]';
    const containerStyle = (() => {
      switch(controlPanelPosition) {
        case 'topLeft': return `${baseStyles} top-4 left-4`;
        case 'bottomLeft': return `${baseStyles} bottom-4 left-4`;
        case 'bottomRight': return `${baseStyles} bottom-4 right-4`;
        case 'topRight': 
        default: return `${baseStyles} top-4 right-4`;
      }
    })();
    
    return {
      container: containerStyle,
      panel: 'bg-white rounded-lg shadow-lg p-4 mt-2'
    };
  }, [controlPanelPosition]);

  return {
    showControlPanel,
    toggleControlPanel,
    controlPanelStyles
  };
};

export default useControlPanel; 