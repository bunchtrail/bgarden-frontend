import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { COLORS } from '../../../styles/global-styles';
import { useNavigation } from '../hooks';
import { NavItem } from '../types';

interface NavbarItemProps {
  item: NavItem;
  isMobile?: boolean;
  onItemClick?: () => void;
  isActive?: boolean;
}

export const NavbarItem: React.FC<NavbarItemProps> = ({
  item,
  isMobile = false,
  onItemClick,
  isActive: isActiveFromProps,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isItemActive } = useNavigation([]);

  const isActive =
    isActiveFromProps !== undefined ? isActiveFromProps : isItemActive(item);

  const toggleDropdown = (e: React.MouseEvent) => {
    if (item.dropdownItems?.length) {
      e.preventDefault();
      setIsDropdownOpen((prev) => !prev);
    }
  };

  // Базовые классы в стиле Apple
  const baseClasses =
    'rounded-md transition-colors relative text-sm font-medium';
  // Минималистичное выделение активного элемента
  const activeClasses = isActive
    ? `text-${COLORS.SUCCESS}`
    : 'hover:text-gray-800 hover:bg-gray-100';
  const mobileClasses = isMobile
    ? 'block px-4 py-2 w-full text-left'
    : 'px-4 py-2 inline-flex items-center';

  const hasDropdown = !!item.dropdownItems?.length;

  if (hasDropdown) {
    return (
      <div className='relative'>
        <button
          onClick={toggleDropdown}
          className={`${baseClasses} ${activeClasses} ${mobileClasses} ${
            hasDropdown ? 'pr-8' : ''
          }`}
        >
          {item.icon && <span className='mr-2'>{item.icon}</span>}
          {item.label}
          {hasDropdown && (
            <span className='ml-1 absolute right-2 text-gray-500 text-xs'>
              {isDropdownOpen ? '▲' : '▼'}
            </span>
          )}
        </button>

        {isDropdownOpen && (
          <div
            className={`z-10 ${
              isMobile
                ? 'pl-4'
                : 'absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-sm border border-gray-200'
            }`}
          >
            {item.dropdownItems?.map((dropdownItem) => (
              <Link
                key={dropdownItem.id}
                to={dropdownItem.path}
                className={`${baseClasses} ${
                  isItemActive(dropdownItem)
                    ? `text-${COLORS.SUCCESS}`
                    : 'hover:bg-gray-100'
                } ${isMobile ? 'pl-6' : 'px-4'} py-2 block w-full text-left`}
                onClick={() => {
                  setIsDropdownOpen(false);
                  if (onItemClick) onItemClick();
                }}
              >
                {dropdownItem.icon && (
                  <span className='mr-2'>{dropdownItem.icon}</span>
                )}
                {dropdownItem.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.path}
      className={`${baseClasses} ${activeClasses} ${mobileClasses}`}
      onClick={onItemClick}
      style={{
        color: isActive ? COLORS.SUCCESS : 'inherit',
      }}
    >
      {item.icon && <span className='mr-2'>{item.icon}</span>}
      {item.label}
    </Link>
  );
};
