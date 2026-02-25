import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import LogoutRoute from './LogoutRoute';

import MainLayout from '@/widgets/layout/MainLayout/MainLayout';
import Loader from '@/shared/ui/Loader/Loader';

const LoginPage = lazy(() => import('@/pages/LoginPage/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage/DashboardPage'));
const ProductsPage = lazy(() => import('@/pages/ProductsPage/ProductsPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage/ProductDetailPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage/SettingsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage/NotFoundPage'));

const AppRouter = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/logout" element={<LogoutRoute />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
