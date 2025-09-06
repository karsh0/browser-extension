import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiBarChart, FiMoreHorizontal, FiMail } from 'react-icons/fi';
import { useFriends } from '../../context/FriendsContext';
import { useMessage } from '../../context/MessageContext';

interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  getBadge?: () => number;
}

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { friends } = useFriends();
  const { unreadCount, pendingCount } = useMessage();
  
  const navItems: NavItem[] = [
    {
      key: 'home',
      label: 'Home',
      icon: <FiHome size={20} />,
      path: '/'
    },
    {
      key: 'friends',
      label: 'Friends',
      icon: <FiUsers size={20} />,
      path: '/friends',
      getBadge: () => {
        // TODO: Get actual pending requests count from API
        return 0;
      }
    },
    {
      key: 'inbox',
      label: 'Inbox',
      icon: <FiMail size={20} />,
      path: '/inbox',
      getBadge: () => {
        return unreadCount + pendingCount;
      }
    },
    {
      key: 'analytics',
      label: 'Analytics',
      icon: <FiBarChart size={20} />,
      path: '/analytics'
    },
    {
      key: 'more',
      label: 'More',
      icon: <FiMoreHorizontal size={20} />,
      path: '/more'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex items-center justify-around py-2 px-1 bg-white border-t border-gray-100">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const badge = item.getBadge ? item.getBadge() : 0;
        
        return (
          <button
            key={item.key}
            onClick={() => handleNavigation(item.path)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 relative ${
              isActive 
                ? 'text-blue-600 bg-blue-50 scale-110' 
                : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <div className="relative">
              {item.icon}
              
              {badge > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[16px] h-[16px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
            </div>
            
            <span className="text-xs font-medium mt-1">{item.label}</span>
            
            {/* Active indicator */}
            {isActive && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BottomNavigation;