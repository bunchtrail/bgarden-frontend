import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../../ui/components/Button';
import { SectorType } from '../../types';
import { useAuth } from '../../../auth/hooks';

/**
 * Плавающая кнопка добавления образца для мобильных устройств
 */
const MobileAddButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Получаем текущий выбранный тип сектора из URL
  const getActiveSectorType = (): SectorType | null => {
    const params = new URLSearchParams(location.search);
    const sectorTypeParam = params.get('sectorType');
    return sectorTypeParam ? Number(sectorTypeParam) as SectorType : null;
  };
  
  const activeSectorType = getActiveSectorType();
  
  // Скрываем кнопку для неавторизованных пользователей
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="md:hidden fixed bottom-6 right-6">
      <Button
        variant="success"
        className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
        onClick={() => navigate(activeSectorType !== null 
          ? `/specimens/new?sectorType=${activeSectorType}` 
          : '/specimens/new'
        )}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </Button>
    </div>
  );
};

export default MobileAddButton; 