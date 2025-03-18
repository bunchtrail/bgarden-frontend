import React from 'react';
import { Specimen, SectorType } from '../../types';
import { sectorTypeColors, statusColors } from '../../styles';
import { animationClasses, textClasses } from '../../../../styles/global-styles';
import ActionButtons from '../specimens-controls/ActionButtons';
import { Card } from '../../../ui';
import { useNavigate } from 'react-router-dom';

interface SpecimenCardProps {
  specimen: Specimen;
  getSectorTypeName: (sectorType: SectorType) => string;
  onDelete: (id: number) => void;
}

/**
 * Компонент карточки образца для отображения в режиме сетки
 */
const SpecimenCard: React.FC<SpecimenCardProps> = ({
  specimen,
  getSectorTypeName,
  onDelete
}) => {
  const navigate = useNavigate();
  const sectorType = specimen.sectorType as SectorType;
  const sectorColor = sectorTypeColors[sectorType] || sectorTypeColors[0];
  
 
  
  const cardHeaderAction = (
    <span 
      className="text-xs text-[#86868B] font-medium bg-white/70 backdrop-blur-sm rounded-full 
        px-2.5 py-1.5 shadow-sm"
      aria-label={`Идентификатор образца: ${specimen.id}`}
    >
      ID: {specimen.id}
    </span>
  );
  
  const cardTitle = specimen.russianName || 'Без названия';
  const cardSubtitle = specimen.latinName;
  
  const headerClassName = `${sectorColor.bg} py-3 border-b border-gray-200`;
  
  // Информационные теги в верхней части
  const renderSectorBadge = () => (
    <span 
      className={`text-xs font-medium px-2.5 py-1.5 bg-white/70 backdrop-blur-sm 
        rounded-full shadow-sm flex items-center space-x-1 ${sectorColor.text} font-semibold`}
      aria-label={`Сектор: ${getSectorTypeName(sectorType)}`}
    >
      {getSectorTypeName(sectorType)}
    </span>
  );
  
  // Дополнительные бейджи (опционально)
  const renderExtraBadges = () => {
    const badges = [];
    
    if (specimen.hasHerbarium) {
      badges.push(
        <span key="herbarium" 
          className={`text-xs font-medium px-2 py-1 ${statusColors.info.bg} ${statusColors.info.text} 
          rounded-full shadow-sm ml-2`}
          aria-label="Имеется гербарий"
        >
          Гербарий
        </span>
      );
    }
    
    return badges.length > 0 ? (
      <div className="flex items-center mt-2">
        {badges}
      </div>
    ) : null;
  };
  
  const footer = (
    <div className="flex justify-end opacity-90 hover:opacity-100 transition-opacity">
      <ActionButtons specimenId={specimen.id} onDelete={onDelete} variant="card" />
    </div>
  );
  
  const renderCardContent = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        {renderSectorBadge()}
        {renderExtraBadges()}
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center">
          <span className={`${textClasses.small} ${textClasses.secondary} uppercase tracking-wider w-24`}>
            Инв. номер
          </span> 
          <span className="bg-[#F5F5F7] px-3 py-1.5 rounded-md text-sm font-medium flex-1 shadow-sm">
            {specimen.inventoryNumber}
          </span>
        </div>
        
        {specimen.latinName && (
          <div className="flex items-center">
            <span className={`${textClasses.small} ${textClasses.secondary} uppercase tracking-wider w-24`}>
              Лат. название
            </span> 
            <span className="text-sm italic flex-1 px-3 py-1.5">
              {specimen.latinName}
            </span>
          </div>
        )}
        
        {specimen.familyName && (
          <div className="flex items-center">
            <span className={`${textClasses.small} ${textClasses.secondary} uppercase tracking-wider w-24`}>
              Семейство
            </span>
            <span className="text-sm flex-1 px-3 py-1.5">
              {specimen.familyName}
            </span>
          </div>
        )}
        
        {specimen.regionName && (
          <div className="flex items-center">
            <span className={`${textClasses.small} ${textClasses.secondary} uppercase tracking-wider w-24`}>
              Регион
            </span>
            <span className="text-sm flex-1 px-3 py-1.5">
              {specimen.regionName}
            </span>
          </div>
        )}
        
        {specimen.expositionName && (
          <div className="flex items-center">
            <span className={`${textClasses.small} ${textClasses.secondary} uppercase tracking-wider w-24`}>
              Экспозиция
            </span>
            <span className="text-sm flex-1 px-3 py-1.5">
              {specimen.expositionName}
            </span>
          </div>
        )}
      </div>
    </>
  );

  return (
    <Card
      className={`${animationClasses.transition} group overflow-hidden backdrop-blur-md 
        hover:shadow-lg hover:border-[#0A84FF]/20`}
      headerClassName={headerClassName}
      title={cardTitle}
      subtitle={cardSubtitle}
      headerAction={cardHeaderAction}
      footer={footer}
    >
      {renderCardContent()}
    </Card>
  );
};

export default SpecimenCard; 