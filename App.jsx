import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { RequestsProvider } from './context/RequestsContext';
import { NotificationsProvider } from "./context/NotificationsContext";

// Layouts
import AuthLayout from './components/layout/AuthLayout';
import AppLayout from './components/layout/AppLayout';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy load pages
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const StudentRequests = lazy(() => import('./pages/student/StudentRequests'));
const NewRequest = lazy(() => import('./pages/student/NewRequest'));
const Messages = lazy(() => import('./pages/Messages'));
const StaffRequests = lazy(() => import('./pages/staff/StaffRequests'));
const TeamManagement = lazy(() => import('./pages/staff/TeamManagement'));
const UsersManagement = lazy(() => import('./pages/admin/UsersManagement'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <RequestsProvider>
        <Router>
          <div className="App">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<AuthLayout />}>
                  <Route index element={<Login />} />
                </Route>
                <Route path="/forgot-password" element={<AuthLayout />}>
                  <Route index element={<ForgotPassword />} />
                </Route>
                <Route path="/reset-password" element={<AuthLayout />}>
                  <Route index element={<ResetPassword />} />
                </Route>

                {/* Protected App Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <NotificationsProvider>
                        <AppLayout />
                      </NotificationsProvider>
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />

                  {/* Student Routes */}
                  <Route path="student/requests" element={
                    <ProtectedRoute roles={['student']}>
                      <StudentRequests />
                    </ProtectedRoute>
                  } />
                  <Route path="student/requests/new" element={
                    <ProtectedRoute roles={['student']}>
                      <NewRequest />
                    </ProtectedRoute>
                  } />

                  {/* Staff Routes */}
                  <Route path="staff/requests" element={
                    <ProtectedRoute roles={['teacher', 'department_head']}>
                      <StaffRequests />
                    </ProtectedRoute>
                  } />
                  <Route path="staff/reports" element={
                    <ProtectedRoute roles={['teacher', 'department_head']}>
                      <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-gray-900">Rapports</h2>
                        <p className="text-gray-600 mt-2">Module en cours de développement</p>
                      </div>
                    </ProtectedRoute>
                  } />

                  <Route path="staff/team" element={
                    <ProtectedRoute roles={['department_head']}>
                      <TeamManagement />
                    </ProtectedRoute>
                  } />

                  {/* Admin Routes */}
                  <Route path="admin/users" element={
                    <ProtectedRoute roles={['admin']}>
                      <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
                        <p className="text-gray-600 mt-2">Module en cours de développement</p>
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="admin/settings" element={
                    <ProtectedRoute roles={['admin']}>
                      <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-gray-900">Paramètres Système</h2>
                        <p className="text-gray-600 mt-2">Module en cours de développement</p>
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="dashboard/admin/users" element={
                    <ProtectedRoute roles={['admin']}>
                      <UsersManagement />
                    </ProtectedRoute>
                  } />

                  {/* Common Routes */}
                  <Route path="messages" element={<Messages />} />
                  <Route path="profile" element={
                    <div className="text-center py-12">
                      <h2 className="text-2xl font-bold text-gray-900">Mon Profil</h2>
                      <p className="text-gray-600 mt-2">Module en cours de développement</p>
                    </div>
                  } />
                </Route>

                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* 404 */}
                <Route path="*" element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900">404</h1>
                      <p className="text-gray-600 mt-2">Page non trouvée</p>
                    </div>
                  </div>
                } />
              </Routes>
            </Suspense>

            {/* Toast Notifications */}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </Router>
      </RequestsProvider>
    </AuthProvider>
  );
}

export default App;