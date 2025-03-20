import React from 'react';
import { COLORS } from '@/styles/global-styles';

interface InfoBlockProps {
  title: string;
  content: string;
  type?: 'info' | 'warning' | 'error';
}

interface StyleSet {
  bg: string;
  border: string;
  titleColor: string;
  contentColor: string;
  iconColor: string;
}

export const InfoBlock: React.FC<InfoBlockProps> = ({ title, content, type = 'info' }) => {
  const getTypeStyles = (): StyleSet => {
    switch (type) {
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-100',
          titleColor: 'text-blue-700',
          contentColor: 'text-blue-600',
          iconColor: 'text-blue-600'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-100',
          titleColor: 'text-yellow-700',
          contentColor: 'text-yellow-600',
          iconColor: 'text-yellow-600'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-100',
          titleColor: 'text-red-700',
          contentColor: 'text-red-600',
          iconColor: 'text-red-600'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-100',
          titleColor: 'text-blue-700',
          contentColor: 'text-blue-600',
          iconColor: 'text-blue-600'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className={`mt-6 p-4 ${styles.bg} rounded-lg border ${styles.border} animate__animated animate__fadeIn`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className={`w-5 h-5 ${styles.iconColor}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
          </svg>
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${styles.titleColor}`}>{title}</h3>
          <div className={`mt-2 text-sm ${styles.contentColor}`}>
            <p>{content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 