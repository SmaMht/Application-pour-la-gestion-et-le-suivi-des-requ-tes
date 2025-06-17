import React from 'react';
import Card from './Card';

const StatsCard = ({ title, value, icon: Icon, color = 'blue', change, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600',
    green: 'bg-green-500 text-green-600',
    yellow: 'bg-yellow-500 text-yellow-600',
    red: 'bg-red-500 text-red-600',
    purple: 'bg-purple-500 text-purple-600'
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <Card.Body className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 truncate">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {value}
            </p>
            {change !== undefined && (
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  trend === 'up' ? 'text-green-600' : 
                  trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  vs mois dernier
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full bg-opacity-10 ${colorClasses[color]}`}>
            <Icon className={`h-6 w-6 ${colorClasses[color].split(' ')[1]}`} />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatsCard;