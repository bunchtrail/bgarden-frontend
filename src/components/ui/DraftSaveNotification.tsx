import React from 'react';

interface DraftSaveNotificationProps {
  isVisible: boolean;
}

export const DraftSaveNotification: React.FC<DraftSaveNotificationProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 transform transition-all duration-300 ease-in-out">
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-green-200 text-green-700 px-4 py-2 rounded-lg shadow-sm">
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span className="text-sm font-medium">Черновик сохранен</span>
      </div>
    </div>
  );
}; 