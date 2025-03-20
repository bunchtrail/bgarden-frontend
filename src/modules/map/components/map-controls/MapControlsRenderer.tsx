import React, { ReactNode } from 'react';
import { MAP_STYLES } from '../../styles';
import Button from '../../../ui/components/Button';
import { cardClasses, textClasses } from '../../../../styles/global-styles';

interface MapControlsRendererProps {
  showControls: boolean;
  controlPanelStyles: Record<string, string>;
  toggleControlPanel: () => void;
  showControlPanel: boolean;
  extraControls?: ReactNode;
}

/**
 * Компонент для отображения элементов управления картой
 * Отвечает за отображение панели управления и дополнительных элементов управления
 */
const MapControlsRenderer: React.FC<MapControlsRendererProps> = ({
  showControls,
  controlPanelStyles,
  toggleControlPanel,
  showControlPanel,
  extraControls
}) => {
  if (!showControls) return null;

  return (
    <div className="absolute top-4 right-4 z-50">
      <div className={controlPanelStyles.container}>
        <Button 
          variant="neutral"
          size="small"
          className="w-10 h-10 flex items-center justify-center rounded-full"
          onClick={toggleControlPanel}
          aria-label="Переключить панель управления"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            {showControlPanel ? (
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M14.293 5.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 9.586l4.293-4.293z" 
              />
            ) : (
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
              />
            )}
          </svg>
        </Button>
        
        {showControlPanel && (
          <div className={`${MAP_STYLES.controlPanel} mt-2`}>
            {extraControls || (
              <div className={`p-2 text-center`}>
                <p className={`${textClasses.body} ${textClasses.secondary}`}>Панель управления картой</p>
                <p className={`${textClasses.small} text-red-500 mt-1`}>Отсутствуют элементы управления</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapControlsRenderer; 