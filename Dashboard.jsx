import React from 'react';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from './student/StudentDashboard';
import StaffDashboard from './staff/StaffDashboard';
import AdminDashboard from './admin/AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === 'student') {
    return <StudentDashboard />;
  } else if (user?.role === 'teacher' || user?.role === 'department_head') {
    return <StaffDashboard />;
  } else if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-gray-900">Tableau de bord</h2>
      <p className="text-gray-600 mt-2">Bienvenue dans votre espace personnel</p>
    </div>
  );
};

export default Dashboard;