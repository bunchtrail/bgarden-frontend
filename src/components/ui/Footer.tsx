import React from 'react';
import { Link } from 'react-router-dom';
import { footerClasses } from '../../styles/global-styles';

interface FooterProps {
  year?: number;
  companyName?: string;
}

const Footer: React.FC<FooterProps> = ({
  year = new Date().getFullYear(),
  companyName = 'Ботанический сад',
}) => {
  return (
    <footer className={footerClasses.footer}>
      <div className={footerClasses.container}>
        <div className={footerClasses.content}>
          © {year} {companyName}. Все права защищены.
        </div>
        <div className='flex justify-center mt-2 space-x-4'>
          <Link to='/' className='text-gray-600 hover:text-blue-600 text-sm'>
            Главная
          </Link>
          <Link
            to='/about'
            className='text-gray-600 hover:text-blue-600 text-sm'
          >
            О нас
          </Link>
          <Link
            to='/contact'
            className='text-gray-600 hover:text-blue-600 text-sm'
          >
            Контакты
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
