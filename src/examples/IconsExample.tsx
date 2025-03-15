import React from 'react';
import * as Icons from '../components/icons';
import { COLORS } from '../styles/global-styles';

// Группировка иконок по категориям
const iconCategories = {
  Навигация: [
    { name: 'FirstPageIcon', icon: Icons.FirstPageIcon },
    { name: 'LastPageIcon', icon: Icons.LastPageIcon },
    { name: 'NavigateBeforeIcon', icon: Icons.NavigateBeforeIcon },
    { name: 'NavigateNextIcon', icon: Icons.NavigateNextIcon },
    { name: 'HomeIcon', icon: Icons.HomeIcon },
    { name: 'MenuIcon', icon: Icons.MenuIcon },
    { name: 'CloseIcon', icon: Icons.CloseIcon },
  ],
  Действия: [
    { name: 'AddIcon', icon: Icons.AddIcon },
    { name: 'DeleteIcon', icon: Icons.DeleteIcon },
    { name: 'EditIcon', icon: Icons.EditIcon },
    { name: 'SaveIcon', icon: Icons.SaveIcon },
    { name: 'CancelIcon', icon: Icons.CancelIcon },
    { name: 'PrintIcon', icon: Icons.PrintIcon },
    { name: 'FileDownloadIcon', icon: Icons.FileDownloadIcon },
    { name: 'ExitToAppIcon', icon: Icons.ExitToAppIcon },
  ],
  Поиск: [
    { name: 'SearchIcon', icon: Icons.SearchIcon },
    { name: 'FilterListIcon', icon: Icons.FilterListIcon },
    { name: 'SortUpIcon', icon: Icons.SortUpIcon },
    { name: 'SortDownIcon', icon: Icons.SortDownIcon },
  ],
  Состояния: [
    { name: 'VisibilityIcon', icon: Icons.VisibilityIcon },
    { name: 'InfoIcon', icon: Icons.InfoIcon },
    { name: 'LeafIcon', icon: Icons.LeafIcon },
    { name: 'MonitorHeartIcon', icon: Icons.MonitorHeartIcon },
    { name: 'NoteIcon', icon: Icons.NoteIcon },
  ],
  Пользователи: [
    { name: 'UserIcon', icon: Icons.UserIcon },
    { name: 'UsersIcon', icon: Icons.UsersIcon },
    { name: 'SettingsIcon', icon: Icons.SettingsIcon },
    { name: 'LockIcon', icon: Icons.LockIcon },
  ],
  Карта: [
    { name: 'MapIcon', icon: Icons.MapIcon },
    { name: 'LocationMarkerIcon', icon: Icons.LocationMarkerIcon },
    { name: 'ViewGridIcon', icon: Icons.ViewGridIcon },
  ],
};

const IconsExample: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Библиотека иконок Botanical Garden</h1>
      
      <div className="grid grid-cols-1 gap-y-10">
        {Object.entries(iconCategories).map(([category, icons]) => (
          <div key={category} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{category}</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {icons.map(({ name, icon: Icon }) => (
                <div 
                  key={name} 
                  className="flex flex-col items-center border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow duration-200"
                >
                  <Icon size={32} className="mb-2" />
                  <span className="text-sm text-center">{name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Примеры использования</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Пример с цветом */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3">Различные цвета</h3>
            <div className="flex flex-wrap gap-4">
              <Icons.InfoIcon size={24} color={COLORS.PRIMARY} />
              <Icons.InfoIcon size={24} color={COLORS.SUCCESS} />
              <Icons.InfoIcon size={24} color={COLORS.DANGER} />
              <Icons.InfoIcon size={24} color={COLORS.WARNING} />
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <code className="bg-gray-100 p-1 rounded">color={'{COLORS.PRIMARY}'}</code>
            </div>
          </div>
          
          {/* Пример с размерами */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3">Различные размеры</h3>
            <div className="flex items-end flex-wrap gap-4">
              <Icons.UserIcon size={16} />
              <Icons.UserIcon size={24} />
              <Icons.UserIcon size={32} />
              <Icons.UserIcon size={40} />
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <code className="bg-gray-100 p-1 rounded">size={'{16|24|32|40}'}</code>
            </div>
          </div>
          
          {/* Пример с кнопками */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3">С текстом</h3>
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded">
                <Icons.AddIcon size={20} color="#FFFFFF" />
                <span>Добавить</span>
              </button>
              <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded">
                <Icons.DeleteIcon size={20} />
                <span>Удалить</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconsExample; 