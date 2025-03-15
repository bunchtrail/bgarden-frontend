import React from 'react';
import { useAuth } from '../../auth/contexts/AuthContext';
import { Link } from 'react-router-dom';

const WelcomeUser: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return null;

  return (
    <div className="mb-6 rounded-lg bg-green-50 p-4 shadow-md">
      <h2 className="mb-2 text-xl font-semibold text-green-800">
        Добро пожаловать, {user.fullName || user.username}!
      </h2>
      <p className="mb-3 text-gray-600">
        Рады видеть вас снова в нашем Ботаническом саду.
      </p>
      <div className="flex space-x-3">
        <Link 
          to="/profile" 
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Мой профиль
        </Link>
        <Link 
          to="/favorites" 
          className="rounded border border-green-600 px-4 py-2 text-green-600 hover:bg-green-50"
        >
          Избранные растения
        </Link>
      </div>
    </div>
  );
};

export default WelcomeUser; 