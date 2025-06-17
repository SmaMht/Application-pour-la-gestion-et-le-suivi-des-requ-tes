import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, MessageSquare, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MobileBottomNav = () => {
  const { user } = useAuth();

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Accueil', href: '/dashboard', icon: Home },
      { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
      { name: 'Profil', href: '/dashboard/profile', icon: User }
    ];

    if (user?.role === 'student') {
      return [
        baseItems[0],
        { name: 'Requêtes', href: '/dashboard/student/requests', icon: FileText },
        ...baseItems.slice(1)
      ];
    } else {
      return [
        baseItems[0],
        { name: 'Requêtes', href: '/dashboard/staff/requests', icon: FileText },
        ...baseItems.slice(1)
      ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
      <nav className="flex">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors ${
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="h-6 w-6 mb-1" />
            <span className="truncate">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default MobileBottomNav;