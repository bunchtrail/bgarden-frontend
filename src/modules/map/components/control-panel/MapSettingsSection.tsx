import React from 'react';
import { useMapConfig } from '../../contexts/MapConfigContext';
import { Switch } from '../../../ui/components/Form';
import { cardClasses, textClasses } from '../../../../styles/global-styles';

interface MapSettingsSectionProps {
  showTooltipToggle?: boolean;
  showClusteringToggle?: boolean;
  showDrawingToggle?: boolean;
  showPopupToggle?: boolean;
  onConfigChange?: (key: string, value: boolean | string | number) => void;
}

/**
 * Компонент секции основных настроек карты
 */
const MapSettingsSection: React.FC<MapSettingsSectionProps> = ({
  showTooltipToggle = true,
  showClusteringToggle = true,
  showDrawingToggle = true,
  showPopupToggle = true,
  onConfigChange
}) => {
  const { mapConfig, updateMapConfig } = useMapConfig();

  const handleConfigChange = (key: string, value: boolean | string | number) => {
    updateMapConfig({ [key]: value });
    onConfigChange?.(key, value);
  };

  return (
    <div>
      <h4 className={`${cardClasses.title} ${textClasses.secondary} mb-2`}>Настройки карты</h4>
      <div className={`${cardClasses.flat} p-3 rounded-lg space-y-3`}>
        {showTooltipToggle && (
          <Switch 
            label="Показывать подсказки"
            checked={mapConfig.showTooltips}
            onChange={() => handleConfigChange('showTooltips', !mapConfig.showTooltips)}
          />
        )}

        {showClusteringToggle && (
          <Switch 
            label="Группировать маркеры"
            checked={mapConfig.enableClustering}
            onChange={() => handleConfigChange('enableClustering', !mapConfig.enableClustering)}
          />
        )}
        
        {showPopupToggle && (
          <Switch 
            label="Информация по клику"
            checked={mapConfig.showPopupOnClick}
            onChange={() => handleConfigChange('showPopupOnClick', !mapConfig.showPopupOnClick)}
          />
        )}
        
        {showDrawingToggle && (
          <Switch 
            label="Создание областей"
            checked={mapConfig.drawingEnabled}
            onChange={() => handleConfigChange('drawingEnabled', !mapConfig.drawingEnabled)}
          />
        )}
      </div>
    </div>
  );
};

export default MapSettingsSection; 