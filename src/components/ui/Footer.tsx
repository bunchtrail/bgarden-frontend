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
    <footer className={footerClasses.base}>
      <div className={footerClasses.container}>
        <div className="flex justify-between items-center">
          <div className={footerClasses.content}>
            © {year} {companyName}. Все права защищены.
          </div>
          <div className='flex space-x-3'>
            <Link to='/' className='text-gray-600 hover:text-blue-600 text-xs'>
              Главная
            </Link>
            <Link
              to='/about'
              className='text-gray-600 hover:text-blue-600 text-xs'
            >
              О нас
            </Link>
            <Link
              to='/contact'
              className='text-gray-600 hover:text-blue-600 text-xs'
            >
              Контакты
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
