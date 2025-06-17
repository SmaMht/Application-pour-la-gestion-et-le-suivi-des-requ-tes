import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCheck, FileText, MessageSquare, User } from 'lucide-react';

const NotificationDropdown = ({ notifications, onMarkAsRead, onClose }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'status_update':
        return <CheckCheck className="h-5 w-5 text-purple-500" />;
      default:
        return <User className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="px-4 py-2 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-gray-500">Aucune notification</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
              onClick={() => {
                if (!notification.read) {
                  onMarkAsRead(notification.id);
                }
                onClose();
              }}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(notification.createdAt, { 
                      addSuffix: true, 
                      locale: fr 
                    })}
                  </p>
                </div>
                {!notification.read && (
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {notifications.some(n => !n.read) && (
        <div className="px-4 py-2 border-t border-gray-100">
          <button
            onClick={() => {
              // Mark all as read logic would go here
              onClose();
            }}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Tout marquer comme lu
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;