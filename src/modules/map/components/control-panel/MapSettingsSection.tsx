import React from 'react';
import { useMapConfig } from '../../contexts/MapConfigContext';
import { Switch } from '../../../ui/components/Form';
import { cardClasses, textClasses } from '../../../../styles/global-styles';

interface MapSettingsSectionProps {
  showTooltipToggle?: boolean;
  showClusteringToggle?: boolean;
  onConfigChange: (key: string, value: boolean | string | number) => void;
}

/**
 * Компонент секции основных настроек карты
 */
const MapSettingsSection: React.FC<MapSettingsSectionProps> = ({
  showTooltipToggle = true,
  showClusteringToggle = true,
  onConfigChange
}) => {
  const { mapConfig } = useMapConfig();

  return (
    <div>
      <h4 className={`${cardClasses.title} ${textClasses.secondary} mb-2`}>Настройки карты</h4>
      <div className={`${cardClasses.flat} p-3 rounded-lg space-y-3`}>
        {showTooltipToggle && (
          <Switch 
            label="Показывать подсказки"
            checked={mapConfig.showTooltips}
            onChange={() => onConfigChange('showTooltips', !mapConfig.showTooltips)}
          />
        )}

        {showClusteringToggle && (
          <Switch 
            label="Группировать маркеры"
            checked={mapConfig.enableClustering}
            onChange={() => onConfigChange('enableClustering', !mapConfig.enableClustering)}
          />
        )}
      </div>
    </div>
  );
};

export default MapSettingsSection; 