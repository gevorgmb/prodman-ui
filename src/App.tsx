import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ApartmentProvider } from './context/ApartmentContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ApartmentGuard from './components/Auth/ApartmentGuard';
import Layout from './components/Layout/Layout';

// Lazy load pages to address chunk size warning and improve performance
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage'));
const SettingsPage = lazy(() => import('./pages/Settings/SettingsPage'));
const ApartmentUsersPage = lazy(() => import('./pages/ApartmentUsers/ApartmentUsersPage'));
const ProductsPage = lazy(() => import('./pages/Products/ProductsPage'));
const DepartmentsPage = lazy(() => import('./pages/Products/DepartmentsPage'));
const CategoriesPage = lazy(() => import('./pages/Products/CategoriesPage'));
const AcquisitionsPage = lazy(() => import('./pages/Acquisitions/AcquisitionsPage'));
const AcquisitionFormPage = lazy(() => import('./pages/Acquisitions/AcquisitionFormPage'));

const LoadingFallback = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
    <div className="spinner" style={{ width: '40px', height: '40px', borderTopColor: 'var(--primary)' }}></div>
  </div>
);

// Root wrapper to ensure Providers have access to Router context if needed
const Root = () => (
  <AuthProvider>
    <ApartmentProvider>
      <Suspense fallback={<LoadingFallback />}>
        <Outlet />
      </Suspense>
    </ApartmentProvider>
  </AuthProvider>
);

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <Layout />,
            children: [
              {
                element: <ApartmentGuard />,
                children: [
                  { path: "/", element: <DashboardPage /> },
                  { path: "/products", element: <ProductsPage /> },
                  { path: "/products/departments", element: <DepartmentsPage /> },
                  { path: "/products/categories", element: <CategoriesPage /> },
                  { path: "/acquisitions", element: <AcquisitionsPage /> },
                  { path: "/acquisitions/new", element: <AcquisitionFormPage /> },
                  { path: "/acquisitions/:id", element: <AcquisitionFormPage /> },
                  { path: "/apartment-users", element: <ApartmentUsersPage /> },
                ]
              },
              { path: "/settings", element: <SettingsPage /> },
            ]
          }
        ]
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      }
    ]
  }
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
