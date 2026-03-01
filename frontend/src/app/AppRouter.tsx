import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from 'react-router-dom';
import { useMemo } from 'react';
import { useAuth } from '../shared/context/AuthContext';
import { LoginCard } from '../shared/components/LoginCard';
import { WaitingApprovalPage } from '../modules/auth/presentation/pages/WaitingApprovalPage';
import { BookingEnginePage } from '../modules/client/BookingEnginePage';
import { LandingPage } from '../modules/landing/LandingPage';
import { AdminHomePage } from '../modules/admin/pages/AdminHomePage';
import { AdminAgendaPage } from '../modules/admin/pages/AdminAgendaPage';
import { AdminTeamPage } from '../modules/admin/pages/AdminTeamPage';
import { AdminBranchesPage } from '../modules/admin/pages/AdminBranchesPage';
import { AdminWhatsAppPage } from '../modules/admin/pages/AdminWhatsAppPage';
import { StaffDashboardPage } from '../modules/staff/StaffDashboardPage';
import { GodPanelPage } from '../modules/god/GodPanelPage';
import { CreateBarbershopPage } from '../modules/onboarding/CreateBarbershopPage';
import { AppLayout } from '../shared/layouts/AppLayout';
import { BookingLayout } from '../shared/layouts/BookingLayout';
import { LandingLayout } from '../shared/layouts/LandingLayout';
import { RoleGuard } from '../shared/components/RoleGuard';
import { resolveHostContext } from '../shared/utils/host';

export function AppRouter() {
  const { user } = useAuth();
  const hostContext = resolveHostContext(window.location.hostname);
  const defaultAppPath = user
    ? user.role === 'GOD'
      ? '/god'
      : user.role === 'ADMIN'
        ? '/admin'
        : user.role === 'BARBER'
          ? '/staff'
          : '/login'
    : '/login';

  const router = useMemo(() => {
    const tenantRoutes = createRoutesFromElements(
      <Route element={<BookingLayout />}>
        <Route index element={<BookingEnginePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    );

    const appRoutes = createRoutesFromElements(
      <>
        <Route path="/login" element={<LoginCard title="Acceso" subtitle="Usa tu cuenta para gestionar la plataforma." />} />
        <Route path="/waiting" element={<WaitingApprovalPage />} />
        <Route path="/onboarding" element={<CreateBarbershopPage />} />
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
            path="/admin/agenda"
            element={
              <RoleGuard allow={['ADMIN', 'GOD']}>
                <AdminAgendaPage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/team"
            element={
              <RoleGuard allow={['ADMIN', 'GOD']}>
                <AdminTeamPage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/branches"
            element={
              <RoleGuard allow={['ADMIN', 'GOD']}>
                <AdminBranchesPage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/whatsapp"
            element={
              <RoleGuard allow={['ADMIN', 'GOD']}>
                <AdminWhatsAppPage />
              </RoleGuard>
            }
          />
          <Route
            path="/staff"
            element={
              <RoleGuard allow={['BARBER', 'ADMIN', 'GOD']}>
                <StaffDashboardPage />
              </RoleGuard>
            }
          />
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
        <Route path="/onboarding" element={<CreateBarbershopPage />} />
        <Route path="/login" element={<LoginCard title="Acceso" subtitle="Usa tu cuenta para gestionar la plataforma." />} />
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
