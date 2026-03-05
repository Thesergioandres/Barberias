import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from 'react-router-dom';
import { useMemo, type ReactElement } from 'react';
import { useAuth } from '../shared/context/AuthContext';
import { LoginCard } from '../shared/components/LoginCard';
import { WaitingApprovalPage } from '../modules/auth/presentation/pages/WaitingApprovalPage';
import { BookingEnginePage } from '../modules/client/BookingEnginePage';
import { LandingPage } from '../modules/landing/LandingPage';
import { BarberiasLandingPage } from '../modules/landing/BarberiasLandingPage';
import { BarberiasClientLoginPage } from '../modules/landing/BarberiasClientLoginPage';
import { BarbershopLandingPage } from '../modules/landing/presentation/pages/BarbershopLandingPage';
import { AdminHomePage } from '../modules/admin/pages/AdminHomePage';
import { GodPanelPage } from '../modules/god/GodPanelPage';
import { CreateTenantPage } from '../modules/onboarding/CreateTenantPage';
import { AppLayout } from '../shared/layouts/AppLayout';
import { BookingLayout } from '../shared/layouts/BookingLayout';
import { LandingLayout } from '../shared/layouts/LandingLayout';
import { RoleGuard } from '../shared/components/RoleGuard';
import { ModuleGuard } from '../shared/components/ModuleGuard';
import { moduleRegistry } from '../shared/constants/moduleRegistry';
import { resolveHostContext } from '../shared/utils/host';

export function AppRouter() {
  const { user } = useAuth();
  const hostContext = resolveHostContext(window.location.hostname);
  const defaultAppPath = user
    ? user.role === 'GOD'
      ? '/god'
      : user.role === 'ADMIN'
        ? '/admin'
        : user.role === 'STAFF'
          ? '/staff/dashboard'
          : '/login'
    : '/login';

  const router = useMemo(() => {
    const moduleRoutes = Object.values(moduleRegistry).flatMap((module) => {
      const routes: Array<{ key: string; path: string; element: ReactElement }> = [];
      if (module.adminPath && module.adminElement) {
        routes.push({
          key: `${module.key}-admin`,
          path: module.adminPath,
          element: (
            <RoleGuard allow={['ADMIN', 'GOD']}>
              <ModuleGuard allow={[module.key]}>{module.adminElement}</ModuleGuard>
            </RoleGuard>
          )
        });
      }
      if (module.staffPath && module.staffElement) {
        routes.push({
          key: `${module.key}-staff`,
          path: module.staffPath,
          element: (
            <RoleGuard allow={['STAFF', 'ADMIN', 'GOD']}>
              <ModuleGuard allow={[module.key]}>{module.staffElement}</ModuleGuard>
            </RoleGuard>
          )
        });
      }
      return routes;
    });

    const tenantRoutes = createRoutesFromElements(
      <Route element={<BookingLayout />}>
        <Route index element={<BookingEnginePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    );

    const appRoutes = createRoutesFromElements(
      <>
        <Route path="/login" element={
          <LoginCard
            title="Acceso"
            subtitle="Usa tu cuenta para gestionar la plataforma."
            allowedRoles={['ADMIN', 'STAFF', 'GOD']}
          />
        } />
        <Route path="/waiting" element={<WaitingApprovalPage />} />
        <Route path="/onboarding" element={<CreateTenantPage />} />
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to={defaultAppPath} replace />} />
          <Route
            path="/admin"
            element={
              <RoleGuard allow={['ADMIN', 'GOD']}>
                <AdminHomePage />
              </RoleGuard>
            }
          />
          <Route
            path="/staff"
            element={<Navigate to="/staff/dashboard" replace />}
          />
          {moduleRoutes.map((route) => (
            <Route key={route.key} path={route.path} element={route.element} />
          ))}
          <Route
            path="/god"
            element={
              <RoleGuard allow={['GOD']}>
                <GodPanelPage />
              </RoleGuard>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to={defaultAppPath} replace />} />
      </>
    );

    const landingRoutes = createRoutesFromElements(
      <Route element={<LandingLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="/barberias" element={<BarbershopLandingPage />} />
        <Route path="/barberias-landing" element={<BarberiasLandingPage />} />
        <Route path="/waiting" element={<WaitingApprovalPage />} />
        <Route path="/barberias-landing" element={<BarberiasLandingPage />} />
        <Route path="/barberias-login" element={
          <LoginCard
            title="Acceso barberias"
            subtitle="Login para duenos y staff."
            allowedRoles={['ADMIN', 'STAFF']}
          />
        } />
        <Route path="/barberias-client-login" element={<BarberiasClientLoginPage />} />
        <Route path="/admin-login" element={
          <LoginCard
            title="Login administradores"
            subtitle="Acceso exclusivo para GOD."
            allowedRoles={['GOD']}
            redirectTo="/god"
          />
        } />
        <Route path="/onboarding" element={<CreateTenantPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    );

    if (hostContext.mode === 'tenant') {
      return createBrowserRouter(tenantRoutes);
    }

    if (hostContext.mode === 'app') {
      return createBrowserRouter(appRoutes);
    }

    return createBrowserRouter(landingRoutes);
  }, [hostContext.mode, defaultAppPath]);

  return <RouterProvider router={router} />;
}
