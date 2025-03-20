import React from 'react';
import { ControlPanelSection } from './types';
import { cardClasses, textClasses } from '../../../../styles/global-styles';

interface CustomSectionsProps {
  sections?: ControlPanelSection[];
}

/**
 * Компонент для отображения пользовательских секций настроек
 */
const CustomSections: React.FC<CustomSectionsProps> = ({ sections = [] }) => {
  if (!sections || sections.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4 mt-4">
      {sections.map(section => (
        <div key={section.id} className="mb-3">
          {section.title && (
            <h4 className={`${textClasses.subheading} mb-2`}>{section.title}</h4>
          )}
          <div className={`${cardClasses.flat} p-3 rounded-lg`}>
            {section.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomSections; 