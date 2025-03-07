import React from 'react';

export const MenuIcon: React.FC = () => (
  <svg
    className='h-5 w-5'
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M4 6h16M4 12h16M4 18h16'
    />
  </svg>
);

export const CloseIcon: React.FC = () => (
  <svg
    className='h-5 w-5'
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M6 18L18 6M6 6l12 12'
    />
  </svg>
);

export const HomeIcon: React.FC = () => (
  <svg
    className='h-5 w-5'
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    />
  </svg>
);
