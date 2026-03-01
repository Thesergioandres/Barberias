import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import { BrandMark } from '../components/BrandMark';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `app-navlink ${isActive ? 'border-secondary/60 text-secondary' : ''}`;

export function AppLayout() {
  const { user, logout } = useAuth();
  const { tenant } = useTenant();

  return (
    <div className="app-shell">
      <header className="app-header border-b backdrop-blur">
        <div className="app-container flex flex-wrap items-center justify-between gap-4 py-6">
          <div className="flex items-center gap-3">
            <BrandMark />
            <div>
              <p className="app-chip">{tenant?.name || 'ESSENCE FACTORY SAAS'}</p>
              <h1 className="text-3xl font-semibold">Tu plataforma white-label</h1>
              <p className="mt-2 text-sm text-muted">Unifica reservas, operaciones y crecimiento por tenant.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {user ? (
              <div className="text-right text-xs text-muted">
                <p className="font-semibold text-ink">{user.name || 'Usuario'}</p>
                <p className="uppercase tracking-[0.18em]">{user.role}</p>
              </div>
            ) : null}
            {user ? (
              <button className="btn-ghost" type="button" onClick={logout}>
                Cerrar sesion
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <div className="app-container">
        <nav className="mt-6 flex flex-wrap gap-2">
          <NavLink className={navLinkClass} to="/admin">
            Dashboard
          </NavLink>
          <NavLink className={navLinkClass} to="/admin/agenda">
            Agenda viva
          </NavLink>
          <NavLink className={navLinkClass} to="/admin/team">
            Equipo
          </NavLink>
          <NavLink className={navLinkClass} to="/admin/branches">
            Sedes
          </NavLink>
          <NavLink className={navLinkClass} to="/admin/whatsapp">
            WhatsApp
          </NavLink>
          <NavLink className={navLinkClass} to="/staff">
            Staff
          </NavLink>
          <NavLink className={navLinkClass} to="/god">
            God Panel
          </NavLink>
        </nav>
      </div>

      <main className="app-container py-10">
        <Outlet />
      </main>
    </div>
  );
}
