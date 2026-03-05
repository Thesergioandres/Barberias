import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from 'react-router-dom';
import { Suspense, useMemo, type ReactElement } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../shared/context/AuthContext';
import { useTenant } from '../shared/context/TenantContext';
import { LoginCard } from '../shared/components/LoginCard';
import { WaitingApprovalPage } from '../modules/auth/presentation/pages/WaitingApprovalPage';
import { BookingEnginePage } from '../modules/client/BookingEnginePage';
import { StorefrontPage } from '../modules/client/StorefrontPage';
import { TenantLandingSwitch } from '../modules/client/TenantLandingSwitch';
import { LandingPage } from '../modules/landing/LandingPage';
import { BarberiasLandingPage } from '../modules/landing/BarberiasLandingPage';
import { BarberiasClientLoginPage } from '../modules/landing/BarberiasClientLoginPage';
import { VerticalLandingPage } from '../modules/landing/VerticalLandingPage';
import { BarbershopLandingPage } from '../modules/landing/presentation/pages/BarbershopLandingPage';
import { AdminHomePage } from '../modules/admin/pages/AdminHomePage';
import { GodPanelPage } from '../modules/god/GodPanelPage';
import { LicenseExpiredPage } from '../modules/admin/presentation/pages/LicenseExpiredPage';
import { OnboardingPendingPage } from '../modules/admin/presentation/pages/OnboardingPendingPage';
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
      : user.role === 'OWNER'
        ? '/admin'
        : user.role === 'ADMIN'
        ? '/admin'
        : user.role === 'STAFF'
          ? '/staff/dashboard'
          : '/login'
    : '/login';

  const router = useMemo(() => {
    const PanelStatusGuard = ({ children }: { children: ReactElement }) => {
      const { tenant, loading } = useTenant();
      const location = useLocation();
      const role = user?.role;

      if (role !== 'ADMIN' && role !== 'OWNER' && role !== 'STAFF') {
        return children;
      }

      if (loading) {
        return <div className="app-card">Cargando entorno...</div>;
      }

      if (role === 'STAFF') {
        const blocked = ['settings', 'billing', 'admin-home'];
        const pathname = location.pathname.toLowerCase();
        if (blocked.some((segment) => pathname.includes(segment))) {
          return <Navigate to="/" replace />;
        }
      }

      if (tenant?.status === 'suspended') {
        return <Navigate to="/license-expired" replace state={{ from: location.pathname }} />;
      }

      if (tenant?.status === 'onboarding') {
        return <Navigate to="/onboarding-pending" replace state={{ from: location.pathname }} />;
      }

      return children;
    };
    const staffAllowedModules = new Set(['agenda', 'inventory', 'pos', 'tables']);
    const moduleRoutes = Object.values(moduleRegistry).flatMap((module) => {
      const staffAllowed = staffAllowedModules.has(module.key);
      const routes: Array<{ key: string; path: string; element: ReactElement }> = [];
      if (module.adminPath && module.adminElement) {
        routes.push({
          key: `${module.key}-admin`,
          path: module.adminPath,
          element: (
            <RoleGuard allow={staffAllowed ? ['ADMIN', 'OWNER', 'GOD', 'STAFF'] : ['ADMIN', 'OWNER', 'GOD']}>
              <ModuleGuard allow={[module.key]}>
                <Suspense fallback={<div className="app-card">Cargando modulo...</div>}>
                  {module.adminElement}
                </Suspense>
              </ModuleGuard>
            </RoleGuard>
          )
        });
      }
      if (module.staffPath && module.staffElement) {
        routes.push({
          key: `${module.key}-staff`,
          path: module.staffPath,
          element: (
            <RoleGuard allow={['STAFF', 'ADMIN', 'OWNER', 'GOD']}>
              <ModuleGuard allow={[module.key]}>
                <Suspense fallback={<div className="app-card">Cargando modulo...</div>}>
                  {module.staffElement}
                </Suspense>
              </ModuleGuard>
            </RoleGuard>
          )
        });
      }
      return routes;
    });

    const tenantRoutes = createRoutesFromElements(
      <Route element={<BookingLayout />}>
        <Route index element={<TenantLandingSwitch />} />
        <Route path="/booking" element={<BookingEnginePage />} />
        <Route path="/storefront" element={<StorefrontPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    );

    const appRoutes = createRoutesFromElements(
      <>
        <Route path="/login" element={
          <LoginCard
            title="Acceso"
            subtitle="Usa tu cuenta para gestionar la plataforma."
            allowedRoles={['ADMIN', 'OWNER', 'STAFF', 'GOD']}
          />
        } />
        <Route path="/waiting" element={<WaitingApprovalPage />} />
        <Route path="/onboarding" element={<CreateTenantPage />} />
        <Route element={<PanelStatusGuard><AppLayout /></PanelStatusGuard>}>
          <Route index element={<Navigate to={defaultAppPath} replace />} />
          <Route
            path="/admin"
            element={
              <RoleGuard allow={['ADMIN', 'OWNER', 'GOD']}>
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
        <Route path="/license-expired" element={<LicenseExpiredPage />} />
        <Route path="/onboarding-pending" element={<OnboardingPendingPage />} />
        <Route path="*" element={<Navigate to={defaultAppPath} replace />} />
      </>
    );

    const landingRoutes = createRoutesFromElements(
      <Route element={<LandingLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="/landing/:slug" element={<VerticalLandingPage />} />
        <Route path="/barberias" element={<BarbershopLandingPage />} />
        <Route path="/barberias-landing" element={<BarberiasLandingPage />} />
        <Route path="/waiting" element={<WaitingApprovalPage />} />
        <Route path="/barberias-landing" element={<BarberiasLandingPage />} />
        <Route path="/barberias-login" element={
          <LoginCard
            title="Acceso barberias"
            subtitle="Login para duenos y staff."
            allowedRoles={['ADMIN', 'OWNER', 'STAFF']}
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
