import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../shared/context/AuthContext';
import { useTenant } from '../../../../shared/context/TenantContext';
import { moduleRegistry } from '../../../../shared/constants/moduleRegistry';

const baseLinks = [
  { to: '/admin', label: 'Resumen' },
  { to: '/admin/users', label: 'Usuarios' },
  { to: '/admin/services', label: 'Servicios' },
  { to: '/admin/appointments', label: 'Citas' },
  { to: '/admin/agenda', label: 'Agenda' },
  { to: '/admin/notifications', label: 'WhatsApp' },
  { to: '/admin/reports', label: 'Reportes' }
];

export function AdminNav() {
  const location = useLocation();
  const { user } = useAuth();
  const { tenant } = useTenant();
  const activeModules = tenant?.activeModules || [];
  const staffAllowedModules = new Set(['agenda', 'inventory', 'pos', 'tables']);

  const staffLinks = Object.values(moduleRegistry)
    .filter((module) => module.adminPath && staffAllowedModules.has(module.key) && activeModules.includes(module.key))
    .map((module) => ({ to: module.adminPath as string, label: module.label }));

  const adminLinks = user?.role === 'GOD'
    ? [...baseLinks, { to: '/admin/tenants', label: 'Negocios' }, { to: '/admin/approvals', label: 'Aprobaciones' }]
    : baseLinks;

  const links = user?.role === 'STAFF' ? staffLinks : adminLinks;

  return (
    <nav className="flex flex-wrap gap-2 text-xs">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`app-navlink ${location.pathname === link.to ? 'border-amber-300/40 text-amber-100' : ''}`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
