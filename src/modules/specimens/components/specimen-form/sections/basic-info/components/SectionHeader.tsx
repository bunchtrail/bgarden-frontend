import React from 'react';
import { textClasses } from '@/styles/global-styles';

interface SectionHeaderProps {
  title: string;
  description?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-6">
      <h3 className={`text-xl font-semibold mb-4 text-green-700 border-b pb-2 ${textClasses.heading}`}>
        {title}
      </h3>
      
      {description && (
        <p className={`${textClasses.body} ${textClasses.secondary} mb-4`}>
          {description}
        </p>
      )}
    </div>
  );
}; 