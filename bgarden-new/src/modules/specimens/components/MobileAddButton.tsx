import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../ui/components/Button';

/**
 * Плавающая кнопка добавления образца для мобильных устройств
 */
const MobileAddButton: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="md:hidden fixed bottom-6 right-6">
      <Button
        variant="success"
        className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
        onClick={() => navigate('/specimens/new')}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </Button>
    </div>
  );
};

export default MobileAddButton; 