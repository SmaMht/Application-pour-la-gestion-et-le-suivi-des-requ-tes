import React from 'react';
import Badge from './Badge';
import { getStatusLabel, getStatusColor } from '../../context/RequestsContext';

const StatusBadge = ({ status, className }) => {
  const label = getStatusLabel(status);
  const colorClass = getStatusColor(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}>
      {label}
    </span>
  );
};

export default StatusBadge;