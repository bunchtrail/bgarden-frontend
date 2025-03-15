import React from 'react';
import { Link } from 'react-router-dom';
import { UserRole } from '../../modules/auth/types';
import { COLORS } from '../../styles/global-styles';

interface Tool {
  id: string;
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
  color: string;
}

// Инструменты для сотрудников
export const employeeTools: Tool[] = [
  {
    id: 'specimens',
    title: 'Каталог растений',
    description: '',
    link: '/specimens',
    color: 'text-[#3882F6]',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
      </svg>
    )
  },
  {
    id: 'map',
    title: 'Карта сада',
    description: '',
    link: '/map',
    color: 'text-[#E97451]',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 0 1 1.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0 1 21.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 0 1-1.676 0l-4.994-2.497a.375.375 0 0 0-.336 0l-3.868 1.935A1.875 1.875 0 0 1 2.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437ZM9 6a.75.75 0 0 1 .75.75V15a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 9 6Zm6.75 3a.75.75 0 0 0-1.5 0v8.25a.75.75 0 0 0 1.5 0V9Z" clipRule="evenodd" />
      </svg>
    )
  },
  {
    id: 'expositions',
    title: 'Экспозиции',
    description: '',
    link: '/expositions',
    color: 'text-[#6366F1]',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.25a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l9.75-5.25Z" />
        <path d="m3.265 10.602 7.668 4.129a2.25 2.25 0 0 0 2.134 0l7.668-4.13 1.37.739a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.71 0l-9.75-5.25a.75.75 0 0 1 0-1.32l1.37-.738Z" />
        <path d="m10.933 19.231-7.668-4.13-1.37.739a.75.75 0 0 0 0 1.32l9.75 5.25c.223.12.489.12.711 0l9.75-5.25a.75.75 0 0 0 0-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 0 1-2.135-.001Z" />
      </svg>
    )
  },
];

// Инструменты для администраторов
export const adminTools: Tool[] = [
  {
    id: 'admin',
    title: 'Административная панель',
    description: '',
    link: '/admin',
    color: 'text-[#30D158]',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
      </svg>
    )
  },
];

interface UserToolsProps {
  userRole?: UserRole;
}

const UserTools: React.FC<UserToolsProps> = ({ userRole }) => {
  return (
    <div className="mt-auto mb-4 pt-4">
      <h3 className="text-lg font-medium text-[#1D1D1F] mb-3 text-center">Инструменты</h3>
      <div className="flex flex-wrap gap-4 justify-center">
        {employeeTools.map((tool) => (
          <Link key={tool.id} to={tool.link} 
                className="flex items-center rounded-full px-5 py-2.5 border border-[#E5E5EA] shadow-sm transition-all duration-500 hover:shadow-md hover:border-[#D1D1D6] hover:bg-[#F9F9FB] group">
            <span className={`text-sm font-medium text-[#1D1D1F] group-hover:${tool.color} transition-colors duration-300`}>{tool.title}</span>
          </Link>
        ))}

        {userRole === UserRole.Administrator && (
          <Link to='/admin' 
                className="flex items-center rounded-full px-5 py-2.5 border border-[#E5E5EA] shadow-sm transition-all duration-500 hover:shadow-md hover:border-[#D1D1D6] hover:bg-[#F9F9FB] group">
            <span className="text-sm font-medium text-[#1D1D1F] group-hover:text-[#30D158] transition-colors duration-300">Административная панель</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default UserTools; 