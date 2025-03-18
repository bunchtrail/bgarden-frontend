import React from 'react';
import { Button } from '../../../ui';

interface ErrorViewProps {
  error: string;
  onRefresh: () => void;
  variant?: 'danger' | 'warning';
}

const ErrorView: React.FC<ErrorViewProps> = ({ 
  error, 
  onRefresh, 
  variant = 'danger'
}) => {
  const backgroundColor = variant === 'danger' ? 'bg-red-50' : 'bg-yellow-50';
  const textColor = variant === 'danger' ? 'text-red-600' : 'text-yellow-600';
  const buttonVariant = variant === 'danger' ? 'primary' : 'secondary';

  return (
    <div className="p-8 text-center">
      <div className={`inline-block p-4 mb-4 rounded-xl ${backgroundColor} ${textColor}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-center">{error}</p>
      </div>
      <Button 
        variant={buttonVariant} 
        onClick={onRefresh}
      >
        Обновить страницу
      </Button>
    </div>
  );
};

export default ErrorView; 