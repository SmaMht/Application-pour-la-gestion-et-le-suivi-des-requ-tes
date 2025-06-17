import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Users, 
  Settings,
  User,
  LogOut,
  X,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
      { name: 'Messages', href: '/messages', icon: MessageSquare },
      { name: 'Profil', href: '/dashboard/profile', icon: User }
    ];

    if (user?.role === 'student') {
      return [
        ...baseItems.slice(0, 1),
        { name: 'Mes Requêtes', href: '/dashboard/student/requests', icon: FileText },
        { name: 'Nouvelle Requête', href: '/dashboard/student/requests/new', icon: FileText },
        ...baseItems.slice(1)
      ];
    } else if (user?.role === 'teacher') {
      return [
        ...baseItems.slice(0, 1),
        { name: 'Requêtes Assignées', href: '/dashboard/staff/requests', icon: FileText },
        { name: 'Rapports', href: '/dashboard/staff/reports', icon: BarChart3 },
        ...baseItems.slice(1)
      ];
    } else if (user?.role === 'department_head') {
      return [
        ...baseItems.slice(0, 1),
        { name: 'Toutes les Requêtes', href: '/dashboard/staff/requests', icon: FileText },
        { name: 'Mon Équipe', href: '/dashboard/staff/team', icon: Users },
        { name: 'Rapports', href: '/dashboard/staff/reports', icon: BarChart3 },
        ...baseItems.slice(1)
      ];
    } else if (user?.role === 'admin') {
      return [
        ...baseItems.slice(0, 1),
        { name: 'Utilisateurs', href: '/dashboard/admin/users', icon: Users },
        { name: 'Toutes les Requêtes', href: '/dashboard/admin/requests', icon: FileText },
        { name: 'Rapports', href: '/dashboard/admin/reports', icon: BarChart3 },
        { name: 'Paramètres', href: '/dashboard/admin/settings', icon: Settings },
        ...baseItems.slice(1)
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="flex h-full flex-col bg-white shadow-lg">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">Univ. Maroua</span>
            <span className="text-xs text-gray-500">Faculté Sciences</span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <span className="text-sm font-medium text-blue-600">
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.prenom} {user?.nom}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.matricule}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
            onClick={onClose}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;