import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ApartmentProvider } from './context/ApartmentContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ApartmentGuard from './components/Auth/ApartmentGuard';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import SettingsPage from './pages/Settings/SettingsPage';
import ApartmentUsersPage from './pages/ApartmentUsers/ApartmentUsersPage';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ApartmentProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route element={<ApartmentGuard />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/products" element={<div>Products Page Placeholder</div>} />
                  <Route path="/apartment-users" element={<ApartmentUsersPage />} />
                </Route>
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ApartmentProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
